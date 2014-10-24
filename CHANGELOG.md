# Ember Widgets Changelog

### Ember Widgets 0.2.0 _(October 23, 2014)_

* Only set `container` on modals/popovers if a `targetObject` is passed with
  one provided
* Add placeholder for multiselect and select
  * `placeholder` for text to show when the selects are empty
  * `persistentPlaceholder` for text to show even if some selections are made
    in the multi-select component
* Fix error when fade=no for popovers and modals
* Update deprecated helper and property access
  * Another `layoutName` instead of `templateName`
  * `bindAttr` becomes `bind-attr`
* Add debounced filter and sort for select dropdown options
* Use static width for color-picker-cell
* Set the query when the user did select
* Remove unnecessary uses of Ember.run
* Fix select component focus
* Fixes broken selects when there is no content
* Update the query text whenever the typeahead dropdown folds
* Close popover when the user hits escape and fix not calling callbacks on
  escape press in modal dialog
* Select and multi-select now responsive to labels
* Allow radio buttons to be disabled
* Rename templates with underscores to use dashes
* Support a custom header view class in modal
* Add support for bootstrap modal sizes
* Fix reference to `'state'` with `'_state' or 'state'`.
* Fixes small bug with connecting select item to item templates
* Add option to enable titles on selects
* Fix ember-widgets in environments where Ember's prototype extensions have
  been disabled
* Prevent ensureVisible from failing if `listView` is undefined
* Fix typo in spinner image filename
* Fix console errors with `popover-link-component`
* Adds the proper form-control class to select components
* Fix bug where dropdown menu drops "up" even when there was no space above
* Future-proofing for QUnit updates
* Update `bower.json` and dependency documentation
* Add radio button component
* Upgrade handlebars dependency to `~1.3.0`
* Bugfix: don't call `hide` on destroyed popovers
* Use `layoutName` instead of `templateName`

### Ember Widgets 0.1.0 _(July 1, 2014)_

* Initial release

