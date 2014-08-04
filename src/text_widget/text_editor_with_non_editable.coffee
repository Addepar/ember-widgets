Ember.Widgets.TextEditorWithNonEditableComponent =
Ember.Widgets.TextEditorComponent.extend Ember.Widgets.DomHelper, Ember.Widgets.PillInsertMixin,
  templateName: 'text-editor-with-non-editable'

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

  _getCurrentCaretContainer: (range) ->
    return $(range?.startContainer.parentElement).closest('.non-editable-caret')

  getNewPillId: ->
    @incrementProperty 'pillId'

  updatePill: (pill) ->
    # TODO: allow updating pill params
    pillElement = @_getElementFromPill(pill)
    $(pillElement).text(pill.result())

  insertPill: (pill) ->
    precedingCharacters = @getCharactersPrecedingCaret(this.getEditor()[0])
    matches = precedingCharacters.match @get('insertPillRegex')
    if matches
      # Inserting via key, so we need to replace the characters before
      @deleteCharactersPrecedingCaret(matches[0].length, false)
    # Ensure that we insert the factor in the text editor (move the range inside the editor if
    # not already)
    range = @getCurrentRange()
    if not range or not @inEditor(range)
      if not (range = @getCurrentRange()) or not @inEditor(range)
        @selectElement(@getOrCreateLastElementInEditor())
      range = @getCurrentRange()

    existingNonEditable = this._getNonEditableParent(range.startContainer) || this._getNonEditableParent(range.endContainer)
    existingNonEditable?.remove()
    factor = @insertElementAtRange(range, pill.render())
    caretContainer = @_insertCaretContainer(factor, false)

    # Set cursor to the end of the caret container just created
    @selectElement(caretContainer)
    # Remove other caret containers, excluding the one we just selected
    @_removeCaretContainers()

    # Move cursor
    @_moveSelection()

    # Wrap text in div
    @_wrapText()

    # select the caret container again (which has probably been moved)
    @getEditor().focus()
    @selectElement(factor.nextSibling)

  _isNonEditable: (node) ->
    not Ember.isEmpty($(node).closest('.non-editable'))

  # Get the non editable node, if any, to the left of the current range
  # Node: https://developer.mozilla.org/en-US/docs/Web/API/Node
  # Range: https://developer.mozilla.org/en-US/docs/Web/API/range
  _getNonEditableOnLeft: (deep=false) ->
    return unless (currentRange = @getCurrentRange()) and leftNode = @getNonEmptySideNode(currentRange, true, deep)

    if currentRange.startOffset == 0 && @_isNonEditable(leftNode)
      return leftNode
    else if currentRange.startOffset == 1 && @_isNonEditable(leftNode) and
    currentRange.startContainer.nodeValue?.charAt(0) == @INVISIBLE_CHAR
      # i.e. we are in a non-editable caret container
      return leftNode

  # Get the non editable node, if any, to the right of the current range
  # Node: https://developer.mozilla.org/en-US/docs/Web/API/Node
  # Range: https://developer.mozilla.org/en-US/docs/Web/API/range
  _getNonEditableOnRight: (deep=false) ->
    return unless (currentRange = @getCurrentRange()) and rightNode = @getNonEmptySideNode(currentRange, false, deep)

    endContainer = currentRange.endContainer
    if currentRange.endOffset == endContainer.length && @_isNonEditable(rightNode)
      return rightNode
    else if currentRange.endOffset == endContainer.length - 1 and
    endContainer.nodeValue.charAt(endContainer.nodeValue.length - 1) == @INVISIBLE_CHAR and
    @_isNonEditable(rightNode)
      return rightNode

  _isRangeWithinNonEditable: (range) ->
    $startNode = $(range.startContainer.parentNode)
    $endNode = $(range.endContainer.parentNode)
    $startNode.hasClass('non-editable') && $endNode.hasClass('non-editable') && $startNode[0] == $endNode[0]

  _getNonEditableParent: (node) ->
    while node
      if $(node).hasClass('non-editable')
        return node
      node = node.parentElement

  # Inserts a "caret container" next to the target node
  # Used to allow users to type next to a non-editable element (i.e. the non editable pill).
  # Otherwise when the user tries to type text preceding or following a non-editable element, the
  # text will appear in the non-editable element. The caret container gives us a place to
  # temporarily put the cursor.
  _insertCaretContainer: (target, before) ->
    caretContainer = @createElementsFromString('<span class="non-editable-caret">' + @INVISIBLE_CHAR + '</span>')[0]
    if (before)
      $(caretContainer).insertBefore(target)
    else
      $(caretContainer).insertAfter(target)
    return caretContainer

  _removeCaretContainer: (caretContainer) ->
    if caretContainer.parentElement.innerHTML == '<span class="non-editable-caret">' + @INVISIBLE_CHAR + '</span>'
      return $(caretContainer.parentElement).html('<br>')  # chrome specific
    if (child = caretContainer.childNodes[0]) && child.nodeValue.charAt(0) == @INVISIBLE_CHAR
      child = child.deleteData(0, 1)
    savedSelection = rangy.saveSelection(@$('iframe.text-editor-frame')[0].contentWindow)
    contents = $(caretContainer).contents()
    $(caretContainer).replaceWith(contents)
    rangy.restoreSelection(savedSelection)

  _removeCaretContainers: ->
    range = @getCurrentRange()
    currentCaretContainer = @_getCurrentCaretContainer(range)
    while (caretContainer = @getEditor().find('.non-editable-caret').not(currentCaretContainer)[0])
      if caretContainer.parentElement.innerHTML == '<span class="non-editable-caret">' + @INVISIBLE_CHAR + '</span>'
        $(caretContainer.parentElement).html('<br>')  # chrome specific
        continue
      child = caretContainer.childNodes[0]
      if child && child.nodeValue?.charAt(0) == @INVISIBLE_CHAR
        child = child.deleteData(0, 1)
      # via http://stackoverflow.com/questions/170004/how-to-remove-only-the-parent-element-and-not-its-child-elements-in-javascript
      contents = $(caretContainer).contents()
      $(caretContainer).replaceWith(contents)
      caretContainer.childNodes[caretContainer.childNodes.length-1]

  _moveSelection: ->
    # Move the cursor (selection) to a non editable caret if a pill has just
    # been inserted, remove non editable carets as needed, and expand selection
    # to the entire pill if selected.
    hasSideContent = (range, element, left) ->
      container = range.startContainer
      offset = range.startOffset

      if container.nodeType == 3  # i.e. TEXT_NODE (see https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType)
        len = container.nodeValue.length
        if (offset > 0 && offset < len) || (if left then offset == len else offset == 0)
          return
      return element

    @_removeCaretContainers()
    return unless currentRange = @getCurrentRange()

    isCollapsed = currentRange.collapsed
    nonEditableStart = @_getNonEditableParent(currentRange.startContainer)
    nonEditableEnd = @_getNonEditableParent(currentRange.endContainer)
    parentCaret = @_getCurrentCaretContainer(currentRange)

    if nonEditableStart || nonEditableEnd
      if currentRange.collapsed
        if (element = hasSideContent(currentRange, nonEditableStart || nonEditableEnd, true))
          caretContainer = @_insertCaretContainer(element, true)
        else if (element = hasSideContent(currentRange, nonEditableStart || nonEditableEnd, false))
          caretContainer = @_insertCaretContainer(element, false)

        if caretContainer
          # place cursor at end of caret unless the caret is the first child
          collapse = if $(caretContainer).is(":first-child") then "beginning" else "end"
          @selectElement(caretContainer, collapse)
          return

      # We are in the middle of a non editable (either collapsed or not). Select the entire non-
      # editable if part is selected. This includes the case where multiple non-editables and
      # parts are selected.
      if nonEditableStart
        currentRange.setStartBefore(nonEditableStart)
      if nonEditableEnd
        currentRange.setEndAfter(nonEditableEnd)
      selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(currentRange)
    else if parentCaret?.length > 0 and !@_isNonEditable(@getNonEmptySideNode(currentRange, true)) and
    !@_isNonEditable(@getNonEmptySideNode(currentRange, false))
      @_removeCaretContainer(parentCaret[0])

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
    return unless @isTargetInEditor(event)

    handleLeftNodeCase = =>
      if leftNode
        if keyCode == @KEY_CODES.LEFT and isCollapsed
          @selectElement(leftNode, "none")
          event.preventDefault()
        else if keyCode == @KEY_CODES.BACKSPACE
          @selectElement(leftNode, "none")
      else if leftNodeDeep and keyCode == @KEY_CODES.BACKSPACE
        # This happens when the last node on the previous line is a non-editable
        @_insertCaretContainer(leftNodeDeep, false)

    handleRightNodeCase = =>
      if rightNode
        if keyCode == @KEY_CODES.DELETE
          @selectElement(rightNode, "none")
        else if keyCode == @KEY_CODES.RIGHT and isCollapsed
          @selectElement(rightNode, "none")
          event.preventDefault()
      else if rightNodeDeep and keyCode == @KEY_CODES.DELETE and not rightNode
        # This happens when the first node on the next line is a non-editable
        @_insertCaretContainer(rightNodeDeep, true)

    isCharacter = (keyCode) ->
      return keyCode >= 48 && keyCode <= 90 or   # [0-9a-z]
             keyCode >= 96 && keyCode <= 111 or  # num pad characters
             keyCode >= 186 && keyCode <= 222    # punctuation

    keyCode = event.keyCode

    if @showConfigPopover
      insertSelect = @getInsertSelectController()
      if keyCode == @KEY_CODES.DOWN
        return insertSelect.downArrowPressed(event)
      else if keyCode == @KEY_CODES.UP
        return insertSelect.upArrowPressed(event)
      else if keyCode in [@KEY_CODES.ENTER, @KEY_CODES.TAB] and insertSelect.get('filteredContent').length > 0
        return insertSelect.enterPressed(event)
      else if keyCode == @KEY_CODES.ESCAPE
        return insertSelect.escapePressed(event)

    @_moveSelection()
    range = @getCurrentRange()
    isCollapsed = range.collapsed

    startElement = range.startContainer
    endElement = range.endContainer
    nonEditableParent = @_isNonEditable(startElement) || @_isNonEditable(endElement)
    leftNode = @_getNonEditableOnLeft()
    rightNode = @_getNonEditableOnRight()
    leftNodeDeep = @_getNonEditableOnLeft(true)
    rightNodeDeep = @_getNonEditableOnRight(true)

    if (event.metaKey || event.ctrlKey) && keyCode not in [@KEY_CODES.DELETE, @KEY_CODES.BACKSPACE]
      return

    if isCharacter(keyCode) or keyCode == @KEY_CODES.BACKSPACE or keyCode == @KEY_CODES.DELETE
      if (leftNode || rightNode) and !isCollapsed
        caret = @_insertCaretContainer(leftNode || rightNode, if leftNode then false else true)
        @deleteRange(range)
        @selectElement(caret)
      else if nonEditableParent
        @deleteRange(range)  # special delete in case a non-editable is selected

      if (keyCode == @KEY_CODES.BACKSPACE || keyCode == @KEY_CODES.DELETE) && !isCollapsed && nonEditableParent
        # We already performed the delete action
        return event.preventDefault()

    handleLeftNodeCase()
    handleRightNodeCase()

  _wrapText: ->
    # move things around so that all text are within divs
    # This can only happen on mouse up and key up so that font style selections
    # are saved
    $editor = @getEditor()
    savedSelection = rangy.saveSelection(@$('iframe.text-editor-frame')[0].contentWindow)
    contents = $editor.contents()
    @wrapInDiv(contents)
    rangy.restoreSelection(savedSelection)

  keyUp: (event) ->
    return unless @isTargetInEditor(event)
    @_moveSelection()
    @_wrapText()

    unless event.keyCode == @KEY_CODES.ESCAPE
      @_handlePillConfig()
      @_super()

  mouseDown: (event) ->
    return unless @isTargetInEditor(event)
    @mouseDownTarget = event.target  # Save mousedown target for use in mouseup handler
    @_moveSelection()

  mouseUp: (event) ->
    return unless @isTargetInEditor(event)
    @_moveSelection()  # expand selection if only part of a non-editable was selected
    @_wrapText()

    currentRange = @getCurrentRange()
    if @_isNonEditable(event.target) and event.target == @mouseDownTarget and @_isRangeWithinNonEditable(currentRange)
      # This prevents the user from putting the cursor within a non-editable that was previously selected
      @selectElement(event.target, "none")
      event.preventDefault()
    @_super()

  click: (event) -> Ember.K
