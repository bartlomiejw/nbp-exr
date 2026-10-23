<?php
/**
 * Uninstall routine.
 *
 * Cached NBP responses are always removed. Settings are removed only when
 * the "Remove data on uninstall" option is enabled.
 *
 * @package NbpExr
 */

declare(strict_types=1);

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/**
 * Deletes plugin data for the current site.
 */
function nbpexr_uninstall_site(): void {
	global $wpdb;

	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- One-off cleanup of plugin transients.
	$wpdb->query(
		$wpdb->prepare(
			"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
			$wpdb->esc_like( '_transient_nbpexr_rates_' ) . '%',
			$wpdb->esc_like( '_transient_timeout_nbpexr_rates_' ) . '%'
		)
	);

	$settings = get_option( 'nbpexr_settings', array() );

	if ( is_array( $settings ) && ! empty( $settings['cleanup_on_uninstall'] ) ) {
		delete_option( 'nbpexr_settings' );
	}
}

if ( is_multisite() ) {
	foreach ( get_sites( array( 'fields' => 'ids' ) ) as $nbpexr_site_id ) {
		switch_to_blog( (int) $nbpexr_site_id );
		nbpexr_uninstall_site();
		restore_current_blog();
	}
} else {
	nbpexr_uninstall_site();
}
