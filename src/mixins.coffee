Ember.Widgets.KeyboardHelper = Ember.Mixin.create
  KEY_CODES:
    BACKSPACE: 8
    DELETE: 46
    DOWN: 40
    ENTER: 13
    LEFT: 37
    RIGHT: 39
    SPACEBAR: 32
    TAB: 9
    UP: 38
    ESCAPE: 27

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
          # check if event.target still exists in DOM
          if document.contains(event.target)
            @bodyClick()
    $(@get('bodyElementSelector')).on "click", @_clickHandler

  _removeDocumentHandlers: ->
    $(@get('bodyElementSelector')).off "click", @_clickHandler
    @_clickHandler = null

Ember.Widgets.TabbableModal = Ember.Mixin.create Ember.Widgets.KeyboardHelper,
  # these are variables from the modal component (modal.coffee) to enforce
  # the modality when clicking outside of the modal and to allow pressing ESC
  # to cancel the modal. Please check if this mixin is going to be used
  # outside of modal.coffee
  enforceModality:  no
  escToCancel:      yes

  currentFocus: null

  _focusTabbable: ->
     # Set focus to the first match:
     # 1. The saved focused element
     # 2. First element inside the dialog matching [autofocus]
     # 3. Tabbable element inside the content element
     # 4. The close button (has class "close")
    hasFocus = [@get 'currentFocus']
    unless @$().has(hasFocus[0]).length
      hasFocus = @$('[autofocus]')
    if hasFocus.length == 0
      hasFocus = @$(':tabbable')
    if focusElement = hasFocus[0]
      if focusElement.className.indexOf('close') > -1
        # if we have more than two tabbable objects, we do not want to tab
        # to close button
        # while if we do not have any choice, the close button is chosen
        if hasFocus.length > 1
          focusElement = hasFocus[1]
      focusElement.focus()
      @set 'currentFocus', focusElement

  _checkContainingElement: (containers, element) ->
    for containerItem in containers
      if containerItem is element or $.contains(containerItem, element)
        return yes
    no

  click: (event) ->
    @_super(event)

    # in some cases, when the app remove the DOM element and replace it with
    # another one for styling purpose, we have to check and drive the focus
    # back to the modal
    unless document.contains(event.target)
      @_focusTabbable()
    # if we click on a not-focusable elemnt, we should guide the focus back
    # to a focusable element, otherwise we will lose the TAB loop
    else unless @_checkContainingElement(@$(':focusable'), event.target)
      @_focusTabbable()
    else
      @set 'currentFocus', event.target

  # capture the TAB key and make a cycle tab loop among the tabbable elements
  # inside the modal. Remove the close button from the loop
  keyDown: (event) ->
    @_super(event)
    return if event.isDefaultPrevented()

    if event.keyCode == @KEY_CODES.ESCAPE and @get 'escToCancel'
      @send 'sendCancel'
      event.preventDefault()
    else if event.keyCode == @KEY_CODES.TAB
      # tabbable objects list without close button
      tabbableObjects = @$(":tabbable").not('.close')

      _currentFocus = document.activeElement

      _index = tabbableObjects.index _currentFocus
      # if the current target does not belong to tabbable objects
      # we need to guide the focus back to a tabbable element
      if _index == -1
        @_focusTabbable()

      # process the tab loop by checking two ends to construct the loop
      if tabbableObjects.length > 0
        first = tabbableObjects[0]
        last = tabbableObjects[tabbableObjects.length - 1]
        # check the two ends
        if (event.target == last and not event.shiftKey)
          first.focus()
          @set 'currentFocus', first
          event.preventDefault()
        else if (event.target == first and event.shiftKey)
          @set 'currentFocus', last
          last.focus()
          event.preventDefault()
        else
          @set 'currentFocus', tabbableObjects[_index+1]
    return yes
