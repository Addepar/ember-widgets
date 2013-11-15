### Addepar custom test helpers ###

# Augment ember-test helpers with our own set of functions that help manipulate
# the DOM and do testing.
#
# Any reference to *built-in* test helpers in this file have to be refered to
# via app.testHelpers.myHelper(...).  You must not pass the app argument to the
# built in helpers because they have been curried with the app as the first
# argument.

_pm_getHeader = -> find('.panel-4')
_pm_getPortfolioLink = -> $("a:contains('Portfolio Views')", _pm_getHeader())
_pm_getTransactionLink = -> $("a:contains('Transaction Views')", _pm_getHeader())
_pm_getFilesLink = -> $("a:contains('Files')", _pm_getHeader())
_pm_getClientAccessSettingsLink = ->
  $("a:contains('Client Access Settings')", _pm_getHeader())
_pm_getSettingsPanel = -> find('.portal-manager-settings-panel-body')
_pm_getSettingsEmailLoginsTab = ->
  pm_getSettingsPanel().find("a:contains('Email Logins')")

_pm_getPortfolioViewRows = ->
  controller = Addepar.__container__.lookup('controller:portalManagerPortfolio')
  controller.get 'bodyContent'
_pm_getTransactionViewRows = ->
  controller = Addepar.__container__.lookup('controller:portalManagerTransaction')
  controller.get 'bodyContent'
_pm_getFileRows = ->
  fileTable = find('.portal-manager-files-container .ember-table-tables-container')
  fileTableView = Ember.View.views[fileTable.attr('id')]
  fileTableView.get 'bodyContent'

_portalAccessButton = -> $('.portal-access-chooser .btn')
_portalAccessModal = -> $('.portal-access-modal')
_portalAccessModalCloseButton = ->
  $('.btn:contains("Close")', portalAccessModal())

_find = (app, selector, context) ->
  context = context or Ember.get(app, 'rootElement')
  app.$(selector, context)

_mouseDown = (app, selector, context) ->
  $element = _find app, selector, context
  Ember.run ->
    $element.mousedown()
  wait app

_isPresent = (app, selector, context) ->
  $element = _find app, selector, context
  $element.length > 0

_isNotPresent = (app, selector, context) ->
  not _isPresent(app, selector, context)

_isVisible = (app, selector, context) ->
  $element = _find app, selector, context
  $element.is(':visible')

_isHidden = (app, selector, context) ->
  not _isVisible(app, selector, context)

_emberReset = ->
  Addepar._readinessDeferrals = 1
  that = Addepar

  Ember.run.join that, ->
    router = this.__container__.lookup('router:main')
    router.reset()

  wait().then ->
    Ember.run.join that, ->
      Ember.run that.__container__, 'destroy'

      that.buildContainer()

      Ember.run.schedule 'actions', that, ->
        that._initialize()
        that.startRouting()

_reset = ->
  wait().then ->
    Ember.Widgets.ModalComponent.hideAll()
    Ember.Widgets.PopoverComponent.hideAll()
    Addepar.Components.AlertComponent.hideAlert()
    # Addepar.reset()
    _emberReset()
    wait()

# Generates a globally unique identifier based on the format outlined in
# http://en.wikipedia.org/wiki/Globally_unique_identifier
_guid = do ->
  # random 4-digit hex segment
  s4 = -> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  # 8 hex digits - 4 digits - 4 digits - 12 digits
  -> "#{s4()}#{s4()}-#{s4()}-#{s4()}-#{s4()}-#{s4()}#{s4()}#{s4()}"

# programmatically drag and drop
_dragAndDrop = (app, element, dx, dy) ->
  Ember.run(element, -> element.simulate('drag', {dx: dx, dy: dy}))
  wait(app)

_isSorted = (app, list, comparator = (x, y) -> x < y) ->
  previous = undefined

  for item in list
    if previous is undefined or comparator(previous, item)
      previous = item
    else
      return no

  return yes

