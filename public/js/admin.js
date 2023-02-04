"use strict";
(self["webpackChunkwp_nbpexr"] = self["webpackChunkwp_nbpexr"] || []).push([["/js/admin"],{

/***/ "./src/assets/admin.css":
/*!******************************!*\
  !*** ./src/assets/admin.css ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/assets/frontend.css":
/*!*********************************!*\
  !*** ./src/assets/frontend.css ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/assets/frontview.css":
/*!**********************************!*\
  !*** ./src/assets/frontview.css ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/admin/admin.ts":
/*!****************************!*\
  !*** ./src/admin/admin.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var vue_1 = __webpack_require__(/*! vue */ "vue");
var element_plus_1 = __importDefault(__webpack_require__(/*! element-plus */ "./node_modules/element-plus/lib/index.js"));
var App_vue_1 = __importDefault(__webpack_require__(/*! ./App.vue */ "./src/admin/App.vue"));
var router_1 = __importDefault(__webpack_require__(/*! ./router */ "./src/admin/router/index.ts"));
var shared_1 = __importDefault(__webpack_require__(/*! ~src/shared */ "./src/shared/index.ts"));
var app = (0, vue_1.createApp)(App_vue_1.default);
app.use(element_plus_1.default);
app.use(router_1.default);
// delay mount so we can load configuration
setTimeout(function () {
  (0, shared_1.default)(app, 'vue_wp_plugin_config_admin');
  app.mount('#vue-admin-app');
}, 200);

/***/ }),

/***/ "./src/admin/router/index.ts":
/*!***********************************!*\
  !*** ./src/admin/router/index.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var vue_router_1 = __webpack_require__(/*! vue-router */ "./node_modules/vue-router/index.js");
var Dashboard_vue_1 = __importDefault(__webpack_require__(/*! ~src/admin/views/Dashboard.vue */ "./src/admin/views/Dashboard.vue"));
var Settings_vue_1 = __importDefault(__webpack_require__(/*! ~src/admin/views/Settings.vue */ "./src/admin/views/Settings.vue"));
var routes = [{
  path: '/',
  component: Dashboard_vue_1.default
}, {
  path: '/settings',
  component: Settings_vue_1.default
}];
var router = (0, vue_router_1.createRouter)({
  history: (0, vue_router_1.createWebHashHistory)(),
  routes: routes
});
exports["default"] = router;

/***/ }),

/***/ "./src/shared/i18n.ts":
/*!****************************!*\
  !*** ./src/shared/i18n.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var vue3_gettext_1 = __webpack_require__(/*! vue3-gettext */ "./node_modules/vue3-gettext/dist/cjs/index.js");
var translations_json_1 = __importDefault(__webpack_require__(/*! ~src/../languages/translations.json */ "./languages/translations.json"));
/*
Examples:

import gettext from "./gettext"

const { $gettext } = gettext

const myTest = $gettext("My translation message")

// use in *.vue template: {{ $gettext("Message to translate") }}
*/
exports["default"] = function (app) {
  var gettext = (0, vue3_gettext_1.createGettext)({
    availableLanguages: {
      en: 'English',
      vi: 'Vietnamese',
      'zh-CN': '中文'
    },
    defaultLanguage: 'en',
    translations: translations_json_1.default
  });
  app.use(gettext);
};

/***/ }),

/***/ "./src/shared/index.ts":
/*!*****************************!*\
  !*** ./src/shared/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var axios_1 = __importDefault(__webpack_require__(/*! axios */ "./node_modules/axios/index.js"));
var debounce_1 = __importDefault(__webpack_require__(/*! lodash/debounce */ "./node_modules/lodash/debounce.js"));
var i18n_1 = __importDefault(__webpack_require__(/*! ./i18n */ "./src/shared/i18n.ts"));
var vue_axios_1 = __importDefault(__webpack_require__(/*! vue-axios */ "./node_modules/vue-axios/dist/vue-axios.esm.min.js"));
exports["default"] = function (app, configName) {
  (0, i18n_1.default)(app);
  var win = window;
  win.$appConfig = {};
  win.$appConfig.axios = axios_1.default;
  win.$appConfig.debounce = debounce_1.default;
  // allow for using this.$win/axios inside of a component
  app.config.globalProperties.$win = win;
  app.config.globalProperties.axios = win.$appConfig.axios;
  app.provide('win', win);
  app.provide('pluginConfig', win[configName]);
  app.use(vue_axios_1.default, win.$appConfig.axios);
};

/***/ }),

