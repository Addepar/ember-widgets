Ember.Widgets.PopoverLinkComponent = Ember.Component.extend
  classNames: ['popover-link']
  classNameBindings: ['disabled']
  placement:  'top'
  content:    null
  title:      null
  contentViewClass: null
  disabled:   no
  popoverClassNames: []
  rootElement: '.ember-application'
  fade: yes

  willDestroy: ->
    @_super()

    propertyName = '_popover'
    if @cacheFor propertyName
      property = @get propertyName
      property.destroy()

  _contentViewClass: Ember.computed ->
    contentViewClass = @get 'contentViewClass'
    if typeof contentViewClass is 'string'
      return Ember.get contentViewClass
    contentViewClass
  .property 'contentViewClass'

  click: (event) ->
    return if @get('disabled')

    popover = @get('_popover')

    if (popover?.get('_state') or popover?.get('state')) is 'inDOM'
      popover.hide()
    else
      popoverView = Ember.View.extend Ember.Widgets.PopoverMixin,
        layoutName: 'popover-link-popover'
        classNames: @get('popoverClassNames')
        controller: this
        targetElement: @get('element')
        container: @get('container')
        placement: Ember.computed.alias 'controller.placement'
        title:  Ember.computed.alias 'controller.title'
        contentViewClass: @get('_contentViewClass')
        fade: @get('fade')
      popover = popoverView.create()
      @set '_popover', popover
      popover.appendTo @get('rootElement')

Ember.Handlebars.helper('popover-link-component', Ember.Widgets.PopoverLinkComponent)
