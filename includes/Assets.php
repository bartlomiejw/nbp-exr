<?php
/**
 * Script and style registration based on the Vite build manifest.
 *
 * @package NbpExr
 */

declare(strict_types=1);

namespace NbpExr;

/**
 * Registers (but does not enqueue) the bundled Vue apps. Each app is
 * enqueued only where it is used: the settings page or a rendered shortcode.
 *
 * @phpstan-type ManifestChunk array{file: string, css?: list<string>, imports?: list<string>, isEntry?: bool}
 */
final class Assets {

	/**
	 * Frontend (shortcode) handle.
	 */
	public const FRONTEND = 'nbpexr-frontend';

	/**
	 * Admin (settings page) handle.
	 */
	public const ADMIN = 'nbpexr-admin';

	/**
	 * Vite entry points keyed by handle.
	 *
	 * @var array<string, string>
	 */
	private const ENTRIES = array(
		self::FRONTEND => 'src/frontend/main.ts',
		self::ADMIN    => 'src/admin/main.ts',
	);

	/**
	 * Parsed manifest cache.
	 *
	 * @var array<string, ManifestChunk>|null
	 */
	private ?array $manifest = null;

	/**
	 * Constructor.
	 *
	 * @param string $plugin_file Absolute path to the main plugin file.
	 * @param string $version     Plugin version, used for cache busting.
	 */
	public function __construct(
		private readonly string $plugin_file,
		private readonly string $version
	) {
	}

	/**
	 * Registers all app scripts and styles.
	 */
	public function register(): void {
		foreach ( self::ENTRIES as $handle => $entry ) {
			$this->register_entry( $handle, $entry );
		}
	}

	/**
	 * Enqueues one app (script and its styles).
	 *
	 * @param string $handle One of the class handle constants.
	 * @return bool False when the app has not been built.
	 */
	public function enqueue( string $handle ): bool {
		if ( ! wp_script_is( $handle, 'registered' ) ) {
			$this->register();
		}

		if ( ! wp_script_is( $handle, 'registered' ) ) {
			return false;
		}

		wp_enqueue_script( $handle );
		if ( wp_style_is( $handle, 'registered' ) ) {
			wp_enqueue_style( $handle );
		}

		return true;
	}

	/**
	 * Marks the app scripts as ES modules.
	 *
	 * @param string $tag    Script tag HTML.
	 * @param string $handle Script handle.
	 */
	public function add_module_type( string $tag, string $handle ): string {
		if ( ! isset( self::ENTRIES[ $handle ] ) ) {
			return $tag;
		}

		$tag = (string) preg_replace( '/\stype=([\'"])text\/javascript\1/', '', $tag );

		return (string) preg_replace( '/<script(?=[^>]*\ssrc=)/', '<script type="module"', $tag, 1 );
	}

	/**
	 * Registers the script and the collected CSS of one entry.
	 *
	 * @param string $handle Handle.
	 * @param string $entry  Manifest key of the entry.
	 */
	private function register_entry( string $handle, string $entry ): void {
		$manifest = $this->manifest();

		if ( ! isset( $manifest[ $entry ] ) ) {
			return;
		}

		$base = plugins_url( 'public/', $this->plugin_file );

		wp_register_script(
			$handle,
			$base . $manifest[ $entry ]['file'],
			array(),
			$this->version,
			array( 'in_footer' => true )
		);

		$css = $this->collect_css( $entry, $manifest );

		if ( array() === $css ) {
			return;
		}

		$deps = array();
		foreach ( array_slice( $css, 1 ) as $index => $file ) {
			$dep_handle = $handle . '-' . ( $index + 1 );
			wp_register_style( $dep_handle, $base . $file, array(), $this->version );
			$deps[] = $dep_handle;
		}

		wp_register_style( $handle, $base . $css[0], $deps, $this->version );
	}

	/**
	 * Collects CSS files of an entry and of all statically imported chunks.
	 *
	 * @param string                       $key      Manifest key.
	 * @param array<string, ManifestChunk> $manifest Manifest.
	 * @param array<string, true>          $seen     Visited keys.
	 * @return list<string>
	 */
	private function collect_css( string $key, array $manifest, array &$seen = array() ): array {
		if ( isset( $seen[ $key ] ) || ! isset( $manifest[ $key ] ) ) {
			return array();
		}
		$seen[ $key ] = true;

		$css = $manifest[ $key ]['css'] ?? array();
		foreach ( $manifest[ $key ]['imports'] ?? array() as $import ) {
			$css = array_merge( $css, $this->collect_css( $import, $manifest, $seen ) );
		}

		return array_values( array_unique( $css ) );
	}

	/**
	 * Reads public/manifest.json produced by `npm run build`.
	 *
	 * @return array<string, ManifestChunk>
	 */
	private function manifest(): array {
		if ( null !== $this->manifest ) {
			return $this->manifest;
		}

		$path           = dirname( $this->plugin_file ) . '/public/manifest.json';
		$this->manifest = array();

		if ( is_readable( $path ) ) {
			// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local file.
			$decoded = json_decode( (string) file_get_contents( $path ), true );
			if ( is_array( $decoded ) ) {
				/**
				 * Manifest written by Vite.
				 *
				 * @var array<string, ManifestChunk> $decoded
				 */
				$this->manifest = $decoded;
			}
		}

		return $this->manifest;
	}
}
