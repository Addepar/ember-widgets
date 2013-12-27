Ember.Widgets.PopoverLinkComponent = Ember.Component.extend
  classNames: ['popover-link']
  placement:  'top'
  content:    null
  title:      null
  contentViewClass: null

  _contentViewClass: Ember.computed ->
    Ember.get(@get('contentViewClass')) if @get('contentViewClass')
  .property 'contentViewClass'

  click: (event) ->
    Ember.Widgets.PopoverComponent.popup
      targetElement: @get('element')
      targetObject: @get('targetObject')
      container: @get('container')
      placement: @get('placement')
      title:  @get('title')
      content: @get('content')
      contentViewClass: @get('_contentViewClass')

Ember.Handlebars.helper('popover-link-component', Ember.Widgets.PopoverLinkComponent)