/***/ "./src/admin/admin-menu-fix.js":
/*!*************************************!*\
  !*** ./src/admin/admin-menu-fix.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
__webpack_require__(/*! core-js/modules/es.string.ends-with.js */ "./node_modules/core-js/modules/es.string.ends-with.js");
// @ts-ignore
var menuFix = function menuFix(slug) {
  var currentUrl = window.location.href;
  var isLocal = currentUrl.indexOf('admin.html') > 0;
  var menuRoot = document.querySelector(isLocal ? '.wp-menu-open' : "#toplevel_page_".concat(slug));
  var currentPath = currentUrl.substr(currentUrl.indexOf(isLocal ? '#/' : 'admin.php'));
  if (menuRoot) {
    menuRoot.addEventListener('click', function (e) {
      var target = e.target;
      var myItems = this.querySelectorAll('li');
      for (var i = 0; i < myItems.length; i++) {
        var node = myItems[i];
        if (node !== e.target.parentElement) {
          node.classList.remove('current');
        } else {
          target.parentElement.classList.add('current');
        }
      }
    });

    // remove all current
    var items = menuRoot.querySelectorAll(".current");
    for (var i = 0; i < items.length; i++) {
      var node = items[i];
      node.classList.remove('current');
    }
    var menu = menuRoot.querySelector(".wp-submenu a[href=\"".concat(currentPath, "\""));
    if (!isLocal && currentPath.endsWith('#/')) {
      menu = menuRoot.querySelector(".wp-submenu a.wp-first-item");
    }
    if (menu) {
      console.log(menu);
      menu.parentElement.classList.add('current');
    }
  }
};
var _default = menuFix;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/ts-loader/index.js??clonedRuleSet-6!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/App.vue?vue&type=script&lang=ts":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/ts-loader/index.js??clonedRuleSet-6!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/App.vue?vue&type=script&lang=ts ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* unplugin-vue-components disabled */

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var vue_1 = __webpack_require__(/*! vue */ "vue");
var admin_menu_fix_1 = __importDefault(__webpack_require__(/*! ./admin-menu-fix */ "./src/admin/admin-menu-fix.js"));
exports["default"] = (0, vue_1.defineComponent)({
  mounted: function mounted() {
    // const that = this
    var pluginConfig = (0, vue_1.inject)('pluginConfig', {});
    // @ts-ignore
    (0, admin_menu_fix_1.default)(pluginConfig.prefix || 'vue-app');
  }
});

/***/ }),

/***/ "./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/ts-loader/index.js??clonedRuleSet-6!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Dashboard.vue?vue&type=script&lang=ts":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/ts-loader/index.js??clonedRuleSet-6!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Dashboard.vue?vue&type=script&lang=ts ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* unplugin-vue-components disabled */

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var vue_1 = __webpack_require__(/*! vue */ "vue");
exports["default"] = (0, vue_1.defineComponent)({
  name: 'Dashboard',
  props: {
    msg: {
      type: String,
      required: false,
      default: 'Welcome to Your Vue.js Backend App'
    }
  }
});

/***/ }),

/***/ "./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/ts-loader/index.js??clonedRuleSet-6!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[5]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/App.vue?vue&type=template&id=3a030f38&ts=true":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/ts-loader/index.js??clonedRuleSet-6!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[5]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/App.vue?vue&type=template&id=3a030f38&ts=true ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* unplugin-vue-components disabled */

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.render = void 0;
var vue_1 = __webpack_require__(/*! vue */ "vue");
var _hoisted_1 = {
  class: "main-wrapper"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_router_view = (0, vue_1.resolveComponent)("router-view");
  return (0, vue_1.openBlock)(), (0, vue_1.createElementBlock)("div", _hoisted_1, [((0, vue_1.openBlock)(), (0, vue_1.createBlock)(_component_router_view, {
    key: _ctx.$route.path
  }))]);
}
exports.render = render;

/***/ }),

/***/ "./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/ts-loader/index.js??clonedRuleSet-6!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[5]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Dashboard.vue?vue&type=template&id=531b35ca&ts=true":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/ts-loader/index.js??clonedRuleSet-6!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[5]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Dashboard.vue?vue&type=template&id=531b35ca&ts=true ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* unplugin-vue-components disabled */

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.render = void 0;
var vue_1 = __webpack_require__(/*! vue */ "vue");
var _hoisted_1 = {
  class: "app-dashboard"
};
var _hoisted_2 = {
  class: "w-full text-center"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, vue_1.openBlock)(), (0, vue_1.createElementBlock)("div", _hoisted_1, [(0, vue_1.createElementVNode)("section", _hoisted_2, (0, vue_1.toDisplayString)(_ctx.msg), 1 /* TEXT */)]);
}

exports.render = render;

/***/ }),

/***/ "./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Settings.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Settings.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* unplugin-vue-components disabled */

__webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
__webpack_require__(/*! core-js/modules/es.array.filter.js */ "./node_modules/core-js/modules/es.array.filter.js");
__webpack_require__(/*! core-js/modules/es.object.get-own-property-descriptor.js */ "./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");
__webpack_require__(/*! core-js/modules/es.object.get-own-property-descriptors.js */ "./node_modules/core-js/modules/es.object.get-own-property-descriptors.js");
var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js"));
__webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
__webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
__webpack_require__(/*! core-js/modules/es.object.keys.js */ "./node_modules/core-js/modules/es.object.keys.js");
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js"));
var _vue = __webpack_require__(/*! vue */ "vue");
var _vue3AceEditor = __webpack_require__(/*! vue3-ace-editor */ "./node_modules/vue3-ace-editor/index.js");
var _aceBuilds = _interopRequireDefault(__webpack_require__(/*! ace-builds */ "./node_modules/ace-builds/src-noconflict/ace.js"));
var _elementPlus = __webpack_require__(/*! element-plus */ "./node_modules/element-plus/lib/index.js");
__webpack_require__(/*! element-plus/es/components/button/style/css */ "./node_modules/element-plus/es/components/button/style/css.mjs");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
_aceBuilds.default.config.set('basePath', 'https://cdn.jsdelivr.net/npm/ace-builds@' + (__webpack_require__(/*! ace-builds */ "./node_modules/ace-builds/src-noconflict/ace.js").version) + '/src-noconflict/');
var _default = (0, _vue.defineComponent)({
  components: {
    VAceEditor: _vue3AceEditor.VAceEditor,
    ElButton: _elementPlus.ElButton
  },
  name: 'Settings',
  setup: function setup() {
    var oldSettings = {};
    var settings = (0, _vue.reactive)(_objectSpread({}, oldSettings));
    var ui = (0, _vue.reactive)({
      actionKey: 0,
      loaded: false
    });
    var structure = (0, _vue.reactive)({
      sections: {},
      options: {}
    });
    var hasLoaded = (0, _vue.ref)(false);
    var hasChanged = (0, _vue.computed)(function () {
      // compare two objects
      var a = JSON.stringify(settings);
      var b = JSON.stringify(oldSettings);
      ui.actionKey = ui.actionKey + 1;
      return a === b;
    });
    return {
      settings: settings,
      oldSettings: oldSettings,
      hasChanged: hasChanged,
      endpoints: {
        settings: ''
      },
      ui: ui,
      structure: structure,
      hasLoaded: hasLoaded
    };
  },
  methods: {
    doSave: function doSave() {
      var _this = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var data, rst, config, oldSettings, settings;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              data = (0, _vue.toRaw)(_this.settings);
              console.log(_this.endpoints.settings);
              _context.next = 5;
              return _this.axios.post(_this.endpoints.settings, data);
            case 5:
              rst = _context.sent;
              console.log(rst);
              // const rst = { success: true }
              if (rst.status === 200) {
                (0, _elementPlus.ElMessage)({
                  message: 'Twoje ustawienia zostały zapisane.',
                  type: 'success'
                });

                // @ts-ignore
                config = _this.$win.vue_wp_plugin_config_admin;
                oldSettings = config.settings || {};
                settings = _objectSpread({}, _this.settings);
                Object.keys(settings).forEach(function (key) {
                  _this.oldSettings[key] = settings[key];
                  oldSettings[key] = settings[key];
                });

                // force rerendered
                _this.ui.actionKey = _this.ui.actionKey + 1;
              } else {
                _elementPlus.ElMessage.error('Odpowiedź wordpress z błędem. ' + JSON.stringify(rst, null, 2));
              }
              _context.next = 13;
              break;
            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](0);
              _elementPlus.ElMessage.error('Odpowiedź serwera z błędem. ' + _context.t0.message);
            case 13:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 10]]);
      }))();
    },
    getOptions: function getOptions(section) {
      var options = _objectSpread({}, this.structure.options);
      var result = [];
      Object.keys(options).forEach(function (key) {
        var item = options[key];
        if (item.section === section) {
          item.id = key;
          result.push(item);
        }
      });
      return result;
    },
    doCancel: function doCancel() {
      var _this2 = this;
      var settings = this.oldSettings;
      Object.keys(settings).forEach(function (key) {
        _this2.oldSettings[key] = settings[key];
        _this2.settings[key] = settings[key];
      });
    },
    doLoad: function doLoad() {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var config, structure, settings;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _vue.nextTick)();
            case 2:
              // @ts-ignore
              config = _this3.$win.vue_wp_plugin_config_admin; // @ts-ignore
              if (!_this3.$win.$appConfig.nonce) {
                _this3.$win.$appConfig.nonce = config.rest.nonce;
              }
              structure = config.settingStructure;
              _this3.structure['sections'] = structure['sections'];
              _this3.structure['options'] = structure['options'];
              settings = config.settings || {};
              _this3.endpoints = config.rest.endpoints;

              // copy settings from server output
              Object.keys(settings).forEach(function (key) {
                _this3.oldSettings[key] = settings[key];
                _this3.settings[key] = settings[key];
              });

              // make sure data is loaded before ui render
              _this3.hasLoaded = true;
              _this3.$forceUpdate();
            case 12:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }))();
    }
  },
  beforeMount: function beforeMount() {
    var _this4 = this;
    var that = this;

    // @ts-ignore
    if (that.$win && that.$win.vue_wp_plugin_config_admin) {
      that.doLoad();
      return;
    }
    document.onreadystatechange = /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
      return _regenerator.default.wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (document.readyState === 'complete') {
              _this4.doLoad();
            }
          case 1:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
  }
});
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[5]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Settings.vue?vue&type=template&id=3c95d6dd&scoped=true":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[5]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Settings.vue?vue&type=template&id=3c95d6dd&scoped=true ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* unplugin-vue-components disabled */

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.render = render;
__webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
__webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
__webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
var _vue = __webpack_require__(/*! vue */ "vue");
var _withScopeId = function _withScopeId(n) {
  return (0, _vue.pushScopeId)("data-v-3c95d6dd"), n = n(), (0, _vue.popScopeId)(), n;
};
var _hoisted_1 = {
  key: 0,
  class: "app-settings w-full flex flex-wrap mx-auto"
};
var _hoisted_2 = {
  class: "w-full md:w-1/5 pt-4"
};
var _hoisted_3 = {
  class: "w-full sticky inset-0 max-h-64 lg:h-auto overflow-x-hidden overflow-y-auto lg:overflow-y-hidden lg:block mt-0 my-2 lg:my-0 border border-gray-400 lg:border-transparent bg-white shadow lg:shadow-none lg:bg-transparent z-20"
};
var _hoisted_4 = {
  class: "font-bold"
};
var _hoisted_5 = {
  class: "space-x-3 flex justify-end pt-2"
};
var _hoisted_6 = {
  class: "w-full md:w-4/5 min-h-screen"
};
var _hoisted_7 = {
  class: "ml-3"
};
var _hoisted_8 = ["id"];
var _hoisted_9 = {
  class: "p-8 mt-6 lg:mt-0 rounded shadow bg-white"
};
var _hoisted_10 = {
  class: "font-sans font-bold break-normal text-gray-700 pb-4 text-xl w-full"
};
var _hoisted_11 = {
  class: "md:flex mb-6"
};
var _hoisted_12 = {
  class: "md:w-3/5"
};
var _hoisted_13 = {
  class: "block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4",
  for: "my-checkbox"
};
var _hoisted_14 = {
  class: "py-2 text-sm text-gray-600"
};
var _hoisted_15 = {
  class: "md:w-2/5"
};
var _hoisted_16 = {
  key: 0
};
var _hoisted_17 = {
  key: 1
};
var _hoisted_18 = {
  key: 2
};
var _hoisted_19 = {
  key: 3
};
var _hoisted_20 = {
  key: 4
};
var _hoisted_21 = {
  key: 5
};
var _hoisted_22 = {
  key: 6
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_el_menu_item = (0, _vue.resolveComponent)("el-menu-item");
  var _component_el_menu = (0, _vue.resolveComponent)("el-menu");
  var _component_el_button = (0, _vue.resolveComponent)("el-button");
  var _component_el_switch = (0, _vue.resolveComponent)("el-switch");
  var _component_el_option = (0, _vue.resolveComponent)("el-option");
  var _component_el_select = (0, _vue.resolveComponent)("el-select");
  var _component_el_input = (0, _vue.resolveComponent)("el-input");
  var _component_v_ace_editor = (0, _vue.resolveComponent)("v-ace-editor");
  var _component_el_color_picker = (0, _vue.resolveComponent)("el-color-picker");
  return _ctx.hasLoaded ? ((0, _vue.openBlock)(), (0, _vue.createElementBlock)("div", _hoisted_1, [(0, _vue.createElementVNode)("aside", _hoisted_2, [(0, _vue.createElementVNode)("div", _hoisted_3, [(0, _vue.createVNode)(_component_el_menu, {
    "default-active": "1",
    class: "rounded shadow bg-white"
  }, {
    default: (0, _vue.withCtx)(function () {
      return [((0, _vue.openBlock)(true), (0, _vue.createElementBlock)(_vue.Fragment, null, (0, _vue.renderList)(_ctx.structure.sections, function (value, name) {
        return (0, _vue.openBlock)(), (0, _vue.createBlock)(_component_el_menu_item, {
          key: "item-".concat(name),
          index: "#".concat(name)
        }, {
          default: (0, _vue.withCtx)(function () {
            return [(0, _vue.createElementVNode)("span", _hoisted_4, (0, _vue.toDisplayString)(value), 1 /* TEXT */)];
          }),

          _: 2 /* DYNAMIC */
        }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["index"]);
      }), 128 /* KEYED_FRAGMENT */))];
    }),

    _: 1 /* STABLE */
  }), (0, _vue.createElementVNode)("div", _hoisted_5, [(0, _vue.createVNode)(_component_el_button, {
    onClick: _cache[0] || (_cache[0] = function ($event) {
      return _ctx.doSave();
    }),
    style: {
      "width": "100px"
    },
    type: "primary",
    size: "large",
    disabled: _ctx.hasChanged,
    "data-rerendered": _ctx.ui.actionKey
  }, {
    default: (0, _vue.withCtx)(function () {
      return [(0, _vue.createTextVNode)(" Zapisz ")];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["disabled", "data-rerendered"]), (0, _vue.createVNode)(_component_el_button, {
    onClick: _cache[1] || (_cache[1] = function ($event) {
      return _ctx.doCancel();
    }),
    style: {
      "width": "100px"
    },
    type: "danger",
    size: "large",
    disabled: _ctx.hasChanged,
    "data-rerendered": _ctx.ui.actionKey
  }, {
    default: (0, _vue.withCtx)(function () {
      return [(0, _vue.createTextVNode)(" Anuluj ")];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["disabled", "data-rerendered"])])])]), (0, _vue.createCommentVNode)("Section container"), (0, _vue.createElementVNode)("section", _hoisted_6, [(0, _vue.createElementVNode)("div", _hoisted_7, [((0, _vue.openBlock)(true), (0, _vue.createElementBlock)(_vue.Fragment, null, (0, _vue.renderList)(_ctx.structure.sections, function (value, name) {
    return (0, _vue.openBlock)(), (0, _vue.createElementBlock)("div", {
      id: name,
      class: "pt-4"
    }, [(0, _vue.createCommentVNode)("Card"), (0, _vue.createElementVNode)("div", _hoisted_9, [(0, _vue.createCommentVNode)("Title"), (0, _vue.createElementVNode)("h2", _hoisted_10, (0, _vue.toDisplayString)(value), 1 /* TEXT */), ((0, _vue.openBlock)(true), (0, _vue.createElementBlock)(_vue.Fragment, null, (0, _vue.renderList)(_ctx.getOptions(name), function (item) {
      return (0, _vue.openBlock)(), (0, _vue.createElementBlock)("div", _hoisted_11, [(0, _vue.createElementVNode)("div", _hoisted_12, [(0, _vue.createElementVNode)("label", _hoisted_13, (0, _vue.toDisplayString)(item.name), 1 /* TEXT */), (0, _vue.createElementVNode)("p", _hoisted_14, (0, _vue.toDisplayString)(item.description), 1 /* TEXT */)]), (0, _vue.createElementVNode)("div", _hoisted_15, [item.type === 'toggle' ? ((0, _vue.openBlock)(), (0, _vue.createElementBlock)("div", _hoisted_16, [(0, _vue.createVNode)(_component_el_switch, {
        modelValue: _ctx.settings[item.id],
        "onUpdate:modelValue": function onUpdateModelValue($event) {
          return _ctx.settings[item.id] = $event;
        },
        size: "large"
      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])])) : item.type === 'dropdownMultiselect' ? ((0, _vue.openBlock)(), (0, _vue.createElementBlock)("div", _hoisted_17, [(0, _vue.createTextVNode)((0, _vue.toDisplayString)(_ctx.settings[item.id]) + " ", 1 /* TEXT */), (0, _vue.createVNode)(_component_el_select, {
        modelValue: _ctx.settings[item.id],
        "onUpdate:modelValue": function onUpdateModelValue($event) {
          return _ctx.settings[item.id] = $event;
        },
        size: "large",
        multiple: "",
        "collapse-tags": "",
        placeholder: "Wybierz"
      }, {
        default: (0, _vue.withCtx)(function () {
          return [((0, _vue.openBlock)(true), (0, _vue.createElementBlock)(_vue.Fragment, null, (0, _vue.renderList)(item.options, function (item, index) {
            return (0, _vue.openBlock)(), (0, _vue.createBlock)(_component_el_option, {
              key: index,
              label: item.currency,
              value: item.code
            }, null, 8 /* PROPS */, ["label", "value"]);
          }), 128 /* KEYED_FRAGMENT */))];
        }),

        _: 2 /* DYNAMIC */
      }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["modelValue", "onUpdate:modelValue"])])) : item.type === 'dropdown' ? ((0, _vue.openBlock)(), (0, _vue.createElementBlock)("div", _hoisted_18, [(0, _vue.createVNode)(_component_el_select, {
        modelValue: _ctx.settings[item.id],
        "onUpdate:modelValue": function onUpdateModelValue($event) {
          return _ctx.settings[item.id] = $event;
        },
        size: "large",
        placeholder: "Wybierz"
      }, {
        default: (0, _vue.withCtx)(function () {
          return [((0, _vue.openBlock)(true), (0, _vue.createElementBlock)(_vue.Fragment, null, (0, _vue.renderList)(item.options, function (item, index) {
            return (0, _vue.openBlock)(), (0, _vue.createBlock)(_component_el_option, {
              key: index,
              label: item,
              value: item
            }, null, 8 /* PROPS */, ["label", "value"]);
          }), 128 /* KEYED_FRAGMENT */))];
        }),

        _: 2 /* DYNAMIC */
      }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["modelValue", "onUpdate:modelValue"])])) : ['textarea'].indexOf(item.type) > -1 ? ((0, _vue.openBlock)(), (0, _vue.createElementBlock)("div", _hoisted_19, [(0, _vue.createVNode)(_component_el_input, {
        modelValue: _ctx.settings[item.id],
        "onUpdate:modelValue": function onUpdateModelValue($event) {
          return _ctx.settings[item.id] = $event;
        },
        rows: 5,
        size: "large",
        type: "textarea",
        placeholder: "Please input"
      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])])) : item.type === 'code' ? ((0, _vue.openBlock)(), (0, _vue.createElementBlock)("div", _hoisted_20, [(0, _vue.createVNode)(_component_v_ace_editor, {
        modelValue: _ctx.settings[item.id],
        "onUpdate:modelValue": function onUpdateModelValue($event) {
          return _ctx.settings[item.id] = $event;
        },
        lang: "html",
        theme: "chrome",
        style: {
          "height": "300px"
        }
      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])])) : item.type === 'color' ? ((0, _vue.openBlock)(), (0, _vue.createElementBlock)("div", _hoisted_21, [(0, _vue.createVNode)(_component_el_color_picker, {
        modelValue: _ctx.settings[item.id],
        "onUpdate:modelValue": function onUpdateModelValue($event) {
          return _ctx.settings[item.id] = $event;
        }
      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])])) : ((0, _vue.openBlock)(), (0, _vue.createElementBlock)("div", _hoisted_22, [(0, _vue.createTextVNode)((0, _vue.toDisplayString)(item.type) + " ", 1 /* TEXT */), (0, _vue.createVNode)(_component_el_input, {
        modelValue: _ctx.settings[item.id],
        "onUpdate:modelValue": function onUpdateModelValue($event) {
          return _ctx.settings[item.id] = $event;
        },
        size: "large",
        placeholder: "Please input"
      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])]))])]);
    }), 256 /* UNKEYED_FRAGMENT */))]), (0, _vue.createCommentVNode)("/Card")], 8 /* PROPS */, _hoisted_8);
  }), 256 /* UNKEYED_FRAGMENT */))])])])) : (0, _vue.createCommentVNode)("v-if", true);
}

/***/ }),

/***/ "./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/laravel-mix/node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-15.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-15.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/laravel-mix/node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-15.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-15.use[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Settings.vue?vue&type=style&index=0&id=3c95d6dd&lang=scss&scoped=true":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/laravel-mix/node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-15.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-15.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/laravel-mix/node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-15.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-15.use[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Settings.vue?vue&type=style&index=0&id=3c95d6dd&lang=scss&scoped=true ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* unplugin-vue-components disabled */// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/admin/App.vue":
/*!***************************!*\
  !*** ./src/admin/App.vue ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__esModule": function() { return /* reexport safe */ _App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__.__esModule; }
/* harmony export */ });
/* harmony import */ var _App_vue_vue_type_template_id_3a030f38_ts_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App.vue?vue&type=template&id=3a030f38&ts=true */ "./src/admin/App.vue?vue&type=template&id=3a030f38&ts=true");
/* harmony import */ var _App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./App.vue?vue&type=script&lang=ts */ "./src/admin/App.vue?vue&type=script&lang=ts");
/* harmony import */ var _Users_bartekapplover_Local_Sites_nbpplugin_app_public_web_app_plugins_nbp_exr_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");
/* unplugin-vue-components disabled */



