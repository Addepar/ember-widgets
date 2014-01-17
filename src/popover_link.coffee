Ember.Widgets.PopoverLinkComponent = Ember.Component.extend
  classNames: ['popover-link']
  classNameBindings: ['disabled']
  placement:  'top'
  content:    null
  title:      null
  contentViewClass: null
  disabled:   no
  rootElement: '.ember-application'

  _contentViewClass: Ember.computed ->
    Ember.get(@get('contentViewClass')) if @get('contentViewClass')
  .property 'contentViewClass'

  click: (event) ->
    return if @get('disabled')
    popoverView = Ember.View.extend Ember.Widgets.PopoverMixin,
      controller: this
      targetElement: @get('element')
      container: @get('container')
      placement: Ember.computed.alias 'controller.placement'
      title:  Ember.computed.alias 'controller.title'
      contentViewClass: @get('_contentViewClass')
    popover = popoverView.create()
    popover.appendTo rootElement

Ember.Handlebars.helper('popover-link-component', Ember.Widgets.PopoverLinkComponent)
