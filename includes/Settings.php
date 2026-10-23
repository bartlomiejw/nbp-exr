<?php
/**
 * Settings repository and field schema.
 *
 * @package NbpExr
 */

declare(strict_types=1);

namespace NbpExr;

use WP_Error;

/**
 * Stores plugin settings in a single option and knows how to validate and
 * sanitize every field.
 *
 * @phpstan-type Field array{
 *     type: 'text'|'color'|'currencies'|'toggle',
 *     section: string,
 *     label: string,
 *     description: string,
 *     default: mixed
 * }
 */
final class Settings {

	/**
	 * Option name.
	 */
	public const OPTION = 'nbpexr_settings';

	/**
	 * Maximum length of text fields.
	 */
	public const TEXT_MAX_LENGTH = 200;

	/**
	 * Maximum number of selected currencies.
	 */
	public const MAX_CURRENCIES = 50;

	/**
	 * Default values, independent of translations.
	 *
	 * @var array<string, mixed>
	 */
	private const DEFAULTS = array(
		'title'                => '',
		'currencies'           => array( 'USD', 'EUR', 'CHF', 'GBP' ),
		'color_border'         => '#018765',
		'color_heading'        => '#7a7a7a',
		'color_text'           => '#018765',
		'color_stripe'         => '#f8f8f8',
		'debug'                => false,
		'cleanup_on_uninstall' => false,
	);

	/**
	 * Field types, independent of translations.
	 *
	 * @var array<string, 'text'|'color'|'currencies'|'toggle'>
	 */
	private const TYPES = array(
		'title'                => 'text',
		'currencies'           => 'currencies',
		'color_border'         => 'color',
		'color_heading'        => 'color',
		'color_text'           => 'color',
		'color_stripe'         => 'color',
		'debug'                => 'toggle',
		'cleanup_on_uninstall' => 'toggle',
	);

	/**
	 * Settings sections with translated labels.
	 *
	 * @return array<string, string>
	 */
	public function sections(): array {
		return array(
			'general'    => __( 'General', 'nbp-exr' ),
			'appearance' => __( 'Appearance', 'nbp-exr' ),
			'advanced'   => __( 'Advanced', 'nbp-exr' ),
		);
	}

	/**
	 * Full field schema with translated labels.
	 *
	 * @return array<string, Field>
	 */
	public function fields(): array {
		$labels = array(
			'title'                => array(
				'general',
				__( 'Table heading', 'nbp-exr' ),
				__( 'Text displayed above the exchange rates table. Leave empty to use the default heading.', 'nbp-exr' ),
			),
			'currencies'           => array(
				'general',
				__( 'Currencies', 'nbp-exr' ),
				__( 'Currencies shown in the table, in the order they are published by NBP.', 'nbp-exr' ),
			),
			'color_border'         => array(
				'appearance',
				__( 'Accent colour', 'nbp-exr' ),
				__( 'Top border of the table header.', 'nbp-exr' ),
			),
			'color_heading'        => array(
				'appearance',
				__( 'Heading colour', 'nbp-exr' ),
				__( 'Colour of the table heading.', 'nbp-exr' ),
			),
			'color_text'           => array(
				'appearance',
				__( 'Rate text colour', 'nbp-exr' ),
				__( 'Colour of the buy and sell rates.', 'nbp-exr' ),
			),
			'color_stripe'         => array(
				'appearance',
				__( 'Striped row colour', 'nbp-exr' ),
				__( 'Background of every other table row.', 'nbp-exr' ),
			),
			'debug'                => array(
				'advanced',
				__( 'Debug messages', 'nbp-exr' ),
				__( 'Log diagnostic messages to the browser console.', 'nbp-exr' ),
			),
			'cleanup_on_uninstall' => array(
				'advanced',
				__( 'Remove data on uninstall', 'nbp-exr' ),
				__( 'Delete the plugin settings from the database when the plugin is uninstalled.', 'nbp-exr' ),
			),
		);

		$fields = array();
		foreach ( $labels as $key => $meta ) {
			$fields[ $key ] = array(
				'type'        => self::TYPES[ $key ],
				'section'     => $meta[0],
				'label'       => $meta[1],
				'description' => $meta[2],
				'default'     => self::DEFAULTS[ $key ],
			);
		}

		return $fields;
	}

