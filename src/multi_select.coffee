Ember.Widgets.MultiSelectSelectedItemView = Ember.View.extend
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

Ember.Widgets.MultiSelectOptionView = Ember.Widgets.SelectOptionView.extend
  correctHighlight: ->
    content   = @get('controller.selectableOptions') or Ember.A()
    if content.length > 0
      index = @get 'controller.highlightedIndex'
      if index < content.length - 1
        value = content.objectAt index + 1
      else
        value = content.objectAt index - 1
    @set 'controller.highlighted', value
    # @set 'controller.highlighted', @get('content')

  processDropDownShown: ->
    @get('controller').focusTextField()
    # @correctHighlight()

Ember.Widgets.MultiSelectComponent = Ember.Widgets.SelectComponent.extend
  layoutName: 'multi-select'
  selections: undefined
  choicesFieldClass: ''
  placeholder: undefined
  persistentPlaceholder: undefined
  itemViewClass:      'Ember.Widgets.MultiSelectOptionView'

  # disable tabindex of the component container to set focus directly to
  # the input field, which is always visible. This helps reducing one tab
  # step to navigate back to the previous component
  tabindex: -1

  values: Ember.computed (key, value) ->
    if arguments.length is 2 # setter
      return unless value
      valuePath = @get 'optionValuePath'
      @set 'selections', Ember.A(
        @get('content').filter (item) ->
          value.contains Ember.get(item, valuePath)
      )
      value
    else # getter
      valuePath = @get 'optionValuePath'
      selections = @get 'selections'
      if valuePath then selections.getEach(valuePath) else selections
  .property 'selections.[]'

  selectionItemView: Ember.Widgets.MultiSelectSelectedItemView

  # Invisible span used to make sure there is a good amount of room for either
  # the placeholder values, or for the query the user has entered.
  invisiblePlaceholderText: Ember.computed ->
    return @get('query') if @get 'query'
    return @get('persistentPlaceholder') if @get('selections.length')
    @get('placeholder') or @get('persistentPlaceholder')
  .property 'query', 'placeholder', 'persistentPlaceholder', 'selections.length'

  addBorderMultiSelectContainer: ->
    @$('.ember-select-multi').addClass('ember-select-multi-focus')

  removeBorderMultiSelectContainer: ->
    @$('.ember-select-multi').removeClass('ember-select-multi-focus')

  searchView: Ember.TextField.extend
    class: 'ember-select-input'
    valueBinding: 'parentView.query'
    placeholder: Ember.computed ->
      if @get('parentView.selections.length')
        return @get('parentView.persistentPlaceholder')
      @get('parentView.placeholder') or @get('parentView.persistentPlaceholder')
    .property('parentView.placeholder', 'parentView.persistentPlaceholder',
      'parentView.selections.length')

  # the list of content that is filtered down based on the query entered
  # in the textbox
  # Other than observing the changes on each elements, we need to observe the
  # `filteredContent`, and `sortedFilteredContent` because when the `content`
  # is overridden by a DS.PromiseArray, somehow it never triggers this function
  preparedContent: Ember.computed ->
    content = @get 'content'
    selections = @get 'selections'
    return Ember.A [] unless content and selections
    # excludes items that are already selected

    if @get('sortLabels')
      @get('sortedFilteredContent').filter (item) ->
        not selections.contains(item)
    else
      @get('filteredContent').filter (item) ->
        not selections.contains(item)
  .property('content.[]', 'filteredContent.[]', 'sortedFilteredContent.[]',
    'selections.[]', 'sortLabels', 'filteredContent', 'sortedFilteredContent')

  # uses single select's "selection" value - adds it to selections and
  # then clears the selection value so that it can be re-selected
  selectionDidChange: Ember.observer ->
    selections = @get 'selections'
    selection  = @get 'selection'
    @set 'selection', null
    @set 'query', ''
    if not Ember.isEmpty(selection) and not selections.contains selection
      selections.pushObject selection
  , 'selection', 'selections.[]'

  focusTextField: ->
    @$('.ember-text-field').focus()

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
    if event.target.selectionStart is 0 and event.target.selectionEnd is 0
      @removeSelectedItem(@get('selections.lastObject'))
      event.preventDefault()

  removeSelectedItem: (item) ->
    # set the focus back to the searchView because this item will be removed
    dropdownIsShowing = @get('showDropdown')
    @focusTextField()
    @send 'hideDropdown' unless dropdownIsShowing
    @get('selections').removeObject item

  escapePressed: (event) ->
    if @get('showDropdown')
      @focusTextField()
      @send 'hideDropdown'
      event.preventDefault()

  enterPressed: (event) ->
    @_super(event)
    @focusTextField()
    @set('showDropdown', yes)

Ember.Handlebars.helper(
  'multi-select-component'
  Ember.Widgets.MultiSelectComponent
)
