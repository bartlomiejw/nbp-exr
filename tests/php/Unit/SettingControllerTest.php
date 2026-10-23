<?php
/**
 * Tests for the settings REST controller and settings sanitization.
 *
 * @package NbpExr\Tests
 */

declare(strict_types=1);

namespace NbpExr\Tests\Unit;

use Brain\Monkey\Functions;
use NbpExr\Api\SettingController;
use NbpExr\Settings;
use NbpExr\Tests\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

final class SettingControllerTest extends TestCase {

	private SettingController $controller;

	protected function setUp(): void {
		parent::setUp();
		$this->controller = new SettingController( new Settings() );
	}

	public function test_permission_granted_to_administrators(): void {
		Functions\expect( 'current_user_can' )->once()->with( 'manage_options' )->andReturn( true );

		$this->assertTrue( $this->controller->permissions_check() );
	}

	public function test_permission_denied_without_manage_options(): void {
		Functions\expect( 'current_user_can' )->once()->with( 'manage_options' )->andReturn( false );
		Functions\when( 'rest_authorization_required_code' )->justReturn( 401 );

		$result = $this->controller->permissions_check();

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_forbidden', $result->get_error_code() );
		$this->assertSame( array( 'status' => 401 ), $result->get_error_data() );
	}

	public function test_every_route_is_protected_by_the_permission_check(): void {
		$captured = array();
		Functions\when( 'register_rest_route' )->alias(
			static function () use ( &$captured ): bool {
				list( $captured['route_namespace'], $captured['route'], $captured['endpoints'] ) = func_get_args();
				return true;
			}
		);

		$this->controller->register_routes();

		$this->assertSame( 'nbpexr/v1', $captured['route_namespace'] );
		$this->assertSame( '/settings', $captured['route'] );
		$this->assertCount( 2, $captured['endpoints'] );
		foreach ( $captured['endpoints'] as $endpoint ) {
			$this->assertSame( array( $this->controller, 'permissions_check' ), $endpoint['permission_callback'] );
		}
		$this->assertArrayHasKey( 'args', $captured['endpoints'][1] );
	}

	public function test_args_cover_every_field_with_callbacks(): void {
		$args = $this->controller->get_endpoint_args();

		$this->assertSame( ( new Settings() )->keys(), array_keys( $args ) );
		foreach ( $args as $arg ) {
			$this->assertFalse( $arg['required'] );
			$this->assertIsCallable( $arg['validate_callback'] );
			$this->assertIsCallable( $arg['sanitize_callback'] );
		}
		$this->assertSame( 'array', $args['currencies']['type'] );
		$this->assertSame( 'boolean', $args['debug']['type'] );
	}

	/**
	 * @return array<string, array{string, mixed, mixed}>
	 */
	public static function sanitization_cases(): array {
		return array(
			'text strips tags'              => array( 'title', '<b>Kursy</b> <script>x</script>walut ', 'Kursy xwalut' ),
			'text truncated'                => array( 'title', str_repeat( 'a', 250 ), str_repeat( 'a', Settings::TEXT_MAX_LENGTH ) ),
			'text non-scalar uses default'  => array( 'title', array( 'x' ), '' ),
			'color normalized to lowercase' => array( 'color_border', ' #ABCDEF ', '#abcdef' ),
			'color short form'              => array( 'color_text', '#FFF', '#fff' ),
			'color invalid uses default'    => array( 'color_stripe', 'red', '#f8f8f8' ),
			'color non-string uses default' => array( 'color_heading', 123, '#7a7a7a' ),
			'currencies normalized'         => array( 'currencies', array( 'usd', 'EUR', 'usd', 'EURO', 1, ' chf ' ), array( 'USD', 'EUR', 'CHF' ) ),
			'currencies from csv'           => array( 'currencies', 'usd, eur', array( 'USD', 'EUR' ) ),
			'currencies invalid uses dflt'  => array( 'currencies', 42, array( 'USD', 'EUR', 'CHF', 'GBP' ) ),
			'toggle true'                   => array( 'debug', true, true ),
			'toggle string false'           => array( 'debug', 'false', false ),
			'toggle string one'             => array( 'cleanup_on_uninstall', '1', true ),
			'toggle array'                  => array( 'cleanup_on_uninstall', array( 1 ), false ),
		);
	}

	#[DataProvider( 'sanitization_cases' )]
	public function test_sanitize_callback( string $key, mixed $input, mixed $expected ): void {
		$args = $this->controller->get_endpoint_args();

		$this->assertSame( $expected, ( $args[ $key ]['sanitize_callback'] )( $input ) );
	}

	/**
	 * @return array<string, array{string, mixed, bool}>
	 */
	public static function validation_cases(): array {
		return array(
			'text ok'               => array( 'title', 'Kursy walut', true ),
			'text too long'         => array( 'title', str_repeat( 'a', 201 ), false ),
			'text not string'       => array( 'title', 5, false ),
			'color ok'              => array( 'color_border', '#018765', true ),
			'color bad'             => array( 'color_border', 'javascript:alert(1)', false ),
			'currencies ok'         => array( 'currencies', array( 'USD', 'eur' ), true ),
			'currencies bad code'   => array( 'currencies', array( 'USD', 'EURO' ), false ),
			'currencies not array'  => array( 'currencies', 'USD', false ),
			'currencies too many'   => array( 'currencies', array_fill( 0, 51, 'USD' ), false ),
			'toggle bool'           => array( 'debug', false, true ),
			'toggle string'         => array( 'debug', 'true', true ),
			'toggle invalid string' => array( 'debug', 'yes', false ),
		);
	}

	#[DataProvider( 'validation_cases' )]
	public function test_validate_callback( string $key, mixed $input, bool $valid ): void {
		$args   = $this->controller->get_endpoint_args();
		$result = ( $args[ $key ]['validate_callback'] )( $input );

		if ( $valid ) {
			$this->assertTrue( $result );
		} else {
			$this->assertInstanceOf( WP_Error::class, $result );
			$this->assertSame( array( 'status' => 400 ), $result->get_error_data() );
		}
	}

	public function test_update_merges_known_keys_and_sanitizes(): void {
		Functions\when( 'get_option' )->justReturn(
			array(
				'title'      => 'Old title',
				'currencies' => array( 'USD' ),
				'legacy'     => 'dropped',
			)
		);

		$saved = null;
		Functions\expect( 'update_option' )->once()->andReturnUsing(
			static function ( string $option, array $value ) use ( &$saved ): bool {
				$saved = array( $option, $value );
				return true;
			}
		);

		$response = $this->controller->update_item(
			new WP_REST_Request(
				array(
					'color_border' => '#ABCDEF',
					'debug'        => '1',
					'unknown'      => 'ignored',
				)
			)
		);

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( 'nbpexr_settings', $saved[0] );
		$this->assertSame( 'Old title', $saved[1]['title'] );
		$this->assertSame( array( 'USD' ), $saved[1]['currencies'] );
		$this->assertSame( '#abcdef', $saved[1]['color_border'] );
		$this->assertTrue( $saved[1]['debug'] );
		$this->assertArrayNotHasKey( 'legacy', $saved[1] );
		$this->assertArrayNotHasKey( 'unknown', $saved[1] );
		$this->assertSame( $saved[1], $response->get_data() );
	}

	public function test_get_item_returns_defaults_when_option_is_corrupted(): void {
		Functions\when( 'get_option' )->justReturn( 'not-an-array' );

		$response = $this->controller->get_item();

		$this->assertSame( ( new Settings() )->defaults(), $response->get_data() );
	}
}