	/**
	 * Default values for every field.
	 *
	 * @return array<string, mixed>
	 */
	public function defaults(): array {
		return self::DEFAULTS;
	}

	/**
	 * Field keys.
	 *
	 * @return list<string>
	 */
	public function keys(): array {
		return array_keys( self::DEFAULTS );
	}

	/**
	 * Field type for a key.
	 *
	 * @param string $key Field key.
	 */
	public function type( string $key ): ?string {
		return self::TYPES[ $key ] ?? null;
	}

	/**
	 * Current settings merged over the defaults. Unknown keys are dropped.
	 *
	 * @return array<string, mixed>
	 */
	public function all(): array {
		$stored = get_option( self::OPTION, array() );

		if ( ! is_array( $stored ) ) {
			$stored = array();
		}

		return array_merge( self::DEFAULTS, array_intersect_key( $stored, self::DEFAULTS ) );
	}

	/**
	 * Single setting value.
	 *
	 * @param string $key Field key.
	 * @return mixed
	 */
	public function get( string $key ): mixed {
		return $this->all()[ $key ] ?? null;
	}

	/**
	 * Sanitizes and persists the given values on top of the current settings.
	 *
	 * @param array<string, mixed> $values Partial settings.
	 * @return array<string, mixed> The saved settings.
	 */
	public function update( array $values ): array {
		$settings = $this->all();

		foreach ( $values as $key => $value ) {
			if ( array_key_exists( $key, self::DEFAULTS ) ) {
				$settings[ $key ] = $this->sanitize( $key, $value );
			}
		}

		update_option( self::OPTION, $settings );

		return $settings;
	}

	/**
	 * Validates a raw value for a field.
	 *
	 * @param string $key   Field key.
	 * @param mixed  $value Raw value.
	 * @return true|WP_Error
	 */
	public function validate( string $key, mixed $value ): bool|WP_Error {
		$type = $this->type( $key );

		$valid = match ( $type ) {
			'text'       => is_string( $value ) && mb_strlen( $value ) <= self::TEXT_MAX_LENGTH,
			'color'      => is_string( $value ) && 1 === preg_match( '/^#(?:[0-9a-fA-F]{3}){1,2}$/', $value ),
			'currencies' => is_array( $value )
				&& count( $value ) <= self::MAX_CURRENCIES
				&& array_reduce(
					$value,
					static fn ( bool $carry, mixed $code ): bool => $carry && is_string( $code ) && 1 === preg_match( '/^[A-Za-z]{3}$/', $code ),
					true
				),
			'toggle'     => rest_is_boolean( $value ),
			default      => false,
		};

		if ( $valid ) {
			return true;
		}

		return new WP_Error(
			'rest_invalid_param',
			/* translators: %s: setting key. */
			sprintf( __( 'Invalid value for "%s".', 'nbp-exr' ), $key ),
			array( 'status' => 400 )
		);
	}

	/**
	 * Sanitizes a value for a field. Invalid values fall back to the default.
	 *
	 * @param string $key   Field key.
	 * @param mixed  $value Raw value.
	 * @return mixed
	 */
	public function sanitize( string $key, mixed $value ): mixed {
		$default = self::DEFAULTS[ $key ] ?? null;

		switch ( $this->type( $key ) ) {
			case 'text':
				if ( ! is_scalar( $value ) ) {
					return $default;
				}
				return mb_substr( sanitize_text_field( (string) $value ), 0, self::TEXT_MAX_LENGTH );

			case 'color':
				$color = is_string( $value ) ? sanitize_hex_color( trim( $value ) ) : null;
				return $color ? strtolower( $color ) : $default;

			case 'currencies':
				if ( is_string( $value ) ) {
					$value = explode( ',', $value );
				}
				if ( ! is_array( $value ) ) {
					return $default;
				}
				$codes = array();
				foreach ( $value as $code ) {
					if ( is_string( $code ) && 1 === preg_match( '/^[A-Za-z]{3}$/', trim( $code ) ) ) {
						$codes[] = strtoupper( trim( $code ) );
					}
				}
				return array_slice( array_values( array_unique( $codes ) ), 0, self::MAX_CURRENCIES );

			case 'toggle':
				if ( is_bool( $value ) ) {
					return $value;
				}
				return is_scalar( $value ) && rest_sanitize_boolean( (string) $value );
		}//end switch

		return null;
	}
}
