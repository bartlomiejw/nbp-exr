<?php

// don't call the file directly
if (! defined('ABSPATH')) {
    exit;
}

// this allow for using wordpress server-side translation
return [
    'sections' => [
        'general'   => __('Ogólne', \NbpExr\Main::PREFIX),
        'advanced'  => __('Zaawansowane', \NbpExr\Main::PREFIX),
        'debugging' => __('Debug', \NbpExr\Main::PREFIX),
    ],
    'options'  => [
        'input'                          => [
            'name'        => __('Nagłówek tabeli', \NbpExr\Main::PREFIX),
            'description' => __('Wprowadź tekst wyświetlany ponad tabelą kursów walut', \NbpExr\Main::PREFIX),
            'section'     => 'general',
            'type'        => 'text',
            'default'     => 'Kursy walut',
        ],
        'color_table_border'                          => [
            'name'        => __('Kolor linii tabeli', \NbpExr\Main::PREFIX),
            'description' => __('Wybierz z palety kolorów', \NbpExr\Main::PREFIX),
            'section'     => 'general',
            'type'        => 'color',
            'default'     => '#018765', // empty text means #000 by default anyway so might as well set it
        ],
        'color_table_header'                          => [
	        'name'        => __('Kolor nagłówków tabli', \NbpExr\Main::PREFIX),
	        'description' => __('Wybierz z palety kolorów', \NbpExr\Main::PREFIX),
	        'section'     => 'general',
	        'type'        => 'color',
	        'default'     => '#7A7A7A', // empty text means #000 by default anyway so might as well set it
        ],
        'color_table_text'                          => [
	        'name'        => __('Kolor tekstu tabeli', \NbpExr\Main::PREFIX),
	        'description' => __('Wybierz z palety kolorów', \NbpExr\Main::PREFIX),
	        'section'     => 'general',
	        'type'        => 'color',
	        'default'     => '#018765', // empty text means #000 by default anyway so might as well set it
        ],
        'color_table_striped'                          => [
	        'name'        => __('Kolor tła parzystego wiersza tabeli', \NbpExr\Main::PREFIX),
	        'description' => __('Wybierz z palety kolorów', \NbpExr\Main::PREFIX),
	        'section'     => 'general',
	        'type'        => 'color',
	        'default'     => '#F8F8F8', // empty text means #000 by default anyway so might as well set it
        ],
        'enable_debug_messages'          => [
            'name'        => __('Włącz komunikaty debugowania', \NbpExr\Main::PREFIX),
            'description' => __('Po włączeniu wtyczka wyświetli komunikaty debugowania w konsoli JavaScript.', \NbpExr\Main::PREFIX),
            'section'     => 'debugging',
            'type'        => 'toggle',
            'default'     => false,
        ],
        'cleanup_db_on_plugin_uninstall' => [
            'name'        => __('Czyszczenie bazy danych po odinstalowaniu wtyczki', \NbpExr\Main::PREFIX),
            'description' => __('Po włączeniu wtyczka usunie wszelkie dane z bazy danych po odinstalowaniu wtyczki.', \NbpExr\Main::PREFIX),
            'section'     => 'advanced',
            'type'        => 'toggle',
            'default'     => false,
        ],
        'main_widget_rates'             => [
            'name'            => __('Wybierz waluty', \NbpExr\Main::PREFIX),
            'description'     => __('Wybierz waluty wyświetlane w tabeli', \NbpExr\Main::PREFIX),
            'section'         => 'general',
            'type'            => 'dropdownMultiselect',
            'optionsCallback' => function () {
	            $result = wp_remote_get( 'https://api.nbp.pl/api/exchangerates/tables/C?format=json' )['body'];
	            $rates_table = json_decode($result);

	            return $rates_table[0]->rates;
            },
            'default'         => [],
        ],
    ],
];
