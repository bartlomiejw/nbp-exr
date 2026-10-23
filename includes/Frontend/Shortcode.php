<?php
/**
 * The [nbpexr-vue-app] shortcode.
 *
 * @package NbpExr
 */

declare(strict_types=1);

namespace NbpExr\Frontend;

use NbpExr\Assets;
use NbpExr\Plugin;
use NbpExr\Settings;

/**
 * Renders a mount point for the exchange rates Vue island. Every shortcode
 * instance carries its own JSON config in a data attribute, so several tables
 * with different attributes can live on one page.
 */
final class Shortcode {

	/**
	 * Shortcode tag.
	 */
	public const TAG = 'nbpexr-vue-app';

	/**
	 * Constructor.
	 *
	 * @param Settings $settings Settings repository.
	 * @param Assets   $assets   Asset registry.
	 */
	public function __construct(
		private readonly Settings $settings,
		private readonly Assets $assets
	) {
	}

	/**
	 * Registers the shortcode.
	 */
	public function register(): void {
		add_shortcode( self::TAG, array( $this, 'render' ) );
	}

	/**
	 * Shortcode callback.
	 *
	 * Supported attributes:
	 * - title:      overrides the table heading;
	 * - currencies: comma-separated ISO 4217 codes overriding the selection
	 *               from the settings page, e.g. "USD,EUR".
	 *
	 * @param array<string, string>|string $atts Shortcode attributes.
	 */
	public function render( array|string $atts = array() ): string {
		$atts = shortcode_atts(
			array(
				'title'      => '',
				'currencies' => '',
			),
			is_array( $atts ) ? $atts : array(),
			self::TAG
		);

		if ( ! $this->assets->enqueue( Assets::FRONTEND ) ) {
			return current_user_can( 'manage_options' )
				? '<p>' . esc_html__( 'NBP Exchange Rates: front-end assets are missing. Run "npm run build".', 'nbp-exr' ) . '</p>'
				: '';
		}

		return sprintf(
			'<div class="nbpexr-rates" data-nbpexr-config="%s"></div>',
			esc_attr( (string) wp_json_encode( $this->config( $atts ) ) )
		);
	}

	/**
	 * Builds the per-instance config passed to the Vue app.
	 *
	 * @param array<string, string> $atts Normalized shortcode attributes.
	 * @return array<string, mixed>
	 */
	public function config( array $atts ): array {
		$settings   = $this->settings->all();
		$title      = '' !== trim( $atts['title'] ) ? sanitize_text_field( $atts['title'] ) : (string) $settings['title'];
		$title      = '' !== $title ? $title : __( 'Exchange rates', 'nbp-exr' );
		$currencies = '' !== trim( $atts['currencies'] )
			? $this->settings->sanitize( 'currencies', $atts['currencies'] )
			: $settings['currencies'];

		return array(
			'restUrl'    => esc_url_raw( rest_url( Plugin::REST_NAMESPACE . '/rates' ) ),
			'locale'     => determine_locale(),
			'title'      => $title,
			'currencies' => $currencies,
			'colors'     => array(
				'border'  => $settings['color_border'],
				'heading' => $settings['color_heading'],
				'text'    => $settings['color_text'],
				'stripe'  => $settings['color_stripe'],
			),
			'debug'      => (bool) $settings['debug'],
			'i18n'       => array(
				'currency'  => __( 'Currency', 'nbp-exr' ),
				'buy'       => __( 'Buy rate', 'nbp-exr' ),
				'sell'      => __( 'Sell rate', 'nbp-exr' ),
				'pickDate'  => __( 'Pick a date', 'nbp-exr' ),
				'today'     => __( 'Today', 'nbp-exr' ),
				'yesterday' => __( 'Yesterday', 'nbp-exr' ),
				'weekAgo'   => __( 'A week ago', 'nbp-exr' ),
				'loading'   => __( 'Loading exchange rates…', 'nbp-exr' ),
				'noData'    => __( 'No exchange rates are available for the selected date.', 'nbp-exr' ),
				'error'     => __( 'Exchange rates could not be loaded. Please try again later.', 'nbp-exr' ),
				/* translators: 1: NBP table number, 2: effective date. */
				'tableInfo' => __( 'NBP table %1$s, effective %2$s', 'nbp-exr' ),
			),
		);
	}
}
