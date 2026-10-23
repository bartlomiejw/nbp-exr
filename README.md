# NBP Exchange Rates for WordPress

[![CI](https://github.com/bartlomiejw/nbp-exr/actions/workflows/ci.yml/badge.svg)](https://github.com/bartlomiejw/nbp-exr/actions/workflows/ci.yml)
![PHP 8.1+](https://img.shields.io/badge/PHP-8.1%2B-777bb4)
![WordPress 6.4+](https://img.shields.io/badge/WordPress-6.4%2B-21759b)
![License: GPL-2.0-or-later](https://img.shields.io/badge/license-GPL--2.0--or--later-blue)

A WordPress plugin that shows the buy and sell exchange rates published by the
**National Bank of Poland** (Narodowy Bank Polski, NBP) in its
[table C](https://api.nbp.pl/en.html). Add a shortcode to a page and visitors get a
table of the selected currencies with a date picker for historical rates.

Source strings are English. A Polish (`pl_PL`) translation ships with the plugin,
since most sites using NBP rates are Polish.

## What it looks like

The shortcode renders a heading bar with the table title on the left and a date picker
on the right. The picker has shortcuts for *Today*, *Yesterday* and *A week ago*, and
future dates are disabled. Below it is a three-column table: **Currency** (flag and
ISO code, for example `USD` or `100 HUF`), **Buy rate** and **Sell rate**, with four
decimal places in the site's locale and alternating row colours. A caption under the
table names the NBP table number and its effective date, so visitors can tell when a
weekend or holiday date has fallen back to the previous publication.

The settings screen (**Settings → NBP Exchange Rates**) is a single page with
*General*, *Appearance* and *Advanced* cards and a sticky sidebar holding the
*Save* / *Discard* buttons and a shortcode cheat sheet.

## Features

- NBP table C buy (`bid`) and sell (`ask`) rates, for the latest table or any date since 2 January 2002.
- Dates without a table (weekends, holidays, before the morning publication) fall back to the most recent earlier table.
- Rates quoted per 100 or 10 000 units where that is customary (HUF, JPY, IDR, …).
- Server-side proxy with a 1-hour transient cache: visitors never call `api.nbp.pl` directly.
- Admin settings for the heading, four colours, the currency list, debug logging and cleanup on uninstall.
- Shortcode attributes to override the heading and currencies per table. Several tables can share one page.
- Assets load only on pages that render the shortcode, and only on the plugin's own admin screen.
- Fully translatable, with Polish translation included.

## Requirements

- WordPress 6.4 or newer
- PHP 8.1 or newer
- Outbound HTTPS access from the server to `api.nbp.pl`

## Installation

**From a release zip:** download `nbp-exr-<version>.zip` from the CI artifacts (or build it,
see below), then go to *Plugins → Add New → Upload Plugin* and activate
**NBP Exchange Rates**.

**From source:**

```bash
cd wp-content/plugins
git clone https://github.com/bartlomiejw/nbp-exr.git
cd nbp-exr
npm ci && npm run build
```

Composer is only needed for development tools. The plugin has its own PSR-4 autoloader,
so it does not need a `vendor/` directory at runtime.

## Usage

```text
[nbpexr-vue-app]
```

| Attribute    | Default                    | Description                                                    |
|--------------|----------------------------|----------------------------------------------------------------|
| `title`      | heading from settings      | Overrides the table heading.                                   |
| `currencies` | currencies from settings   | Comma-separated ISO 4217 codes, e.g. `USD,EUR,CHF`.            |

```text
[nbpexr-vue-app title="Euro and dollar" currencies="EUR,USD"]
```

Currencies always appear in the order NBP publishes them. Codes that are missing from
the table are ignored.

## Settings

*Settings → NBP Exchange Rates* (requires the `manage_options` capability):

| Setting                  | Section    | Notes                                                              |
|--------------------------|------------|--------------------------------------------------------------------|
| Table heading            | General    | Up to 200 characters. If empty, the translated "Exchange rates" is used. |
| Currencies               | General    | Multi-select filled from the current NBP table (default USD, EUR, CHF, GBP). |
| Accent colour            | Appearance | Top border of the header bar.                                      |
| Heading colour           | Appearance | Colour of the heading text.                                        |
| Rate text colour         | Appearance | Colour of the buy and sell values.                                 |
| Striped row colour       | Appearance | Background of every other row.                                     |
| Debug messages           | Advanced   | Logs requests and errors to the browser console.                   |
| Remove data on uninstall | Advanced   | Deletes the `nbpexr_settings` option when the plugin is deleted.   |

Cached rates (`nbpexr_rates_*` transients) are always removed on uninstall.

## Architecture

```text
nbp-exr.php                 bootstrap: constants, PSR-4 autoloader, Plugin::boot()
uninstall.php               removes cached rates; removes settings if the toggle is on
includes/
  Plugin.php                hook wiring, text domain loading
  Settings.php              option storage, field schema, validation and sanitization
  NbpClient.php             NBP HTTP client: error handling, normalization, transient cache
  Assets.php                registers Vite entries from public/manifest.json as ES modules
  Api/SettingController.php GET/POST nbpexr/v1/settings (manage_options + REST nonce)
  Api/RatesController.php   GET nbpexr/v1/rates?date=YYYY-MM-DD (public, read-only, cached)
  Admin/SettingsPage.php    options page; mounts the admin Vue app
  Frontend/Shortcode.php    [nbpexr-vue-app]; renders a mount point with per-instance JSON config
src/
  frontend/                 exchange rates island (Vue 3 + Element Plus date picker)
  admin/                    settings app (Vue 3 + Element Plus form controls)
  shared/                   typed REST helpers and shared types
languages/                  nbp-exr.pot, Polish .po/.mo
tests/php                   PHPUnit + Brain Monkey
tests/js                    Vitest + @vue/test-utils
```

**PHP side.** `NbpClient` is the only code that talks to NBP. For a given date it requests
the range *date − 7 days … date* in one call and keeps the most recent table, which covers
weekends and holidays. It checks transport errors, HTTP status codes and payload shape.
Failures come back as `WP_Error` (404 → `nbpexr_no_data`, anything else → `502`) and are
not cached. Successful results are stored in a transient for one hour (filter:
`nbpexr_cache_ttl`). `RatesController` exposes the client as a public, read-only REST route.

**Settings API.** `SettingController` registers per-field `args` with `validate_callback`
and `sanitize_callback` taken from the `Settings` schema (text length, hex colours,
3-letter currency codes, booleans). Every method is protected by
`current_user_can( 'manage_options' )`. Authentication is WordPress's standard cookie and
`X-WP-Nonce` (`wp_rest`) flow.

**Vue islands.** Each shortcode prints
`<div class="nbpexr-rates" data-nbpexr-config="{…}">`. The frontend bundle mounts one
independent Vue app per element, so several differently configured tables can share a
page. Translated UI strings come from PHP inside that config, so all translations live in
the one gettext catalogue. The admin app gets its config from `window.nbpexrAdmin`, and
its currency list comes from the cached rates endpoint, so loading the admin page never
blocks on NBP.

**Build.** Vite builds both entries into `public/` with a shared chunk and writes a
manifest. `Assets` reads the manifest, registers the scripts with `type="module"` and the
CSS of each entry including its imported chunks, and enqueues them only where needed.
Element Plus components are imported on demand. Vue is bundled, with no CDN.

## Development

```bash
composer install
npm ci

npm run dev          # rebuild public/ on change
npm run build        # production build
npm run zip          # build + create build/nbp-exr-<version>.zip
```

| Command              | What it runs                                         |
|----------------------|------------------------------------------------------|
| `composer lint`      | PHP_CodeSniffer with WPCS 3 and PHPCompatibilityWP   |
| `composer lint:fix`  | PHP Code Beautifier                                  |
| `composer analyse`   | PHPStan level 6 with `szepeviktor/phpstan-wordpress` |
| `composer test`      | PHPUnit                                              |
| `composer check`     | all of the above plus `composer validate --strict`   |
| `npm run lint`       | ESLint 9 (flat config, Vue + typed TypeScript rules) |
| `npm run typecheck`  | `vue-tsc --noEmit`                                   |
| `npm test`           | Vitest                                               |

Translations: see [CONTRIBUTING.md](CONTRIBUTING.md#translations).

## Testing

- **PHP:** PHPUnit 10 with [Brain Monkey](https://giuseppe-mazzapica.gitbook.io/brain-monkey/)
  mocks WordPress functions, so no WordPress install or database is needed.
  `SettingControllerTest` covers the permission check, route registration, and
  validation and sanitization of every field type. `NbpClientTest` covers cache hits,
  successful fetches, transport and HTTP errors, malformed payloads, the date lookback
  URL, the TTL filter and date validation.
- **JavaScript:** Vitest with jsdom. `rates.spec.ts` covers the pure rate scaling,
  filtering and formatting functions. `ExchangeRates.spec.ts` mounts the component against
  a mocked REST response and checks the rendered rows, units and error states.

## Continuous integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every pull request and on
pushes to `main`, and cancels superseded runs:

- **PHP** (matrix 8.1, 8.2, 8.3, 8.4): `composer validate`, PHPCS, PHPStan, PHPUnit
- **JavaScript**: `npm ci`, lint, typecheck, Vitest, build
- **Plugin zip**: builds the front-end and packs only runtime files (see `.distignore`)
  into an uploadable artifact

Dependabot keeps npm, Composer and GitHub Actions dependencies up to date.

## Workflow

The repository uses trunk-based development:

- `main` is the trunk and is always releasable.
- Work happens on short-lived branches that live for hours or a few days.
- Pull requests are **squash-merged**, so `main` has one commit per change.
- The PHP matrix, JavaScript and package jobs are required status checks on `main`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Acknowledgements

- The project started from
  [niiknow/vue-wp-plugin-starter](https://github.com/niiknow/vue-wp-plugin-starter)
  (GPL-2.0-or-later), a Vue + WordPress plugin template. It has since been rewritten:
  Vite build, typed PHP 8.1 services, REST proxy and caching, tests and CI.
- Exchange rates are provided by the public [NBP Web API](https://api.nbp.pl/en.html).
  This plugin is not affiliated with or endorsed by Narodowy Bank Polski.
- UI components by [Element Plus](https://element-plus.org/) and [Vue](https://vuejs.org/).

## License

[GPL-2.0-or-later](LICENSE) © Bartłomiej Warias
