`import Ember from 'ember'`
`import transitionend from '../utils/css-transitions'`

AccordionItem = Ember.View.extend
  defaultTemplate: Ember.Handlebars.compile('{{view.content}}')
  layoutName: 'accordion-group-layout'
  classNames: 'panel panel-default'
  title: 'Untitled Accordion Group'
  index: 0
  isActive: no
  content: Ember.computed.alias 'parentView.content'

  isActiveDidChange: Ember.observer ->
    @set 'isActive', (@get('parentView.activeIndex') is @get('index'))
    if @get('isActive') then @show() else @hide()
  , 'parentView.activeIndex'

  didInsertElement: ->
    index = @get('parentView').$('.panel').index @$()
    @set 'index', index
    @isActiveDidChange()

  click: (event) ->
    # only handle clicks on the title of the accordion
    return unless @$(event.target).closest('.panel-heading').length > 0
    if @get('isActive')
      @set 'parentView.activeIndex', null
    else
      @set 'parentView.activeIndex', @get('index')

  hide: ->
    $accordionBody = @$('.panel-collapse')
    $accordionBody.height($accordionBody.height())[0].offsetHeight

    $accordionBody
      .removeClass('collapse')
      .removeClass('in')
      .addClass('collapsing')
    $accordionBody.height(0)

    @_onTransitionEnd $accordionBody, ->
      $accordionBody.removeClass('collapsing').addClass('collapse')

  show: ->
    $accordionBody = @$('.panel-collapse')
    $accordionBody.removeClass('collapse').addClass('collapsing').height(0)

    $accordionBody.height($accordionBody[0]['scrollHeight'])
    @_onTransitionEnd $(), ->
      $accordionBody.removeClass('collapsing').addClass('in')
        .height('auto')

  _onTransitionEnd: ($el, callback) ->
    if @get('emberWidgetsConfig.DISABLE_ANIMATIONS')
      callback()
    else
      $el.one transitionend, callback

`export default AccordionItem`
