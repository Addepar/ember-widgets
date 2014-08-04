get = (object, key) ->
  return undefined unless object
  return object    unless key
  object.get?(key) or object[key]

set = (object, key, value) ->
  return unless object and key
  object.set?(key, value) or object[key] = value;

Ember.Widgets.MultiSelectOptionView = Ember.View.extend
  tagName: 'li'
  templateName: 'multi-select-item'
  classNames:   'ember-select-search-choice'
  labelPath: Ember.computed.alias 'controller.optionLabelPath'

  didInsertElement: ->
    @_super()
    @labelPathDidChange()

  labelPathDidChange: Ember.observer ->
    labelPath = @get 'labelPath'
    path = if labelPath then "context.#{labelPath}" else 'context'
    Ember.defineProperty(this, 'label', Ember.computed.alias(path))
    @notifyPropertyChange 'label'
  , 'context', 'labelPath'

Ember.Widgets.MultiSelectComponent = Ember.Widgets.SelectComponent.extend
  layoutName: 'multi-select'
  selections: undefined
  choicesFieldClass: ''

  values: Ember.computed (key, value) ->
    if arguments.length is 2 # setter
      return unless value
      valuePath = @get 'optionValuePath'
      @set 'selections', Ember.A(
        @get('content').filter (item) ->
          value.contains get(item, valuePath)
      )
      value
    else # getter
      valuePath = @get 'optionValuePath'
      selections = @get 'selections'
      if valuePath then selections.getEach(valuePath) else selections
  .property 'selections.@each'

  selectionItemView: Ember.Widgets.MultiSelectOptionView

  searchView: Ember.TextField.extend
    class: 'ember-select-input'
    valueBinding: 'parentView.query'
    focusIn: (event) -> @set 'parentView.showDropdown', yes

  # the list of content that is filtered down based on the query entered
  # in the textbox
  filteredContent: Ember.computed ->
    content = @get 'content'
    query   = @get 'query'
    selections = @get 'selections'
    return Ember.A [] unless content and selections
    # excludes items that are already selected
    Ember.A(
      @get('content').filter (item) =>
        not selections.contains(item) and @matcher(query, item)
    )
  .property 'content.@each', 'optionLabelPath', 'query', 'selections.@each'

  # uses single select's "selection" value - adds it to selections and
  # then clears the selection value so that it can be re-selected
  selectionDidChange: Ember.observer ->
    selections = @get 'selections'
    selection  = @get 'selection'
    @set 'selection', null
    @set 'query', ''
    if not Ember.isEmpty(selection) and not selections.contains selection
      selections.pushObject selection
  , 'selection'

  didInsertElement: ->
    # We want to initialize selections to []. This SHOULD NOT be done through
    # computed properties, because we would run into the following situation.
    # If the user do selectionsBinding and whatever we are binded to is
    # undefined then, selections is initialized as undefined. We could change
    # the value to [] if its value is undefined but the bindings would not have
    # realized a change and fail to fire.
    @_super()
    @set 'selections', Ember.A [] unless @get('selections')
    @set 'values', Ember.A [] unless @get('values')

  deletePressed: (event) ->
    if event.target.selectionStart == 0
      @removeSelectItem(@get('selections.lastObject'))

  removeSelectItem: (item) ->
    @get('selections').removeObject item

  actions:
    removeSelectItem: (item) ->
      @removeSelectItem(item)

Ember.Handlebars.helper('multi-select-component', Ember.Widgets.MultiSelectComponent)
