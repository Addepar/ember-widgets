`import Ember from 'ember'`

BodyEventListener = Ember.Mixin.create
  bodyElementSelector: 'html'
  bodyClick: Ember.K

  didInsertElement: ->
    @_super()
    # It is important to setup document handlers in the next run loop.
    # Otherwise we run in to situation whenre the click that causes a popover
    # to appears will be handled right away when we attach a click handler.
    # This very same click will trigger the bodyClick to fire and thus
    # causing us to hide the popover right away
    Ember.run.next this, @_setupDocumentHandlers

  willDestroyElement: ->
    @_super()
    @_removeDocumentHandlers()

  _setupDocumentHandlers: ->
    return if @_clickHandler or @isDestroying
    @_clickHandler = (event) =>
      Ember.run =>
        if (@get('_state') or @get('state')) is 'inDOM' and Ember.isEmpty(@$().has($(event.target)))
          @bodyClick()
    $(@get('bodyElementSelector')).on "click", @_clickHandler

  _removeDocumentHandlers: ->
    $(@get('bodyElementSelector')).off "click", @_clickHandler
    @_clickHandler = null

`export default BodyEventListener`
