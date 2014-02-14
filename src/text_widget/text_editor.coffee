Ember.Widgets.TextEditorComponent = Ember.Component.extend
  templateName: 'text_editor'
  selectedFontName: 'Helvetica Neue'
  selectedFontSize: '2'
  selectedForeColor: 'rgb(0, 0, 0)'
  isToolbarVisible: true

  EDITOR_CLASS: 'text-editor'
  PLACEHOLDER_TEXT: 'Click to edit'

  commands: [
    'bold',
    'italic',
    'underline',
    'fontName',
    'fontSize',
    'foreColor',
    'indent',
    'outdent'
    'insertOrderedList',
    'insertUnorderedList',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    'strikeThrough',
  ]

  iframeHeadContents: Ember.computed ->
    """
    <link rel="stylesheet" href="css/addepar-style-guide.css">
    <style>
      html,
      body {
        min-height: 0;
        min-width: 0;
        margin: 0;
        background: transparent;
        font-family: "Helvetica Neue";
      }
      .""" + @EDITOR_CLASS + """ {
        min-height: 100%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        padding: 5px;
      }
      .""" + @EDITOR_CLASS + """:focus {
        outline: none;
      }
      .non-editable {
        display: inline-block;
        padding: 0 5px;
        background-color: #e7e7e7;
        list-style-type: none;
        cursor: pointer;
      }
      [contentEditable=true]:empty:not(:focus):before {
        content: attr(data-ph);
        color: grey;
        font-style: italic;
      }
    </style>
    """
  .property 'EDITOR_CLASS'

  iframeBodyContents: Ember.computed ->
    '<div class="' + @EDITOR_CLASS + '" contenteditable="true" data-ph="' + @PLACEHOLDER_TEXT + '"></div>'
  .property 'EDITOR_CLASS', 'PLACEHOLDER_TEXT'

  getEditor: ->
    @$('iframe.text-editor-frame').contents().find('.' + @EDITOR_CLASS)

  getDocument: ->
    iframe = @$('iframe.text-editor-frame')[0]
    iframe.contentDocument || iframe.contentWindow.document

  # Returns true if the entire range is in the text editor
  inEditor: (range) ->
    @$(range.endContainer).parents().has(range.startContainer).first().closest('.' + @EDITOR_CLASS).length > 0

  isTargetInEditor: (event) ->
    not Ember.isEmpty($(event.target).closest('.' + @EDITOR_CLASS))

  # Return the last child node of the editor
  getOrCreateLastElementInEditor: ->
    editor = @getEditor()[0]
    if editor is `undefined`
      iframe = @$('iframe.text-editor-frame').contents()
      iframe.find('body').append(@get('iframeBodyContents'))
      editor = @getEditor()[0]
    if editor.childElementCount is 0
      # Insert div in text editor if none exists
      @insertHTMLAtRange(@selectElement(editor), "<div></div>")
    return editor.children[editor.children.length - 1]

  didInsertElement: ->
    @_super()
    iframe = @$('iframe.text-editor-frame').contents()
    iframe.find('body').append(@get('iframeBodyContents'))
    iframe.find('head').append(@get('iframeHeadContents'))
    @getDocument().execCommand 'styleWithCSS', true, true

    iframe = @$('iframe.text-editor-frame')[0]
    iframe.contentWindow.onkeyup = (event) =>
      @keyUp(event)
    iframe.contentWindow.onkeydown = (event) =>
      @keyDown(event)
    iframe.contentWindow.onmouseup = (event) =>
      @mouseUp(event)
    iframe.contentWindow.onmousedown = (event) =>
      @mouseDown(event)
    iframe.contentWindow.onclick = (event) =>
      @click(event)

    # Defines commands in @get('commands'), such as fontName and fontSize
    @get('commands').forEach (command) =>
      @set command, (arg) =>
        @getDocument().execCommand command, true, arg
        # We should update the state immediately after executing a command
        @queryCommandState()

  keyUp: (event) ->
    @queryCommandState()

  mouseUp: (event) ->
    @queryCommandState()

  queryCommandState: ->
    idocument = @getDocument()
    @set 'isBold',     idocument.queryCommandState('bold')
    @set 'isItalic',   idocument.queryCommandState('italic')
    @set 'isUnderline',idocument.queryCommandState('underline')

    @set 'isJustifyLeft', idocument.queryCommandState('justifyLeft')
    @set 'isJustifyCenter',   idocument.queryCommandState('justifyCenter')
    @set 'isJustifyRight',idocument.queryCommandState('justifyRight')

    # Font names with spaces need to have the start and end quotes removed
    fontName = idocument.queryCommandValue('fontName') || ''
    @set 'selectedFontName', fontName.replace(/^'/, '').replace(/'$/, '')
    @set 'selectedFontSize', idocument.queryCommandValue('fontSize')
    @set 'selectedForeColor', idocument.queryCommandValue('foreColor')

  click: (event) -> Ember.K
  keyDown: (event) -> Ember.K
  keyUp: (event) -> Ember.K
  mouseDown: (event) -> Ember.K
  mouseUp: (event) -> Ember.K

