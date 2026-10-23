<?php
/**
 * REST endpoint for plugin settings.
 *
 * @package NbpExr
 */

declare(strict_types=1);

namespace NbpExr\Api;

use NbpExr\Plugin;
use NbpExr\Settings;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * GET/POST /wp-json/nbpexr/v1/settings
 *
 * Restricted to users with the manage_options capability. Authentication
 * relies on the core REST cookie + nonce flow (X-WP-Nonce header created with
 * wp_create_nonce( 'wp_rest' )), so no custom nonce handling is needed here.
 */
final class SettingController {

	/**
	 * Route base.
	 */
	public const REST_BASE = 'settings';

	/**
	 * Constructor.
	 *
	 * @param Settings $settings Settings repository.
	 */
	public function __construct( private readonly Settings $settings ) {
	}

	/**
	 * Registers the routes.
	 */
	public function register_routes(): void {
		register_rest_route(
			Plugin::REST_NAMESPACE,
			'/' . self::REST_BASE,
			array(
				array(
					'methods'             => 'GET',
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'permissions_check' ),
				),
				array(
					'methods'             => 'POST, PUT, PATCH',
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_endpoint_args(),
				),
			)
		);
	}

	/**
	 * Only administrators may read or change settings.
	 *
	 * @return true|WP_Error
	 */
	public function permissions_check(): bool|WP_Error {
		if ( current_user_can( 'manage_options' ) ) {
			return true;
		}

		return new WP_Error(
			'rest_forbidden',
			__( 'Sorry, you are not allowed to manage these settings.', 'nbp-exr' ),
			array( 'status' => rest_authorization_required_code() )
		);
	}

	/**
	 * Returns the current settings.
	 */
	public function get_item(): WP_REST_Response {
		return new WP_REST_Response( $this->settings->all(), 200 );
	}

	/**
	 * Updates the settings sent in the request. Missing keys keep their value.
	 *
	 * The values have already been validated and sanitized by the per-field
	 * args registered in get_endpoint_args().
	 *
	 * @param WP_REST_Request $request Request.
	 * @phpstan-param WP_REST_Request<array<string, mixed>> $request
	 */
	public function update_item( WP_REST_Request $request ): WP_REST_Response {
		$values = array();

		foreach ( $this->settings->keys() as $key ) {
			if ( $request->has_param( $key ) ) {
				$values[ $key ] = $request->get_param( $key );
			}
		}

		return new WP_REST_Response( $this->settings->update( $values ), 200 );
	}

	/**
	 * Per-field argument schema with validation and sanitization callbacks.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	public function get_endpoint_args(): array {
		$json_types = array(
			'text'       => 'string',
			'color'      => 'string',
			'currencies' => 'array',
			'toggle'     => 'boolean',
		);

		$args = array();

		foreach ( $this->settings->fields() as $key => $field ) {
			$arg = array(
				'description'       => $field['label'],
				'type'              => $json_types[ $field['type'] ],
				'required'          => false,
				'validate_callback' => fn ( mixed $value ): bool|WP_Error => $this->settings->validate( $key, $value ),
				'sanitize_callback' => fn ( mixed $value ): mixed => $this->settings->sanitize( $key, $value ),
			);

			if ( 'currencies' === $field['type'] ) {
				$arg['items'] = array(
					'type'    => 'string',
					'pattern' => '^[A-Za-z]{3}$',
				);
			}

			$args[ $key ] = $arg;
		}

		return $args;
	}
}