;
const __exports__ = /*#__PURE__*/(0,_Users_bartekapplover_Local_Sites_nbpplugin_app_public_web_app_plugins_nbp_exr_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_App_vue_vue_type_template_id_3a030f38_ts_true__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"src/admin/App.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ __webpack_exports__["default"] = (__exports__);

/***/ }),

/***/ "./src/admin/views/Dashboard.vue":
/*!***************************************!*\
  !*** ./src/admin/views/Dashboard.vue ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__esModule": function() { return /* reexport safe */ _Dashboard_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__.__esModule; }
/* harmony export */ });
/* harmony import */ var _Dashboard_vue_vue_type_template_id_531b35ca_ts_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Dashboard.vue?vue&type=template&id=531b35ca&ts=true */ "./src/admin/views/Dashboard.vue?vue&type=template&id=531b35ca&ts=true");
/* harmony import */ var _Dashboard_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Dashboard.vue?vue&type=script&lang=ts */ "./src/admin/views/Dashboard.vue?vue&type=script&lang=ts");
/* harmony import */ var _Users_bartekapplover_Local_Sites_nbpplugin_app_public_web_app_plugins_nbp_exr_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");
/* unplugin-vue-components disabled */



;
const __exports__ = /*#__PURE__*/(0,_Users_bartekapplover_Local_Sites_nbpplugin_app_public_web_app_plugins_nbp_exr_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_Dashboard_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_Dashboard_vue_vue_type_template_id_531b35ca_ts_true__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"src/admin/views/Dashboard.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ __webpack_exports__["default"] = (__exports__);

/***/ }),

