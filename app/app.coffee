# Dependencies
require 'dependencies/list-view'
require 'lib/bootstrap/js/bootstrap'
require 'dist/js/ember-widgets'

# Compiled Handlebars templates
require 'build/app/templates'

# Data
require 'build/app/data/ember_widgets/countries'

window.App = Ember.Application.create
  LOG_TRANSITIONS: false

require 'build/app/views/mixins'
require 'build/app/views/ember_widgets'

App.Router.map ->
  @route 'license'
  @resource 'emberWidgets', path: '/ember-widgets', ->
    @route 'overview'
    @route 'documentation'
    @route 'accordion'
    @route 'carousel'
    @route 'modal'
    @route 'popover'
    @route 'select'
    @route 'textEditor'
    @route 'colorPicker'

App.IndexRoute = Ember.Route.extend
  beforeModel: -> @transitionTo('emberWidgets.overview')

App.EmberWidgetsIndexRoute = Ember.Route.extend
  beforeModel: -> @transitionTo('emberWidgets.overview')

App.CustomPopoverContentView = Ember.View.extend
  templateName: 'custom-popover-content'

App.CustomModalContentView = Ember.View.extend
  templateName: 'custom-modal-content'

App.EmberWidgetsSelectRoute = Ember.Route.extend
  model: -> window.countries

App.EmberWidgetsModalRoute = Ember.Route.extend
  actions:
    showModal: ->
      Ember.Widgets.ModalComponent.popup
        targetObject: this
        confirm: "modalConfirm"
        cancel: "modalCancel"
        content: "Isn't this one fine day?"

    showModalWithCustomContent: ->
      Ember.Widgets.ModalComponent.popup
        targetObject: this
        confirm: "modalConfirm"
        cancel: "modalCancel"
        content: { name: "Louis" }
        contentViewClass: App.CustomModalContentView

    modalConfirm: -> console.log("Modal Confirm!")

    modalCancel: -> console.log("Modal Cancel!")

App.EmberWidgetsPopoverRoute = Ember.Route.extend
  model: -> {name: "Louis"}
