<?php
/**
 * Plugin bootstrap.
 *
 * @package NbpExr
 */

declare(strict_types=1);

namespace NbpExr;

use NbpExr\Admin\SettingsPage;
use NbpExr\Api\RatesController;
use NbpExr\Api\SettingController;
use NbpExr\Frontend\Shortcode;

/**
 * Wires the plugin services into WordPress hooks.
 */
final class Plugin {

	/**
	 * Plugin slug, also used as the text domain.
	 */
	public const SLUG = 'nbp-exr';

	/**
	 * Prefix for options, transients, hooks and the REST namespace.
	 */
	public const PREFIX = 'nbpexr';

	/**
	 * REST API namespace.
	 */
	public const REST_NAMESPACE = 'nbpexr/v1';

	/**
	 * Settings repository.
	 *
	 * @var Settings
	 */
	private Settings $settings;

	/**
	 * NBP API client.
	 *
	 * @var NbpClient
	 */
	private NbpClient $client;

	/**
	 * Script and style registration.
	 *
	 * @var Assets
	 */
	private Assets $assets;

	/**
	 * Constructor.
	 *
	 * @param string $plugin_file Absolute path to the main plugin file.
	 * @param string $version     Plugin version.
	 */
	public function __construct(
		private readonly string $plugin_file,
		private readonly string $version
	) {
		$this->settings = new Settings();
		$this->client   = new NbpClient();
		$this->assets   = new Assets( $this->plugin_file, $this->version );
	}

	/**
	 * Registers all hooks.
	 */
	public function boot(): void {
		add_action( 'init', array( $this, 'load_textdomain' ) );
		add_action( 'init', array( new Shortcode( $this->settings, $this->assets ), 'register' ) );
		add_action( 'wp_enqueue_scripts', array( $this->assets, 'register' ) );
		add_action( 'admin_enqueue_scripts', array( $this->assets, 'register' ), 5 );
		add_filter( 'script_loader_tag', array( $this->assets, 'add_module_type' ), 10, 2 );
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );

		if ( is_admin() ) {
			( new SettingsPage( $this->settings, $this->assets ) )->hook();
			add_filter(
				'plugin_action_links_' . plugin_basename( $this->plugin_file ),
				array( $this, 'add_settings_link' )
			);
		}
	}

	/**
	 * Loads the plugin translations shipped in /languages.
	 */
	public function load_textdomain(): void {
		load_plugin_textdomain(
			self::SLUG,
			false,
			dirname( plugin_basename( $this->plugin_file ) ) . '/languages'
		);
	}

	/**
	 * Registers the REST API controllers.
	 */
	public function register_rest_routes(): void {
		( new SettingController( $this->settings ) )->register_routes();
		( new RatesController( $this->client ) )->register_routes();
	}

	/**
	 * Adds a "Settings" link on the Plugins screen.
	 *
	 * @param array<int|string, string> $links Existing action links.
	 * @return array<int|string, string>
	 */
	public function add_settings_link( array $links ): array {
		array_unshift(
			$links,
			sprintf(
				'<a href="%s">%s</a>',
				esc_url( admin_url( 'options-general.php?page=' . SettingsPage::MENU_SLUG ) ),
				esc_html__( 'Settings', 'nbp-exr' )
			)
		);

		return $links;
	}
}
