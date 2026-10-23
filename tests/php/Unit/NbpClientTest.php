<?php
/**
 * Tests for the NBP API client.
 *
 * @package NbpExr\Tests
 */

declare(strict_types=1);

namespace NbpExr\Tests\Unit;

use Brain\Monkey\Functions;
use DateTimeImmutable;
use DateTimeZone;
use NbpExr\NbpClient;
use NbpExr\Tests\TestCase;
use WP_Error;

final class NbpClientTest extends TestCase {

	private const TABLE_JSON = '[{"table":"C","no":"204/C/NBP/2026","tradingDate":"2026-10-21","effectiveDate":"2026-10-22","rates":[{"currency":"dolar amerykański","code":"USD","bid":3.6012,"ask":3.674},{"currency":"forint (Węgry)","code":"HUF","bid":0.010612,"ask":0.010826}]}]';

	protected function setUp(): void {
		parent::setUp();
		Functions\when( 'wp_remote_retrieve_response_code' )->alias(
			static fn ( array $response ): int => $response['response']['code']
		);
		Functions\when( 'wp_remote_retrieve_body' )->alias(
			static fn ( array $response ): string => $response['body']
		);
	}

	/**
	 * @return array{response: array{code: int}, body: string}
	 */
	private static function http( int $code, string $body ): array {
		return array(
			'response' => array( 'code' => $code ),
			'body'     => $body,
		);
	}

	public function test_returns_cached_table_without_http_request(): void {
		$cached = array( 'number' => 'cached' );
		Functions\expect( 'get_transient' )->once()->with( 'nbpexr_rates_latest' )->andReturn( $cached );
		Functions\expect( 'wp_remote_get' )->never();

		$this->assertSame( $cached, ( new NbpClient() )->get_table() );
	}

	public function test_fetches_normalizes_and_caches_latest_table(): void {
		Functions\when( 'get_transient' )->justReturn( false );
		Functions\expect( 'wp_remote_get' )
			->once()
			->with( 'https://api.nbp.pl/api/exchangerates/tables/C/?format=json', \Mockery::type( 'array' ) )
			->andReturn( self::http( 200, self::TABLE_JSON ) );
		Functions\expect( 'set_transient' )
			->once()
			->with( 'nbpexr_rates_latest', \Mockery::type( 'array' ), 3600 )
			->andReturn( true );

		$table = ( new NbpClient() )->get_table();

		$this->assertIsArray( $table );
		$this->assertSame( '204/C/NBP/2026', $table['number'] );
		$this->assertSame( '2026-10-22', $table['effectiveDate'] );
		$this->assertSame(
			array(
				'currency' => 'dolar amerykański',
				'code'     => 'USD',
				'bid'      => 3.6012,
				'ask'      => 3.674,
			),
			$table['rates'][0]
		);
	}

	public function test_date_request_uses_lookback_range_and_picks_latest_table(): void {
		$body = '[{"table":"C","no":"1/C/NBP/2024","effectiveDate":"2024-01-04","rates":[{"currency":"a","code":"EUR","bid":4.3,"ask":4.4}]},'
			. '{"table":"C","no":"2/C/NBP/2024","effectiveDate":"2024-01-05","rates":[{"currency":"a","code":"EUR","bid":4.31,"ask":4.41}]}]';

		Functions\when( 'get_transient' )->justReturn( false );
		Functions\expect( 'wp_remote_get' )
			->once()
			->with( 'https://api.nbp.pl/api/exchangerates/tables/C/2023-12-31/2024-01-07/?format=json', \Mockery::type( 'array' ) )
			->andReturn( self::http( 200, $body ) );
		Functions\expect( 'set_transient' )->once()->with( 'nbpexr_rates_2024-01-07', \Mockery::type( 'array' ), 3600 );

		$table = ( new NbpClient() )->get_table( '2024-01-07' );

		$this->assertIsArray( $table );
		$this->assertSame( '2/C/NBP/2024', $table['number'] );
	}

