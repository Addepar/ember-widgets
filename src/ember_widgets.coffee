## Used for bundling files together using neuter

Ember.Widgets = Ember.Namespace.create()
Ember.Widgets.VERSION = '0.0.1'
Ember.libraries?.register 'Ember Widgets', Ember.Widgets.VERSION

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
require 'build/src/text_widget/dom_helper'
require 'build/src/text_widget/text_editor'
require 'build/src/text_widget/non_editable_pill'
require 'build/src/text_widget/text_editor_config'
require 'build/src/text_widget/text_editor_with_non_editable'
require 'build/src/color_picker'
require 'build/src/typeahead'