# the popover needs to know where to anchor themselves but ember doesn't pass
# along the event in action helper so we rely on the fact that jquery attaches
# event to window
_openPopover = (app, selector, context) ->
  window.event =
    target: selector.get(0)
    preventDefault: Ember.K
  click selector

# nav helpers
_getCurrentURL = -> Addepar.__container__.lookup('router:main').get('url')
_visitPortfolioAnalysis = -> visit('/app/client/1/portfolio')
_visitTransactionCenter = -> visit('/app/client/1/transaction')
_visitPortalManager = -> visit('/app/client/1/portal')

_visitDefaultPortfolioView = ->
  visitPortfolioAnalysis().then ->
    controller = Addepar.__container__.lookup('controller:portfolioAnalysis')
    controller.set 'selectedView', Addepar.PortfolioView.find('default')

_visitClientPortalViewForCurrentClient = ->
  clientId = getSelectedPerspective().get('id')
  reset().then -> visit("/client/#{clientId}")

# Perspective Helpers
_getContextChooser = -> find('.context-chooser-container')

_getSelectedPerspective = ->
  controller = Addepar.__container__.lookup('controller:application')
  selectedPerspective = controller.get 'selectedPerspective'

_setSelectedPerspective = (app, perspective) ->
  controller = Addepar.__container__.lookup('controller:application')
  controller.set 'selectedPerspective', perspective
  wait()

_selectNewPerspectiveOfType = (app, type) ->
  selectedPerspective = getSelectedPerspective()
  controller = Addepar.__container__.lookup('controller:application')
  perspectives = switch type
    when 'client' then controller.get('clients')
    when 'group' then controller.get('groups')
    when 'entity' then controller.get('entities')
  newPerspective = perspectives.find (perspective) ->
    perspective isnt selectedPerspective
  setSelectedPerspective newPerspective

# Chosen Helpers

# find the first item with the exact matching itemText from a chosen
_findInChosen = (app, element, itemText) ->
  toggleButton = find '.dropdown-toggle', element
  searchBox = find '.ember-select-search input', element
  shouldOpenChosen = isHidden searchBox

  if shouldOpenChosen
    promise = click(toggleButton)
  else
    promise = wait()

  promise.then ->
    fillIn searchBox, itemText
  .then ->
    #Need to use filter to get an exact match
    $('li', element).filter -> $.text([this]).trim() is itemText

_findInMultiChosen = (app, element, itemText) ->
  searchBox = find 'input', element
  fillIn(searchBox, itemText).then ->
    #Need to use filter to get an exact match
    $('li', element).filter -> $.text([this]).trim() is itemText

_selectInMultiChosen = (app, element, itemText) ->
  findInMultiChosen(element, itemText).then (item) ->
    click item

_selectFirstInMultiChosen = (app, element) ->
  searchBox = find 'input', element
  click searchBox
  click $('.ember-select-result-item', element)[0]

# select the first item with the given itemText from a chosen
_selectInChosen = (app, element, itemText) ->
  findInChosen(element, itemText).then (item) ->
    click item

_findInSelect = (app, element, itemText) ->
  toggleButton = find 'a', element
  mouseDown(toggleButton)
  .then ->
    #Need to use filter to get an exact match
    item = $('li', element).filter -> $.text([this]).trim() is itemText
    click item

_getFactorChooser = -> find('.factor-chooser')
_pa_viewChooser = -> find '.save-view-chooser'
_pa_getFirstNonPortalViewName = ->
  pa = Addepar.__container__.lookup('controller:portfolioAnalysis')
  views = pa.get('portfolioViews')
  #Doing this iteratively to avoid materializing all views
  i = 0
  while views.objectAt(i).get('isPortalView')
    i++
  views.objectAt(i).get('displayName')

# Table Helpers
_getTable = -> find('.ember-table-tables-container')

_getTableColumnValues = (app, table, columnIndex) ->
  tableBody = table.find('.ember-table-body-container')
  rightBlock = tableBody.find('.ember-table-right-table-block')
  rows = rightBlock.find('.ember-table-table-row')
  values = rows.map (index, element) ->
    cells = $(element).find('.ember-table-cell')
    $(cells[columnIndex]).text().trim()
  values.toArray().filter (value) -> value isnt ""

