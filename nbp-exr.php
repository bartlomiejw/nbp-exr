<?php
/**
 * Plugin Name:       NBP Exchange Rates
 * Plugin URI:        https://github.com/bartlomiejw/nbp-exr
 * Description:       Displays National Bank of Poland (NBP) table C buy and sell exchange rates with a date picker, via the [nbpexr-vue-app] shortcode.
 * Version:           1.0.0
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            Bartłomiej Warias
 * Author URI:        https://github.com/bartlomiejw
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       nbp-exr
 * Domain Path:       /languages
 *
 * @package NbpExr
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'NBPEXR_VERSION', '1.0.0' );
define( 'NBPEXR_FILE', __FILE__ );
define( 'NBPEXR_DIR', __DIR__ );

/*
 * PSR-4 autoloader for the NbpExr\ namespace. Composer is only used for
 * development tooling, so the distributable plugin has no vendor/ directory.
 */
spl_autoload_register(
	static function ( string $class_name ): void {
		$prefix = 'NbpExr\\';

		if ( 0 !== strncmp( $class_name, $prefix, strlen( $prefix ) ) ) {
			return;
		}

		$relative = substr( $class_name, strlen( $prefix ) );
		$file     = __DIR__ . '/includes/' . str_replace( '\\', '/', $relative ) . '.php';

		if ( is_readable( $file ) ) {
			require $file;
		}
	}
);

( new \NbpExr\Plugin( __FILE__, NBPEXR_VERSION ) )->boot();
