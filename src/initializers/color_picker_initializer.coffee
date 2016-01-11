Ember.onLoad 'Ember.Application', (application) ->
  name = 'ember-widgets'
  return if application.initializers[name]
  application.initializer
    name: name
    initialize: (container, application) ->
      application.register 'component:color-picker', Ember.Widgets.ColorPickerComponent
      application.register 'component:color-picker-dropdown', Ember.Widgets.ColorPickerDropdownComponent
