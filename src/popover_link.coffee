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

  _contentViewClass: Ember.computed ->
    contentViewClass = @get 'contentViewClass'
    if typeof contentViewClass is 'string'
      return Ember.get contentViewClass
    contentViewClass
  .property 'contentViewClass'

  click: (event) ->
    return if @get('disabled')
    popoverView = Ember.View.extend Ember.Widgets.PopoverMixin,
      layoutName: 'popover-link-popover'
      classNames: @get('popoverClassNames')
      controller: this
      targetElement: @get('element')
      container: @get('container')
      placement: Ember.computed.alias 'controller.placement'
      title:  Ember.computed.alias 'controller.title'
      contentViewClass: @get('_contentViewClass')
    popover = popoverView.create()
    popover.appendTo @get('rootElement')

Ember.Handlebars.helper('popover-link-component', Ember.Widgets.PopoverLinkComponent)
