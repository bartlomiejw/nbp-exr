<?php

namespace Tests;

use nbpdefined('ABSPATH') or die();

class AdminLoaderTests extends PluginTestCase
{
    public function test_construct()
    {
        new \NbpExr\AdminLoader('test');

        $this->assertTrue(has_action('admin_menu', '\NbpExr\AdminLoader->admin_menu()') > 0);
    }
}