/***/ "./src/admin/views/Settings.vue":
/*!**************************************!*\
  !*** ./src/admin/views/Settings.vue ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__esModule": function() { return /* reexport safe */ _Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.__esModule; }
/* harmony export */ });
/* harmony import */ var _Settings_vue_vue_type_template_id_3c95d6dd_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Settings.vue?vue&type=template&id=3c95d6dd&scoped=true */ "./src/admin/views/Settings.vue?vue&type=template&id=3c95d6dd&scoped=true");
/* harmony import */ var _Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Settings.vue?vue&type=script&lang=js */ "./src/admin/views/Settings.vue?vue&type=script&lang=js");
/* harmony import */ var _Settings_vue_vue_type_style_index_0_id_3c95d6dd_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Settings.vue?vue&type=style&index=0&id=3c95d6dd&lang=scss&scoped=true */ "./src/admin/views/Settings.vue?vue&type=style&index=0&id=3c95d6dd&lang=scss&scoped=true");
/* harmony import */ var _Users_bartekapplover_Local_Sites_nbpplugin_app_public_web_app_plugins_nbp_exr_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");
/* unplugin-vue-components disabled */



;


const __exports__ = /*#__PURE__*/(0,_Users_bartekapplover_Local_Sites_nbpplugin_app_public_web_app_plugins_nbp_exr_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__["default"])(_Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_Settings_vue_vue_type_template_id_3c95d6dd_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render],['__scopeId',"data-v-3c95d6dd"],['__file',"src/admin/views/Settings.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ __webpack_exports__["default"] = (__exports__);

/***/ }),

