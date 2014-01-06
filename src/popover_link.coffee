Ember.Widgets.PopoverLinkComponent = Ember.Component.extend
  classNames: ['popover-link']
  classNameBindings: ['disabled']
  placement:  'top'
  content:    null
  title:      null
  contentViewClass: null
  disabled:   no

  _contentViewClass: Ember.computed ->
    Ember.get(@get('contentViewClass')) if @get('contentViewClass')
  .property 'contentViewClass'

  click: (event) ->
    return if @get('disabled')
    Ember.Widgets.PopoverComponent.popup
      parentController: this
      targetElement: @get('element')
      container: @get('container')
      placement: @get('placement')
      title:  @get('title')
      content: @get('content')
      contentViewClass: @get('_contentViewClass')
      # forward actions to popover link component
      sendAction: ->
        context = @get 'parentController'
        context.sendAction.apply context, arguments

Ember.Handlebars.helper('popover-link-component', Ember.Widgets.PopoverLinkComponent)
