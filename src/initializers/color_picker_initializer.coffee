###*
 * Register all the color picker component and sub-components to the application
 * when loading, so that we can use the dash-style in handlebars.
###
Ember.onLoad 'Ember.Application', (application) ->
  name = 'ember-widgets'
  return if application.initializers[name]
  application.initializer
    name: name
    initialize: (container, application) ->
      application.register 'component:color-picker',
      	Ember.Widgets.ColorPickerComponent
      application.register 'component:color-picker-dropdown',
      	Ember.Widgets.ColorPickerDropdownComponent
      application.register 'component:color-picker-cell',
      	Ember.Widgets.ColorPickerCellComponent
