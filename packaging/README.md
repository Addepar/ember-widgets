# Ember Widgets by Addepar Globals Build

There are some legacy apps which are not in ember-cli or ES6 modules style, and
expect some global objects to exist. The broccoli build in this file generates
those global objects.

## Installation

Add a bower dependency on ember-widgets and include
```
bower_components/ember-widgets/packaging/dist/ember-widgets.js
```
in your app.

## Building

* `cd packaging`
* `rm -r dist/`
* `broccoli build dist/`
