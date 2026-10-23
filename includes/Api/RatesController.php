<?php
/**
 * Public, read-only REST endpoint proxying cached NBP rates.
 *
 * @package NbpExr
 */

declare(strict_types=1);

namespace NbpExr\Api;

use NbpExr\NbpClient;
use NbpExr\Plugin;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * GET /wp-json/nbpexr/v1/rates[?date=YYYY-MM-DD]
 *
 * The browser never talks to api.nbp.pl directly: responses go through
 * NbpClient, which validates the payload and caches it in a transient.
 */
final class RatesController {

	/**
	 * Route base.
	 */
	public const REST_BASE = 'rates';

	/**
	 * Constructor.
	 *
	 * @param NbpClient $client NBP API client.
	 */
	public function __construct( private readonly NbpClient $client ) {
	}

	/**
	 * Registers the route.
	 */
	public function register_routes(): void {
		register_rest_route(
			Plugin::REST_NAMESPACE,
			'/' . self::REST_BASE,
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_items' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'date' => array(
						'description'       => __( 'Date in YYYY-MM-DD format. Defaults to the latest table.', 'nbp-exr' ),
						'type'              => 'string',
						'required'          => false,
						'validate_callback' => static fn ( mixed $value ): bool => is_string( $value ) && NbpClient::is_valid_date( $value ),
					),
				),
			)
		);
	}

	/**
	 * Returns table C for the requested date.
	 *
	 * @param WP_REST_Request $request Request.
	 * @phpstan-param WP_REST_Request<array<string, mixed>> $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_items( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$date  = $request->get_param( 'date' );
		$table = $this->client->get_table( is_string( $date ) && '' !== $date ? $date : null );

		if ( is_wp_error( $table ) ) {
			return $table;
		}

		$response = new WP_REST_Response( $table, 200 );
		$response->header( 'Cache-Control', 'public, max-age=300' );

		return $response;
	}
}
