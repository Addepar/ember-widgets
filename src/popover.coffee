Ember.Widgets.PopoverComponent =
Ember.Component.extend Ember.Widgets.StyleBindingsMixin,
Ember.Widgets.BodyEventListener,
  layoutName: 'popover'
  classNames: ['popover']
  classNameBindings: ['isShowing:in', 'fade', 'placement']
  styleBindings: ['left', 'top', 'display', 'visibility']

  # The target element to anchor the popover to
  targetElement: null
  contentViewClass: null
  placement:  'top'
  title:      ''
  left:       0
  top:        0
  display:    'block'
  visibility: 'hidden'
  fade: yes
  isShowing:  no
  inserted: no
  content: ""

  _resizeHandler: null
  _scrollHandler: null

  _contentViewClass: Ember.computed ->
    return @get('contentViewClass') if @get('contentViewClass')
    Ember.View.extend
      content: Ember.computed.alias 'parentView.content'
      templateName: 'view_parent_view_content'
  .property 'contentViewClass'

  didInsertElement: ->
    @_super()
    # we want the view to render first and then we snap to position after
    # it is renered
    Ember.run.next this, ->
      @snapToPosition()
      @set 'visibility', 'visible'
      @set 'isShowing', yes

  bodyClick: -> @hide()

  hide: ->
    @set('isShowing', no)
    @$().one $.support.transition.end, => @destroy()

  snapToPosition: ->
    return unless @get('state') is 'inDOM'
    $target      = $(@get('targetElement'))
    actualWidth  = @$()[0].offsetWidth
    actualHeight = @$()[0].offsetHeight
    pos = $target.offset()
    pos.width  = $target[0].offsetWidth
    pos.height = $target[0].offsetHeight

    switch @get('placement')
      when 'bottom'
        @set 'top',   pos.top + pos.height
        @set 'left',  pos.left + pos.width / 2 - actualWidth / 2
        break
      when 'top'
        @set 'top',   pos.top - actualHeight
        @set 'left',  pos.left + pos.width / 2 - actualWidth / 2
        break
      when 'top-right'
        @set 'top',   pos.top
        @set 'left',  pos.left + pos.width
        break
      when 'top-left'
        @set 'top',   pos.top
        @set 'left',  pos.left - actualWidth
        break
      when 'bottom-right'
        @set 'top', pos.top + pos.height
        @set 'left', pos.left + pos.width - actualWidth
        break
      when 'bottom-left'
        @set 'top',   pos.top + pos.height
        @set 'left',  pos.left
        break
      when 'left'
        @set 'top',   pos.top + pos.height / 2 - actualHeight / 2
        @set 'left',  pos.left - actualWidth
        break
      when 'right'
        @set 'top',   pos.top + pos.height / 2 - actualHeight / 2
        @set 'left',  pos.left + pos.width
        break
    @correctHorizontalIfOffScreen()

  correctHorizontalIfOffScreen: ->
    bodyWidth = $('body').width()
    actualWidth  = @$()[0].offsetWidth

    # if our popover is outside of the body (either on left or on right)
    # we need to get rid of the arrow at top/bottom of the popover
    hideArrow = no
    if @get('left') + actualWidth > bodyWidth
      @set 'left', bodyWidth - actualWidth
      hideArrow = yes

    if @get('left') < 0
      @set 'left', 0
      hideArrow = yes

    if hideArrow then @$().addClass('no-arrow') else @$().removeClass('no-arrow')

  # We need to put this in a computed because this is attached to the
  # resize and scroll events before snapToPosition is defined. We
  # throttle for 100 ms because that looks nice.
  debounceSnapToPosition: Ember.computed ->
    Ember.run.debounce(this, @snapToPosition, 100)

  _setupDocumentHandlers: ->
    @_super()
    unless @_resizeHandler
      @_resizeHandler = @get('debounceSnapToPosition')
      $('html').on 'resize', @_resizeHandler
    unless @_scrollHandler
      @_scrollHandler = @get('debounceSnapToPosition')
      $('html').on 'scroll', @_scrollHandler

  _removeDocumentHandlers: ->
    @_super()
    # remove resize callbacks
    $('html').off 'resize', @_resizeHandler
    @_resizeHandler = null
    $('html').off 'scroll', @_scrollHandler
    @_scrollHandler = null

Ember.Widgets.PopoverComponent.reopenClass
  rootElement: '.ember-application'
  hideAll: ->

  popup: (options) ->
    rootElement = options.rootElement or @rootElement
    popover = this.create options
    popover.appendTo rootElement
    popover

Ember.Handlebars.helper('popover-component', Ember.Widgets.PopoverComponent)
