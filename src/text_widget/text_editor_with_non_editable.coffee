Ember.Widgets.TextEditorWithNonEditableComponent =
Ember.Widgets.TextEditorComponent.extend Ember.Widgets.PillInsertMixin,
  layoutName: 'text-editor-with-non-editable'

  ##############################################################################
  # Interface
  ##############################################################################
  pillOptions: Ember.A [
    Ember.Widgets.TodaysDatePill
    Ember.Widgets.NonEditableTextPill
  ]
  getInsertSelectController: -> @get('pillChooserInLine')
  INVISIBLE_CHAR:   '\uFEFF'
  INSERT_PILL_CHAR: '='
  insertPillRegex: Ember.computed ->
    new RegExp @INSERT_PILL_CHAR + '[A-Za-z0-9_\+\-]*$', 'gi'
  .property ('INSERT_PILL_CHAR')

  ##############################################################################
  # Properties
  ##############################################################################
  pillId:           0
  mouseDownTarget:  null
  pillHideSearchBox: false
  showConfigPopover: false
  selectedPillOption: null

  isTargetInEditor: (event) ->
    not Ember.isEmpty($(event.target).closest('.' + @EDITOR_CLASS))

  getEditor: ->
    @$('iframe.text-editor-frame').contents().find('.' + @EDITOR_CLASS)

  # Returns true if the entire range is in the text editor
  inEditor: (range) ->
    @$(range.endContainer).
      parents().
      has(range.startContainer).
      first().
      closest('.' + @EDITOR_CLASS).
      length > 0

  _getPillFromElement: (pillElement) ->
    # Deserialize the pillElement into a pill object
    data = $(pillElement).data()
    return unless data.type
    params = {}
    for key, value of data
      params[key] = value
    Ember.get(data.type).create({'textEditor': this, 'params': params})

  _getElementFromPill: (pill) ->
    pillId = pill.get('params.pillId')
    @getEditor().find('.non-editable[data-pill-id="' + pillId + '"]')

  serialize: ->
    raw_html = @getEditor().html()
    div = $('<div/>').html(raw_html)
    $('.non-editable', div).empty()
    return div.html()

  updateNonEditablePillContent: ->
    pillElements = @getEditor().find('.non-editable[data-pill-id]')
    for pillElement in pillElements
      pill = @_getPillFromElement(pillElement)
      return unless pill
      $(pillElement).text(pill.result())

  getNewPillId: ->
    @incrementProperty 'pillId'

  updatePill: (pill) ->
    # TODO: allow updating pill params
    pillElement = @_getElementFromPill(pill)
    $(pillElement).text(pill.result())

  insertPill: (pill) ->
    iframeDocument = @getDocument()
    precedingCharacters = @getCharactersPrecedingCaret(this.getEditor()[0])
    matches = precedingCharacters.match @get('insertPillRegex')
    if matches
      # Inserting via key, so we need to replace the characters before
      @deleteCharactersPrecedingCaret(matches[0].length, false)
    # Ensure that we insert the factor in the text editor (move the range inside the editor if
    # not already)
    range = @getCurrentRange()
    if not range or not @inEditor(range)
      selection = iframeDocument.getSelection()
      selection.removeAllRanges()
      range = iframeDocument.createRange()
      range.selectNodeContents iframeDocument.body.firstChild
      selection.addRange range

    factor = @insertElementAtRange(range, pill.render())

    @getEditor().focus()
    selection = iframeDocument.getSelection()
    selection.removeAllRanges()
    range = iframeDocument.createRange()
    range.setStartAfter( factor )
    range.collapse()
    selection.addRange( range )

  configurePill: ($pill) ->
    pillClass = $pill.attr('data-type')
    selectedPillOption = Ember.get(window, pillClass).create
      textEditor: this
      params:
        text: $pill.text()
        pillId: $pill.attr('data-pill-id')
    selectedPillOption.configure()

  _showPillConfig: (query) ->
    @set 'showConfigPopover', true
    @set 'pillHideSearchBox', true
    @set 'query', query

  _hidePillConfig: ->
    @set 'showConfigPopover', false
    @set 'pillHideSearchBox', false
    @set 'query', null

  _handlePillConfig: ->
    # Show or hide the pill config component depending on the characters
    # preceding the cursor
    precedingCharacters = @getCharactersPrecedingCaret(this.getEditor()[0])
    matches = precedingCharacters.match @get('insertPillRegex')
    if matches
      query = matches[0].split(" ").reverse()[0].slice(1)
      @_showPillConfig(query)
    else
      @_hidePillConfig()

  keyDown: (event) ->
    keyCode = event.keyCode

    if @showConfigPopover
      insertSelect = @getInsertSelectController()
      if keyCode == @KEY_CODES.DOWN
        return insertSelect.downArrowPressed(event)
      else if keyCode == @KEY_CODES.UP
        return insertSelect.upArrowPressed(event)
      else if keyCode in [@KEY_CODES.ENTER, @KEY_CODES.TAB] and insertSelect.get('preparedContent').length > 0
        return insertSelect.enterPressed(event)
      else if keyCode == @KEY_CODES.ESCAPE
        return insertSelect.escapePressed(event)

  keyUp: (event) ->
    return unless @isTargetInEditor(event)

    unless event.keyCode == @KEY_CODES.ESCAPE
      @_handlePillConfig()
      @_super.apply this, arguments

  click: (event) ->
    $target = $(event.target)
    if $target.attr('contentEditable') == "false" and $target.hasClass('configurable')
      @configurePill $target