# PA Table Helpers

_pa_getTableColumnDropdown = -> find('.popover.dropdown-menu')

_pa_getTableGroupingColumnDropdown = ->
  find('.js-portfolio-table-grouping-column-dropdown')

_pa_getTableGroupingColumn = ->
  _getTable().find('.ember-table-left-table-block')
      .find('.ember-table-header-cell')

_pa_openGroupingColumnDropdown = ->
  openPopover pa_getTableGroupingColumn()

_pa_openGroupingColumnAddFactorPopover = ->
  pa_openGroupingColumnDropdown()
  .then ->
    dropdown = pa_getTableGroupingColumnDropdown()
    click dropdown.find("li:contains('Insert Column Right')")

_pa_columnHeaders = ->
  find('.ember-table-right-table-block .ember-table-header-cell')

_pa_addSimpleColumnFactor = (app, name) ->
  pa_openGroupingColumnAddFactorPopover()
  .then ->
    selectInChosen getFactorChooser(), name

_pa_addDiscreteFilter = (app, name, value) ->
  openPopover(find('.add-filter-button'))
  .then ->
    selectInChosen(find('.filter-chooser .ember-select'), name)
  .then ->
    selectInMultiChosen(find('.filter-editor-view .ember-select'), value)
  .then ->
    # click finish
    factorChooser = find('.filter-chooser')
    finishButton = factorChooser.find('a:contains("Finish")')
    click finishButton

_setOfNonEmptyStrings = (app, elements) ->
  output = {}
  elements.forEach (element) ->
    if element.length > 0
      output[element] = element
  value for key, value of output

Ember.Test.registerHelper 'getContextChooser', _getContextChooser
Ember.Test.registerHelper 'getSelectedPerspective', _getSelectedPerspective
Ember.Test.registerHelper 'setSelectedPerspective', _setSelectedPerspective
Ember.Test.registerHelper 'selectNewPerspectiveOfType', _selectNewPerspectiveOfType

Ember.Test.registerHelper 'getTable', _getTable
Ember.Test.registerHelper 'getTableColumnValues', _getTableColumnValues

Ember.Test.registerHelper 'pa_viewChooser', _pa_viewChooser
Ember.Test.registerHelper 'getFactorChooser', _getFactorChooser
Ember.Test.registerHelper('pa_getFirstNonPortalViewName',
  _pa_getFirstNonPortalViewName)
Ember.Test.registerHelper('pa_getTableGroupingColumnDropdown',
  _pa_getTableGroupingColumnDropdown)
Ember.Test.registerHelper('pa_getTableGroupingColumn',
  _pa_getTableGroupingColumn)
Ember.Test.registerHelper('pa_openGroupingColumnDropdown',
  _pa_openGroupingColumnDropdown)
Ember.Test.registerHelper('pa_openGroupingColumnAddFactorPopover',
  _pa_openGroupingColumnAddFactorPopover)

Ember.Test.registerHelper('pa_getTableColumnDropdown',
  _pa_getTableColumnDropdown)
Ember.Test.registerHelper 'pa_columnHeaders', _pa_columnHeaders
Ember.Test.registerHelper 'pa_addSimpleColumnFactor', _pa_addSimpleColumnFactor
Ember.Test.registerHelper 'pa_addDiscreteFilter', _pa_addDiscreteFilter

Ember.Test.registerHelper 'getCurrentURL', _getCurrentURL
Ember.Test.registerHelper 'visitPortfolioAnalysis', _visitPortfolioAnalysis
Ember.Test.registerHelper 'visitTransactionCenter', _visitTransactionCenter
Ember.Test.registerHelper 'visitPortalManager', _visitPortalManager
Ember.Test.registerHelper 'visitDefaultPortfolioView', _visitDefaultPortfolioView
Ember.Test.registerHelper 'visitClientPortalViewForCurrentClient',
    _visitClientPortalViewForCurrentClient

