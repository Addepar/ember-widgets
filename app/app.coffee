# Dependencies
require 'vendor/ember-list-view/list-view'
require 'vendor/bootstrap/dist/js/bootstrap'
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
    @route 'radioButton'

App.IndexRoute = Ember.Route.extend
  beforeModel: -> @transitionTo('emberWidgets.overview')

App.EmberWidgetsIndexRoute = Ember.Route.extend
  beforeModel: -> @transitionTo('emberWidgets.overview')

App.EmberWidgetsOverviewRoute = Ember.Route.extend
  activate: ->
    controller = @controllerFor('emberWidgets')
    controller.set 'showLargeHero', yes

  deactivate: ->
    controller = @controllerFor('emberWidgets')
    controller.set 'showLargeHero', no

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

    showSmallModal: ->
      Ember.Widgets.ModalComponent.popup
        targetObject: this
        confirm: "modalConfirm"
        cancel: "modalCancel"
        size: 'small'
        content: "This is quite small isn't it? You can also use 'large'."

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
