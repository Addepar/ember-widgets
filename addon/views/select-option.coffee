`import Ember from 'ember'`

# The view for each item in the select.
SelectOptionView = Ember.ListItemView.extend
  tagName: 'li'
  templateName: 'select-item'
  layoutName: 'select-item-layout'
  classNames: 'ember-select-result-item'
  classNameBindings: Ember.A [
    'content.isGroupOption:ember-select-group'
    'isHighlighted:highlighted'
  ]
  labelPath: Ember.computed.alias  'controller.optionLabelPath'

  isHighlighted: Ember.computed ->
    @get('controller.highlighted') is @get('content')
  .property 'controller.highlighted', 'content'

  labelPathDidChange: Ember.observer ->
    labelPath = @get 'labelPath'
    # if it is a raw string, the path is just the context
    # if labelPath is specified, the path should be context.labelPath
    path = if labelPath then "content.#{labelPath}" else 'content'
    # We are creating a computed property called label that is an alias of
    # 'context.#{labelPath}'
    Ember.defineProperty(this, 'label', Ember.computed.alias(path))
    @notifyPropertyChange 'label'
  , 'content', 'labelPath'

  didInsertElement: ->
    @_super()
    @labelPathDidChange()

  # TODO(Peter): This is a hack. Some computed don't fire properly if
  # they are dependent on the context. e.g. isHighlighted may not update
  # if it is dependent on the context. This seems to fix the issue
  updateContext: (context) ->
    @_super context
    @set 'content', context

  click: ->
    return if @get('content.isGroupOption')
    @set 'controller.selection', @get('content')
    @get('controller').userDidSelect @get 'content'
    # if there's a selection and the dropdown is unexpanded, we want to
    # propagate the click event
    # if the dropdown is expanded and we select something, don't propagate
    if @get('controller.showDropdown')
      @get('controller').send 'hideDropdown'
      # return false to prevent propagation
      return no

  mouseEnter: ->
    return if @get('content.isGroupOption')
    @set 'controller.highlighted', @get('content')

`export default SelectOptionView`
