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
            'default'     => '',
        ],
//        'email'                          => [
//            'name'        => __('Email', \NbpExr\Main::PREFIX),
//            'description' => __('Email type input', \NbpExr\Main::PREFIX),
//            'section'     => 'general',
//            'type'        => 'email',
//            'default'     => '',
//        ],
//        'url'                            => [
//            'name'        => __('URL', \NbpExr\Main::PREFIX),
//            'description' => __('URL input', \NbpExr\Main::PREFIX),
//            'section'     => 'general',
//            'type'        => 'url',
//            'default'     => '',
//        ],
        'color_table_border'                          => [
            'name'        => __('Kolor linii tabeli', \NbpExr\Main::PREFIX),
            'description' => __('Wybierz z palety kolorów', \NbpExr\Main::PREFIX),
            'section'     => 'general',
            'type'        => 'color',
            'default'     => '#000', // empty text means #000 by default anyway so might as well set it
        ],
        'color_table_header'                          => [
	        'name'        => __('Kolor nagłówków tabli', \NbpExr\Main::PREFIX),
	        'description' => __('Wybierz z palety kolorów', \NbpExr\Main::PREFIX),
	        'section'     => 'general',
	        'type'        => 'color',
	        'default'     => '#000', // empty text means #000 by default anyway so might as well set it
        ],
        'color_table_text'                          => [
	        'name'        => __('Kolor tekstu tabeli', \NbpExr\Main::PREFIX),
	        'description' => __('Wybierz z palety kolorów', \NbpExr\Main::PREFIX),
	        'section'     => 'general',
	        'type'        => 'color',
	        'default'     => '#000', // empty text means #000 by default anyway so might as well set it
        ],
        'color_table_striped'                          => [
	        'name'        => __('Kolor tła parzystego wiersza tabeli', \NbpExr\Main::PREFIX),
	        'description' => __('Wybierz z palety kolorów', \NbpExr\Main::PREFIX),
	        'section'     => 'general',
	        'type'        => 'color',
	        'default'     => '#000', // empty text means #000 by default anyway so might as well set it
        ],
//        'textarea'                       => [
//            'name'        => __('Textarea', \NbpExr\Main::PREFIX),
//            'description' => __('Simple textarea', \NbpExr\Main::PREFIX),
//            'section'     => 'general',
//            'type'        => 'textarea',
//            'default'     => '',
//        ],
//        'dropdown'                       => [
//            'name'        => __('Select one', \NbpExr\Main::PREFIX),
//            'description' => __('Single select dropdown', \NbpExr\Main::PREFIX),
//            'section'     => 'general',
//            'type'        => 'dropdown',
//            'default'     => 'option1',
//            'options'     => ['option1', 'option2', 'option3'],
//        ],
        'additional_css'                 => [
            'name'        => __('Dodatkowe CSS', \NbpExr\Main::PREFIX),
            'description' => __('Dodaj dodatkowy CSS do strony', \NbpExr\Main::PREFIX),
            'section'     => 'advanced',
            'type'        => 'code',
            'default'     => '',
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
            'name'            => __('Wybierz waluty (główny widget)', \NbpExr\Main::PREFIX),
            'description'     => __('Wybierz waluty wyświetlane w tabeli', \NbpExr\Main::PREFIX),
            'section'         => 'general',
            'type'            => 'dropdownMultiselect',
            'optionsCallback' => function () {
	            $result = wp_remote_get( 'https://api.nbp.pl/api/exchangerates/tables/A?format=json' )['body'];
	            $rates_table = json_decode($result);

	            return $rates_table[0]->rates;
            },
            'default'         => ['post', 'page'],
        ],
        'mini_widget_rates'             => [
	        'name'            => __('Wybierz waluty (mini widget)', \NbpExr\Main::PREFIX),
	        'description'     => __('Wybierz waluty wyświetlane w tabeli', \NbpExr\Main::PREFIX),
	        'section'         => 'general',
	        'type'            => 'dropdownMultiselect',
	        'optionsCallback' => function () {
		        $result = wp_remote_get( 'https://api.nbp.pl/api/exchangerates/tables/A?format=json' )['body'];
		        $rates_table = json_decode($result);

		        return $rates_table[0]->rates;
	        },
	        'default'         => ['post', 'page'],
        ],
    ],
];
