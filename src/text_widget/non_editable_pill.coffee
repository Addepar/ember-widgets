# Base class for NonEditablePill that can be inserted into the TextEditorWithNonEditableComponent
Ember.Widgets.BaseNonEditablePill = Ember.Controller.extend Ember.Widgets.DomHelper,

  textEditor: null
  params: Ember.computed -> {}

  ##############################################################################
  # Interface
  ##############################################################################

  name: null

  # Returns a string that is displayed to the user in the non-editable pill in the text editor.
  # This method is called whenever the text editor view is refreshed. Needs to be overriden.
  result: -> Ember.K

  # Configure the parameters of the pill, e.g. by displaying a modal with input options that are
  # then stored in @get('params')
  configurable: false
  configure: ->
    @send 'modalConfirm'  # No configuration by default

  ##############################################################################

  actions:
    modalConfirm: ->
      if @get 'params.pillId'
        @get('textEditor').updatePill this
      else
        @set 'params.pillId', @get('textEditor').getNewPillId()
        @set 'params.type', "" + @constructor
        @get('textEditor').insertPill this
    modalCancel: -> Ember.K

  # Update the text of the pill with the latest results
  updateContent: ->
    $(@get('pillElement')).text(@result())

  # Create a span element containing the correct text and with class=non-editable, that will then
  # be inserted into the text editor DOM.
  render: ->
    span = @createElementsFromString("<span></span>")
    span.addClass('non-editable')
    if @get('configurable')
      span.addClass 'configurable'

    span.attr('title': @get('name'))
    span.attr('contentEditable', false)
    # include all params as data-attributes
    for key, value of @get('params')
      span.attr('data-' + Ember.String.dasherize(key), value)
    @set 'pillElement', span
    @updateContent(span)
    return span[0]


Ember.Widgets.NonEditableTextPill = Ember.Widgets.BaseNonEditablePill.extend
  name: "Custom Text"
  text: Ember.computed.alias 'params.text'

  result: ->
    @get('params.text')

  configurable: true
  configure: ->
    modal = Ember.Widgets.ModalComponent.popup
      content: this
      targetObject: this
      confirm: "modalConfirm"
      cancel: "modalCancel"
      contentViewClass: Ember.View.extend
        templateName: 'non-editable-text-pill-configuration'
      headerText: @get('name')
      confirmText: "Insert"


Ember.Widgets.TodaysDatePill = Ember.Widgets.BaseNonEditablePill.extend
  name: "Today's Date"

  result: -> Date()


Ember.Widgets.PillSelect = Ember.Widgets.SelectComponent.extend
  templateName: 'text-editor-pill-menu'
  isSelect: true
  showButton: true


Ember.Widgets.PillInsertMixin = Ember.Mixin.create
  pillOptions: Ember.A [
    Ember.Widgets.TodaysDatePill
    Ember.Widgets.NonEditableTextPill
  ]

  _pillOptions : Ember.computed ->
    Ember.A @getWithDefault('pillOptions', []).map (option) =>
      label: option.create().name
      value: option
  .property 'pillOptions'

  actions:
    insertPill: (pillOption) ->
      selectedPillOption = pillOption.value.create textEditor: @get('textEditor') or this
      selectedPillOption.configure()
      @set 'selectedPillOption', null
