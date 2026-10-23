<?php
/**
 * Base test case wiring Brain Monkey and common WordPress function doubles.
 *
 * @package NbpExr\Tests
 */

declare(strict_types=1);

namespace NbpExr\Tests;

use Brain\Monkey;
use Brain\Monkey\Functions;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use PHPUnit\Framework\TestCase as PHPUnitTestCase;

abstract class TestCase extends PHPUnitTestCase {

	use MockeryPHPUnitIntegration;

	protected function setUp(): void {
		parent::setUp();
		Monkey\setUp();

		Functions\stubTranslationFunctions();
		Functions\stubEscapeFunctions();

		Functions\when( 'is_wp_error' )->alias(
			static fn ( mixed $thing ): bool => $thing instanceof \WP_Error
		);
		Functions\when( 'sanitize_text_field' )->alias(
			static fn ( string $value ): string => trim( (string) preg_replace( '/\s+/', ' ', strip_tags( $value ) ) )
		);
		Functions\when( 'sanitize_hex_color' )->alias(
			static function ( string $color ): ?string {
				if ( '' === $color ) {
					return '';
				}
				return preg_match( '|^#([A-Fa-f0-9]{3}){1,2}$|', $color ) ? $color : null;
			}
		);
		Functions\when( 'rest_is_boolean' )->alias(
			static function ( mixed $value ): bool {
				if ( is_bool( $value ) ) {
					return true;
				}
				if ( is_string( $value ) ) {
					return in_array( strtolower( $value ), array( 'true', 'false', '1', '0', '' ), true );
				}
				return is_int( $value ) && in_array( $value, array( 0, 1 ), true );
			}
		);
		Functions\when( 'rest_sanitize_boolean' )->alias(
			static function ( mixed $value ): bool {
				if ( is_string( $value ) && in_array( strtolower( $value ), array( 'false', '0' ), true ) ) {
					return false;
				}
				return (bool) $value;
			}
		);
	}

	protected function tearDown(): void {
		Monkey\tearDown();
		parent::tearDown();
	}
}
