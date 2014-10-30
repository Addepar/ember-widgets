## Used for bundling files together using neuter

Ember.Widgets = Ember.Namespace.create()
Ember.Widgets.VERSION = '0.2.0'
Ember.Widgets.DISABLE_ANIMATIONS = false
Ember.libraries?.register 'Ember Widgets', Ember.Widgets.VERSION

# Dependencies
require 'dependencies/ember-addepar-mixins/resize_handler'

# Ember-Widgets
require 'build/src/templates'
require 'build/src/mixins'
require 'build/src/accordion'
require 'build/src/carousel'
require 'build/src/editable_label'
require 'build/src/modal'
require 'build/src/popover'
require 'build/src/popover_link'
require 'build/src/select'
require 'build/src/multi_select'
require 'build/src/radio_button'
require 'build/src/text_widget/dom_helper'
require 'build/src/text_widget/text_editor'
require 'build/src/text_widget/non_editable_pill'
require 'build/src/text_widget/text_editor_config'
require 'build/src/text_widget/text_editor_with_non_editable'
require 'build/src/color_picker'
require 'build/src/typeahead'