/***/ "./src/admin/App.vue?vue&type=script&lang=ts":
/*!***************************************************!*\
  !*** ./src/admin/App.vue?vue&type=script&lang=ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__esModule": function() { return /* reexport safe */ _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_ts_loader_index_js_clonedRuleSet_6_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__.__esModule; },
/* harmony export */   "default": function() { return /* reexport safe */ _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_ts_loader_index_js_clonedRuleSet_6_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__["default"]; }
/* harmony export */ });
/* harmony import */ var _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_ts_loader_index_js_clonedRuleSet_6_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_App_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!../../node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!../../node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../node_modules/ts-loader/index.js??clonedRuleSet-6!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./App.vue?vue&type=script&lang=ts */ "./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/ts-loader/index.js??clonedRuleSet-6!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/App.vue?vue&type=script&lang=ts");
/* unplugin-vue-components disabled */ 

/***/ }),

/***/ "./src/admin/views/Dashboard.vue?vue&type=script&lang=ts":
/*!***************************************************************!*\
  !*** ./src/admin/views/Dashboard.vue?vue&type=script&lang=ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__esModule": function() { return /* reexport safe */ _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_ts_loader_index_js_clonedRuleSet_6_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Dashboard_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__.__esModule; },
/* harmony export */   "default": function() { return /* reexport safe */ _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_ts_loader_index_js_clonedRuleSet_6_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Dashboard_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__["default"]; }
/* harmony export */ });
/* harmony import */ var _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_ts_loader_index_js_clonedRuleSet_6_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Dashboard_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!../../../node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!../../../node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/ts-loader/index.js??clonedRuleSet-6!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Dashboard.vue?vue&type=script&lang=ts */ "./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/ts-loader/index.js??clonedRuleSet-6!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Dashboard.vue?vue&type=script&lang=ts");
/* unplugin-vue-components disabled */ 

