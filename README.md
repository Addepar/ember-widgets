# Ember Widgets by Addepar

A collection of small widgets, easy to drop into place as Ember Components.


## Demo and Documentation
http://addepar.github.com/#/ember-widgets/


## Getting started

### JS Bin Starter Kit

http://emberjs.jsbin.com/hebexa/1/edit

### Installation

With bower: `bower install ember-widgets --save`

Or, just include `dist/js/ember-widgets.js` and `dist/css/ember-widgets.css` in your app.

Once it's installed, you can customize the look of ember-widgets with CSS.


#### Developing or Testing

```bash
$ npm install -g grunt-cli
$ npm install
$ grunt
```

To view examples, start the node server. From the root directory:

`$ node examples.js`.

You can view the examples at http://localhost:8000/gh_pages.

For developing, install pre-commit hooks to run tests in PhantomJS:

`./bin/create-hook-symlinks`


## Dependencies
* ember
* jquery
* bootstrap v3
* lodash
* ember list-view


## Contributing

Got something to add? Great! Bug reports, feature ideas, and (especially) pull
requests are extremely helpful, and this project wouldn't be where it is today
without lots of help from the community.

Please read the [contribution guidelines](CONTRIBUTING.md) for directions on
opening issues and working on the project.


## Versioning

Ember Widgets uses [Semantic Versioning](http://semver.org) to keep track of
releases using the following format:

`<major>.<minor>.<patch>`

In a nutshell, this means:
* Breaking changes to the API or behavior increases the major version
* Adding functionality in a backwards-compatible way increases the minor version
* Making backwards-compatible bug fixes increases the patch version


### Maintainers
Update version numbers and release using https://github.com/webpro/release-it. Install:
```
$ npm install -g release-it
$ alias release="release-it"
```
Release process:
```
$ vim CHANGELOG.md
$ release <options>
```


## Copyright and License
Copyright © 2013 Addepar, Inc. All Rights Reserved

Licensed under the BSD License (the "License"); you may not use this work
except in compliance with the License. You may obtain a copy of the License in
the LICENSE file.
