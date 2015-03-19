Ember.Widgets.StyleBindingsMixin = Ember.Mixin.create
  concatenatedProperties: ['styleBindings']
  attributeBindings: ['style']
  unitType: 'px'

  createStyleString: (styleName, property) ->
    value = @get property
    return if value is undefined
    if Ember.typeOf(value) is 'number'
      value = value + @get('unitType')
    "#{styleName}:#{value};"

  applyStyleBindings: ->
    styleBindings = this.styleBindings
    return unless styleBindings
    # get properties from bindings e.g. ['width', 'top']
    lookup = {}
    styleBindings.forEach (binding) ->
      [property, style] = binding.split(':')
      lookup[(style or property)] = property
    styles     = _.keys lookup
    properties = _.values lookup

    # create computed property
    styleComputed = Ember.computed =>
      styleTokens = styles.map (style) =>
        @createStyleString style, lookup[style]
      styleString = styleTokens.join('')
      return styleString unless styleString.length is 0
    # add dependents to computed property
    styleComputed.property.apply(styleComputed, properties)
    # define style computed properties
    Ember.defineProperty this, 'style', styleComputed

  init: ->
    @applyStyleBindings()
    @_super()

Ember.Widgets.BodyEventListener = Ember.Mixin.create
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