/***/ }),

/***/ "./src/admin/App.vue?vue&type=template&id=3a030f38&ts=true":
/*!*****************************************************************!*\
  !*** ./src/admin/App.vue?vue&type=template&id=3a030f38&ts=true ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__esModule": function() { return /* reexport safe */ _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_ts_loader_index_js_clonedRuleSet_6_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_5_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_App_vue_vue_type_template_id_3a030f38_ts_true__WEBPACK_IMPORTED_MODULE_0__.__esModule; },
/* harmony export */   "render": function() { return /* reexport safe */ _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_ts_loader_index_js_clonedRuleSet_6_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_5_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_App_vue_vue_type_template_id_3a030f38_ts_true__WEBPACK_IMPORTED_MODULE_0__.render; }
/* harmony export */ });
/* harmony import */ var _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_ts_loader_index_js_clonedRuleSet_6_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_5_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_App_vue_vue_type_template_id_3a030f38_ts_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!../../node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!../../node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../node_modules/ts-loader/index.js??clonedRuleSet-6!../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[5]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./App.vue?vue&type=template&id=3a030f38&ts=true */ "./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/ts-loader/index.js??clonedRuleSet-6!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[5]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/App.vue?vue&type=template&id=3a030f38&ts=true");
/* unplugin-vue-components disabled */

/***/ }),

/***/ "./src/admin/views/Dashboard.vue?vue&type=template&id=531b35ca&ts=true":
/*!*****************************************************************************!*\
  !*** ./src/admin/views/Dashboard.vue?vue&type=template&id=531b35ca&ts=true ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__esModule": function() { return /* reexport safe */ _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_ts_loader_index_js_clonedRuleSet_6_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_5_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Dashboard_vue_vue_type_template_id_531b35ca_ts_true__WEBPACK_IMPORTED_MODULE_0__.__esModule; },
