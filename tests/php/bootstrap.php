<?php
/**
 * PHPUnit bootstrap: Composer autoloader plus minimal WordPress class doubles.
 *
 * WordPress functions are mocked per test with Brain Monkey.
 *
 * @package NbpExr\Tests
 */

declare(strict_types=1);

require_once dirname( __DIR__, 2 ) . '/vendor/autoload.php';
require_once __DIR__ . '/Stubs/wp-classes.php';
