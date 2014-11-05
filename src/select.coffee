# The view for each item in the select.
Ember.Widgets.SelectOptionView = Ember.ListItemView.extend
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

Ember.Widgets.SelectComponent =
Ember.Component.extend Ember.Widgets.BodyEventListener,
Ember.AddeparMixins.ResizeHandlerMixin,
  layoutName:         'select'
  classNames:         'ember-select'
  attributeBindings:  Ember.A ['tabindex']
  classNameBindings:  Ember.A ['showDropdown:open', 'isDropup:dropup']
  itemViewClass:      'Ember.Widgets.SelectOptionView'
  prompt:             'Select a Value'
  placeholder:        undefined
  disabled: no

  # we need to set tabindex so that div responds to key events
  highlightedIndex: -1

  tabindex: -1

  showDropdown: no

  dropdownHeight: 300
  # Important: rowHeight must be synched with the CSS
  rowHeight: 26
  # Option to indicate whether we should sort the labels
  sortLabels: yes
  # Use title on labels, containing content of the labels
  titleOnOptions: no
  # If isSelect is true, we will not show the search box
  isSelect: no

  # Align dropdown-menu above the button
  isDropup: no
  # Align dropdown-menu to the right of the button
  isDropdownMenuPulledRight: no

  # Change the icon when necessary
  dropdownToggleIcon: 'fa fa-caret-down'

  # Change the button class when necessary
  buttonClass: 'btn btn-default'

  dropdownMenuClass: ''

  # The list of options
  content: Ember.A []
  selection: null
  query: ''
  optionLabelPath: ''
  optionValuePath: ''
  optionGroupPath: ''
  optionDefaultPath: ''

  # This augments the dropdown to provide a place for adding a select menu that
  # possibly says 'create item' or something along that line
  selectMenuView: null

  updateDropdownLayout: Ember.observer ->
    return if (@get('_state') or @get('state')) isnt 'inDOM' or @get('showDropdown') is no

    # Render the dropdown in a hidden state to get the size
    @$('.js-dropdown-menu').css('visibility', 'hidden');

    # Render the dropdown completely into the DOM for offset()
    dropdownButton = @$('.js-dropdown-toggle')[0]
    dropdownButtonHeight = @$(dropdownButton).outerHeight()
    dropdownButtonOffset = @$(dropdownButton).offset()

    dropdownMenu = @$('.js-dropdown-menu')[0]
    dropdownMenuHeight = @$(dropdownMenu).outerHeight()
    dropdownMenuWidth = @$(dropdownMenu).outerWidth()
    dropdownMenuOffset = @$(dropdownMenu).offset()

    # Only switch from dropUp to dropDown if there's this much extra space
    # under where the dropDown would be. This prevents the popup from jiggling
    # up and down
    dropdownMargin = 15

    if @get('isDropup')
      dropdownMenuBottom = dropdownButtonOffset.top + dropdownButtonHeight +
        dropdownMenuHeight + dropdownMargin
    else
      dropdownMenuBottom = dropdownMenuOffset.top + dropdownMenuHeight

    # regardless of whether it is dropping up or down, we want to know
    # where dropUp will put the top since we don't want this to fall
    # above the top of the screen
    dropupMenuTop = dropdownButtonOffset.top - dropdownMenuHeight -
      dropdownMargin

    @set 'isDropup', dropupMenuTop > window.scrollY and
      dropdownMenuBottom > window.innerHeight
    @set 'isDropdownMenuPulledRight', dropdownButtonOffset.left +
      dropdownMenuWidth + dropdownMargin > window.innerWidth

    @$('.js-dropdown-menu').css('visibility', 'visible');
  , 'showDropdown'

  onResizeEnd: ->
    # We need to put this on the run loop, because the resize event came from
    # the window. Otherwise, we get a warning when used in the tests. You have
    # turned on testing mode, which disables the run-loop's autorun. You
    # will need to wrap any code with asynchronous side-effects in an Ember.run
    Ember.run this, @updateDropdownLayout

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
    Ember.get @get('selection'), @get('optionLabelPath')
  .property 'selection', 'optionLabelPath'

  searchView: Ember.TextField.extend
    placeholder: Ember.computed.alias 'parentView.placeholder'
    valueBinding: 'parentView.query'
    # we want to focus on search input when dropdown is opened. We need to put
    # this in a run loop to wait for the event that triggers the showDropdown
    # to finishes before trying to focus the input. Otherwise, focus when be
    # "stolen" from us.
    showDropdownDidChange: Ember.observer ->
      Ember.run.schedule 'afterRender', this, ->
          @$().focus() if (@get('_state') or @get('state')) is 'inDOM'
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
  preparedContent: Ember.computed ->
    if @get('sortLabels') then @get('sortedFilteredContent') else @get('filteredContent')
  .property 'sortLabels', 'filteredContent', 'sortedFilteredContent'

  contentProxy: Ember.computed ->
    matcher = (searchText, item) => @matcher(searchText, item)
    optionLabelPath = @get('optionLabelPath')
    query = @get('query')

    ContentProxy = Ember.ObjectProxy.extend
      filteredContent:  Ember.computed ->
        (@get('content') or []).filter (item) ->
          matcher(query, item)
      .property("content.@each.#{optionLabelPath}")

      sortedFilteredContent: Ember.computed ->
        _.sortBy @get('filteredContent'), (item) =>
          Ember.get(item, optionLabelPath)?.toLowerCase()
      .property("filteredContent")

    ContentProxy.create
      content: @get('content')
  .property 'content', 'optionLabelPath', 'query'

  filteredContent: Ember.computed.alias 'contentProxy.filteredContent'
  sortedFilteredContent: Ember.computed.alias 'contentProxy.sortedFilteredContent'

  # the list of content that is grouped by the content in the optionGroupPath
  # e.g. {name: 'Addepar', location: 'Mountain View'}
  #      {name: 'Google', location: 'Mountain View'}
  # if we group by location we will get
  # Mountain View
  #   Addepar
  #   Google
  groupedContent: Ember.computed ->
    path    = @get 'optionGroupPath'
    content = @get 'preparedContent'
    return content unless path
    groups  = _.groupBy content, (item) -> Ember.get(item, path)
    result  = Ember.A()
    _.keys(groups).sort().forEach (key) ->
      result.pushObject  Ember.Object.create isGroupOption: yes, name:key
      result.pushObjects groups[key]
    result
  .property 'preparedContent', 'optionGroupPath', 'labels.[]'

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
      if valuePath then Ember.get(selection, valuePath) else selection
  .property 'selection'

  didInsertElement: ->
    @_super()
    @setDefaultSelection()

  # It matches the item label with the query. This can be overrideen for better
  matcher: (searchText, item) ->
    return yes unless searchText
    label = Ember.get(item, @get('optionLabelPath'))
    escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    regex = new RegExp(escapedSearchText, 'i')
    regex.test(label)

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
    if @get('showDropdown')
      highlighted = @get('highlighted')
      if not @get('selectableOptions').contains(highlighted)
        @set 'highlighted', @get('selectableOptions.firstObject')
  , 'selectableOptions', 'showDropdown'

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
    Ember.A(
      (@get('groupedContent') or []).filter (item) ->
        not Ember.get(item, 'isGroupOption')
    )
  .property 'groupedContent'

  # The option that is currently highlighted.
  highlighted: Ember.computed (key, value) ->
    content   = @get('selectableOptions') or Ember.A []
    value     = value or Ember.A []
    if arguments.length is 1 # getter
      index = @get 'highlightedIndex'
      value = content.objectAt index
    else # setter
      index = content.indexOf value
      @setHighlightedIndex index, yes
    value
  .property 'selectableOptions', 'highlightedIndex'

  bodyClick: -> @send 'hideDropdown'

  keyDown: (event) ->
    # show dropdown if dropdown is not already showing
    return @set('showDropdown', yes) unless @get 'showDropdown'
    map   = @get 'KEY_EVENTS'
    method = map[event.keyCode]
    @get(method)?.apply(this, arguments) if method

  deletePressed: Ember.K

  escapePressed: (event) ->
    @send 'hideDropdown'

  enterPressed: (event) ->
    item = @get 'highlighted'
    @set 'selection', item unless Ember.isEmpty(item)
    @userDidSelect(item) unless Ember.isEmpty(item)
    # in case dropdown doesn't close
    @send 'hideDropdown'
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
    return unless listView
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

  actions:
    toggleDropdown: (event) ->
      return if @get('disabled')
      @toggleProperty 'showDropdown'

    hideDropdown: (event) ->
      return if @get('isDestroyed') or @get('isDestroying')
      @set 'showDropdown', no

Ember.Handlebars.helper('select-component', Ember.Widgets.SelectComponent)
