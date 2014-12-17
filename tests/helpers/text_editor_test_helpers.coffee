Ember.Widgets.TestHelpers = Ember.Widgets.TestHelpers || Ember.Namespace.create()
Ember.Widgets.TestHelpers.TextEditor = Ember.Widgets.TestHelpers.TextEditor || Ember.Namespace.create()

KEY_CODES =
  BACKSPACE: 8,
  DELETE: 46,
  DOWN: 40,
  ENTER: 13,
  LEFT: 37,
  RIGHT: 39,
  SPACEBAR: 32,
  TAB: 9,
  UP: 38,
  ESCAPE: 27


Ember.Widgets.TestHelpers.TextEditor =
  ###############################################################################
  # Object Helpers
  ###############################################################################
  getInsertNonEditableButton: ->
    find('.insert-non-editable-btn')[0]
  getTextEditor: ->
    find('iframe.text-editor-frame').contents().find('.text-editor')
  getTextEditorComponent: ->
    id = $('iframe.text-editor-frame').parent()[0].id
    Ember.View.views[id]

  ###############################################################################
  # Selection / Range Helpers
  ###############################################################################
  getInnerDocument: ->
    $iframe = find 'iframe.text-editor-frame'
    iframe = $iframe[0]
    iframe.contentDocument || iframe.contentWindow.document
  getSelection: ->
    @getInnerDocument().getSelection()  # TODO: check browser compatibility
  getCurrentRange: ->
    currentSelection = @getSelection()
    if currentSelection.rangeCount > 0 then currentSelection.getRangeAt(0) else null
  createNewRange: -> document.createRange()  # TODO: browser compatability
  activateRange: (range) ->
    selection = @getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    return range

  ###############################################################################
  # Actions
  ###############################################################################
  insertNonEditableDatePill: ->
    selectInChosen(@getInsertNonEditableButton(), "Today's Date")
  insertNonEditableTextPill: (text="foobar") ->
    selectInChosen(@getInsertNonEditableButton(), "Custom Text").then ->
      fillIn(find('.modal input', 'body'), text).then ->
        click find("button:contains('Insert')", 'body')
  placeCursorAtEndOfTextEditor: ->
    range = @createNewRange()
    editor = @getTextEditor()[0]
    range.selectNodeContents(editor.firstChild)
    range.collapse false  # collapse to end of range
    @activateRange(range)
  placeCursorInTextEditor: ->
    range = @createNewRange()
    # Select the entire contents of the element with the range
    element = @getTextEditor().find('.non-editable-caret')[0]
    range.selectNodeContents(element)
    range.collapse(true)
    @activateRange(range)
  selectNodeInTextEditor: (node, startOffset=0, endOffset=-1) ->
    range = @createNewRange()
    if node.nodeType == 1  # element node
      node_length = node.childNodes.length
    else if node.nodeType == 3  # text node
      nodeLength = node.length
    else  # no support for other kinds of nodes, just collapse to beginning
      endOffset = 0
    endOffset = if endOffset >= 0 then endOffset else node.length
    range.selectNodeContents(node)
    range.setStart(node, startOffset)
    range.setEnd(node, endOffset)
    @activateRange(range)
  selectIdInTextEditor: (eid, startOffset, endOffset) ->
    element = @getTextEditor().find('#' + eid)[0].childNodes[0]
    @selectNodeInTextEditor(element, startOffset, endOffset)
  placeCursorAfterElementInTextEditor: (eid, startOffset=0, endOffset=0) ->
    range = @createNewRange()
    # Select the entire contents of the element with the range
    element = @getTextEditor().find('#' + eid)[0].childNodes[0]
    range.selectNodeContents(element)
    range.collapse(false)
    @activateRange(range)
  selectMatchingTextInTextEditor: (text) ->
    innerSelect = (node, pat) =>
      pat = pat.toLowerCase()
      if node.nodeType is 3
        pos = node.data.toLowerCase().indexOf(pat)
        if pos >= 0
          range = @createNewRange()
          range.setStart(node, pos)
          range.setEnd(node, pos + pat.length)
          return @activateRange(range)
      else if node.nodeType is 1 and node.childNodes and not /(script|style)/i.test(node.tagName)
        i = 0
        while i < node.childNodes.length
          childNode = node.childNodes[i++]
          range = innerSelect(childNode, pat)
          return range if range isnt null
      return null
    innerSelect(@getTextEditor()[0], text)
  sendKeyEventToTextEditor: (eventType, keyCode) ->
    keyEvent('.text-editor', @getInnerDocument(), eventType, keyCode)
  typeKeyInTextEditor: (keyCode) ->
    char = String.fromCharCode(keyCode).toLowerCase()
    @sendKeyEventToTextEditor('keydown', keyCode).then =>
      if keyCode is KEY_CODES.BACKSPACE
        @getInnerDocument().execCommand('Delete', false, null)
      else if keyCode is KEY_CODES.DELETE
        @getInnerDocument().execCommand('ForwardDelete', false, null)
      else if keyCode is KEY_CODES.LEFT or keyCode is KEY_CODES.RIGHT
        # Do nothing
      else if typeof (char) is "string"
        range = @getCurrentRange() or @createNewRange()

        if range.startContainer.nodeType is 3 and range.collapsed
          range.startContainer.insertData range.startOffset, char
          range.setStart range.startContainer, range.startOffset + 1
          range.collapse true
          @activateRange(range)
        else
          node = @getInnerDocument().createTextNode(char)
          range.insertNode node
          range.setStart(node, 1)
          range.collapse true
          @activateRange(range)
      @sendKeyEventToTextEditor('keypress', keyCode)
    .then =>
      @sendKeyEventToTextEditor('keyup', keyCode)
  typeCharInTextEditor: (char) ->
    charCode = char.toUpperCase().charCodeAt(0)
    @typeKeyInTextEditor(charCode)
