=== NBP Exchange Rates ===
Contributors: bartlomiejw
Tags: exchange rates, currency, nbp, kursy walut, shortcode
Requires at least: 6.4
Tested up to: 7.1
Requires PHP: 8.1
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Buy and sell exchange rates from National Bank of Poland (NBP) table C, with a date picker.

== Description ==

NBP Exchange Rates displays the buy and sell rates that Narodowy Bank Polski publishes every business day in table C. Put the `[nbpexr-vue-app]` shortcode on any page or post and visitors see a table of your chosen currencies. A date picker lets them look up historical rates.

Features:

* Buy (bid) and sell (ask) rates from NBP table C, for the latest table or any date since 2 January 2002.
* Weekends and public holidays automatically fall back to the most recent earlier table. The table number and effective date are shown under the table.
* Rates for HUF, JPY and similar currencies are quoted per 100 units, as on nbp.pl.
* Rates are fetched on the server and cached for one hour. Visitors' browsers never contact the NBP API directly.
* Settings page for the table heading, four colours, the list of currencies, debug logging and data removal on uninstall.
* Shortcode attributes override the heading and currencies for a single table. Several tables can share one page.
* Scripts and styles load only on pages that use the shortcode.
* English and Polish translations included.

This plugin is not affiliated with or endorsed by Narodowy Bank Polski.

= External service =

The plugin downloads exchange rates from the public NBP Web API at `https://api.nbp.pl/`. It requests table C when a page with the shortcode or the plugin settings screen is viewed and the cached copy (one hour) has expired. No personal data is sent. The only request parameters are the table type and the date range. See the [NBP Web API documentation](https://api.nbp.pl/en.html).

== Installation ==

1. Upload the `nbp-exr` folder to `/wp-content/plugins/`, or install the zip via *Plugins → Add New → Upload Plugin*.
2. Activate the plugin through the *Plugins* screen.
3. Go to *Settings → NBP Exchange Rates* and choose the currencies and colours.
4. Add `[nbpexr-vue-app]` to a page, for example in a Shortcode block.

== Frequently Asked Questions ==

= Which shortcode attributes are available? =

* `title`: overrides the table heading, e.g. `[nbpexr-vue-app title="Kursy walut"]`.
* `currencies`: comma-separated ISO 4217 codes, e.g. `[nbpexr-vue-app currencies="EUR,USD,CHF"]`.

= Why does the table show an earlier date than the one I picked? =

NBP does not publish table C on weekends and public holidays, and publishes it on business days in the morning. When no table exists for the selected date, the most recent earlier table is shown, and the caption gives its number and effective date.

= How often are rates refreshed? =

Responses are cached for one hour per requested date. Developers can change this with the `nbpexr_cache_ttl` filter (seconds).

= What happens to my data when I delete the plugin? =

Cached rates are always removed. Settings are removed only if *Remove data on uninstall* is enabled on the settings page.

== Changelog ==

= 1.0.0 =
* First public release.
* NBP table C buy and sell rates with a date picker, via the `[nbpexr-vue-app]` shortcode, with `title` and `currencies` attributes.
* Server-side REST proxy (`nbpexr/v1/rates`) with error handling and a one-hour transient cache.
* Settings page built with Vue 3 and Element Plus, saved through a REST endpoint restricted to administrators, with per-field validation.
* English source strings with Polish translation.
* Uninstall routine that honours the "Remove data on uninstall" setting.

== Upgrade Notice ==

= 1.0.0 =
First public release.
