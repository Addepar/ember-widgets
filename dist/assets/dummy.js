/* jshint ignore:start */

/* jshint ignore:end */

define('dummy/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'dummy/config/environment', 'ember-widgets/views/carousel-item'], function (exports, Ember, Resolver, loadInitializers, config, CarouselItem) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  // Legacy view-as-component weirdness. Don't ever ever ever do this.
  Ember['default'].Handlebars.helper('carousel-item', CarouselItem['default']);

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('dummy/components/carousel-component', ['exports', 'ember-widgets/components/carousel-component'], function (exports, carousel_component) {

	'use strict';



	exports.default = carousel_component.default;

});
define('dummy/components/carousel-item', ['exports', 'ember-widgets/components/carousel-item'], function (exports, carousel_item) {

	'use strict';



	exports.default = carousel_item.default;

});
define('dummy/components/color-picker-cell', ['exports', 'ember-widgets/components/color-picker-cell'], function (exports, color_picker_cell) {

	'use strict';



	exports.default = color_picker_cell.default;

});
define('dummy/components/color-picker-dropdown', ['exports', 'ember-widgets/components/color-picker-dropdown'], function (exports, color_picker_dropdown) {

	'use strict';



	exports.default = color_picker_dropdown.default;

});
define('dummy/components/color-picker', ['exports', 'ember-widgets/components/color-picker'], function (exports, color_picker) {

	'use strict';



	exports.default = color_picker.default;

});
define('dummy/components/editable-label-component', ['exports', 'ember-widgets/components/editable-label-component'], function (exports, editable_label_component) {

	'use strict';



	exports.default = editable_label_component.default;

});
define('dummy/components/modal-component', ['exports', 'ember-widgets/components/modal-component'], function (exports, modal_component) {

	'use strict';



	exports.default = modal_component.default;

});
define('dummy/components/multi-select-component', ['exports', 'ember-widgets/components/multi-select-component'], function (exports, multi_select_component) {

	'use strict';



	exports.default = multi_select_component.default;

});
define('dummy/components/popover-component', ['exports', 'ember-widgets/components/popover-component'], function (exports, popover_component) {

	'use strict';



	exports.default = popover_component.default;

});
define('dummy/components/popover-link-component', ['exports', 'ember-widgets/components/popover-link-component'], function (exports, popover_link_component) {

	'use strict';



	exports.default = popover_link_component.default;

});
define('dummy/components/radio-button-group-component', ['exports', 'ember-widgets/components/radio-button-group-component'], function (exports, radio_button_group_component) {

	'use strict';



	exports.default = radio_button_group_component.default;

});
define('dummy/components/radio-button', ['exports', 'ember-widgets/components/radio-button'], function (exports, radio_button) {

	'use strict';



	exports.default = radio_button.default;

});
define('dummy/components/radio-input', ['exports', 'ember-widgets/components/radio-input'], function (exports, radio_input) {

	'use strict';



	exports.default = radio_input.default;

});
define('dummy/components/select-component', ['exports', 'ember-widgets/components/select-component'], function (exports, select_component) {

	'use strict';



	exports.default = select_component.default;

});
define('dummy/components/typeahead-component', ['exports', 'ember-widgets/components/typeahead-component'], function (exports, typeahead_component) {

	'use strict';



	exports.default = typeahead_component.default;

});
define('dummy/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('dummy/controllers/ember-widgets/popover', ['exports', 'ember', 'dummy/views/custom-popover-content'], function (exports, Ember, CustomPopoverContentView) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    customPopoverContentView: CustomPopoverContentView['default']
  });

});
define('dummy/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('dummy/data/countries', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].A([{ name: 'Afghanistan', code: 'AF' }, { name: 'Aland Islands', code: 'AX' }, { name: 'Albania', code: 'AL' }, { name: 'Algeria', code: 'DZ' }, { name: 'American Samoa', code: 'AS' }, { name: 'Andorra', code: 'AD' }, { name: 'Angola', code: 'AO' }, { name: 'Anguilla', code: 'AI' }, { name: 'Antarctica', code: 'AQ' }, { name: 'Antigua and Barbuda', code: 'AG' }, { name: 'Argentina', code: 'AR' }, { name: 'Armenia', code: 'AM' }, { name: 'Aruba', code: 'AW' }, { name: 'Australia', code: 'AU' }, { name: 'Austria', code: 'AT' }, { name: 'Azerbaijan', code: 'AZ' }, { name: 'Bahamas', code: 'BS' }, { name: 'Bahrain', code: 'BH' }, { name: 'Bangladesh', code: 'BD' }, { name: 'Barbados', code: 'BB' }, { name: 'Belarus', code: 'BY' }, { name: 'Belgium', code: 'BE' }, { name: 'Belize', code: 'BZ' }, { name: 'Benin', code: 'BJ' }, { name: 'Bermuda', code: 'BM' }, { name: 'Bhutan', code: 'BT' }, { name: 'Bolivia', code: 'BO' }, { name: 'Bosnia and Herzegovina', code: 'BA' }, { name: 'Botswana', code: 'BW' }, { name: 'Bouvet Island', code: 'BV' }, { name: 'Brazil', code: 'BR' }, { name: 'British Indian Ocean Territory', code: 'IO' }, { name: 'Brunei Darussalam', code: 'BN' }, { name: 'Bulgaria', code: 'BG' }, { name: 'Burkina Faso', code: 'BF' }, { name: 'Burundi', code: 'BI' }, { name: 'Cambodia', code: 'KH' }, { name: 'Cameroon', code: 'CM' }, { name: 'Canada', code: 'CA' }, { name: 'Cape Verde', code: 'CV' }, { name: 'Cayman Islands', code: 'KY' }, { name: 'Central African Republic', code: 'CF' }, { name: 'Chad', code: 'TD' }, { name: 'Chile', code: 'CL' }, { name: 'China', code: 'CN' }, { name: 'Christmas Island', code: 'CX' }, { name: 'Cocos (Keeling) Islands', code: 'CC' }, { name: 'Colombia', code: 'CO' }, { name: 'Comoros', code: 'KM' }, { name: 'Congo', code: 'CG' }, { name: 'Congo, The Democratic Republic of the', code: 'CD' }, { name: 'Cook Islands', code: 'CK' }, { name: 'Costa Rica', code: 'CR' }, { name: 'Cote D\'Ivoire', code: 'CI' }, { name: 'Croatia', code: 'HR' }, { name: 'Cuba', code: 'CU' }, { name: 'Cyprus', code: 'CY' }, { name: 'Czech Republic', code: 'CZ' }, { name: 'Denmark', code: 'DK' }, { name: 'Djibouti', code: 'DJ' }, { name: 'Dominica', code: 'DM' }, { name: 'Dominican Republic', code: 'DO' }, { name: 'Ecuador', code: 'EC' }, { name: 'Egypt', code: 'EG' }, { name: 'El Salvador', code: 'SV' }, { name: 'Equatorial Guinea', code: 'GQ' }, { name: 'Eritrea', code: 'ER' }, { name: 'Estonia', code: 'EE' }, { name: 'Ethiopia', code: 'ET' }, { name: 'Falkland Islands (Malvinas)', code: 'FK' }, { name: 'Faroe Islands', code: 'FO' }, { name: 'Fiji', code: 'FJ' }, { name: 'Finland', code: 'FI' }, { name: 'France', code: 'FR' }, { name: 'French Guiana', code: 'GF' }, { name: 'French Polynesia', code: 'PF' }, { name: 'French Southern Territories', code: 'TF' }, { name: 'Gabon', code: 'GA' }, { name: 'Gambia', code: 'GM' }, { name: 'Georgia', code: 'GE' }, { name: 'Germany', code: 'DE' }, { name: 'Ghana', code: 'GH' }, { name: 'Gibraltar', code: 'GI' }, { name: 'Greece', code: 'GR' }, { name: 'Greenland', code: 'GL' }, { name: 'Grenada', code: 'GD' }, { name: 'Guadeloupe', code: 'GP' }, { name: 'Guam', code: 'GU' }, { name: 'Guatemala', code: 'GT' }, { name: 'Guernsey', code: 'GG' }, { name: 'Guinea', code: 'GN' }, { name: 'Guinea-Bissau', code: 'GW' }, { name: 'Guyana', code: 'GY' }, { name: 'Haiti', code: 'HT' }, { name: 'Heard Island and Mcdonald Islands', code: 'HM' }, { name: 'Holy See (Vatican City State)', code: 'VA' }, { name: 'Honduras', code: 'HN' }, { name: 'Hong Kong', code: 'HK' }, { name: 'Hungary', code: 'HU' }, { name: 'Iceland', code: 'IS' }, { name: 'India', code: 'IN' }, { name: 'Indonesia', code: 'ID' }, { name: 'Iran, Islamic Republic Of', code: 'IR' }, { name: 'Iraq', code: 'IQ' }, { name: 'Ireland', code: 'IE' }, { name: 'Isle of Man', code: 'IM' }, { name: 'Israel', code: 'IL' }, { name: 'Italy', code: 'IT' }, { name: 'Jamaica', code: 'JM' }, { name: 'Japan', code: 'JP' }, { name: 'Jersey', code: 'JE' }, { name: 'Jordan', code: 'JO' }, { name: 'Kazakhstan', code: 'KZ' }, { name: 'Kenya', code: 'KE' }, { name: 'Kiribati', code: 'KI' }, { name: 'Korea, Democratic People\'S Republic of', code: 'KP' }, { name: 'Korea, Republic of', code: 'KR' }, { name: 'Kuwait', code: 'KW' }, { name: 'Kyrgyzstan', code: 'KG' }, { name: 'Lao People\'S Democratic Republic', code: 'LA' }, { name: 'Latvia', code: 'LV' }, { name: 'Lebanon', code: 'LB' }, { name: 'Lesotho', code: 'LS' }, { name: 'Liberia', code: 'LR' }, { name: 'Libyan Arab Jamahiriya', code: 'LY' }, { name: 'Liechtenstein', code: 'LI' }, { name: 'Lithuania', code: 'LT' }, { name: 'Luxembourg', code: 'LU' }, { name: 'Macao', code: 'MO' }, { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' }, { name: 'Madagascar', code: 'MG' }, { name: 'Malawi', code: 'MW' }, { name: 'Malaysia', code: 'MY' }, { name: 'Maldives', code: 'MV' }, { name: 'Mali', code: 'ML' }, { name: 'Malta', code: 'MT' }, { name: 'Marshall Islands', code: 'MH' }, { name: 'Martinique', code: 'MQ' }, { name: 'Mauritania', code: 'MR' }, { name: 'Mauritius', code: 'MU' }, { name: 'Mayotte', code: 'YT' }, { name: 'Mexico', code: 'MX' }, { name: 'Micronesia, Federated States of', code: 'FM' }, { name: 'Moldova, Republic of', code: 'MD' }, { name: 'Monaco', code: 'MC' }, { name: 'Mongolia', code: 'MN' }, { name: 'Montserrat', code: 'MS' }, { name: 'Morocco', code: 'MA' }, { name: 'Mozambique', code: 'MZ' }, { name: 'Myanmar', code: 'MM' }, { name: 'Namibia', code: 'NA' }, { name: 'Nauru', code: 'NR' }, { name: 'Nepal', code: 'NP' }, { name: 'Netherlands', code: 'NL' }, { name: 'Netherlands Antilles', code: 'AN' }, { name: 'New Caledonia', code: 'NC' }, { name: 'New Zealand', code: 'NZ' }, { name: 'Nicaragua', code: 'NI' }, { name: 'Niger', code: 'NE' }, { name: 'Nigeria', code: 'NG' }, { name: 'Niue', code: 'NU' }, { name: 'Norfolk Island', code: 'NF' }, { name: 'Northern Mariana Islands', code: 'MP' }, { name: 'Norway', code: 'NO' }, { name: 'Oman', code: 'OM' }, { name: 'Pakistan', code: 'PK' }, { name: 'Palau', code: 'PW' }, { name: 'Palestinian Territory, Occupied', code: 'PS' }, { name: 'Panama', code: 'PA' }, { name: 'Papua New Guinea', code: 'PG' }, { name: 'Paraguay', code: 'PY' }, { name: 'Peru', code: 'PE' }, { name: 'Philippines', code: 'PH' }, { name: 'Pitcairn', code: 'PN' }, { name: 'Poland', code: 'PL' }, { name: 'Portugal', code: 'PT' }, { name: 'Puerto Rico', code: 'PR' }, { name: 'Qatar', code: 'QA' }, { name: 'Reunion', code: 'RE' }, { name: 'Romania', code: 'RO' }, { name: 'Russian Federation', code: 'RU' }, { name: 'RWANDA', code: 'RW' }, { name: 'Saint Helena', code: 'SH' }, { name: 'Saint Kitts and Nevis', code: 'KN' }, { name: 'Saint Lucia', code: 'LC' }, { name: 'Saint Pierre and Miquelon', code: 'PM' }, { name: 'Saint Vincent and the Grenadines', code: 'VC' }, { name: 'Samoa', code: 'WS' }, { name: 'San Marino', code: 'SM' }, { name: 'Sao Tome and Principe', code: 'ST' }, { name: 'Saudi Arabia', code: 'SA' }, { name: 'Senegal', code: 'SN' }, { name: 'Serbia and Montenegro', code: 'CS' }, { name: 'Seychelles', code: 'SC' }, { name: 'Sierra Leone', code: 'SL' }, { name: 'Singapore', code: 'SG' }, { name: 'Slovakia', code: 'SK' }, { name: 'Slovenia', code: 'SI' }, { name: 'Solomon Islands', code: 'SB' }, { name: 'Somalia', code: 'SO' }, { name: 'South Africa', code: 'ZA' }, { name: 'South Georgia and the South Sandwich Islands', code: 'GS' }, { name: 'Spain', code: 'ES' }, { name: 'Sri Lanka', code: 'LK' }, { name: 'Sudan', code: 'SD' }, { name: 'Suriname', code: 'SR' }, { name: 'Svalbard and Jan Mayen', code: 'SJ' }, { name: 'Swaziland', code: 'SZ' }, { name: 'Sweden', code: 'SE' }, { name: 'Switzerland', code: 'CH' }, { name: 'Syrian Arab Republic', code: 'SY' }, { name: 'Taiwan, Province of China', code: 'TW' }, { name: 'Tajikistan', code: 'TJ' }, { name: 'Tanzania, United Republic of', code: 'TZ' }, { name: 'Thailand', code: 'TH' }, { name: 'Timor-Leste', code: 'TL' }, { name: 'Togo', code: 'TG' }, { name: 'Tokelau', code: 'TK' }, { name: 'Tonga', code: 'TO' }, { name: 'Trinidad and Tobago', code: 'TT' }, { name: 'Tunisia', code: 'TN' }, { name: 'Turkey', code: 'TR' }, { name: 'Turkmenistan', code: 'TM' }, { name: 'Turks and Caicos Islands', code: 'TC' }, { name: 'Tuvalu', code: 'TV' }, { name: 'Uganda', code: 'UG' }, { name: 'Ukraine', code: 'UA' }, { name: 'United Arab Emirates', code: 'AE' }, { name: 'United Kingdom', code: 'GB' }, { name: 'United States', code: 'US' }, { name: 'United States Minor Outlying Islands', code: 'UM' }, { name: 'Uruguay', code: 'UY' }, { name: 'Uzbekistan', code: 'UZ' }, { name: 'Vanuatu', code: 'VU' }, { name: 'Venezuela', code: 'VE' }, { name: 'Viet Nam', code: 'VN' }, { name: 'Virgin Islands, British', code: 'VG' }, { name: 'Virgin Islands, U.S.', code: 'VI' }, { name: 'Wallis and Futuna', code: 'WF' }, { name: 'Western Sahara', code: 'EH' }, { name: 'Yemen', code: 'YE' }, { name: 'Zambia', code: 'ZM' }, { name: 'Zimbabwe', code: 'ZW' }]);

});
define('dummy/ember-widgets/tests/modules/ember-widgets/components/carousel-component.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/components');
  test('modules/ember-widgets/components/carousel-component.js should pass jshint', function () {
    ok(false, 'modules/ember-widgets/components/carousel-component.js should pass jshint.\nmodules/ember-widgets/components/carousel-component.js: line 96, col 25, Expected an assignment or function call and instead saw an expression.\n\n1 error');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/components/color-picker-cell.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/components');
  test('modules/ember-widgets/components/color-picker-cell.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/components/color-picker-cell.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/components/color-picker-dropdown.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/components');
  test('modules/ember-widgets/components/color-picker-dropdown.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/components/color-picker-dropdown.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/components/color-picker.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/components');
  test('modules/ember-widgets/components/color-picker.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/components/color-picker.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/components/editable-label-component.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/components');
  test('modules/ember-widgets/components/editable-label-component.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/components/editable-label-component.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/components/modal-component.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/components');
  test('modules/ember-widgets/components/modal-component.js should pass jshint', function () {
    ok(false, 'modules/ember-widgets/components/modal-component.js should pass jshint.\nmodules/ember-widgets/components/modal-component.js: line 142, col 19, Expected an assignment or function call and instead saw an expression.\n\n1 error');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/components/multi-select-component.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/components');
  test('modules/ember-widgets/components/multi-select-component.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/components/multi-select-component.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/components/popover-component.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/components');
  test('modules/ember-widgets/components/popover-component.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/components/popover-component.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/components/popover-link-component.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/components');
  test('modules/ember-widgets/components/popover-link-component.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/components/popover-link-component.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/components/radio-button-group-component.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/components');
  test('modules/ember-widgets/components/radio-button-group-component.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/components/radio-button-group-component.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/components/radio-button.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/components');
  test('modules/ember-widgets/components/radio-button.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/components/radio-button.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/components/radio-input.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/components');
  test('modules/ember-widgets/components/radio-input.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/components/radio-input.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/components/select-component.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/components');
  test('modules/ember-widgets/components/select-component.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/components/select-component.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/components/typeahead-component.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/components');
  test('modules/ember-widgets/components/typeahead-component.js should pass jshint', function () {
    ok(false, 'modules/ember-widgets/components/typeahead-component.js should pass jshint.\nmodules/ember-widgets/components/typeahead-component.js: line 13, col 48, Missing semicolon.\n\n1 error');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/mixins/body-event-listener.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/mixins');
  test('modules/ember-widgets/mixins/body-event-listener.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/mixins/body-event-listener.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/mixins/color-picker.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/mixins');
  test('modules/ember-widgets/mixins/color-picker.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/mixins/color-picker.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/mixins/keyboard-helper.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/mixins');
  test('modules/ember-widgets/mixins/keyboard-helper.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/mixins/keyboard-helper.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/mixins/popover.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/mixins');
  test('modules/ember-widgets/mixins/popover.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/mixins/popover.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/mixins/style-bindings.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/mixins');
  test('modules/ember-widgets/mixins/style-bindings.js should pass jshint', function () {
    ok(false, 'modules/ember-widgets/mixins/style-bindings.js should pass jshint.\nmodules/ember-widgets/mixins/style-bindings.js: line 28, col 64, Expected an assignment or function call and instead saw an expression.\n\n1 error');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/mixins/tabbable-modal.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/mixins');
  test('modules/ember-widgets/mixins/tabbable-modal.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/mixins/tabbable-modal.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/mysterious-dependency/ember-addepar-mixins/resize_handler.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/mysterious-dependency/ember-addepar-mixins');
  test('modules/ember-widgets/mysterious-dependency/ember-addepar-mixins/resize_handler.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/mysterious-dependency/ember-addepar-mixins/resize_handler.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/utils/color-picker.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/utils');
  test('modules/ember-widgets/utils/color-picker.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/utils/color-picker.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/utils/widget-config.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/utils');
  test('modules/ember-widgets/utils/widget-config.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/utils/widget-config.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/views/carousel-indicator.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/views');
  test('modules/ember-widgets/views/carousel-indicator.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/views/carousel-indicator.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/views/carousel-item.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/views');
  test('modules/ember-widgets/views/carousel-item.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/views/carousel-item.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/views/multi-select-item.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/views');
  test('modules/ember-widgets/views/multi-select-item.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/views/multi-select-item.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/views/multi-select-option.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/views');
  test('modules/ember-widgets/views/multi-select-option.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/views/multi-select-option.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/views/multi-select-tooltip-item.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/views');
  test('modules/ember-widgets/views/multi-select-tooltip-item.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/views/multi-select-tooltip-item.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/views/select-option.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/views');
  test('modules/ember-widgets/views/select-option.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/views/select-option.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/views/select-tooltip-option.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/views');
  test('modules/ember-widgets/views/select-tooltip-option.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/views/select-tooltip-option.js should pass jshint.');
  });

});
define('dummy/ember-widgets/tests/modules/ember-widgets/views/view-parent-view-content.jshint', function () {

  'use strict';

  module('JSHint - modules/ember-widgets/views');
  test('modules/ember-widgets/views/view-parent-view-content.js should pass jshint', function () {
    ok(true, 'modules/ember-widgets/views/view-parent-view-content.js should pass jshint.');
  });

});
define('dummy/initializers/app-version', ['exports', 'dummy/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('dummy/initializers/export-application-global', ['exports', 'ember', 'dummy/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('dummy/initializers/list-view-helper', ['exports', 'ember', 'ember-list-view/helper'], function (exports, Ember, helper) {

  'use strict';

  var initialize = helper.registerListViewHelpers;

  exports['default'] = {
    name: 'list-view-helper',
    initialize: helper.registerListViewHelpers
  };

  exports.initialize = initialize;

});
define('dummy/router', ['exports', 'ember', 'dummy/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('license');
    this.route('emberWidgets', {
      path: '/ember-widgets'
    }, function () {
      this.route('overview');
      this.route('documentation');
      this.route('carousel');
      this.route('modal');
      this.route('popover');
      this.route('select');
      this.route('colorPicker');
      this.route('radioButton');
    });
  });

  exports['default'] = Router;

});
define('dummy/routes/ember-widgets/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function beforeModel() {
      return this.transitionTo('emberWidgets.overview');
    }
  });

});
define('dummy/routes/ember-widgets/modal', ['exports', 'ember', 'dummy/views/custom-modal-content', 'ember-widgets/components/modal-component'], function (exports, Ember, CustomModalContentView, ModalComponent) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    actions: {
      showModal: function showModal() {
        return ModalComponent['default'].popup({
          targetObject: this,
          confirm: "modalConfirm",
          cancel: "modalCancel",
          content: "Isn't this one fine day?"
        });
      },
      showSmallModal: function showSmallModal() {
        return ModalComponent['default'].popup({
          targetObject: this,
          confirm: "modalConfirm",
          cancel: "modalCancel",
          size: 'small',
          content: "This is quite small isn't it? You can also use 'large'."
        });
      },
      showModalWithCustomContent: function showModalWithCustomContent() {
        return ModalComponent['default'].popup({
          targetObject: this,
          confirm: "modalConfirm",
          cancel: "modalCancel",
          content: {
            name: "Louis"
          },
          contentViewClass: CustomModalContentView['default']
        });
      },
      modalConfirm: function modalConfirm() {
        return console.log("Modal Confirm!");
      },
      modalCancel: function modalCancel() {
        return console.log("Modal Cancel!");
      }
    }
  });

});
define('dummy/routes/ember-widgets/overview', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    activate: function activate() {
      var controller;
      controller = this.controllerFor('emberWidgets');
      controller.set('showLargeHero', true);
    },
    deactivate: function deactivate() {
      var controller;
      controller = this.controllerFor('emberWidgets');
      controller.set('showLargeHero', false);
    }
  });

});
define('dummy/routes/ember-widgets/popover', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return {
        name: "Louis"
      };
    }
  });

});
define('dummy/routes/ember-widgets/select', ['exports', 'ember', 'dummy/data/countries'], function (exports, Ember, countryList) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return countryList['default'];
    }
  });

});
define('dummy/routes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function beforeModel() {
      return this.transitionTo('emberWidgets.overview');
    }
  });

});
define('dummy/routes/overview', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.set('showLargeHero', false);
    }
  });

});
define('dummy/routes/select-box', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    redirect: function redirect() {
      this.transitionTo('overview');
    }
  });

});
define('dummy/templates/_footer', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("Overview &amp; Getting Started");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("API &amp; Documentation");
    }

  function program5(depth0,data) {
    
    
    data.buffer.push("Carousel");
    }

  function program7(depth0,data) {
    
    
    data.buffer.push("Modal");
    }

  function program9(depth0,data) {
    
    
    data.buffer.push("Popover");
    }

  function program11(depth0,data) {
    
    
    data.buffer.push("Select");
    }

  function program13(depth0,data) {
    
    
    data.buffer.push("Color Picker");
    }

  function program15(depth0,data) {
    
    
    data.buffer.push("Radio Button");
    }

  function program17(depth0,data) {
    
    
    data.buffer.push("License");
    }

    data.buffer.push("\n<div class=\"footer\">\n  <div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col-md-3\">\n        <ul class=\"list-unstyled\">\n          <li><h6>Ember Widgets</h6></li>\n          <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.overview", options) : helperMissing.call(depth0, "link-to", "emberWidgets.overview", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n          <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.documentation", options) : helperMissing.call(depth0, "link-to", "emberWidgets.documentation", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n        </ul>\n      </div>\n      <div class=\"col-md-3\">\n        <ul class=\"list-unstyled\">\n          <li><h6>Widgets</h6></li>\n          <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.carousel", options) : helperMissing.call(depth0, "link-to", "emberWidgets.carousel", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n          <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.modal", options) : helperMissing.call(depth0, "link-to", "emberWidgets.modal", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n          <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.popover", options) : helperMissing.call(depth0, "link-to", "emberWidgets.popover", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n          <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.select", options) : helperMissing.call(depth0, "link-to", "emberWidgets.select", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n          <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.colorPicker", options) : helperMissing.call(depth0, "link-to", "emberWidgets.colorPicker", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n          <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.radioButton", options) : helperMissing.call(depth0, "link-to", "emberWidgets.radioButton", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n        </ul>\n      </div>\n      <div class=\"col-md-3\">\n        <ul class=\"list-unstyled\">\n          <li><h6>Addepar Open Source</h6></li>\n          <li><a target=\"_BLANK\" href=\"http://addepar.github.io/\">Home</a></li>\n          <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "license", options) : helperMissing.call(depth0, "link-to", "license", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n        </ul>\n      </div>\n      <div class=\"col-md-3\">\n        <ul class=\"list-unstyled\">\n          <li><h6>About Addepar</h6></li>\n          <li><a target=\"_BLANK\" href=\"http://www.addepar.com\">www.addepar.com</a></li>\n          <li>\n            <address>\n              <br>\n              <a target=\"_BLANK\" href=\"http://goo.gl/maps/446ui\"><strong>Addepar HQ</strong><br>\n              1215 Terra Bella Ave<br>\n              Mountain View, CA 94043</a><br><br>\n\n              <a target=\"_BLANK\" href=\"http://goo.gl/maps/xEiCM\"><strong>Addepar NY</strong><br>\n              335 Madison Ave Suite 880<br>\n              New York, NY 10017</a><br>\n            </address>\n          </li>\n        </ul>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-md-12 center-align\">\n        <p>&copy; 2013 Addepar, Inc.</p>\n      </div>\n    </div>\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/_navigation', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '';


    data.buffer.push("\n<nav class=\"navbar navbar-transparent addepar-navbar\" role=\"navigation\">\n  <div class=\"navbar-header\">\n    <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-ex1-collapse\">\n      <span class=\"sr-only\">Toggle navigation</span>\n      <span class=\"icon-bar\"></span>\n      <span class=\"icon-bar\"></span>\n      <span class=\"icon-bar\"></span>\n    </button>\n    <a class=\"navbar-brand\" href=\"http://addepar.github.io/\">\n      <img id=\"logo_dark\" class=\"logo\" src=\"img/addepar_logo_light.png\" /><span class=\"navbar-title\">Open Source</span>\n    </a>\n  </div>\n\n  <div class=\"collapse navbar-collapse navbar-ex1-collapse\">\n    <ul class=\"nav navbar-nav navbar-right\">\n      <li><a href=\"http://addepar.github.io/ember-table\">Ember Table</a></li>\n      <li><a href=\"http://addepar.github.io/ember-charts\">Ember Charts</a></li>\n      <li><a href=\"#\">Ember Widgets</a></li>\n    </ul>\n  </div><!-- /.navbar-collapse -->\n</nav>\n");
    return buffer;
    
  });

});
define('dummy/templates/accordion-group-layout', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<div class=\"panel-heading\">\n  <h4 class=\"panel-title\">\n    <a class=\"accordion-toggle collapsed\">\n      ");
    stack1 = helpers._triageMustache.call(depth0, "view.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </a>\n  </h4>\n</div>\n<div class=\"panel-collapse collapse\">\n  <div class=\"panel-body\">");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</div>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("\n");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "navigation", options) : helperMissing.call(depth0, "partial", "navigation", options))));
    data.buffer.push("\n\n");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "footer", options) : helperMissing.call(depth0, "partial", "footer", options))));
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('dummy/templates/carousel', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.CollectionView", {hash:{
      'tagName': ("ol"),
      'class': ("carousel-indicators"),
      'content': ("view.content"),
      'itemViewClass': ("carouselIndicatorClass")
    },hashTypes:{'tagName': "STRING",'class': "STRING",'content': "ID",'itemViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'content': depth0,'itemViewClass': depth0},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n<div class=\"carousel-inner\">\n  ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>\n<a class=\"left carousel-control\"  href=\"#\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "prev", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">‹</a>\n<a class=\"right carousel-control\" href=\"#\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "next", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">›</a>\n");
    return buffer;
    
  });

});
define('dummy/templates/color-picker-button-partial', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


    data.buffer.push("<button class=\"btn btn-default color-picker-dropdown-button\"\n  ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleDropdown", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\n  ");
    data.buffer.push(escapeExpression((helper = helpers['color-picker-cell'] || (depth0 && depth0['color-picker-cell']),options={hash:{
      'color': ("selectedColor"),
      'classNameBindings': ("isColorTransparent:color-picker-cell-transparent")
    },hashTypes:{'color': "ID",'classNameBindings': "STRING"},hashContexts:{'color': depth0,'classNameBindings': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker-cell", options))));
    data.buffer.push("\n  <span class=\"pull-right fa fa-caret-down color-picker-dropdown-caret\"></span>\n</button>\n");
    return buffer;
    
  });

});
define('dummy/templates/color-picker-cell', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"no-color-indicator-holder\"></div>");
    
  });

});
define('dummy/templates/color-picker-dropdown', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n      <div class=\"color-row clearfix\">\n        ");
    stack1 = helpers.each.call(depth0, "color", "in", "row", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n      <hr>\n    ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n          ");
    data.buffer.push(escapeExpression((helper = helpers['color-picker-cell'] || (depth0 && depth0['color-picker-cell']),options={hash:{
      'color': ("color"),
      'selectedColor': ("selectedColor"),
      'setColor': ("setColor")
    },hashTypes:{'color': "ID",'selectedColor': "ID",'setColor': "STRING"},hashContexts:{'color': depth0,'selectedColor': depth0,'setColor': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker-cell", options))));
    data.buffer.push("\n        ");
    return buffer;
    }

    data.buffer.push("<div class=\"dropdown open\">\n  <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":dropdown-menu :color-picker-dropdown dropdownClass")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("\n    role=\"menu\" aria-labelledby=\"dLabel\">\n    ");
    stack1 = helpers.each.call(depth0, "row", "in", "colorRows", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      <form ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "setCustomColor", {hash:{
      'on': ("submit")
    },hashTypes:{'on': "STRING"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n      ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":color-picker-custom-form isCustomColorValid:valid:invalid")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n        <div class=\"input-group\">\n          <span ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":input-group-addon\n            :color-picker-custom-preview isCustomColor:active"),
      'style': ("customColorCSS")
    },hashTypes:{'class': "STRING",'style': "STRING"},hashContexts:{'class': depth0,'style': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "setCustomColor", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\n          </span>\n          ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'valueBinding': ("customColor"),
      'class': ("form-control input-sm"),
      'type': ("text"),
      'placeholder': ("HEX code")
    },hashTypes:{'valueBinding': "STRING",'class': "STRING",'type': "STRING",'placeholder': "STRING"},hashContexts:{'valueBinding': depth0,'class': depth0,'type': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n        </div>\n      </form>\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/color-picker', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n  ");
    data.buffer.push(escapeExpression((helper = helpers['color-picker-dropdown'] || (depth0 && depth0['color-picker-dropdown']),options={hash:{
      'dropdownClass': ("dropdownClass"),
      'colorRows': ("colorRows"),
      'userSelected': ("userSelected"),
      'hideDropdown': ("hideDropdown"),
      'setSelectedColor': ("setSelectedColor"),
      'customColor': ("customColor"),
      'selectedColor': ("selectedColor")
    },hashTypes:{'dropdownClass': "ID",'colorRows': "ID",'userSelected': "STRING",'hideDropdown': "STRING",'setSelectedColor': "STRING",'customColor': "ID",'selectedColor': "ID"},hashContexts:{'dropdownClass': depth0,'colorRows': depth0,'userSelected': depth0,'hideDropdown': depth0,'setSelectedColor': depth0,'customColor': depth0,'selectedColor': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker-dropdown", options))));
    data.buffer.push("\n");
    return buffer;
    }

    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "colorPickerButtonPartial", options) : helperMissing.call(depth0, "partial", "colorPickerButtonPartial", options))));
    data.buffer.push("\n");
    stack1 = helpers['if'].call(depth0, "isDropdownOpen", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('dummy/templates/component-default-content', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<p>");
    stack1 = helpers._triageMustache.call(depth0, "content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n");
    return buffer;
    
  });

});
define('dummy/templates/custom-modal-content', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<p>Isn't this one fine day ");
    stack1 = helpers._triageMustache.call(depth0, "content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("?</p>\n");
    return buffer;
    
  });

});
define('dummy/templates/custom-popover-content', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("Isn't this one fine day ");
    stack1 = helpers._triageMustache.call(depth0, "content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("?\n");
    return buffer;
    
  });

});
define('dummy/templates/editable-label', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "view.innerTextField", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  <span ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "editLabel", {hash:{
      'target': ("view")
    },hashTypes:{'target': "STRING"},hashContexts:{'target': depth0},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push(">");
    stack1 = helpers._triageMustache.call(depth0, "view.displayName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "view.isEditing", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('dummy/templates/ember-widgets/-sub-navigation', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("Overview");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("API &amp; Documentation");
    }

  function program5(depth0,data) {
    
    
    data.buffer.push("Carousel");
    }

  function program7(depth0,data) {
    
    
    data.buffer.push("Modal");
    }

  function program9(depth0,data) {
    
    
    data.buffer.push("Popover");
    }

  function program11(depth0,data) {
    
    
    data.buffer.push("Select");
    }

  function program13(depth0,data) {
    
    
    data.buffer.push("Color Picker");
    }

  function program15(depth0,data) {
    
    
    data.buffer.push("Radio Button");
    }

    data.buffer.push("\n<div class=\"col-md-2 sub-navigation-sidebar\">\n  <ul class=\"list-unstyled github-navigation\">\n    <li>\n      <a class=\"btn btn-default\" target=\"_BLANK\" href=\"https://github.com/addepar/ember-widgets\">\n        <i class=\"icon-github\"></i> View on GitHub\n      </a>\n    </li>\n    <li>\n      <iframe src=\"http://ghbtns.com/github-btn.html?user=addepar&amp;repo=ember-widgets&amp;type=watch&amp;count=true\" allowtransparency=\"true\" frameborder=\"0\" scrolling=\"0\" width=\"130\" height=\"30\"></iframe>\n    </li>\n  </ul>\n  <hr>\n  <ul class=\"list-unstyled project-navigation\">\n    <li class=\"sub-title\">Ember Widgets</li>\n    <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.overview", options) : helperMissing.call(depth0, "link-to", "emberWidgets.overview", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n    <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.documentation", options) : helperMissing.call(depth0, "link-to", "emberWidgets.documentation", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n  </ul>\n  <hr>\n  <ul class=\"list-unstyled project-navigation\">\n    <li class=\"sub-title\">Examples</li>\n    <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.carousel", options) : helperMissing.call(depth0, "link-to", "emberWidgets.carousel", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n    <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.modal", options) : helperMissing.call(depth0, "link-to", "emberWidgets.modal", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n    <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.popover", options) : helperMissing.call(depth0, "link-to", "emberWidgets.popover", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n    <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.select", options) : helperMissing.call(depth0, "link-to", "emberWidgets.select", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n    <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.colorPicker", options) : helperMissing.call(depth0, "link-to", "emberWidgets.colorPicker", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n    <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.radioButton", options) : helperMissing.call(depth0, "link-to", "emberWidgets.radioButton", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n  </ul>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/ember-widgets/carousel', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n          ");
    stack1 = (helper = helpers['carousel-item'] || (depth0 && depth0['carousel-item']),options={hash:{
      'class': ("active")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "carousel-item", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n          ");
    options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[],types:[],data:data}
    if (helper = helpers['carousel-item']) { stack1 = helper.call(depth0, options); }
    else { helper = (depth0 && depth0['carousel-item']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
    if (!helpers['carousel-item']) { stack1 = blockHelperMissing.call(depth0, 'carousel-item', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[],types:[],data:data}); }
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n          ");
    options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[],types:[],data:data}
    if (helper = helpers['carousel-item']) { stack1 = helper.call(depth0, options); }
    else { helper = (depth0 && depth0['carousel-item']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
    if (!helpers['carousel-item']) { stack1 = blockHelperMissing.call(depth0, 'carousel-item', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[],types:[],data:data}); }
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }
  function program2(depth0,data) {
    
    
    data.buffer.push("\n            <img src=\"img/bootstrap-mdo-sfmoma-01.jpg\" alt=\"\">\n          ");
    }

  function program4(depth0,data) {
    
    
    data.buffer.push("\n            <img src=\"img/bootstrap-mdo-sfmoma-02.jpg\" alt=\"\">\n          ");
    }

  function program6(depth0,data) {
    
    
    data.buffer.push("\n            <img src=\"img/bootstrap-mdo-sfmoma-03.jpg\" alt=\"\">\n          ");
    }

    data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h2>Carousel <small> Ember.Widgets.Carousel</small></h2>\n      <p class=\"elevated\">The slideshow below shows a generic plugin and component for cycling through elements like a carousel.</p>\n\n      <div class=\"example-container\">\n        ");
    options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}
    if (helper = helpers['carousel-component']) { stack1 = helper.call(depth0, options); }
    else { helper = (depth0 && depth0['carousel-component']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
    if (!helpers['carousel-component']) { stack1 = blockHelperMissing.call(depth0, 'carousel-component', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}); }
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h4>Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;#carousel-group&#125;&#125;<br/>  &#123;&#123;#carousel-item class=&quot;active&quot;&#125;&#125;<br/>    &lt;img src=&quot;/gh_pages/img/bootstrap-mdo-sfmoma-01.jpg&quot; alt=&quot;&quot;&gt;<br/>  &#123;&#123;/carousel-item&#125;&#125;<br/>  &#123;&#123;#carousel-item&#125;&#125;<br/>    &lt;img src=&quot;/gh_pages/img/bootstrap-mdo-sfmoma-02.jpg&quot; alt=&quot;&quot;&gt;<br/>  &#123;&#123;/carousel-item&#125;&#125;<br/>  &#123;&#123;#carousel-item&#125;&#125;<br/>    &lt;img src=&quot;/gh_pages/img/bootstrap-mdo-sfmoma-03.jpg&quot; alt=&quot;&quot;&gt;<br/>  &#123;&#123;/carousel-item&#125;&#125;<br/>&#123;&#123;/carousel-group&#125;&#125;</pre>\n      </div>\n    </div>\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/ember-widgets/color-picker', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h2>Color Picker <small> Ember Widgets ColorPicker </small></h2>\n      <p class=\"elevated\">A simple component to select color from a given palette and the option to define a custom HEX.</p>\n    </div>\n\n    <div class=\"col-md-3\">\n      ");
    data.buffer.push(escapeExpression((helper = helpers['color-picker'] || (depth0 && depth0['color-picker']),options={hash:{
      'class': ("btn btn-default")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker", options))));
    data.buffer.push("\n      <button type=\"button\" class=\"btn btn-default\">Comparison</button>\n    </div>\n\n    <div class=\"col-md-3\">\n      ");
    data.buffer.push(escapeExpression((helper = helpers['color-picker'] || (depth0 && depth0['color-picker']),options={hash:{
      'class': ("btn btn-default"),
      'dropdownClass': ("pull-right")
    },hashTypes:{'class': "STRING",'dropdownClass': "STRING"},hashContexts:{'class': depth0,'dropdownClass': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker", options))));
    data.buffer.push("\n      <button type=\"button\" class=\"btn btn-default\">Comparison</button>\n    </div>\n\n    <div class=\"col-md-6\">\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;color-picker&#125;&#125;\n</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-2\">\n      ");
    data.buffer.push(escapeExpression((helper = helpers['color-picker'] || (depth0 && depth0['color-picker']),options={hash:{
      'class': ("btn btn-default btn-expand")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "color-picker", options))));
    data.buffer.push("\n    </div>\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/ember-widgets/documentation', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '';


    data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h1>API</h1>\n  <h2>Ember.Widgets.SelectComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <th style=\"width: 200px;\">Option</th>\n      <th style=\"width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>itemViewClass</td>\n      <td>Ember.Widgets.SelectTooltipOptionView</td>\n      <td><p>The view to be displayed in the rows of the select.</p></td>\n    </tr>\n    <tr>\n      <td>prompt</td>\n      <td>Select a Value</td>\n      <td><p>The prompt to be displayed by default in the select, when\n        nothing else is selected.</p></td>\n    </tr>\n    <tr>\n      <td>placeholder</td>\n      <td>undefined</td>\n      <td><p>The placeholder text to be displayed in the search box when you\n        click on the select.</p></td>\n    </tr>\n    <tr>\n      <td>highlightedIndex</td>\n      <td>-1</td>\n      <td><p>The index of the select item that is highlighted.</p></td>\n    </tr>\n    <tr>\n      <td>tabindex</td>\n      <td>-1</td>\n      <td><p>The tabindex of the component.</p></td>\n    </tr>\n    <tr>\n      <td>showDropdown</td>\n      <td>false</td>\n      <td><p>If true then shows a dropdown.</p></td>\n    </tr>\n    <tr>\n      <td>dropdownHeight</td>\n      <td>300</td>\n      <td><p>The height of the dropdown.</p></td>\n    </tr>\n    <tr>\n      <td>rowHeight</td>\n      <td>26</td>\n      <td><p>Row height in pixels for the lazy list. Important: rowHeight must be synched with the CSS</p></td>\n    </tr>\n    <tr>\n      <td>sortLabels</td>\n      <td>true</td>\n      <td><p>Option to indicate whether we should sort the labels</p></td>\n    </tr>\n    <tr>\n      <td>isSelect</td>\n      <td>false</td>\n      <td><p>If isSelect is true, we will not show the search box</p></td>\n    </tr>\n    <tr>\n      <td>isButton</td>\n      <td>true</td>\n      <td><p>If is button is true, the select will look like a button</p></td>\n    </tr>\n    <tr>\n      <td>dropdownToggleIcon</td>\n      <td>icon-sort</td>\n      <td><p>Font-awesome dependency - Change the icon when necessary</p></td>\n    </tr>\n    <tr>\n      <td>content</td>\n      <td>[]</td>\n      <td><p>The list of options.</p></td>\n    </tr>\n    <tr>\n      <td>selection</td>\n      <td>null</td>\n      <td><p>The option which is currently selected.</p></td>\n    </tr>\n    <tr>\n      <td>optionLabelPath</td>\n      <td>&#39;&#39;</td>\n      <td><p>The path of the label, for options.</p></td>\n    </tr>\n    <tr>\n      <td>optionValuePath</td>\n      <td>&#39;&#39;</td>\n      <td><p>The path of the value, for options.</p></td>\n    </tr>\n    <tr>\n      <td>optionGroupPath</td>\n      <td>&#39;&#39;</td>\n      <td><p>The path of the group, for options.</p></td>\n    </tr>\n    <tr>\n      <td>optionDefaultPath</td>\n      <td>&#39;&#39;</td>\n      <td><p>The path of the default option.</p></td>\n    </tr>\n    <tr>\n      <td>showTooltip</td>\n      <td>true</td>\n      <td><p>Whether to show a tooltip when hovering over an item in the\n        drop-down.</p></td>\n    </tr>\n  </table>\n\n  <hr>\n  <h2>Ember.Widgets.MultiSelectComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <td>placeholder</td>\n      <td>undefined</td>\n      <td><p>The placeholder text to be displayed in multi-select search box\n        before anything has been selected.</p></td>\n    </tr>\n    <tr>\n      <td>persistentPlaceholder</td>\n      <td>undefined</td>\n      <td><p>The placeholder text to be displayed in multi-select search box,\n        even if one or more options are already selected.</p></td>\n    </tr>\n    <tr>\n      <td>clearQueryOnSelect</td>\n      <td>true</td>\n      <td><p>If true, when an option is selected from the dropdown, the current\n        search query will be cleared. If false, the search query will be kept\n        even after a selection is made.</p></td>\n    </tr>\n  </table>\n\n  <hr>\n  <h2>Ember.Widgets.PopoverComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <th style=\"width: 200px;\">Option</th>\n      <th style=\"width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>targetElement</td>\n      <td>null</td>\n      <td><p>The element this popover will be attached to. If null, the popover will be positioned absolutely based on top and left.</p></td>\n    </tr>\n    <tr>\n      <td>placement</td>\n      <td>top</td>\n      <td><p>The direction the popover will pop up. Other options are\n        bottom, top-right, top-left, bottom-right, bottom-left, left,\n        and right</p></td>\n    </tr>\n    <tr>\n      <td>title</td>\n      <td>''</td>\n      <td><p>The title to be displayed on the popover.</p></td>\n    </tr>\n    <tr>\n      <td>left</td>\n      <td>0</td>\n      <td><p>The left offset of the popover, in pixels.</p></td>\n    </tr>\n    <tr>\n      <td>top</td>\n      <td>0</td>\n      <td><p>The top offset of the popover, in pixels.</p></td>\n    </tr>\n    <tr>\n      <td>fade</td>\n      <td>true</td>\n      <td><p>If this is true then the modal fades in/out.</p></td>\n    </tr>\n  </table>\n\n  <hr>\n  <h2>Ember Widgets ModalComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <th style=\"width: 200px;\">Option</th>\n      <th style=\"width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>backdrop</td>\n      <td>true</td>\n      <td><p>If this is true then the modal will be displayed with a\n        semi-opaque backdrop.</p></td>\n    </tr>\n    <tr>\n      <td>fade</td>\n      <td>true</td>\n      <td><p>If this is true then the modal fades in/out.</p></td>\n    </tr>\n    <tr>\n      <td>escToCancel</td>\n      <td>true</td>\n      <td><p>If this is true then pressing ESC cancels the modal.</p></td>\n    </tr>\n    <tr>\n      <td>headerText</td>\n      <td>\"Modal Header\"</td>\n      <td><p>The text that is displayed in the header of the modal.</p></td>\n    </tr>\n    <tr>\n      <td>confirmText</td>\n      <td>\"Confirm\"</td>\n      <td><p>The text that is displayed in the confirmation button of\n        the modal.</p></td>\n    </tr>\n    <tr>\n      <td>cancelText</td>\n      <td>\"Cancel\"</td>\n      <td><p>The text that is displayed in the cancel button of the\n        modal.</p></td>\n    </tr>\n    <tr>\n      <td>bodyElementSelector</td>\n      <td>'.modal-backdrop'</td>\n      <td><p></p></td>\n    </tr>\n    <tr>\n      <td>size</td>\n      <td>'normal'</td>\n      <td><p>The size of the bootstrap modal.  Other options are 'small'\n        and 'large'.</p></td>\n    </tr>\n  </table>\n\n  <hr>\n  <h2>Ember.Widgets.CarouselComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <th style=\"width: 200px;\">Option</th>\n      <th style=\"width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>activeIndex</td>\n      <td>0</td>\n      <td><p>The index of the carousel item which is currently being\n        shown.</p></td>\n    </tr>\n  </table>\n\n\n  layoutName: 'carousel'\n  classNames: ['carousel', 'slide']\n  classNameBindings: ['sliding']\n\n  <hr>\n  <h2>Ember.Widgets.AccordionComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <th style=\"width: 200px;\">Option</th>\n      <th style=\"width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>activeIndex</td>\n      <td>0</td>\n      <td><p>The index of the accordian item which is currently being\n        shown.</p></td>\n    </tr>\n  </table>\n\n  <hr>\n  <h2>Ember.Widgets.RadioButtonGroupComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <th style=\"width: 200px;\">Option</th>\n      <th style=\"width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>selectedValue</td>\n      <td>null</td>\n      <td><p>The value of the currently selected button. To preselect a button\n        set selectedValue to the value of that button in your template. As a use\n        case example, bind selectedValue to a boolean variable and have two radio\n        buttons with values true and false. The bound boolean variable can now switch\n        values between true and false based on which radio button is chosen.</p></td>\n    </tr>\n    <tr>\n      <td>disabled</td>\n      <td>false</td>\n      <td><p>Whether or not the entire radio button group is disabled.</p></td>\n    </tr>\n  </table>\n\n  <hr>\n  <h2>Ember.Widgets.RadioButtonComponent Options</h2>\n  <table class=\"table ember-widgets-options\">\n    <tr>\n      <th style=\"width: 200px;\">Option</th>\n      <th style=\"width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>value</td>\n      <td>null</td>\n      <td><p>The value that the button corresponds to.</p></td>\n    </tr>\n    <tr>\n      <td>disabled</td>\n      <td>false</td>\n      <td><p>If the entire group is not disabled, whether or not this particular\n        radio button is disabled.</p></td>\n    </tr>\n  </table>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/ember-widgets/modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h2>Modal <small> Ember.Widgets.Modal</small></h2>\n      <p class=\"elevated\">The modal is an absolutely positioned dialog\ncomponent which overlays the page. Typically, modals are pre-rendered\ninto the page, even before they are needed. Our approach appends the\nmodal when it is required and removes it once it is no longer visible.\nWe designed it such that actions are sent to the application the same way <a\nhref=\"http://emberjs.com/guides/components/sending-actions-from-components-to-your-application/\">components\nsend them.</a> One caveat is that we need to pass in the current\ncontroller as the target object to receive actions and to inherit the\ncontainer.</p>\n    </div>\n    <div class=\"col-md-6\">\n      <h3>Modal with content property</h3>\n      <div class=\"example-container\">\n        <button type=\"button\" class=\"btn btn-primary\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\n          Show Modal\n        </button>\n      </div>\n\n      <h4 class=\"bumper-30\">Application_controller.coffee</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.ApplicationController = Ember.Controller.extend\n  actions:\n    showModal: ->\n      ModalComponent.popup\n        targetObject: this\n        confirm: \"modalConfirm\"\n        cancel: \"modalCancel\"\n        content: \"Isn't this one fine day?\"\n\n    modalConfirm: -> console.log(\"Modal Confirm!\")\n\n    modalCancel: -> console.log(\"Modal Cancel!\")\n</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-6\">\n      <h3>Modal with contentViewClass</h3>\n      <div class=\"example-container\">\n        <button type=\"button\" class=\"btn btn-primary\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModalWithCustomContent", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\n          Show Modal With Custom Content\n        </button>\n      </div>\n\n      <h4 class=\"bumper-30\">Application_controller.coffee</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.ApplicationController = Ember.Controller.extend\n  actions:\n    showModal: ->\n      ModalComponent.popup\n        targetObject: this\n        confirm: \"modalConfirm\"\n        cancel: \"modalCancel\"\n        content: { name: \"Louis\" }\n        contentViewClass: App.CustomModalContentView\n\n    modalConfirm: -> console.log(\"Modal Confirm!\")\n\n    modalCancel: -> console.log(\"Modal Cancel!\")\n</pre>\n      </div>\n\n      <h4 class=\"bumper-30\">Custom_modal_content_view.coffee</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.CustomModalContentView = Ember.View.extend\n  templateName: 'custom-modal-content'\n</pre>\n      </div>\n\n      <h4 class=\"bumper-30\">Custom-modal-content.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">Isn't this one fine day &#123;&#123;content.name&#125;&#125;?</pre>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <h3>Modal with custom size</h3>\n      <div class=\"example-container\">\n        <button type=\"button\" class=\"btn btn-primary\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "showSmallModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\n          Show Modal\n        </button>\n      </div>\n\n      <h4 class=\"bumper-30\">Application_controller.coffee</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.ApplicationController = Ember.Controller.extend\n  actions:\n    showModal: ->\n      ModalComponent.popup\n        targetObject: this\n        confirm: \"modalConfirm\"\n        cancel: \"modalCancel\"\n        size: 'small'\n        content: \"This is quite small isn't it?\"\n\n    modalConfirm: -> console.log(\"Modal Confirm!\")\n\n    modalCancel: -> console.log(\"Modal Cancel!\")\n</pre>\n      </div>\n    </div>\n\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/ember-widgets/overview', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("Carousel");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("Modal");
    }

  function program5(depth0,data) {
    
    
    data.buffer.push("Popover");
    }

  function program7(depth0,data) {
    
    
    data.buffer.push("Select &amp; Multi-Select");
    }

  function program9(depth0,data) {
    
    
    data.buffer.push("Color Picker");
    }

  function program11(depth0,data) {
    
    
    data.buffer.push("Radio Button");
    }

  function program13(depth0,data) {
    
    
    data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Carousel</h4>\n            <img class=\"preview-box\" src=\"img/preview_widgets_carousel.png\" />\n          </div>\n        ");
    }

  function program15(depth0,data) {
    
    
    data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Modal</h4>\n            <img class=\"preview-box\" src=\"img/preview_widgets_modal.png\" />\n          </div>\n        ");
    }

  function program17(depth0,data) {
    
    
    data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Popover</h4>\n            <img class=\"preview-box\" src=\"img/preview_widgets_popover.png\" />\n          </div>\n        ");
    }

  function program19(depth0,data) {
    
    
    data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Select &amp; Multi-Select</h4>\n            <img class=\"preview-box\" src=\"img/preview_widgets_select.png\" />\n          </div>\n        ");
    }

    data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h1>Ember Widgets</h1>\n      <p class=\"elevated\">A component library built with the <a\n        target=\"_BLANK\" href=\"http://emberjs.com/\">Ember.js</a>\n      framework. Includes easy to extend components such as select,\n      popover, modal, carousel, and accordion. This library is built on\n      bootstrap 3.0 CSS and represents our ideas about component best\n      practices.</p>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <h3>Features</h3>\n      <ul class=\"styled\">\n        <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.carousel", options) : helperMissing.call(depth0, "link-to", "emberWidgets.carousel", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n        <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.modal", options) : helperMissing.call(depth0, "link-to", "emberWidgets.modal", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n        <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.popover", options) : helperMissing.call(depth0, "link-to", "emberWidgets.popover", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n        <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.select", options) : helperMissing.call(depth0, "link-to", "emberWidgets.select", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n        <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.colorPicker", options) : helperMissing.call(depth0, "link-to", "emberWidgets.colorPicker", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n        <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.radioButton", options) : helperMissing.call(depth0, "link-to", "emberWidgets.radioButton", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n      </ul>\n    </div>\n    <div class=\"col-md-6\">\n      <h3>Dependencies</h3>\n      <ul class=\"styled\">\n        <li><a target=\"_BLANK\" href=\"http://emberjs.com/\">Ember.js</a></li>\n        <li><a target=\"_BLANK\" href=\"http://emberjs.com/list-view/\">List-View</a></li>\n        <li><a target=\"_BLANK\" href=\"http://getbootstrap.com/\">Bootstrap (V3)</a></li>\n        <li><a target=\"_BLANK\" href=\"http://lodash.com/\">Lo-Dash</a></li>\n        <li><a target=\"_BLANK\" href=\"http://jquery.com/\">jQuery</a></li>\n      </ul>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <hr>\n      <h1>Widgets</h1>\n      <p class=\"elevated\">The examples below demonstrate how you can extend and customize the widgets.</p>\n      <div class=\"row ember-widgets-examples\">\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.carousel", options) : helperMissing.call(depth0, "link-to", "emberWidgets.carousel", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.modal", options) : helperMissing.call(depth0, "link-to", "emberWidgets.modal", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.popover", options) : helperMissing.call(depth0, "link-to", "emberWidgets.popover", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(19, program19, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberWidgets.select", options) : helperMissing.call(depth0, "link-to", "emberWidgets.select", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <hr>\n      <h1>Getting Started</h1>\n      <p>You will need <a target=\"_BLANK\" href=\"http://nodejs.org/\">node</a> installed as a development dependency.</p>\n      <p><a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-widgets/\">Clone it from Github</a> or <a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-widgets/releases\">download the ZIP repo</a></p>\n      <div class=\"highlight\">\n<pre><code>$ npm install -g grunt-cli\n$ npm install\n$ grunt\n$ node examples.js</code></pre>\n      <p>Go to your browser and navigate to localhost:8000/gh_pages</p>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <hr>\n      <h1>Contributing</h1>\n      <p>You can contribute to this project in one of two ways:</p>\n      <ul class=\"styled\">\n        <li>Browse the ember-widgets <a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-widgets/issues?state=open\">issues</a> and report bugs</li>\n        <li>Clone the ember-widgets repo, make some changes according to our development guidelines and issue a pull-request with your changes.</li>\n      </ul>\n      <p>We keep the ember-widgets.js code to the minimum necessary, giving users as much control as possible.</p>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <hr>\n      <h1>Changelog</h1>\n      <p>The current version is 0.2.0.</p>\n      <p>For the full list of changes, please see <a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-widgets/blob/master/CHANGELOG.md\">CHANGELOG.md</a>.</p>\n    </div>\n    <div class=\"col-md-6\">\n      <hr>\n      <h1>Acknowledgements</h1>\n      <p><a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-widgets/graphs/contributors\">List of Contributors on Github</a></p>\n      <p>With lots of help from the Ember.js team</p>\n      <p><a target=\"_BLANK\" href=\"https://twitter.com/wycats\">wycats</a>, <a target=\"_BLANK\" href=\"https://twitter.com/tomdale\">tomdale</a>, <a target=\"_BLANK\" href=\"https://twitter.com/ebryn\">ebryn</a></p>\n    </div>\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/ember-widgets/popover', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n          Show Popover Top\n        ");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("\n          Show Popover Top-Right\n        ");
    }

  function program5(depth0,data) {
    
    
    data.buffer.push("\n          Show Popover Right\n        ");
    }

  function program7(depth0,data) {
    
    
    data.buffer.push("\n          Show Popover Bottom-Right\n        ");
    }

  function program9(depth0,data) {
    
    
    data.buffer.push("\n          Show Popover Bottom\n        ");
    }

  function program11(depth0,data) {
    
    
    data.buffer.push("\n          Show Popover Bottom-Left\n        ");
    }

  function program13(depth0,data) {
    
    
    data.buffer.push("\n          Show Popover Left\n        ");
    }

  function program15(depth0,data) {
    
    
    data.buffer.push("\n          Show Popover Top-Left\n        ");
    }

    data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h2>Popover <small> Ember.Widgets.Popover</small></h2>\n      <p class=\"elevated\">Add small overlays of content to any element\nfor displaying additional information. We created the popover link as a\ncomponent which can either hold a content string specified in the handlebar\nhelper or point to a custom view class for more sophisticated look and\nfeel.</p>\n    </div>\n\n    <div class=\"col-md-6\">\n      <h3>Simple Popover</h3>\n      <div class=\"example-container\">\n        ");
    stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
      'tagName': ("button"),
      'class': ("btn btn-primary"),
      'title': ("Hello"),
      'content': ("Hello World!")
    },hashTypes:{'tagName': "STRING",'class': "STRING",'title': "STRING",'content': "STRING"},hashContexts:{'tagName': depth0,'class': depth0,'title': depth0,'content': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n\n      <h4 class=\"bumper-30\">Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;#popover-link-component tagName=&quot;button&quot;\n  class=&quot;btn btn-primary&quot; title=&quot;Hello&quot;\n  content=&quot;Hello World&quot;&#125;&#125;\n  Show Popover Button-Left\n&#123;&#123;/popover-link-component&#125;&#125;</pre>\n      </div>\n\n      <hr>\n\n      <h3>Popover with contentViewClass</h3>\n      <div class=\"example-container\">\n        ");
    stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
      'tagName': ("button"),
      'class': ("btn btn-primary"),
      'placement': ("top-right"),
      'content': ("model"),
      'title': ("Derp"),
      'contentViewClass': ("customPopoverContentView")
    },hashTypes:{'tagName': "STRING",'class': "STRING",'placement': "STRING",'content': "STRING",'title': "STRING",'contentViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'placement': depth0,'content': depth0,'title': depth0,'contentViewClass': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n\n      <hr>\n\n      <h3>Popover with contentViewClass</h3>\n      <div class=\"example-container\">\n        ");
    stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
      'tagName': ("button"),
      'class': ("btn btn-primary"),
      'placement': ("right"),
      'content': ("model"),
      'title': ("Derp"),
      'contentViewClass': ("customPopoverContentView")
    },hashTypes:{'tagName': "STRING",'class': "STRING",'placement': "STRING",'content': "ID",'title': "STRING",'contentViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'placement': depth0,'content': depth0,'title': depth0,'contentViewClass': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n\n      <hr>\n\n      LOOK HERE\n      ");
    stack1 = helpers._triageMustache.call(depth0, "randomVariableName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n      <h3>Popover with contentViewClass</h3>\n      <div class=\"example-container\">\n        ");
    stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
      'tagName': ("button"),
      'class': ("btn btn-primary"),
      'placement': ("bottom-right"),
      'content': ("model"),
      'title': ("Derp"),
      'contentViewClass': ("customPopoverContentView")
    },hashTypes:{'tagName': "STRING",'class': "STRING",'placement': "STRING",'content': "ID",'title': "STRING",'contentViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'placement': depth0,'content': depth0,'title': depth0,'contentViewClass': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n\n      <hr>\n\n      <h3>Popover with contentViewClass</h3>\n      <div class=\"example-container\">\n        ");
    stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
      'tagName': ("button"),
      'class': ("btn btn-primary"),
      'placement': ("bottom"),
      'content': ("model"),
      'title': ("Derp"),
      'contentViewClass': ("customPopoverContentView")
    },hashTypes:{'tagName': "STRING",'class': "STRING",'placement': "STRING",'content': "ID",'title': "STRING",'contentViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'placement': depth0,'content': depth0,'title': depth0,'contentViewClass': depth0},inverse:self.noop,fn:self.program(9, program9, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n\n      <hr>\n\n      <h3>Popover with contentViewClass</h3>\n      <div class=\"example-container\">\n        ");
    stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
      'tagName': ("button"),
      'class': ("btn btn-primary"),
      'placement': ("bottom-left"),
      'content': ("model"),
      'title': ("Derp"),
      'contentViewClass': ("customPopoverContentView")
    },hashTypes:{'tagName': "STRING",'class': "STRING",'placement': "STRING",'content': "ID",'title': "STRING",'contentViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'placement': depth0,'content': depth0,'title': depth0,'contentViewClass': depth0},inverse:self.noop,fn:self.program(11, program11, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n\n      <hr>\n\n      <h3>Popover with contentViewClass</h3>\n      <div class=\"example-container\">\n        ");
    stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
      'tagName': ("button"),
      'class': ("btn btn-primary"),
      'placement': ("left"),
      'content': ("model"),
      'title': ("Derp"),
      'contentViewClass': ("customPopoverContentView")
    },hashTypes:{'tagName': "STRING",'class': "STRING",'placement': "STRING",'content': "ID",'title': "STRING",'contentViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'placement': depth0,'content': depth0,'title': depth0,'contentViewClass': depth0},inverse:self.noop,fn:self.program(13, program13, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n    </div>\n\n    <div class=\"col-md-6\">\n      <h3>Popover with contentViewClass</h3>\n      <div class=\"example-container\">\n        ");
    stack1 = (helper = helpers['popover-link-component'] || (depth0 && depth0['popover-link-component']),options={hash:{
      'tagName': ("button"),
      'class': ("btn btn-primary"),
      'placement': ("top-left"),
      'content': ("model"),
      'title': ("Derp"),
      'contentViewClass': ("customPopoverContentView")
    },hashTypes:{'tagName': "STRING",'class': "STRING",'placement': "STRING",'content': "ID",'title': "STRING",'contentViewClass': "ID"},hashContexts:{'tagName': depth0,'class': depth0,'placement': depth0,'content': depth0,'title': depth0,'contentViewClass': depth0},inverse:self.noop,fn:self.program(15, program15, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "popover-link-component", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n\n      <h4 class=\"bumper-30\">Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;#popover-link-component tagName=&quot;button&quot;\n  class=&quot;btn btn-primary&quot; placement=&quot;bottom-left&quot;\n  contentViewClass=&quot;App.CustomPopoverContentView&quot;&#125;&#125;\n  Show Popover Button-Left\n&#123;&#123;/popover-link-component&#125;&#125;</pre>\n      </div>\n\n      <h4 class=\"bumper-30\">Custom-popover-content.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">Isn't this one fine day &#123;&#123;content.name&#125;&#125;?</pre>\n      </div>\n\n      <h4 class=\"bumper-30\">Custom_popover_content_view.coffee</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.CustomPopoverContentView = Ember.View.extend\n  templateName: 'custom-popover-content'</pre>\n      </div>\n    </div>\n\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/ember-widgets/radio-button', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n          <div class=\"radio-row\">\n            ");
    stack1 = (helper = helpers['radio-button-wrapper'] || (depth0 && depth0['radio-button-wrapper']),options={hash:{
      'value': (true)
    },hashTypes:{'value': "BOOLEAN"},hashContexts:{'value': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-wrapper", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n          </div>\n          <div class=\"radio-row\">\n            ");
    stack1 = (helper = helpers['radio-button-wrapper'] || (depth0 && depth0['radio-button-wrapper']),options={hash:{
      'value': (false)
    },hashTypes:{'value': "BOOLEAN"},hashContexts:{'value': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-wrapper", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n          </div>\n        ");
    return buffer;
    }
  function program2(depth0,data) {
    
    
    data.buffer.push("\n              <span class=\"form-label radio-label\">True</span>\n            ");
    }

  function program4(depth0,data) {
    
    
    data.buffer.push("\n              <span class=\"form-label radio-label\">False</span>\n            ");
    }

    data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h2>Radio Button <small>Ember.Widgets.RadioButton</small></h2>\n      <p class=\"elevated\">Allows selection of one choice from multiple possibilities.</p>\n      <div class=\"example-container\">\n        ");
    options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}
    if (helper = helpers['radio-button-group']) { stack1 = helper.call(depth0, options); }
    else { helper = (depth0 && depth0['radio-button-group']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
    if (!helpers['radio-button-group']) { stack1 = blockHelperMissing.call(depth0, 'radio-button-group', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}); }
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n    </div>\n    <div class=\"col-md-12 bumper-30\">\n      <h4>Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;#radio-button-group&#125;&#125;\n  &lt;div class=&quot;radio-row&quot;&gt;\n    &#123;&#123;#radio-button-wrapper value=true&#125;&#125;\n      &lt;span class=&quot;form-label radio-label&quot;&gt;True&lt;/span&gt;\n    &#123;&#123;/radio-button-wrapper&#125;&#125;\n  &lt;/div&gt;\n  &lt;div class=&quot;radio-row&quot;&gt;\n    &#123;&#123;#radio-button-wrapper value=false&#125;&#125;\n      &lt;span class=&quot;form-label radio-label&quot;&gt;False&lt;/span&gt;\n    &#123;&#123;/radio-button-wrapper&#125;&#125;\n  &lt;/div&gt;\n&#123;&#123;/radio-button-groupt&#125;&#125;</pre>\n      </div>\n    </div>\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/ember-widgets/select', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h2>Select <small> Ember.Widgets.Select</small></h2>\n  <p class=\"elevated\">Ember select is a Ember.js based replacement for select boxes. It supports searching, remote data sets, and infinite scrolling of results. This component&#39;s design was inspired by the excellent <a target=\"_BLANK\" href=\"http://harvesthq.github.io/chosen/\">Chosen</a> jquery plugin and <a target=\"_BLANK\" href=\"http://ivaynberg.github.io/select2/\">Select2</a>. Uses the <a target=\"_BLANK\" href=\"https://github.com/emberjs/list-view\">ember list view</a> for lazily rendering large arrays of content.</p>\n\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <h3>Select with Selection Binding</h3>\n      <div class=\"example-container\">\n        ");
    data.buffer.push(escapeExpression((helper = helpers['select-component'] || (depth0 && depth0['select-component']),options={hash:{
      'content': ("model"),
      'prompt': ("Select a Country"),
      'optionLabelPath': ("name"),
      'optionValuePath': ("name"),
      'selection': ("selection"),
      'placeholder': ("Search")
    },hashTypes:{'content': "ID",'prompt': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selection': "ID",'placeholder': "STRING"},hashContexts:{'content': depth0,'prompt': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selection': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "select-component", options))));
    data.buffer.push("\n      </div>\n\n      <h4 class=\"bumper-30\">Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;select-component\n  content=model\n  prompt=\"Select a Country\"\n  optionLabelPath=\"name\"\n  optionValuePath=\"name\"\n  selection=selection\n  placeholder=\"Search\"\n&#125;&#125;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-6\">\n      <h3>Multi-Select</h3>\n      <div class=\"example-container\">\n        ");
    data.buffer.push(escapeExpression((helper = helpers['multi-select-component'] || (depth0 && depth0['multi-select-component']),options={hash:{
      'content': ("model"),
      'optionLabelPath': ("name"),
      'optionValuePath': ("code"),
      'classNames': ("multi-select-example"),
      'placeholder': ("Select a country...")
    },hashTypes:{'content': "ID",'optionLabelPath': "STRING",'optionValuePath': "STRING",'classNames': "STRING",'placeholder': "STRING"},hashContexts:{'content': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'classNames': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "multi-select-component", options))));
    data.buffer.push("\n      </div>\n\n      <h4 class=\"bumper-30\">Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;multi-select-component\n  content=model\n  optionLabelPath=\"name\"\n  optionValuePath=\"code\"\n  classNames=\"multi-select-example\"\n  placeholder=\"Select a country...\"\n&#125;&#125;</pre>\n      </div>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n    </div>\n    <div class=\"col-md-6\">\n      <h3>Multi-Select <small>Small</small></h3>\n      <div class=\"example-container\">\n        ");
    data.buffer.push(escapeExpression((helper = helpers['multi-select-component'] || (depth0 && depth0['multi-select-component']),options={hash:{
      'content': ("model"),
      'optionLabelPath': ("name"),
      'optionValuePath': ("code"),
      'classNames': ("multi-select-example"),
      'choicesFieldClass': ("input-xs")
    },hashTypes:{'content': "ID",'optionLabelPath': "STRING",'optionValuePath': "STRING",'classNames': "STRING",'choicesFieldClass': "STRING"},hashContexts:{'content': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'classNames': depth0,'choicesFieldClass': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "multi-select-component", options))));
    data.buffer.push("\n      </div>\n\n      <h4 class=\"bumper-30\">Application.hbs</h4>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;multi-select-component\n  content=model\n  optionLabelPath=\"name\"\n  optionValuePath=\"code\"\n  classNames=\"multi-select-example\"\n  choicesFieldClass=\"input-xs\"\n&#125;&#125;</pre>\n      </div>\n    </div>\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/ember-widgets/typahead', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h2>Typeahead <small> Ember.Widgets.Typeahead</small></h2>\n  <p class=\"elevated\">TBD</p>\n\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n    <p>Soon...</p>\n    </div>\n  </div>\n</div>\n");
    
  });

});
define('dummy/templates/ember_widgets', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n  \n  <div class=\"hero-container\">\n    <div class=\"hero widgets-hero\">\n      <div class=\"hero-overlay\"></div>\n    </div>\n    <div class=\"container hero-content-container\">\n      <div class=\"row\">\n        <div class=\"span12 hero-tagline center-align hidden-tablet\">\n          <h1 class=\"elevated\">Ember Widgets</h1>\n          <p class=\"elevated\">\n            A powerful and easy to use component library for Ember.js.\n            <br><br>\n            <a target=\"_BLANK\"\n                href=\"https://github.com/Addepar/ember-widgets/releases\"\n                class=\"addepar-btn addepar-btn-large addepar-btn-outline addepar-btn-white\">\n              Download Ember-Widgets\n            </a>\n          </p>\n        </div>\n      </div>\n    </div>\n  </div>\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n  \n  <div class=\"hero-container small-hero-container\">\n    <div class=\"hero widgets-hero\">\n      <div class=\"hero-overlay\"></div>\n    </div>\n  </div>\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "showLargeHero", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n\n<div class=\"container\">\n  <div class=\"row\">\n    ");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "ember-widgets/sub_navigation", options) : helperMissing.call(depth0, "partial", "ember-widgets/sub_navigation", options))));
    data.buffer.push("\n    ");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/font-chooser-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression;


    data.buffer.push("<div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'style': ("view.style")
    },hashTypes:{'style': "STRING"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n  ");
    stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/license', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("\n");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "navigation", options) : helperMissing.call(depth0, "partial", "navigation", options))));
    data.buffer.push("\n\n\n<div class=\"hero-container small-hero-container\">\n  <div class=\"hero widgets-hero\">\n    <div class=\"hero-overlay\"></div>\n  </div>\n</div>\n\n\n<div class=\"section\">\n  <div class=\"container main-content-container\">\n    <div class=\"row\">\n      <div class=\"col-md-6 col-md-offset-3 section-title\">\n        <h1>Code &amp; Documentation Licensing</h1>\n      </div>\n      <div class=\"col-md-6 col-md-offset-3\">\n        <p>The majority of open source software exclusively developed by Addepar is licensed under the liberal terms of the Apache License, Version 2.0. The documentation is generally available under the Creative Commons Attribution 3.0 Unported License. In the end, you are free to use, modify and distribute any documentation, source code or examples within our open source projects as long as you adhere to the licensing conditions present within the projects.</p>\n        <p>Also note that our engineers like to hack on their own open source projects in their free time. For code provided by our engineers outside of our official repositories on GitHub, Addepar does not grant any type of license, whether express or implied, to such code.</p>\n     </div>\n    </div>\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/modal-footer', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  <button type=\"button\"\n    ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":btn :btn-primary :btn-confirm isDisabled:disabled"),
      'disabled': ("isDisabled")
    },hashTypes:{'class': "STRING",'disabled': "STRING"},hashContexts:{'class': depth0,'disabled': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("\n    ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "sendConfirm", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">");
    stack1 = helpers._triageMustache.call(depth0, "confirmText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </button>\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  <button type=\"button\" class=\"btn btn-default btn-cancel\"\n    ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "sendCancel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">");
    stack1 = helpers._triageMustache.call(depth0, "cancelText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </button>\n");
    return buffer;
    }

  function program5(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  <button type=\"button\" class=\"btn btn-default btn-close\"\n    ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "sendClose", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">");
    stack1 = helpers._triageMustache.call(depth0, "closeText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </button>\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "confirmText", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    stack1 = helpers['if'].call(depth0, "cancelText", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    stack1 = helpers['if'].call(depth0, "closeText", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('dummy/templates/modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":modal-dialog sizeClass")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" tabindex=\"-1\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "_headerViewClass", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n    </div>\n    <div class=\"modal-body\">\n      ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "_contentViewClass", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n    </div>\n    <div class=\"modal-footer\">\n      ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "_footerViewClass", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n    </div>\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/modal_header', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression;


    data.buffer.push("<button type=\"button\" class=\"close\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "sendClose", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">&times;</button>\n<h4 class=\"modal-title\">");
    stack1 = helpers._triageMustache.call(depth0, "headerText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h4>\n");
    return buffer;
    
  });

});
define('dummy/templates/multi-select-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression;


    data.buffer.push("<div>");
    stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</div>\n<a class=\"ember-select-search-choice-close\" href=\"#\" tabIndex=\"-1\"\n  ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "removeSelectItem", "view.content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">×\n</a>\n");
    return buffer;
    
  });

});
define('dummy/templates/multi-select-option', ['exports', 'ember-widgets/components/multi-select-option'], function (exports, multi_select_option) {

	'use strict';



	exports.default = multi_select_option.default;

});
define('dummy/templates/multi-select', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <span class=\"ember-select-no-results\">No results match \"");
    stack1 = helpers._triageMustache.call(depth0, "query", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\"</span>\n  ");
    return buffer;
    }

    data.buffer.push("<div class=\"ember-select-container ember-select-multi dropdown-toggle js-dropdown-toggle\"\n  ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("hasFocus:ember-select-focus")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n  <ul ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":ember-select-choices choicesFieldClass")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n    ");
    data.buffer.push(escapeExpression(helpers.each.call(depth0, "selections", {hash:{
      'itemViewClass': ("view.selectionItemView")
    },hashTypes:{'itemViewClass': "STRING"},hashContexts:{'itemViewClass': depth0},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n    <li class=\"ember-select-search-field\">\n      \n      <span class=\"invisible-placeholder\">");
    stack1 = helpers._triageMustache.call(depth0, "invisiblePlaceholderText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n      ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "searchView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n    </li>\n  </ul>\n</div>\n\n<div class=\"dropdown-menu js-dropdown-menu\">\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "listView", {hash:{
      'tagName': ("ul"),
      'classNames': ("ember-select-results"),
      'heightBinding': ("dropdownHeight"),
      'rowHeightBinding': ("rowHeight"),
      'contentBinding': ("groupedContent"),
      'itemViewClassBinding': ("itemView")
    },hashTypes:{'tagName': "STRING",'classNames': "STRING",'heightBinding': "STRING",'rowHeightBinding': "STRING",'contentBinding': "STRING",'itemViewClassBinding': "STRING"},hashContexts:{'tagName': depth0,'classNames': depth0,'heightBinding': depth0,'rowHeightBinding': depth0,'contentBinding': depth0,'itemViewClassBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n  ");
    stack1 = helpers['if'].call(depth0, "hasNoResults", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/popover-link-popover', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  <h4 class=\"popover-title\">");
    stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h4>\n");
    return buffer;
    }

    data.buffer.push("<div class=\"arrow\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'style': ("view.arrowStyle")
    },hashTypes:{'style': "STRING"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("></div>\n");
    stack1 = helpers['if'].call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<div class=\"popover-content\">\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "view._contentViewClass", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/popover', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  <h4 class=\"popover-title\">");
    stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h4>\n");
    return buffer;
    }

    data.buffer.push("<div class=\"arrow\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'style': ("arrowStyle")
    },hashTypes:{'style': "STRING"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("></div>\n");
    stack1 = helpers['if'].call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<div class=\"popover-content\">\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "view._contentViewClass", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/radio-button-layout', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "radio-input", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('dummy/templates/select-item-layout', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  ");
    stack1 = helpers._triageMustache.call(depth0, "view.content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "view.content.isGroupOption", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('dummy/templates/select-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  <span ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'title': ("view.label")
    },hashTypes:{'title': "ID"},hashContexts:{'title': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n    ");
    stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </span>\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  ");
    stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "controller.titleOnOptions", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('dummy/templates/select', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n      ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "selectedItemView", {hash:{
      'contentBinding': ("selection")
    },hashTypes:{'contentBinding': "STRING"},hashContexts:{'contentBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n      <i ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("view.dropdownToggleIcon")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("></i>\n    ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n      <span>");
    stack1 = helpers._triageMustache.call(depth0, "prompt", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n      <i ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("view.dropdownToggleIcon")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("></i>\n    ");
    return buffer;
    }

  function program5(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n    <div class=\"ember-select-search\">\n      ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "searchView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n    </div>\n  ");
    return buffer;
    }

  function program7(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "listView", {hash:{
      'tagName': ("ul"),
      'classNames': ("ember-select-results"),
      'heightBinding': ("dropdownHeight"),
      'rowHeightBinding': ("rowHeight"),
      'contentBinding': ("groupedContent"),
      'itemViewClassBinding': ("itemView")
    },hashTypes:{'tagName': "STRING",'classNames': "STRING",'heightBinding': "STRING",'rowHeightBinding': "STRING",'contentBinding': "STRING",'itemViewClassBinding': "STRING"},hashContexts:{'tagName': depth0,'classNames': depth0,'heightBinding': depth0,'rowHeightBinding': depth0,'contentBinding': depth0,'itemViewClassBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n    ");
    stack1 = helpers['if'].call(depth0, "isLoading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    stack1 = helpers['if'].call(depth0, "contentIsEmpty", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(13, program13, data),fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  ");
    return buffer;
    }
  function program8(depth0,data) {
    
    
    data.buffer.push("\n      <span class=\"ember-select-loading\">Loading...</span>\n    ");
    }

  function program10(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n      <div class=\"ember-select-empty-content\">\n        ");
    stack1 = helpers['if'].call(depth0, "emptyContentView", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n    ");
    return buffer;
    }
  function program11(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n          ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "emptyContentView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n        ");
    return buffer;
    }

  function program13(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n      ");
    stack1 = helpers['if'].call(depth0, "hasNoResults", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(14, program14, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    return buffer;
    }
  function program14(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <span class=\"ember-select-no-results\">No results match \"");
    stack1 = helpers._triageMustache.call(depth0, "query", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\"</span>\n      ");
    return buffer;
    }

  function program16(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "selectMenuView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n  ");
    return buffer;
    }

    data.buffer.push("<div class=\"ember-select-container dropdown-toggle js-dropdown-toggle\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleDropdown", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\n  <a ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":form-control :ember-select-choice buttonClass disabled:disabled\n  hasFocus:ember-select-focus")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n    ");
    stack1 = helpers['if'].call(depth0, "selection", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </a>\n</div>\n\n<div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":dropdown-menu :js-dropdown-menu dropdownMenuClass\n  isDropdownMenuPulledRight:pull-right")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n  ");
    stack1 = helpers.unless.call(depth0, "isSelect", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  ");
    stack1 = helpers['if'].call(depth0, "showDropdown", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  ");
    stack1 = helpers['if'].call(depth0, "selectMenuView", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(16, program16, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/typeahead', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n  <div class=\"dropdown-menu\">\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "listView", {hash:{
      'tagName': ("ul"),
      'classNames': ("ember-typeahead-results"),
      'heightBinding': ("dropdownHeight"),
      'rowHeightBinding': ("rowHeight"),
      'contentBinding': ("groupedContent"),
      'itemViewClassBinding': ("itemView")
    },hashTypes:{'tagName': "STRING",'classNames': "STRING",'heightBinding': "STRING",'rowHeightBinding': "STRING",'contentBinding': "STRING",'itemViewClassBinding': "STRING"},hashContexts:{'tagName': depth0,'classNames': depth0,'heightBinding': depth0,'rowHeightBinding': depth0,'contentBinding': depth0,'itemViewClassBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n  </div>\n");
    return buffer;
    }

    data.buffer.push("<div>\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "searchView", {hash:{
      'classBinding': ("searchFieldClass"),
      'disabled': ("disabled")
    },hashTypes:{'classBinding': "STRING",'disabled': "ID"},hashContexts:{'classBinding': depth0,'disabled': depth0},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n</div>\n");
    stack1 = helpers.unless.call(depth0, "hasNoResults", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('dummy/templates/view-parent-view-content', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "view.parentView.content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('dummy/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('dummy/tests/controllers/ember-widgets/popover.jshint', function () {

  'use strict';

  module('JSHint - controllers/ember-widgets');
  test('controllers/ember-widgets/popover.js should pass jshint', function() { 
    ok(true, 'controllers/ember-widgets/popover.js should pass jshint.'); 
  });

});
define('dummy/tests/data/countries.jshint', function () {

  'use strict';

  module('JSHint - data');
  test('data/countries.js should pass jshint', function() { 
    ok(true, 'data/countries.js should pass jshint.'); 
  });

});
define('dummy/tests/helpers/assertions', ['exports'], function (exports) {

  'use strict';

  var isPresent = function isPresent(app, selector, context) {
    var $element;
    $element = find(app, selector, context);
    return $element.length > 0;
  };

  var isNotPresent = function isNotPresent(app, selector, context) {
    return !isPresent(app, selector, context);
  };

  var isVisible = function isVisible(app, selector, context) {
    var $element;
    $element = find(app, selector, context);
    return $element.is(':visible');
  };

  var isFocused = function isFocused(app, selector, context) {
    var $element;
    $element = find(app, selector, context);
    return $element.is(':focus');
  };

  var isHidden = function isHidden(app, selector, context) {
    return !isVisible(app, selector, context);
  };

  exports.isPresent = isPresent;
  exports.isNotPresent = isNotPresent;
  exports.isVisible = isVisible;
  exports.isFocused = isFocused;
  exports.isHidden = isHidden;

});
define('dummy/tests/helpers/assertions.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/assertions.js should pass jshint', function() { 
    ok(true, 'helpers/assertions.js should pass jshint.'); 
  });

});
define('dummy/tests/helpers/color-picker', ['ember'], function (Ember) {

  'use strict';

  var _openColorChooser, _getSelectedColor, _selectColor, _fillInCustomColor;

  _openColorChooser = function (app, element) {
    if (element == null) {
      element = 'body';
    }
    return andThen(function () {
      var dropdown;
      dropdown = find('.color-picker-button .dropdown', element);
      if (!dropdown.hasClass('open')) {
        return click('.color-picker-dropdown-button', element);
      }
    });
  };

  _getSelectedColor = function (app) {
    var _, a, active, b, g, r, ref, rgbVal;
    active = find(app, '.color-picker-dropdown .active');
    if (active.length) {
      rgbVal = active.css('background-color');
      ref = /(.*?)rgb(a)?\((\d+), (\d+), (\d+)(, (\d+))?\)/.exec(rgbVal), _ = ref[0], _ = ref[1], _ = ref[2], r = ref[3], g = ref[4], b = ref[5], a = ref[6], _ = ref[7];
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    } else {
      return find('.color-picker-dropdown .input-sm').val();
    }
  };

  _selectColor = function (app, colorInHex) {
    var colorCellSelector;
    _openColorChooser();
    colorCellSelector = ".color-picker-cell[style*=" + colorInHex + "]";
    return click(colorCellSelector, '.color-picker-dropdown');
  };

  _fillInCustomColor = function (app, value) {
    var textBox;
    textBox = find('.color-picker-dropdown .input-sm');
    return fillIn(textBox, value);
  };

  Ember['default'].Test.registerAsyncHelper('openColorChooser', _openColorChooser);
  Ember['default'].Test.registerHelper('getSelectedColor', _getSelectedColor);
  Ember['default'].Test.registerAsyncHelper('selectColor', _selectColor);
  Ember['default'].Test.registerAsyncHelper('fillInCustomColor', _fillInCustomColor);

});
define('dummy/tests/helpers/color-picker.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/color-picker.js should pass jshint', function() { 
    ok(false, 'helpers/color-picker.js should pass jshint.\nhelpers/color-picker.js: line 24, col 166, Expected an assignment or function call and instead saw an expression.\n\n1 error'); 
  });

});
define('dummy/tests/helpers/keyboard', ['ember'], function (Ember) {

  'use strict';

  var _pressEnter, _pressSpacebar, _pressESC, _pressUpArrow, _pressDownArrow, _pressBackspace;

  _pressEnter = function (app, element) {
    return keyEvent(element, 'keydown', 13);
  };

  _pressSpacebar = function (app, element) {
    return keyEvent(element, 'keydown', 32);
  };

  _pressESC = function (app, element) {
    return keyEvent(element, 'keydown', 27);
  };

  _pressUpArrow = function (app, element) {
    return keyEvent(element, 'keydown', 38);
  };

  _pressDownArrow = function (app, element) {
    return keyEvent(element, 'keydown', 40);
  };

  _pressBackspace = function (app, element) {
    return keyEvent(element, 'keydown', 8);
  };

  Ember['default'].Test.registerAsyncHelper('pressEnter', _pressEnter);
  Ember['default'].Test.registerAsyncHelper('pressSpacebar', _pressSpacebar);
  Ember['default'].Test.registerAsyncHelper('pressESC', _pressESC);
  Ember['default'].Test.registerAsyncHelper('pressUpArrow', _pressUpArrow);
  Ember['default'].Test.registerAsyncHelper('pressDownArrow', _pressDownArrow);
  Ember['default'].Test.registerAsyncHelper('pressBackspace', _pressBackspace);

});
define('dummy/tests/helpers/keyboard.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/keyboard.js should pass jshint', function() { 
    ok(true, 'helpers/keyboard.js should pass jshint.'); 
  });

});
define('dummy/tests/helpers/mouse', ['ember'], function (Ember) {

  'use strict';

  var _mouseDown = function _mouseDown(app, selector, context) {
    var $element;
    $element = find(app, selector, context);
    Ember['default'].run(function () {
      return $element.mousedown();
    });
    return wait(app);
  };

  Ember['default'].Test.registerHelper('mouseDown', _mouseDown);

});
define('dummy/tests/helpers/mouse.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/mouse.js should pass jshint', function() { 
    ok(true, 'helpers/mouse.js should pass jshint.'); 
  });

});
define('dummy/tests/helpers/resolver', ['exports', 'ember/resolver', 'dummy/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('dummy/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('dummy/tests/helpers/select', ['ember'], function (Ember) {

  'use strict';

  var _findInChosen, _findInMultiChosen, _findInSelect, _openDropdown, _selectFirstInMultiChosen, _selectInChosen, _selectInMultiChosen;

  _openDropdown = function (app, element) {
    return click('.dropdown-toggle', element);
  };

  _findInChosen = function (app, element, itemText) {
    var promise, searchBox, shouldOpenChosen, toggleButton;
    toggleButton = find('.dropdown-toggle', element);
    searchBox = find('.ember-select-search input', element);
    shouldOpenChosen = isHidden(app, searchBox);
    if (shouldOpenChosen) {
      promise = click(toggleButton);
    } else {
      promise = wait();
    }
    return promise.then(function () {
      return $('li', element).filter(function () {
        return $.text([this]).trim() === itemText;
      });
    });
  };

  _findInMultiChosen = function (app, element, itemText) {
    var searchBox;
    searchBox = find('input', element);
    click(searchBox);
    return fillIn(searchBox, itemText).then(function () {
      return $('.js-dropdown-menu li', element).filter(function () {
        return $.text([this]).trim() === itemText;
      });
    });
  };

  _selectInMultiChosen = function (app, element, itemText) {
    return findInMultiChosen(element, itemText).then(function (item) {
      return click(item);
    });
  };

  _selectFirstInMultiChosen = function (app, element) {
    var searchBox;
    searchBox = find('input', element);
    click(searchBox);
    return click($('.ember-select-result-item', element)[0]);
  };

  _selectInChosen = function (app, element, itemText) {
    return findInChosen(element, itemText).then(function (item) {
      return click(item);
    });
  };

  _findInSelect = function (app, element, itemText) {
    var toggleButton;
    toggleButton = find('a', element);
    return mouseDown(toggleButton).then(function () {
      var item;
      item = $('li', element).filter(function () {
        return $.text([this]).trim() === itemText;
      });
      return click(item);
    });
  };

  Ember['default'].Test.registerHelper('openDropdown', _openDropdown);
  Ember['default'].Test.registerHelper('findInChosen', _findInChosen);
  Ember['default'].Test.registerHelper('findInMultiChosen', _findInMultiChosen);
  Ember['default'].Test.registerHelper('selectInMultiChosen', _selectInMultiChosen);
  Ember['default'].Test.registerHelper('selectFirstInMultiChosen', _selectFirstInMultiChosen);
  Ember['default'].Test.registerHelper('selectInChosen', _selectInChosen);
  Ember['default'].Test.registerHelper('findInSelect', _findInSelect);

});
define('dummy/tests/helpers/select.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/select.js should pass jshint', function() { 
    ok(false, 'helpers/select.js should pass jshint.\nhelpers/select.js: line 13, col 22, \'isHidden\' is not defined.\n\n1 error'); 
  });

});
define('dummy/tests/helpers/start-app', ['exports', 'ember', 'dummy/app', 'dummy/config/environment'], function (exports, Ember, Application, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('dummy/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('dummy/tests/integration/select-component-test', ['ember', 'ember-qunit', 'htmlbars-inline-precompile', 'dummy/tests/helpers/assertions'], function (Ember, ember_qunit, hbs, Assertions) {

  'use strict';

  var _templateObject = _taggedTemplateLiteral(['\n    {{select-component content=content}}\n  '], ['\n    {{select-component content=content}}\n  ']);

  function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  var select = null;

  ember_qunit.moduleForComponent('select-component', '[Integration] SelectGroup component', {
    integration: true,
    teardown: function teardown() {
      Ember['default'].run(function () {
        select.destroy();
      });
      select = null;
    }
  });

  ember_qunit.test('Test keyboard interaction', function (assert) {
    assert.expect(10);

    var $selectComponent, selectedText, validateDropdownHidden, validateDropdownVisible, validateFocus;
    selectedText = null;

    this.set('content', ['foo', 'bar', 'barca', 'baz']);
    this.render(hbs['default'](_templateObject));
    $selectComponent = this.$();

    validateDropdownVisible = function (messageVisible) {
      assert.ok(isVisible(find('.ember-select-results', $selectComponent)), messageVisible);
    };
    validateDropdownHidden = function (messageHidden) {
      assert.ok(Assertions['default'].isHidden(find('.ember-select-results', $selectComponent)), messageHidden);
    };
    validateFocus = function (messageFocus) {
      assert.ok(isFocused($selectComponent, $selectComponent), messageFocus);
    };

    validateDropdownHidden('Dropdown list should not exist at the beginning');
    this.$().focus();
    pressEnter($selectComponent);
    andThen(function () {
      validateDropdownVisible('Dropdown list should appear after pressing Enter');
    });

    pressDownArrow($selectComponent);
    andThen(function () {
      var resultItems;
      resultItems = find('.ember-select-result-item', $selectComponent);
      assert.ok($(resultItems[1]).hasClass('highlighted'), 'The second option should be highlighted');
    });

    pressUpArrow($selectComponent);
    andThen(function () {
      var resultItems;
      resultItems = find('.ember-select-result-item', $selectComponent);
      assert.ok($(resultItems[0]).hasClass('highlighted'), 'The first option should be highlighted');
      selectedText = $(resultItems[0]).text();
    });

    pressEnter($selectComponent);
    andThen(function () {
      var currentText, resultItems;
      validateFocus('Select component should be focused after selecting one option');
      validateDropdownHidden('Dropdown list should be hidden after selecting an option');
      resultItems = find('.ember-select-result-item', $selectComponent);
      currentText = $(resultItems[0]).text();
      assert.equal(selectedText, find('.ember-select-result-item:eq(0)', $selectComponent).text(), 'The selected item is not the one was Enter pressed');
    });

    keyEvent($selectComponent, 'keydown', 97);
    andThen(function () {
      validateDropdownVisible('Dropdown list should appear after pressing a letter');
    });

    pressESC($selectComponent);
    andThen(function () {
      validateDropdownHidden('Dropdown list should be hidden after pressing ESC');
      validateFocus('Select component should be focused after pressing ESC');
    });
  });

  ember_qunit.test('Test userSelected action', function (assert) {
    assert.expect(3);

    var selectElement, spy;
    select = this.subject({
      content: ['bar', 'baz']
    });
    spy = sinon.spy(select, "sendAction");
    this.render();
    selectElement = select.$();
    openDropdown(selectElement);
    andThen(function () {
      assert.ok(!spy.calledWith('userSelected'), 'userSelected action should not be fired when first open the dropdown');
      spy.reset();
    });

    click('li:eq(0)', '.ember-select-results');
    andThen(function () {
      assert.ok(spy.calledWithExactly('userSelected', 'bar'), 'userSelected action is fired when select one item in the dropdown');
      spy.reset();
    });

    click('.ember-select-result-item', '.dropdown-toggle');
    andThen(function () {
      assert.ok(!spy.calledWith('userSelected'), 'userSelected action should not be fired when click on the dropdown containing highlighted item');
    });
  });

  ember_qunit.test("Show empty content view if content is empty", function (assert) {
    assert.expect(5);

    var EmptyContentView, selectElement;
    EmptyContentView = Ember['default'].View.extend({
      layout: Ember['default'].Handlebars.compile("<div class='empty-content-view'>No Content</div>")
    });
    select = this.subject({
      content: [],
      optionLabelPath: 'name',
      optionValuePath: 'code',
      classNames: 'select-class-name'
    });
    this.render();
    selectElement = select.$();
    openDropdown(selectElement);
    andThen(function () {
      assert.ok(isPresent(emptyContentSelector, selectElement), 'Empty content block displayed');
      assert.ok(isNotPresent('.empty-content-view', selectElement), 'Empty content view not displayed before specified');
      assert.ok(isNotPresent(noResultSelector, selectElement), '"No result" message not displayed');
    });
    andThen(function () {
      Ember['default'].run(function () {
        select.set('emptyContentView', EmptyContentView);
      });
    });
    andThen(function () {
      assert.ok(isPresent('.empty-content-view', selectElement), 'Empty content view displayed');
    });
    andThen(function () {
      Ember['default'].run(function () {
        select.set('emptyContentView', null);
      });
    });
    andThen(function () {
      assert.ok(isNotPresent('.empty-content-view', selectElement), 'Empty content view no longer displayed');
    });
  });

  ember_qunit.test("Show no-result message if has content but filtered content is empty", function (assert) {
    assert.expect(2);

    var selectElement;
    var data = [{
      name: 'reddit'
    }, {
      name: 'red'
    }];
    select = this.subject({
      content: data,
      query: 'Non-existing Name',
      optionLabelPath: 'name',
      classNames: 'select-class-name'
    });
    this.render();
    selectElement = select.$();
    openDropdown(selectElement);
    andThen(function () {
      assert.ok(isNotPresent(emptyContentSelector, selectElement), 'Empty content block not displayed');
      assert.ok(isPresent(noResultSelector, selectElement), '"No result" message displayed');
    });
  });

});
define('dummy/tests/integration/select-component-test.jshint', function () {

  'use strict';

  module('JSHint - integration');
  test('integration/select-component-test.js should pass jshint', function() { 
    ok(false, 'integration/select-component-test.js should pass jshint.\nintegration/select-component-test.js: line 24, col 54, Missing semicolon.\nintegration/select-component-test.js: line 31, col 15, \'isVisible\' is not defined.\nintegration/select-component-test.js: line 37, col 15, \'isFocused\' is not defined.\nintegration/select-component-test.js: line 92, col 9, \'sinon\' is not defined.\nintegration/select-component-test.js: line 130, col 15, \'isPresent\' is not defined.\nintegration/select-component-test.js: line 130, col 25, \'emptyContentSelector\' is not defined.\nintegration/select-component-test.js: line 131, col 15, \'isNotPresent\' is not defined.\nintegration/select-component-test.js: line 132, col 15, \'isNotPresent\' is not defined.\nintegration/select-component-test.js: line 132, col 28, \'noResultSelector\' is not defined.\nintegration/select-component-test.js: line 140, col 15, \'isPresent\' is not defined.\nintegration/select-component-test.js: line 148, col 15, \'isNotPresent\' is not defined.\nintegration/select-component-test.js: line 173, col 15, \'isNotPresent\' is not defined.\nintegration/select-component-test.js: line 173, col 28, \'emptyContentSelector\' is not defined.\nintegration/select-component-test.js: line 174, col 15, \'isPresent\' is not defined.\nintegration/select-component-test.js: line 174, col 25, \'noResultSelector\' is not defined.\n\n15 errors'); 
  });

});
define('dummy/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('dummy/tests/routes/ember-widgets/index.jshint', function () {

  'use strict';

  module('JSHint - routes/ember-widgets');
  test('routes/ember-widgets/index.js should pass jshint', function() { 
    ok(true, 'routes/ember-widgets/index.js should pass jshint.'); 
  });

});
define('dummy/tests/routes/ember-widgets/modal.jshint', function () {

  'use strict';

  module('JSHint - routes/ember-widgets');
  test('routes/ember-widgets/modal.js should pass jshint', function() { 
    ok(true, 'routes/ember-widgets/modal.js should pass jshint.'); 
  });

});
define('dummy/tests/routes/ember-widgets/overview.jshint', function () {

  'use strict';

  module('JSHint - routes/ember-widgets');
  test('routes/ember-widgets/overview.js should pass jshint', function() { 
    ok(true, 'routes/ember-widgets/overview.js should pass jshint.'); 
  });

});
define('dummy/tests/routes/ember-widgets/popover.jshint', function () {

  'use strict';

  module('JSHint - routes/ember-widgets');
  test('routes/ember-widgets/popover.js should pass jshint', function() { 
    ok(true, 'routes/ember-widgets/popover.js should pass jshint.'); 
  });

});
define('dummy/tests/routes/ember-widgets/select.jshint', function () {

  'use strict';

  module('JSHint - routes/ember-widgets');
  test('routes/ember-widgets/select.js should pass jshint', function() { 
    ok(true, 'routes/ember-widgets/select.js should pass jshint.'); 
  });

});
define('dummy/tests/routes/index.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/index.js should pass jshint', function() { 
    ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('dummy/tests/routes/overview.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/overview.js should pass jshint', function() { 
    ok(true, 'routes/overview.js should pass jshint.'); 
  });

});
define('dummy/tests/routes/select-box.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/select-box.js should pass jshint', function() { 
    ok(true, 'routes/select-box.js should pass jshint.'); 
  });

});
define('dummy/tests/test-helper', ['dummy/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('dummy/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('dummy/tests/unit/components/select-component-test', ['ember', 'ember-qunit'], function (Ember, ember_qunit) {

  'use strict';

  var select = null;

  ember_qunit.moduleForComponent('select-component', '[Unit] SelectGroup component', {
    unit: true,
    teardown: function teardown() {
      Ember['default'].run(function () {
        select.destroy();
      });
      select = null;
    }
  });

  ember_qunit.test('Test continuous queries in a row', function (assert) {
    assert.expect(5);

    var filteredContent;
    select = this.subject({
      content: ['foo', 'bar', 'barca', 'baz']
    });

    select.set('query', 'ba');

    filteredContent = select.get('filteredContent');
    assert.equal(filteredContent[0], 'bar');
    assert.equal(filteredContent[1], 'barca');
    assert.equal(filteredContent[2], 'baz');

    select.set('query', 'bar');

    filteredContent = select.get('filteredContent');
    assert.equal(filteredContent[0], 'bar');
    assert.equal(filteredContent[1], 'barca');
  });

  ember_qunit.test('Test filtered content using array proxy', function (assert) {
    assert.expect(2);

    var data = Ember['default'].ArrayProxy.create({
      content: Ember['default'].A(['red', 'reddit', 'green', 'blue'])
    });
    select = this.subject({
      content: data
    });
    select.set('query', 're');
    assert.equal(select.get('filteredContent')[0], 'red');
    assert.equal(select.get('filteredContent')[1], 'reddit');
  });

  ember_qunit.test('Test sorted filter content', function (assert) {
    assert.expect(3);

    select = this.subject({
      content: ['reddit', 'red', 'green', 'blue']
    });
    select.set('query', 'r');

    assert.equal(select.get('sortedFilteredContent')[0], 'green');
    assert.equal(select.get('sortedFilteredContent')[1], 'red');
    assert.equal(select.get('sortedFilteredContent')[2], 'reddit');
  });

  ember_qunit.test('Test selection label', function (assert) {
    assert.expect(2);

    var data = [{
      name: 'reddit'
    }, {
      name: 'red'
    }];
    select = this.subject({
      content: data,
      selection: data[0],
      optionLabelPath: 'name'
    });
    assert.equal(select.get('selectedLabel'), 'reddit');

    select.set('selection.name', 'blues');
    assert.equal(select.get('selectedLabel'), 'blues');
  });

  ember_qunit.test('Test query matching', function (assert) {
    assert.expect(8);

    select = this.subject({
      content: ['foo', 'bana$  na', 'bar ca', 'baz']
    });
    select.set('query', null);
    assert.equal(select.get('filteredContent').length, 4, 'null queries should return the full list of options');
    select.set('query', '   ');
    assert.equal(select.get('filteredContent').length, 4, 'queries containing all spaces should return the full list of options');
    select.set('query', ' a ');
    assert.equal(select.get('filteredContent').length, 3, 'queries containing spaces at two ends should be trimmed');
    select.set('query', 'bar  ca');
    assert.equal(select.get('filteredContent').length, 1, 'queries containing duplicated spaces should be removed');
    select.set('query', 'barca');
    assert.equal(select.get('filteredContent').length, 0, 'correct spaces should be considered when matching');
    select.set('query', 'bana$');
    assert.equal(select.get('filteredContent').length, 1, 'special characters should be considered when matching');
    select.set('query', 'bana[  na');
    assert.equal(select.get('filteredContent').length, 0, 'special characters should be considered when matching');
    select.set('query', 'bana$ n');
    assert.equal(select.get('filteredContent').length, 1, 'duplicated spaces in the source string should be removed before matching');
  });

  ember_qunit.test('optionValuePath with POJOs', function (assert) {
    assert.expect(1);

    var data, obj1, obj2;
    obj1 = {
      name: 'reddit',
      value: 1
    };
    obj2 = {
      name: 'red',
      value: 2
    };
    data = [obj1, obj2];
    select = this.subject({
      content: data,
      optionLabelPath: 'name',
      optionValuePath: 'value'
    });
    Ember['default'].run(function () {
      select.set('value', 2);
    });
    assert.equal(obj2, select.get('selection'), 'The right selection is retrieved');
  });

  ember_qunit.test('optionValuePath with Ember Objects', function (assert) {
    assert.expect(1);

    var Klass, data, obj1, obj2;
    Klass = Ember['default'].Object.extend({
      name: null,
      value: null
    });
    obj1 = Klass.create({
      name: 'reddit',
      value: 1
    });
    obj2 = Klass.create({
      name: 'red',
      value: 2
    });
    data = [obj1, obj2];
    select = this.subject({
      content: data,
      optionLabelPath: 'name',
      optionValuePath: 'value'
    });

    Ember['default'].run(function () {
      select.set('value', 2);
    });
    assert.equal(obj2, select.get('selection'), 'The right selection is retrieved');
  });

  ember_qunit.test('optionValuePath with ArrayProxy', function (assert) {
    assert.expect(1);

    var Klass, arrData, data, obj1, obj2;
    Klass = Ember['default'].Object.extend({
      name: null,
      value: null
    });
    obj1 = Klass.create({
      name: 'reddit',
      value: 1
    });
    obj2 = Klass.create({
      name: 'red',
      value: 2
    });
    data = [obj1, obj2];
    arrData = Ember['default'].ArrayProxy.create({
      content: Ember['default'].A(data)
    });
    select = this.subject({
      content: arrData,
      optionLabelPath: 'name',
      optionValuePath: 'value'
    });

    Ember['default'].run(function () {
      select.set('value', 2);
    });
    assert.equal(obj2, select.get('selection'), 'The right selection is retrieved');
  });

  ember_qunit.test('optionValuePath with nested valuePath', function (assert) {
    assert.expect(1);

    var data, obj1, obj2, value1;
    value1 = Ember['default'].Object.create();
    value1.set('subvalue', 1);
    obj1 = {
      name: 'reddit',
      value: value1
    };
    obj2 = {
      name: 'red',
      value: {
        subvalue: 2
      }
    };
    data = [obj1, obj2];
    select = this.subject({
      content: Ember['default'].A(data),
      optionLabelPath: 'name',
      optionValuePath: 'value.subvalue'
    });

    Ember['default'].run(function () {
      select.set('value', 2);
    });
    assert.equal(obj2, select.get('selection'), 'The right selection is retrieved');
  });

});
define('dummy/tests/unit/components/select-component-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/select-component-test.js should pass jshint', function() { 
    ok(true, 'unit/components/select-component-test.js should pass jshint.'); 
  });

});
define('dummy/tests/unit/mixins/body-event-listener-test', ['ember', 'ember-widgets/mixins/body-event-listener', 'qunit'], function (Ember, BodyEventListenerMixin, qunit) {

  'use strict';

  qunit.module('Unit | Mixin | body event listener');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var BodyEventListenerObject = Ember['default'].Object.extend(BodyEventListenerMixin['default']);
    var subject = BodyEventListenerObject.create();
    assert.ok(subject);
  });

});
define('dummy/tests/unit/mixins/body-event-listener-test.jshint', function () {

  'use strict';

  module('JSHint - unit/mixins');
  test('unit/mixins/body-event-listener-test.js should pass jshint', function() { 
    ok(true, 'unit/mixins/body-event-listener-test.js should pass jshint.'); 
  });

});
define('dummy/tests/unit/mixins/keyboard-helper-test', ['ember', 'ember-widgets/mixins/keyboard-helper', 'qunit'], function (Ember, KeyboardHelperMixin, qunit) {

  'use strict';

  qunit.module('Unit | Mixin | keyboard helper');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var KeyboardHelperObject = Ember['default'].Object.extend(KeyboardHelperMixin['default']);
    var subject = KeyboardHelperObject.create();
    assert.ok(subject);
  });

});
define('dummy/tests/unit/mixins/keyboard-helper-test.jshint', function () {

  'use strict';

  module('JSHint - unit/mixins');
  test('unit/mixins/keyboard-helper-test.js should pass jshint', function() { 
    ok(true, 'unit/mixins/keyboard-helper-test.js should pass jshint.'); 
  });

});
define('dummy/tests/unit/mixins/popover-test', ['ember', 'ember-widgets/mixins/popover', 'qunit'], function (Ember, PopoverMixin, qunit) {

  'use strict';

  qunit.module('Unit | Mixin | popover');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var PopoverObject = Ember['default'].Object.extend(PopoverMixin['default']);
    var subject = PopoverObject.create();
    assert.ok(subject);
  });

});
define('dummy/tests/unit/mixins/popover-test.jshint', function () {

  'use strict';

  module('JSHint - unit/mixins');
  test('unit/mixins/popover-test.js should pass jshint', function() { 
    ok(true, 'unit/mixins/popover-test.js should pass jshint.'); 
  });

});
define('dummy/tests/unit/mixins/style-bindings-test', ['ember', 'ember-widgets/mixins/style-bindings', 'qunit'], function (Ember, StyleBindingsMixin, qunit) {

  'use strict';

  qunit.module('Unit | Mixin | style bindings');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var StyleBindingsObject = Ember['default'].Object.extend(StyleBindingsMixin['default']);
    var subject = StyleBindingsObject.create();
    assert.ok(subject);
  });

});
define('dummy/tests/unit/mixins/style-bindings-test.jshint', function () {

  'use strict';

  module('JSHint - unit/mixins');
  test('unit/mixins/style-bindings-test.js should pass jshint', function() { 
    ok(true, 'unit/mixins/style-bindings-test.js should pass jshint.'); 
  });

});
define('dummy/tests/unit/mixins/tabbable-modal-test', ['ember', 'ember-widgets/mixins/tabbable-modal', 'qunit'], function (Ember, TabbableModalMixin, qunit) {

  'use strict';

  qunit.module('Unit | Mixin | tabbable modal');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var TabbableModalObject = Ember['default'].Object.extend(TabbableModalMixin['default']);
    var subject = TabbableModalObject.create();
    assert.ok(subject);
  });

});
define('dummy/tests/unit/mixins/tabbable-modal-test.jshint', function () {

  'use strict';

  module('JSHint - unit/mixins');
  test('unit/mixins/tabbable-modal-test.js should pass jshint', function() { 
    ok(true, 'unit/mixins/tabbable-modal-test.js should pass jshint.'); 
  });

});
define('dummy/tests/views/custom-modal-content.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/custom-modal-content.js should pass jshint', function() { 
    ok(true, 'views/custom-modal-content.js should pass jshint.'); 
  });

});
define('dummy/tests/views/custom-popover-content.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/custom-popover-content.js should pass jshint', function() { 
    ok(true, 'views/custom-popover-content.js should pass jshint.'); 
  });

});
define('dummy/views/custom-modal-content', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'custom-modal-content'
  });

});
define('dummy/views/custom-popover-content', ['exports', 'ember', 'dummy/templates/custom-popover-content'], function (exports, Ember, layout) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    layout: layout['default']
  });

});
define('dummy/views/list-view', ['exports', 'ember-list-view'], function (exports, ListView) {

	'use strict';

	exports['default'] = ListView['default'];

});
define('dummy/views/multi-select-option', ['exports', 'ember-widgets/views/multi-select-option'], function (exports, multi_select_option) {

	'use strict';



	exports.default = multi_select_option.default;

});
define('dummy/views/select-option', ['exports', 'ember-widgets/views/select-option'], function (exports, select_option) {

	'use strict';



	exports.default = select_option.default;

});
define('dummy/views/select-tooltip-option', ['exports', 'ember-widgets/views/select-tooltip-option'], function (exports, select_tooltip_option) {

	'use strict';



	exports.default = select_tooltip_option.default;

});
define('dummy/views/virtual-list', ['exports', 'ember-list-view/virtual-list-view'], function (exports, VirtualListView) {

	'use strict';

	exports['default'] = VirtualListView['default'];

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('dummy/config/environment', ['ember'], function(Ember) {
  var prefix = 'dummy';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("dummy/tests/test-helper");
} else {
  require("dummy/app")["default"].create({"name":"ember-widgets","version":"0.0.0.01505aa2"});
}

/* jshint ignore:end */
//# sourceMappingURL=dummy.map