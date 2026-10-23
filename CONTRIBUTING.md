# Contributing

Thanks for taking the time to contribute.

## Workflow

The project uses trunk-based development:

1. Branch off `main` with a short-lived branch (`fix/…`, `feat/…`, `chore/…`).
2. Keep the change small and focused; open a pull request early.
3. CI must be green: PHP (8.1–8.4), JavaScript and the package build are required checks.
4. Pull requests are squash-merged into `main`, so the PR title becomes the commit message.
   Use the imperative mood, e.g. "Cache NBP responses per date".

## Local setup

```bash
composer install
npm ci
npm run build
```

Symlink or copy the repository into `wp-content/plugins/nbp-exr` of a local WordPress
site and activate **NBP Exchange Rates**.

## Before pushing

```bash
composer check        # composer validate, PHPCS, PHPStan, PHPUnit
npm run lint
npm run typecheck
npm test
npm run build
```

PHP follows the WordPress Coding Standards (tabs, `array()` syntax, escaped output);
`composer lint:fix` fixes most issues automatically.

## Translations

Source strings are in English and use the `nbp-exr` text domain. After changing strings,
regenerate the template and update the Polish translation:

```bash
wp i18n make-pot . languages/nbp-exr.pot --exclude=node_modules,vendor,public,build,tests,src
msgmerge --update languages/nbp-exr-pl_PL.po languages/nbp-exr.pot
msgfmt -o languages/nbp-exr-pl_PL.mo languages/nbp-exr-pl_PL.po
```
