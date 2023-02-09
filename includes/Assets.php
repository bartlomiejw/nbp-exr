<?php

namespace NbpExr;

/**
 * Scripts and styles helper.
 */
class Assets {
	/**
	 * The application domain.
	 *
	 * @var string
	 */
	private $prefix;

	/**
	 * Initialize this class.
	 *
	 * @param string $prefix
	 */
	public function __construct( $prefix ) {
		$this->prefix = $prefix;
		add_action( is_admin() ? 'admin_enqueue_scripts' : 'wp_enqueue_scripts', [ $this, 'register' ] );

		// add type="module" to specific script tag
		add_filter( 'script_loader_tag', function ( $tag, $handle ) {
			# add script handles to the array below
			$scripts_to_defer = array( 'nbpexr-vendor', 'nbpexr-frontend', 'nbpexr-admin' );

			if ( in_array( $handle, $scripts_to_defer, true ) ) {
				return str_replace( ' src', '  type="module" src', $tag );
			}

			if ( in_array( $handle, $scripts_to_defer, true ) ) {
				return str_replace( 'text/javascript', 'module', $tag );
			}

			return $tag;
		}, 10, 2 );
	}

	/**
	 * Register our app scripts and styles.
	 *
	 * @return void
	 */
	public function register() {
		$this->register_scripts( $this->get_scripts() );
		$this->register_styles( $this->get_styles() );
	}

	/**
	 * Register scripts.
	 *
	 * @param array $scripts
	 *
	 * @return void
	 */
	private function register_scripts( $scripts ) {
		foreach ( $scripts as $handle => $script ) {
			$deps      = isset( $script['deps'] ) ? $script['deps'] : false;
			$in_footer = isset( $script['in_footer'] ) ? $script['in_footer'] : false;

			wp_enqueue_script( $handle, $script['src'], $deps, null, $in_footer );
		}
	}

	/**
	 * Register styles.
	 *
	 * @param array $styles
	 *
	 * @return void
	 */
	public function register_styles( $styles ) {
		foreach ( $styles as $handle => $style ) {
			$deps = isset( $style['deps'] ) ? $style['deps'] : false;

			wp_register_style( $handle, $style['src'], $deps, null );
		}
	}

	/**
	 * Get all registered scripts.
	 *
	 * @return array
	 */
	public function get_scripts() {
		$assets_url = \NbpExr\Main::$BASEURL . '/public';
		$plugin_dir = \NbpExr\Main::$PLUGINDIR . '/public';
		$prefix     = ''; // defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '.min' : '';

		$scripts = [
			'vuejs'                     => [
				'src'       => 'https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.global.prod.js',
				'script_place' => 'both',
				'in_footer' => true,
			],
			$this->prefix . '-vendor'   => [
				'src'       => $assets_url . '/js/index.js',
				'script_place' => 'both',
				'deps'      => [ 'vuejs' ],
				'in_footer' => true,
			],
			$this->prefix . '-frontend' => [
				'src'       => $assets_url . '/js/frontend.js',
				'script_place' => 'frontend',
				'deps'      => [ 'vuejs', $this->prefix . '-vendor' ],
				'in_footer' => true,
			],
			$this->prefix . '-admin'    => [
				'src'       => $assets_url . '/js/admin.js',
				'script_place' => 'backend',
				'deps'      => [ 'vuejs', $this->prefix . '-vendor' ],
				'in_footer' => true,
			],
		];

		return $scripts;
	}

	/**
	 * Get registered styles.
	 *
	 * @return array
	 */
	public function get_styles() {
		$assets_url = \NbpExr\Main::$BASEURL . '/public';

		$styles = [
			$this->prefix . '-frontend' => [
				'src' => $assets_url . '/css/frontend.css',
			],
			$this->prefix . '-admin'    => [
				'src' => $assets_url . '/css/admin.css',
			],
		];

		return $styles;
	}

	/**
	 * Get the path to a versioned Mix file.
	 *
	 * @param string $path
	 * @param string $manifestDirectory
	 *
	 * @return string
	 */
	public function mix( $path, $manifestDirectory = '' ) {
		static $manifests = [];

		if ( empty( $manifestDirectory ) ) {
			$manifestDirectory = \NbpExr\Main::$PLUGINDIR . '/public';
		}

		$manifestPath = $manifestDirectory . '/manifest.json';

		if ( ! isset( $manifests[ $manifestPath ] ) ) {
			if ( ! is_file( $manifestPath ) ) {
				throw new \Exception( 'The Mix manifest does not exist in: ' . $manifestPath );
			}

			$manifests[ $manifestPath ] = json_decode( file_get_contents( $manifestPath ), true );
		}

		$manifest = $manifests[ $manifestPath ];

		if ( ! isset( $manifest[ $path ] ) ) {
			throw new \Exception( "Unable to locate Mix file: {$path}." );
		}

		return $manifest[ $path ];
	}
}
