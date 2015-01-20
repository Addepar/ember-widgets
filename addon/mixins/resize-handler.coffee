`import Ember from 'ember'`

ResizeHandlerMixin = Ember.Mixin.create
  resizeEndDelay: 200,
  resizing: false,

  onResizeStart: Ember.K,
  onResizeEnd: Ember.K,
  onResize: Ember.K,

  endResize: Ember.computed ->
    # Skinny arrow b/c context is passed into Ember.run.debounce
    (event) ->
      return if @isDestroyed
      @set 'resizing', no
      @onResizeEnd(event) if typeof @onResizeEnd is "function"

  handleWindowResize: (event) ->
    if not @get('resizing')
      @set 'resizing', true
      if typeof @onResizeStart is "function"
        @onResizeStart event
    if typeof @onResize is "function"
      @onResize event
    Ember.run.debounce @, @get('endResize'), event, @get('resizeEndDelay')

  didInsertElement: ->
    @_super()
    @_setupResizeDocumentHandlers()

  willDestroyElement: ->
    @_removeResizeDocumentHandlers()
    @_super()

  _setupResizeDocumentHandlers: ->
    return if @_resizeHandler
    @_resizeHandler = jQuery.proxy(@get('handleWindowResize'), @)
    jQuery(window).on("resize." + @elementId, @_resizeHandler)

  _removeResizeDocumentHandlers: ->
    jQuery(window).off("resize." + @elementId, @_resizeHandler)
    @_resizeHandler = null

`export default ResizeHandlerMixin`