Ember.Test.registerHelper 'findInChosen', _findInChosen
Ember.Test.registerHelper 'findInMultiChosen', _findInMultiChosen
Ember.Test.registerHelper 'selectInMultiChosen', _selectInMultiChosen
Ember.Test.registerHelper 'selectFirstInMultiChosen', _selectFirstInMultiChosen
Ember.Test.registerHelper 'selectInChosen', _selectInChosen
Ember.Test.registerHelper 'findInSelect', _findInSelect

Ember.Test.registerHelper 'mouseDown', _mouseDown
Ember.Test.registerHelper 'isPresent', _isPresent
Ember.Test.registerHelper 'isNotPresent', _isNotPresent
Ember.Test.registerHelper 'isVisible', _isVisible
Ember.Test.registerHelper 'isHidden', _isHidden
Ember.Test.registerHelper 'isSorted', _isSorted
Ember.Test.registerHelper 'guid', _guid
Ember.Test.registerHelper 'find', _find
Ember.Test.registerHelper 'reset', _reset

Ember.Test.registerHelper 'pm_getHeader', _pm_getHeader
Ember.Test.registerHelper 'pm_getPortfolioLink', _pm_getPortfolioLink
Ember.Test.registerHelper 'pm_getTransactionLink', _pm_getTransactionLink
Ember.Test.registerHelper 'pm_getFilesLink', _pm_getFilesLink
Ember.Test.registerHelper 'pm_getClientAccessSettingsLink', _pm_getClientAccessSettingsLink
Ember.Test.registerHelper 'pm_getSettingsPanel', _pm_getSettingsPanel
Ember.Test.registerHelper 'pm_getSettingsEmailLoginsTab', _pm_getSettingsEmailLoginsTab
Ember.Test.registerHelper 'pm_getPortfolioViewRows', _pm_getPortfolioViewRows
Ember.Test.registerHelper 'pm_getTransactionViewRows', _pm_getTransactionViewRows
Ember.Test.registerHelper 'pm_getFileRows', _pm_getFileRows

Ember.Test.registerHelper('portalAccessButton', _portalAccessButton)
Ember.Test.registerHelper('portalAccessModal', _portalAccessModal)
Ember.Test.registerHelper(
  'portalAccessModalCloseButton', _portalAccessModalCloseButton)
Ember.Test.registerHelper('dragAndDrop', _dragAndDrop)

Ember.Test.registerHelper('openPopover', _openPopover)

Ember.Test.registerHelper 'setOfNonEmptyStrings', _setOfNonEmptyStrings


App.rootElement = '#app'
App.setupForTesting()
App.injectTestHelpers()


module "Text Editor with Non Editable Test",
  teardown: -> App.reset()
  setup: ->
    Ember.run(App, App.advanceReadiness)
    visit('/ember-widgets/textEditor')


insertNonEditableButton = -> find '.insert-non-editable-btn'

insertNonEditable = -> selectInChosen(insertNonEditableButton(), "Today's Date")

selectedRange = -> window.getSelection().getRangeAt(0)

test "Text editor initialization", ->
  textEditor = find '.text-editor'
  equal textEditor.html().trim(), "<div>&nbsp;</div>"

test "Insert non-editable pill in text editor", ->
  expect 3
  insertNonEditable().then ->
    textEditor = find '.text-editor'
    pill = find('span.non-editable', textEditor)
    equal pill.attr('title'), "Today's Date"
    equal pill.attr('data-type'), "Ember.Widgets.TodaysDate"
    notEqual pill.attr('data-pill-id'), null

test "Left arrow selects non-editable pill", ->
  expect 3

  # Given a text editor with a non-editable pill inserted
  insertNonEditable().then ->
    textEditor = find '.text-editor'

    # When the left arrow is pressed immediately after
    e = $.Event('keydown', { keyCode: 37, which: 37 } )
    textEditor.trigger(e)

    # Then the non-editable is selected
    range = selectedRange()
    pill = $('.non-editable')
    equal range.startOffset, 0
    equal range.endOffset, pill.text().length
    equal range.startContainer.parentElement, pill[0]
