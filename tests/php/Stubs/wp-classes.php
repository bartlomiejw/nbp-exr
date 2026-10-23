<?php
/**
 * Minimal doubles of the WordPress classes used by the plugin.
 *
 * @package NbpExr\Tests
 */

// phpcs:disable Generic.Files.OneObjectStructurePerFile.MultipleFound, Squiz.Commenting, Generic.Commenting

declare(strict_types=1);

if ( ! class_exists( 'WP_Error' ) ) {
	class WP_Error {
		public function __construct(
			private string $code = '',
			private string $message = '',
			private mixed $data = null
		) {
		}

		public function get_error_code(): string {
			return $this->code;
		}

		public function get_error_message(): string {
			return $this->message;
		}

		public function get_error_data(): mixed {
			return $this->data;
		}
	}
}

if ( ! class_exists( 'WP_REST_Response' ) ) {
	class WP_REST_Response {
		/**
		 * @var array<string, string>
		 */
		private array $headers = array();

		public function __construct( private mixed $data = null, private int $status = 200 ) {
		}

		public function get_data(): mixed {
			return $this->data;
		}

		public function get_status(): int {
			return $this->status;
		}

		public function header( string $key, string $value ): void {
			$this->headers[ $key ] = $value;
		}

		/**
		 * @return array<string, string>
		 */
		public function get_headers(): array {
			return $this->headers;
		}
	}
}

if ( ! class_exists( 'WP_REST_Request' ) ) {
	class WP_REST_Request {
		/**
		 * @param array<string, mixed> $params
		 */
		public function __construct( private array $params = array() ) {
		}

		public function has_param( string $key ): bool {
			return array_key_exists( $key, $this->params );
		}

		public function get_param( string $key ): mixed {
			return $this->params[ $key ] ?? null;
		}
	}
}
