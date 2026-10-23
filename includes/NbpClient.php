<?php
/**
 * Client for the NBP public API (exchange rates table C).
 *
 * @package NbpExr
 */

declare(strict_types=1);

namespace NbpExr;

use DateTimeImmutable;
use DateTimeZone;
use WP_Error;

/**
 * Fetches, validates, normalizes and caches NBP table C.
 *
 * @link https://api.nbp.pl/en.html
 *
 * @phpstan-type Rate array{currency: string, code: string, bid: float, ask: float}
 * @phpstan-type Table array{table: string, number: string, tradingDate: string, effectiveDate: string, rates: list<Rate>}
 */
final class NbpClient {

	/**
	 * Base URL of table C.
	 */
	public const API_BASE = 'https://api.nbp.pl/api/exchangerates/tables/C';

	/**
	 * Transient key prefix.
	 */
	public const CACHE_PREFIX = 'nbpexr_rates_';

	/**
	 * How many days to look back for the latest table published on or
	 * before a requested date (weekends and public holidays have no table).
	 */
	public const LOOKBACK_DAYS = 7;

	/**
	 * First day table C is available through the API.
	 */
	public const FIRST_DATE = '2002-01-02';

	/**
	 * Default cache lifetime in seconds (1 hour).
	 */
	public const DEFAULT_TTL = 3600;

	/**
	 * Constructor.
	 *
	 * @param int $ttl Cache lifetime in seconds.
	 */
	public function __construct( private readonly int $ttl = self::DEFAULT_TTL ) {
	}

	/**
	 * Returns the table effective on the given date (or the latest table).
	 *
	 * When no table was published on the requested date, the most recent
	 * table from the preceding LOOKBACK_DAYS days is returned.
	 *
	 * @param string|null $date Date in Y-m-d format, null for the latest table.
	 * @return Table|WP_Error
	 */
	public function get_table( ?string $date = null ): array|WP_Error {
		if ( null !== $date && ! self::is_valid_date( $date ) ) {
			return new WP_Error(
				'nbpexr_invalid_date',
				__( 'The date must be a valid past date in YYYY-MM-DD format.', 'nbp-exr' ),
				array( 'status' => 400 )
			);
		}

		$cache_key = self::CACHE_PREFIX . ( $date ?? 'latest' );
		$cached    = get_transient( $cache_key );

		if ( is_array( $cached ) ) {
			/**
			 * Cached table produced by normalize().
			 *
			 * @var Table $cached
			 */
			return $cached;
		}

		$table = $this->fetch( $this->build_url( $date ) );

		if ( ! is_wp_error( $table ) ) {
			$ttl = (int) apply_filters( 'nbpexr_cache_ttl', $this->ttl, $date );
			set_transient( $cache_key, $table, max( 60, $ttl ) );
		}

		return $table;
	}

	/**
	 * Checks that a string is a Y-m-d date between FIRST_DATE and today (Warsaw time).
	 *
	 * @param string $date Date string.
	 */
	public static function is_valid_date( string $date ): bool {
		$zone   = new DateTimeZone( 'Europe/Warsaw' );
		$parsed = DateTimeImmutable::createFromFormat( '!Y-m-d', $date, $zone );

		if ( false === $parsed || $parsed->format( 'Y-m-d' ) !== $date ) {
			return false;
		}

		$today = new DateTimeImmutable( 'today', $zone );

		return $date >= self::FIRST_DATE && $parsed <= $today;
	}

	/**
	 * Builds the request URL.
	 *
	 * @param string|null $date Date in Y-m-d format, null for the latest table.
	 */
	private function build_url( ?string $date ): string {
		if ( null === $date ) {
			return self::API_BASE . '/?format=json';
		}

		$end   = new DateTimeImmutable( $date, new DateTimeZone( 'Europe/Warsaw' ) );
		$start = $end->modify( '-' . self::LOOKBACK_DAYS . ' days' );
		$start = max( $start->format( 'Y-m-d' ), self::FIRST_DATE );

		return sprintf( '%s/%s/%s/?format=json', self::API_BASE, $start, $end->format( 'Y-m-d' ) );
	}

	/**
	 * Performs the HTTP request and normalizes the response.
	 *
	 * @param string $url Request URL.
	 * @return Table|WP_Error
	 */
	private function fetch( string $url ): array|WP_Error {
		$response = wp_remote_get(
			$url,
			array(
				'timeout' => 10,
				'headers' => array( 'Accept' => 'application/json' ),
			)
		);

		if ( is_wp_error( $response ) ) {
			return new WP_Error(
				'nbpexr_http_error',
				__( 'Could not connect to the NBP API.', 'nbp-exr' ),
				array(
					'status' => 502,
					'reason' => $response->get_error_message(),
				)
			);
		}

		$code = (int) wp_remote_retrieve_response_code( $response );

		if ( 404 === $code ) {
			return new WP_Error(
				'nbpexr_no_data',
				__( 'NBP has not published table C for the selected date.', 'nbp-exr' ),
				array( 'status' => 404 )
			);
		}

		if ( 200 !== $code ) {
			return new WP_Error(
				'nbpexr_http_error',
				__( 'The NBP API returned an unexpected response.', 'nbp-exr' ),
				array(
					'status'   => 502,
					'upstream' => $code,
				)
			);
		}

		$table = self::normalize( json_decode( wp_remote_retrieve_body( $response ), true ) );

		if ( null === $table ) {
			return new WP_Error(
				'nbpexr_invalid_response',
				__( 'The NBP API returned malformed data.', 'nbp-exr' ),
				array( 'status' => 502 )
			);
		}

		return $table;
	}

	/**
	 * Picks the most recent table from a decoded API response and normalizes it.
	 *
	 * @param mixed $decoded Decoded JSON.
	 * @return Table|null Null when the payload does not look like table C.
	 */
	public static function normalize( mixed $decoded ): ?array {
		if ( ! is_array( $decoded ) || array() === $decoded || ! array_is_list( $decoded ) ) {
			return null;
		}

		$raw = end( $decoded );

		if ( ! is_array( $raw ) || ! isset( $raw['no'], $raw['effectiveDate'], $raw['rates'] ) || ! is_array( $raw['rates'] ) ) {
			return null;
		}

		$rates = array();
		foreach ( $raw['rates'] as $rate ) {
			if ( ! is_array( $rate ) || ! isset( $rate['code'], $rate['bid'], $rate['ask'] ) ) {
				continue;
			}
			if ( ! is_numeric( $rate['bid'] ) || ! is_numeric( $rate['ask'] ) ) {
				continue;
			}

			$rates[] = array(
				'currency' => (string) ( $rate['currency'] ?? '' ),
				'code'     => strtoupper( (string) $rate['code'] ),
				'bid'      => (float) $rate['bid'],
				'ask'      => (float) $rate['ask'],
			);
		}

		if ( array() === $rates ) {
			return null;
		}

		return array(
			'table'         => (string) ( $raw['table'] ?? 'C' ),
			'number'        => (string) $raw['no'],
			'tradingDate'   => (string) ( $raw['tradingDate'] ?? '' ),
			'effectiveDate' => (string) $raw['effectiveDate'],
			'rates'         => $rates,
		);
	}
}