	public function test_transport_error_is_reported_and_not_cached(): void {
		Functions\when( 'get_transient' )->justReturn( false );
		Functions\when( 'wp_remote_get' )->justReturn( new WP_Error( 'http_request_failed', 'cURL error 28' ) );
		Functions\expect( 'set_transient' )->never();

		$result = ( new NbpClient() )->get_table();

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'nbpexr_http_error', $result->get_error_code() );
		$this->assertSame( 502, $result->get_error_data()['status'] );
		$this->assertSame( 'cURL error 28', $result->get_error_data()['reason'] );
	}

	public function test_not_found_maps_to_no_data_error(): void {
		Functions\when( 'get_transient' )->justReturn( false );
		Functions\when( 'wp_remote_get' )->justReturn( self::http( 404, '404 NotFound - Not Found - Brak danych' ) );
		Functions\expect( 'set_transient' )->never();

		$result = ( new NbpClient() )->get_table( '2024-01-01' );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'nbpexr_no_data', $result->get_error_code() );
		$this->assertSame( array( 'status' => 404 ), $result->get_error_data() );
	}

	public function test_server_error_maps_to_bad_gateway(): void {
		Functions\when( 'get_transient' )->justReturn( false );
		Functions\when( 'wp_remote_get' )->justReturn( self::http( 503, 'Service Unavailable' ) );
		Functions\expect( 'set_transient' )->never();

		$result = ( new NbpClient() )->get_table();

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'nbpexr_http_error', $result->get_error_code() );
		$this->assertSame( 503, $result->get_error_data()['upstream'] );
	}

	public function test_malformed_body_is_rejected(): void {
		Functions\when( 'get_transient' )->justReturn( false );
		Functions\when( 'wp_remote_get' )->justReturn( self::http( 200, '{"unexpected":true}' ) );
		Functions\expect( 'set_transient' )->never();

		$result = ( new NbpClient() )->get_table();

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'nbpexr_invalid_response', $result->get_error_code() );
	}

	public function test_invalid_date_is_rejected_before_any_request(): void {
		Functions\expect( 'get_transient' )->never();
		Functions\expect( 'wp_remote_get' )->never();

		$result = ( new NbpClient() )->get_table( '2024-02-30' );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'nbpexr_invalid_date', $result->get_error_code() );
	}

	public function test_cache_ttl_is_filterable(): void {
		Functions\when( 'get_transient' )->justReturn( false );
		Functions\when( 'wp_remote_get' )->justReturn( self::http( 200, self::TABLE_JSON ) );
		\Brain\Monkey\Filters\expectApplied( 'nbpexr_cache_ttl' )->once()->andReturn( 120 );
		Functions\expect( 'set_transient' )->once()->with( 'nbpexr_rates_latest', \Mockery::type( 'array' ), 120 );

		$this->assertIsArray( ( new NbpClient() )->get_table() );
	}

	/**
	 * @return array<string, array{string, bool}>
	 */
	public static function date_cases(): array {
		$zone = new DateTimeZone( 'Europe/Warsaw' );

		return array(
			'valid past date'  => array( '2024-01-05', true ),
			'today'            => array( ( new DateTimeImmutable( 'today', $zone ) )->format( 'Y-m-d' ), true ),
			'tomorrow'         => array( ( new DateTimeImmutable( 'tomorrow', $zone ) )->format( 'Y-m-d' ), false ),
			'before table C'   => array( '2001-12-31', false ),
			'impossible date'  => array( '2023-02-29', false ),
			'wrong format'     => array( '05.01.2024', false ),
			'trailing garbage' => array( '2024-01-05x', false ),
			'not zero padded'  => array( '2024-1-5', false ),
		);
	}

	#[\PHPUnit\Framework\Attributes\DataProvider( 'date_cases' )]
	public function test_is_valid_date( string $date, bool $expected ): void {
		$this->assertSame( $expected, NbpClient::is_valid_date( $date ) );
	}
}