Ember.Widgets.DomHelper = Ember.Mixin.create
  KEY_CODES:
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

  # Set the selected range to the given element, with the option to collapse the selection to the
  # beginning or end
  #   element       the element to select
  #   collapseMode  "none", "beginning", "end"
  selectElement: (element, collapseMode="end") ->
    # http://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
    if(document.createRange)  # Firefox, Chrome, Opera, Safari, IE 9+
      range = document.createRange()
      # Select the entire contents of the element with the range
      range.selectNodeContents(element)
      if collapseMode != "none"
        # collapse the range to the end point. false means collapse to end rather than the start
        range.collapse(if collapseMode == "beginning" then true else false)
      @activateRange(range)

  activateRange: (range) ->
    selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    return range

  # Wrapper around range.deleteContents that also deletes empty containers in the range
  deleteRange: (range, shouldDeleteContainer=true) ->
    startParent = range.startContainer.parentNode
    endParent = range.endContainer.parentNode
    range.deleteContents()
    if @isEmpty(startParent) and shouldDeleteContainer
      $(startParent).remove()
    if @isEmpty(endParent) and shouldDeleteContainer
      $(endParent).remove()

  # Converts html string to node then inserts at range
  insertHTMLAtRange: (range, html) ->
    @insertElementAtRange(range, @createElementsFromString(html)[0])

  # Inserts node at range
  insertElementAtRange: (range, node) ->
    @deleteRange(range, false)
    range.insertNode(node)
    node

  getCurrentRange: ->
    iframe = @$('iframe.text-editor-frame')[0]
    idocument = iframe.contentDocument || iframe.contentWindow.document
    if idocument.getSelection().rangeCount > 0 then idocument.getSelection().getRangeAt(0) else null

  # Returns true if the element has no child elements and has either 0 child nodes or one child
  # node with nothing in it. Different from jQuery's .is(':empty'), which thinks some empty nodes
  # are not empty
  isEmpty: (element) ->
    return element.children.length == 0 &&
           element.childNodes.length <= 1 &&
           element.childNodes[0]?.length == 0

  createElementsFromString: (string) ->
    $("<div/>").html(string).contents()

  # get the node that is beside the current range on either the left or the right. Empty nodes,
  # or nodes containing only whitespace are ignored
  getNonEmptySideNode: (range, left=true, deep) ->
    nodeIsEmpty = (node) ->
      return node?.nodeValue?.trim().length == 0
    node = range[if left then 'startContainer' else 'endContainer']
    while ((sideNode = node[if left then 'previousSibling' else 'nextSibling']) is null or
    nodeIsEmpty(sideNode)) and !$(node).hasClass(@EDITOR_CLASS)  # not the editor div
      if nodeIsEmpty(sideNode)
        # Ignore this sideNode because it's empty. Go to the next/previous sibling
        node = node[if left then 'previousSibling' else 'nextSibling']
      else
        # Go to the parent because this node doesn't have a side node
        node = node.parentNode
    if deep
      # Deep means go to the deepest element node
      while sideNode?.children?.length > 0
        index = if left then sideNode.children.length - 1 else 0
        sideNode = sideNode.children[index]
    return sideNode

  getCharactersPrecedingCaret: ->
    range = @getCurrentRange()
    return "" if range is null
    range.collapse(true)
    range.setStart(range.startContainer, 0)
    precedingChars = range.toString()
    return precedingChars

  deleteCharactersPrecedingCaret: (length, shouldDeleteContainer=true) ->
    range = @getCurrentRange()
    return "" if range is null
    range.collapse(true)
    range.setStart(range.startContainer, range.endOffset - length)
    @deleteRange(range, shouldDeleteContainer)
