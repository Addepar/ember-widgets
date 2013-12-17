get = (object, key) ->
  return undefined unless object
  return object    unless key
  object.get?(key) or object[key]

set = (object, key, value) ->
  return unless object and key
  object.set?(key, value) or object[key] = value;

# The view for each item in the select.
Ember.Widgets.SelectOptionView = Ember.ListItemView.extend
  tagName: 'li'
  templateName: 'select_item'
  layoutName: 'select_item_layout'
  classNames: 'ember-select-result-item'
  classNameBindings: ['content.isGroupOption:ember-select-group',
                      'isHighlighted:highlighted']
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
    @get('controller').hideDropdown()

  mouseEnter: ->
    return if @get('content.isGroupOption')
    @set 'controller.highlighted', @get('content')

Ember.Widgets.SelectComponent =
Ember.Component.extend Ember.Widgets.BodyEventListener,
  templateName:       'select'
  classNames:         'ember-select'
  attributeBindings: ['tabindex']
  classNameBindings: ['showDropdown:open']
  itemViewClass:      'Ember.Widgets.SelectOptionView'
  prompt:             'Select a Value'

  # we need to set tabindex so that div responds to key events
  highlightedIndex: -1

  tabindex: -1

  showDropdown: no

  dropdownHeight: 300
  # Important: rowHeight must be synched with the CSS
  rowHeight:    26
  # Option to indicate whether we should sort the labels
  sortLabels:   yes
  # If isSelect is true, we will not show the search box
  isSelect:     no

  # Change the icon when necessary
  dropdownToggleIcon: 'fa fa-caret-down'

  # Change the button class when necessary
  buttonClass: 'btn btn-default'

  # The list of options
  content:    []
  selection:  null
  query:      ''
  optionLabelPath: ''
  optionValuePath: ''
  optionGroupPath: ''
  optionDefaultPath: ''

  # TODO(Peter): consider calling this optionViewClass?
  itemView: Ember.computed ->
    itemViewClass = @get 'itemViewClass'
    if typeof itemViewClass is 'string'
      return Ember.get itemViewClass
    itemViewClass
  .property 'itemViewClass'

  # TODO(Peter): consider calling this selectedOptionViewClass?
  selectedItemView: Ember.computed ->
    @get('itemView').extend
      tagName: 'span'
      labelPath: Ember.computed.alias 'controller.optionLabelPath'
      context: Ember.computed.alias 'controller.selection'
  .property 'itemView'

  selectedLabel: Ember.computed ->
    get @get('selection'), @get('optionLabelPath')
  .property 'selection', 'optionLabelPath'

  searchView: Ember.TextField.extend
    placeholder: 'Search'
    valueBinding: 'parentView.query'
    # we want to focus on search input when dropdown is opened. We need to put
    # this in a run loop to wait for the event that triggers the showDropdown
    # to finishes before trying to focus the input. Otherwise, focus when be
    # "stolen" from us.
    showDropdownDidChange: Ember.observer ->
      Ember.run.next this, -> @$().focus() if @get('state') is 'inDOM'
    , 'parentView.showDropdown'

  # This is a hack. Ember.ListView doesn't handle case when total height
  # is less than height properly
  listView: Ember.ListView.extend
    style: Ember.computed ->
      height = Math.min @get('height'), @get('totalHeight')
      "height: #{height}px"
    .property('height', 'totalHeight'),

  # the list of content that is filtered down based on the query entered
  # in the textbox
  filteredContent: Ember.computed ->
    content = @get 'content'
    query   = @get 'query'
    return [] unless content
    filteredContent = @get('content').filter (item) => @matcher(query, item)
    return filteredContent unless @get('sortLabels')
    _.sortBy filteredContent, (item) => get(item, @get('optionLabelPath'))?.toLowerCase()
  .property 'content.@each', 'query', 'optionLabelPath', 'sortLabels'

  # the list of content that is grouped by the content in the optionGroupPath
  # e.g. {name: 'Addepar', location: 'Mountain View'}
  #      {name: 'Google', location: 'Mountain View'}
  # if we group by location we will get
  # Mountain View
  #   Addepar
  #   Google
  groupedContent: Ember.computed ->
    path    = @get 'optionGroupPath'
    content = @get 'filteredContent'
    return content unless path
    groups  = _.groupBy content, (item) -> get(item, path)
    result  = Ember.A()
    _.keys(groups).sort().forEach (key) ->
      result.pushObject  Ember.Object.create isGroupOption: yes, name:key
      result.pushObjects groups[key]
    result
  .property 'filteredContent', 'optionGroupPath'

  hasNoResults: Ember.computed.empty 'filteredContent'

  value: Ember.computed (key, value) ->
    if arguments.length is 2 # setter
      valuePath = @get 'optionValuePath'
      selection = value
      selection = @get('content').findProperty(valuePath, value) if valuePath
      @set 'selection', selection
      value
    else # getter
      valuePath = @get 'optionValuePath'
      selection = @get 'selection'
      if valuePath then get(selection, valuePath) else selection
  .property 'selection'

  didInsertElement: ->
    @_super()
    @setDefaultSelection()

  # It matches the item label with the query. This can be overrideen for better
  matcher: (searchText, item) ->
    return yes unless searchText
    label = get(item, @get('optionLabelPath'))
    escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    regex = new RegExp(escapedSearchText, 'i')
    regex.test(label)

  toggleDropdown: (event) ->
    @toggleProperty 'showDropdown'

  hideDropdown: (event) ->
    @set 'showDropdown', no

  # TODO(Peter): This needs to be rethought
  setDefaultSelection: Ember.observer ->
    # do not set default selection if selection is defined
    return if @get 'selection'
    content     = @get 'content'
    defaultPath = @get 'optionDefaultPath'
    return unless content and defaultPath
    @set 'selection', content.findProperty(defaultPath)
  , 'content.@each'

  selectableOptionsDidChange: Ember.observer ->
    highlighted = @get('highlighted')
    if not @get('selectableOptions').contains(highlighted)
      @set 'highlighted', @get('selectableOptions.firstObject')
  , 'selectableOptions'

  ###
  # SELECTION RELATED
  ###
  KEY_EVENTS:
    8:  'deletePressed'
    27: 'escapePressed'
    13: 'enterPressed'
    38: 'upArrowPressed'
    40: 'downArrowPressed'

  # All the selectable options - namely everything except for the non-group
  # options that are artificially created.
  selectableOptions: Ember.computed ->
    (@get('groupedContent') or []).filter (item) ->
      not get(item, 'isGroupOption')
  .property 'groupedContent'

  # The option that is currently highlighted.
  highlighted: Ember.computed (key, value) ->
    content   = @get('selectableOptions') or []
    value     = value or []
    if arguments.length is 1 # getter
      index = @get 'highlightedIndex'
      value = content.objectAt index
    else # setter
      index = content.indexOf value
      @setHighlightedIndex index, yes
    value
  .property 'selectableOptions', 'highlightedIndex'

  bodyClick: -> @hideDropdown()

  keyDown: (event) ->
    # show dropdown if dropdown is not already showing
    return @set('showDropdown', yes) unless @get 'showDropdown'
    map   = @get 'KEY_EVENTS'
    method = map[event.keyCode]
    @get(method)?.apply(this, arguments) if method

  deletePressed: Ember.K

  escapePressed: (event) ->
    @hideDropdown()

  enterPressed: (event) ->
    item = @get 'highlighted'
    @set 'selection', item if item
    @userDidSelect(item) if item
    # in case dropdown doesn't close
    @hideDropdown()
    # TODO(Peter): HACK the web app somehow reloads when enter is pressed.
    event.preventDefault()

  upArrowPressed: (event) ->
    sel   = @get 'highlightedIndex'
    index = if event.ctrlKey or event.metaKey then 0 else sel - 1
    @setHighlightedIndex index, yes
    # we want to prevent the app from scroll when pressing up arrow
    event.preventDefault()

  downArrowPressed: (event) ->
    sel   = @get 'highlightedIndex'
    clen  = @get 'selectableOptions.length'
    index = if event.ctrlKey or event.metaKey then clen - 1 else sel + 1
    @setHighlightedIndex index, yes
    # we want to prevent the app from scroll when pressing down arrow
    event.preventDefault()

  setHighlightedIndex: (index, ensureVisible) ->
    return unless @ensureIndex index
    @set 'highlightedIndex', index
    @ensureVisible index if ensureVisible

  ensureIndex: (index) ->
    clen = @get 'selectableOptions.length'
    index >= 0 and index < clen

  # Scroll the list to make sure the given index is visible.
  ensureVisible: (index) ->
    $listView  = @$('.ember-list-view')
    listView   = Ember.View.views[$listView.attr('id')]
    startIndex = listView._startingIndex()
    numRows    = listView._childViewCount() - 1
    endIndex   = startIndex + numRows
    item       = @get('selectableOptions').objectAt(index)
    newIndex   = @get('groupedContent').indexOf(item)
    if index is 0
      $listView.scrollTop 0
    else if newIndex < startIndex
      $listView.scrollTop newIndex * @get('rowHeight')
    else if newIndex >= endIndex
      $listView.scrollTop (newIndex - numRows + 1.5) * @get('rowHeight')

  #TODO Refactor other parts to use this method to set selection
  userDidSelect: (selection) ->
    @sendAction 'userSelected', selection


Ember.Handlebars.helper('select-component', Ember.Widgets.SelectComponent)
