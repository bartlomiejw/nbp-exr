<?php
/**
 * Settings page under Settings > NBP Exchange Rates.
 *
 * @package NbpExr
 */

declare(strict_types=1);

namespace NbpExr\Admin;

use NbpExr\Assets;
use NbpExr\Frontend\Shortcode;
use NbpExr\Plugin;
use NbpExr\Settings;

/**
 * Registers the settings screen and boots the admin Vue app on it.
 */
final class SettingsPage {

	/**
	 * Menu slug.
	 */
	public const MENU_SLUG = 'nbp-exr';

	/**
	 * Hook suffix returned by add_options_page().
	 *
	 * @var string
	 */
	private string $hook_suffix = '';

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
	 * Hooks into the admin.
	 */
	public function hook(): void {
		add_action( 'admin_menu', array( $this, 'add_page' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
	}

	/**
	 * Adds the options page.
	 */
	public function add_page(): void {
		$this->hook_suffix = (string) add_options_page(
			__( 'NBP Exchange Rates', 'nbp-exr' ),
			__( 'NBP Exchange Rates', 'nbp-exr' ),
			'manage_options',
			self::MENU_SLUG,
			array( $this, 'render' )
		);
	}

	/**
	 * Enqueues the admin app on the plugin screen only.
	 *
	 * @param string $hook_suffix Current admin screen hook suffix.
	 */
	public function enqueue( string $hook_suffix ): void {
		if ( '' === $this->hook_suffix || $hook_suffix !== $this->hook_suffix ) {
			return;
		}

		if ( ! $this->assets->enqueue( Assets::ADMIN ) ) {
			return;
		}

		wp_add_inline_script(
			Assets::ADMIN,
			'window.nbpexrAdmin = ' . wp_json_encode( $this->config() ) . ';',
			'before'
		);
	}

	/**
	 * Renders the page wrapper the Vue app mounts into.
	 */
	public function render(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		printf(
			'<div class="wrap"><h1>%s</h1><div id="nbpexr-admin-app"><p>%s</p></div></div>',
			esc_html( get_admin_page_title() ),
			esc_html__( 'Loading…', 'nbp-exr' )
		);
	}

	/**
	 * Data passed to the admin app.
	 *
	 * @return array<string, mixed>
	 */
	public function config(): array {
		return array(
			'restUrl'  => array(
				'settings' => esc_url_raw( rest_url( Plugin::REST_NAMESPACE . '/settings' ) ),
				'rates'    => esc_url_raw( rest_url( Plugin::REST_NAMESPACE . '/rates' ) ),
			),
			'nonce'    => wp_create_nonce( 'wp_rest' ),
			'locale'   => determine_locale(),
			'settings' => $this->settings->all(),
			'fields'   => $this->settings->fields(),
			'sections' => $this->settings->sections(),
			'i18n'     => array(
				'save'              => __( 'Save changes', 'nbp-exr' ),
				'reset'             => __( 'Discard changes', 'nbp-exr' ),
				'saved'             => __( 'Settings saved.', 'nbp-exr' ),
				'saveError'         => __( 'Settings could not be saved.', 'nbp-exr' ),
				'currenciesError'   => __( 'The list of currencies could not be loaded from NBP. Previously selected currencies are still shown.', 'nbp-exr' ),
				'selectPlaceholder' => __( 'Select currencies', 'nbp-exr' ),
				'defaultTitle'      => __( 'Exchange rates', 'nbp-exr' ),
				'usage'             => __( 'Usage', 'nbp-exr' ),
				'usageHelp'         => __( 'Paste the shortcode into any post, page or Shortcode block. Optional attributes override the settings for a single table.', 'nbp-exr' ),
				'shortcode'         => '[' . Shortcode::TAG . ']',
				'shortcodeAttrs'    => '[' . Shortcode::TAG . ' title="' . __( 'Exchange rates', 'nbp-exr' ) . '" currencies="USD,EUR"]',
			),
		);
	}
}