/* harmony export */   "render": function() { return /* reexport safe */ _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_ts_loader_index_js_clonedRuleSet_6_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_5_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Dashboard_vue_vue_type_template_id_531b35ca_ts_true__WEBPACK_IMPORTED_MODULE_0__.render; }
/* harmony export */ });
/* harmony import */ var _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_ts_loader_index_js_clonedRuleSet_6_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_5_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Dashboard_vue_vue_type_template_id_531b35ca_ts_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!../../../node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!../../../node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/ts-loader/index.js??clonedRuleSet-6!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[5]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Dashboard.vue?vue&type=template&id=531b35ca&ts=true */ "./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/ts-loader/index.js??clonedRuleSet-6!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[5]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Dashboard.vue?vue&type=template&id=531b35ca&ts=true");
/* unplugin-vue-components disabled */

/***/ }),

/***/ "./src/admin/views/Settings.vue?vue&type=script&lang=js":
/*!**************************************************************!*\
  !*** ./src/admin/views/Settings.vue?vue&type=script&lang=js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__esModule": function() { return /* reexport safe */ _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.__esModule; },
/* harmony export */   "default": function() { return /* reexport safe */ _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]; }
/* harmony export */ });
/* harmony import */ var _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!../../../node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!../../../node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Settings.vue?vue&type=script&lang=js */ "./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Settings.vue?vue&type=script&lang=js");
/* unplugin-vue-components disabled */ 

/***/ }),

/***/ "./src/admin/views/Settings.vue?vue&type=template&id=3c95d6dd&scoped=true":
/*!********************************************************************************!*\
  !*** ./src/admin/views/Settings.vue?vue&type=template&id=3c95d6dd&scoped=true ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__esModule": function() { return /* reexport safe */ _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_5_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Settings_vue_vue_type_template_id_3c95d6dd_scoped_true__WEBPACK_IMPORTED_MODULE_0__.__esModule; },
/* harmony export */   "render": function() { return /* reexport safe */ _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_5_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Settings_vue_vue_type_template_id_3c95d6dd_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render; }
/* harmony export */ });
/* harmony import */ var _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_5_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Settings_vue_vue_type_template_id_3c95d6dd_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!../../../node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!../../../node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[5]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Settings.vue?vue&type=template&id=3c95d6dd&scoped=true */ "./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[5]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Settings.vue?vue&type=template&id=3c95d6dd&scoped=true");
/* unplugin-vue-components disabled */

/***/ }),

/***/ "./src/admin/views/Settings.vue?vue&type=style&index=0&id=3c95d6dd&lang=scss&scoped=true":
/*!***********************************************************************************************!*\
  !*** ./src/admin/views/Settings.vue?vue&type=style&index=0&id=3c95d6dd&lang=scss&scoped=true ***!
  \***********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue_components_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_auto_import_node_modules_unplugin_element_plus_node_modules_unplugin_dist_webpack_loaders_transform_js_ruleSet_1_rules_35_use_0_node_modules_laravel_mix_node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_15_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_15_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_laravel_mix_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_15_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_15_use_3_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Settings_vue_vue_type_style_index_0_id_3c95d6dd_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!../../../node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!../../../node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!../../../node_modules/laravel-mix/node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-15.use[0]!../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-15.use[1]!../../../node_modules/vue-loader/dist/stylePostLoader.js!../../../node_modules/laravel-mix/node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-15.use[2]!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-15.use[3]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Settings.vue?vue&type=style&index=0&id=3c95d6dd&lang=scss&scoped=true */ "./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue-components!./node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-auto-import!./node_modules/unplugin-element-plus/node_modules/unplugin/dist/webpack/loaders/transform.js??ruleSet[1].rules[35].use[0]!./node_modules/laravel-mix/node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-15.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-15.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/laravel-mix/node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-15.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-15.use[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/admin/views/Settings.vue?vue&type=style&index=0&id=3c95d6dd&lang=scss&scoped=true");
/* unplugin-vue-components disabled */

/***/ }),

/***/ "vue":
/*!**********************!*\
  !*** external "Vue" ***!
  \**********************/
/***/ (function(module) {

module.exports = Vue;

/***/ }),

/***/ "./languages/translations.json":
/*!*************************************!*\
  !*** ./languages/translations.json ***!
  \*************************************/
/***/ (function(module) {

module.exports = JSON.parse('{"en":{},"zh-CN":{},"vi":{}}');

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["css/admin","css/frontview","css/frontend","/js/vendor"], function() { return __webpack_exec__("./src/admin/admin.ts"), __webpack_exec__("./src/assets/admin.css"), __webpack_exec__("./src/assets/frontend.css"), __webpack_exec__("./src/assets/frontview.css"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);