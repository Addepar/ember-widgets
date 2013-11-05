# TODO(Peter): support queryCommandState
Ember.Widgets.TextEditorComponent = Ember.Component.extend
  templateName: 'text_editor'
  selectedFontName: 'Arial'
  selectedFontSize: '2'

  EDITOR_CLASS: 'text-editor'

  beginEditing: Ember.K
  endEditing: Ember.K

  commands: [
    'bold',
    'italic',
    'underline',
    'fontName',
    'fontSize',
    'indent',
    'outdent'
    'insertOrderedList',
    'insertUnorderedList',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    'strikeThrough',
  ]

  fontNames: [
    'Arial',
    'Calibri',
    'Cambria',
    'Comic Sans MS',
    'Consolas',
    'Corsiva',
    'Courier New',
    'Droid Sans',
    'Droid Serif',
    'Georgia',
    'Impact',
    'Sans Serif',
    'Serif',
    'Syncopate',
    'Times New Roman',
    'Trebuchet MS',
    'Ubuntu',
    'Verdana'
  ]

  fontSizes: [
    {size:'1', name: '8'},
    {size:'2', name: '10'},
    {size:'3', name: '12'},
    {size:'4', name: '14'},
    {size:'5', name: '18'},
    {size:'6', name: '24'},
    {size:'7', name: '36'}
  ]

  # Returns true if the entire range is in the text editor
  inEditor: (range) ->
    $(range.endContainer).parents().has(range.startContainer).first().closest('.' + @EDITOR_CLASS).length > 0

  isTargetInEditor: (event) ->
    not Ember.isEmpty($(event.target).closest('.' + @EDITOR_CLASS))

  # Return the last child node of the editor. Does not handle multiple text editors
  getLastElementInEditor: ->
    editor = $('.' + @EDITOR_CLASS)[0]
    unless editor.childElementCount > 0
      # Insert div in text editor if none exists
      @insertHTMLAtRange(@selectElement(editor), "<div>&nbsp;</div>")
    return editor.children[editor.children.length - 1]

  onSelectedFontNameDidChange: Ember.observer ->
    @fontName @get('selectedFontName')
  , 'selectedFontName'

  onSelectedFontSizeDidChange: Ember.observer ->
    @fontSize @get('selectedFontSize')
  , 'selectedFontSize'

  init: ->
    @_super()
    document.execCommand 'styleWithCSS', true, true
    @get('commands').forEach (command) =>
      @set command, (arg) ->
        return unless event
        event.preventDefault()
        arg = arg or $(event.target).attr('data-editor-value')
        @beginEditing()
        document.execCommand command, true, arg
        @endEditing()

  keyUp: (event) ->
    @queryCommandState()

  mouseUp: (event) ->
    @queryCommandState()

  queryCommandState: ->
    @set 'isBold',     document.queryCommandState('bold')
    @set 'isItalic',   document.queryCommandState('italic')
    @set 'isUnderline',document.queryCommandState('underline')

    @set 'isJustifyLeft', document.queryCommandState('justifyLeft')
    @set 'isJustifyCenter',   document.queryCommandState('justifyCenter')
    @set 'isJustifyRight',document.queryCommandState('justifyRight')

    @set 'selectedFontName', document.queryCommandValue('fontName')
    @set 'selectedFontSize', document.queryCommandValue('fontSize')

Ember.Widgets.DomHelper = Ember.Mixin.create
  KEY_CODES: {
    BACKSPACE: 8,
    DELETE: 46,
    DOWN: 40,
    ENTER: 13,
    LEFT: 37,
    RIGHT: 39,
    SPACEBAR: 32,
    TAB: 9,
    UP: 38
  }

  # Set a range in the given element
  #   element       the element to select
  #   collapseMode  "none", "beginning", "end"
  selectElement: (element, collapseMode="end") ->
    # http://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
    if(document.createRange)  # Firefox, Chrome, Opera, Safari, IE 9+
      # Create a range (a range is a like the selection but invisible)
      range = document.createRange()
      # Select the entire contents of the element with the range
      range.selectNodeContents(element)
      if collapseMode != "none"
        # collapse the range to the end point. false means collapse to end rather than the start
        range.collapse(if collapseMode == "beginning" then true else false)
      selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      return range
    else if(document.selection) # IE 8 and lower
      # Create a range (a range is a like the selection but invisible)
      range = document.body.createTextRange()
      # Select the entire contents of the element with the range
      range.moveToElementText(element)
      if collapseMode != "none"
        # collapse the range to the end point. false means collapse to end rather than the start
        range.collapse(if collapseMode == "beginning" then true else false)
      # Select the range (make it the visible selection)
      range.select()
      return range

  # Wrapper around range.deleteContents that also deletes empty containers in the range
  deleteRange: (range) ->
    startParent = range.startContainer.parentNode
    endParent = range.endContainer.parentNode
    range.deleteContents()
    if @isEmpty(startParent)
      $(startParent).remove()
    if @isEmpty(endParent)
      $(endParent).remove()

  insertHTMLAtRange: (range, html) ->
    insertElementAtRange(range, @createElementsFromString(html)[0])

  insertElementAtRange: (range, node) ->
    @deleteRange(range)
    range.insertNode(node)
    node

  getCurrentRange: ->
    if window.getSelection().rangeCount > 0 then window.getSelection().getRangeAt(0) else null

  # Returns true if the element has no child elements and has either 0 child nodes or one child
  # node with nothing in it. Different from jQuery's .is(':empty'), which thinks some empty nodes
  # are not empty
  isEmpty: (element) ->
    return element.children.length == 0 &&
           element.childNodes.length <= 1 &&
           element.childNodes[0]?.length == 0

  createElementsFromString: (string) ->
    $("<div/>").html(string).contents();

  getNonEmptySideNode: (range, left=true, deep)->
    node = range[if left then 'startContainer' else 'endContainer']
    while ((sideNode = node[if left then 'previousSibling' else 'nextSibling']) is null or
           sideNode.nodeValue?.trim().length == 0) and
    !$(node).hasClass(@EDITOR_CLASS)
      if sideNode?.nodeValue?.trim().length == 0
        # Ignore this sideNode because it's empty. Go to the next/previous sibling
        node = node[if left then 'previousSibling' else 'nextSibling']
      else
        # Go to the parent because this node doesn't have a side node
        node = node.parentNode
    if deep
      # Deep means go to the deepest element node
      while sideNode.children?.length > 0
        index = if left then sideNode.children.length - 1 else 0
        sideNode = sideNode.children[index]
    return sideNode

Ember.Widgets.NonEditablePill = Ember.Controller.extend Ember.Widgets.DomHelper,
  name: null
  textEditor: null
  params: {}

  actions:
    modalConfirm: ->
      @params['factor-id'] = @textEditor.getNewFactorId()
      @params['type'] = "" + @constructor
      @get('textEditor').insertFactor this
    modalCancel: -> Ember.K

  result: -> Ember.K

  configure: ->
    @send 'modalConfirm'  # No configuration by default

  render: ->
    span = @createElementsFromString("<span></span>")
    span.addClass("non-editable")
    span.attr("title": @get('name'))
    # include all params as data-attributes
    for key, value of @get('params')
      span.attr("data-" + key, value)
    span.text(@result())
    return span[0]

Ember.Widgets.NonEditableTextPill = Ember.Widgets.NonEditablePill.extend
  name: "Custom Text"
  text: Ember.computed.alias 'params.text'

  result: ->
    @get('params.text')

  configure: ->
    modal = Ember.Widgets.ModalComponent.popup
      content: this
      targetObject: this
      confirm: "modalConfirm"
      cancel: "modalCancel"
      contentViewClass: Ember.View.extend
        templateName: 'non_editable_text_pill_configuration'
      headerText: @get('name')
      confirmText: "Insert"

Ember.Widgets.TodaysDate = Ember.Widgets.NonEditablePill.extend
  name: "Today's Date"

  result: -> Date()

Ember.Widgets.TextEditorWithNonEditableComponent =
Ember.Widgets.TextEditorComponent.extend Ember.Widgets.DomHelper,
  factorId: 0
  INVISIBLE_CHAR: '\uFEFF'
  mouseDownTarget: null

  pillOptions: [Ember.Widgets.TodaysDate, Ember.Widgets.NonEditableTextPill]

  _pillOptions : Ember.computed ->
    @getWithDefault('pillOptions', []).map (option) =>
      option.create textEditor: this
  .property('pillOptions')

  selectedPillOption: null

  selectedPillOptionDidChange: Ember.observer ->
    selectedPillOption = @get('selectedPillOption')
    return unless selectedPillOption
    selectedPillOption.configure()
    @set 'selectedPillOption', null
  , 'selectedPillOption'

  initialize: (serializedContents) ->
    $('.' + @EDITOR_CLASS).html(serializedContents)

  serialize: ->
    return $('.'+ @EDITOR_CLASS).html()

  updateNonEditablePillContent: ->
    deserializePill = (pillElement) =>
      data = $(pillElement).data()
      params = {}
      for key, value of data
        params[key] = value
      return Ember.get(data.type).create({'textEditor': this, 'params': params})
    pillElements = $('.non-editable')
    for pillElement in pillElements
      pill = deserializePill(pillElement)
      @insertFactor(pill)

  getCurrentCaretContainer: (range) ->
    return $(range?.startContainer.parentElement).closest('.non-editable-caret')

  getNewFactorId: ->
    @incrementProperty 'factorId'

  insertFactor: (pill) ->
    # Ensure that we insert the factor in the text editor (move the range inside the editor if
    # not already)
    pillElement = $('.non-editable[data-factor-id=' + pill.params.factorId + ']')
    if pillElement.length == 1
      pillElement.text(pill.result())
      # TODO: support updating data params
    else
      range = @getCurrentRange()
      range = if range && @inEditor(range) then range else @selectElement(@getLastElementInEditor())

      factor = @insertElementAtRange(range, pill.render())
      caretContainer = @insertCaretContainer(factor, false)

      # Set cursor to the end of the caret container just created
      @selectElement(caretContainer)
      # Remove other caret containers, excluding the one we just selected
      @removeCaretContainers()
      # select the caret container again (which has probably been moved)
      @selectElement(factor.nextSibling)

  isNonEditable: (node) ->
    not Ember.isEmpty($(node).closest('.non-editable'))

  getNonEditableOnLeft: (deep=false) ->
    return unless (currentRange = @getCurrentRange()) and leftNode = @getNonEmptySideNode(currentRange, true, deep)

    if currentRange.startOffset == 0 && @isNonEditable(leftNode)
      return leftNode
    else if currentRange.startOffset == 1 && @isNonEditable(leftNode) and
    currentRange.startContainer.nodeValue.charAt(0) == @INVISIBLE_CHAR
      # i.e. we are in a non-editable caret container
      return leftNode

  getNonEditableOnRight: (deep=false) ->
    return unless (currentRange = @getCurrentRange()) and rightNode = @getNonEmptySideNode(currentRange, false, deep)

    endContainer = currentRange.endContainer
    if currentRange.endOffset == endContainer.length && @isNonEditable(rightNode)
      return rightNode
    else if currentRange.endOffset == endContainer.length - 1 and
    endContainer.nodeValue.charAt(endContainer.nodeValue.length - 1) == @INVISIBLE_CHAR and
    @isNonEditable(rightNode)
      return rightNode

  isRangeWithinNonEditable: (range) ->
    $startNode = $(range.startContainer.parentNode)
    $endNode = $(range.endContainer.parentNode)
    $startNode.hasClass('non-editable') && $endNode.hasClass('non-editable') && $startNode[0] == $endNode[0]

  getNonEditableParent: (node) ->
    while node
      if $(node).hasClass('non-editable')
        return node
      node = node.parentElement

  insertCaretContainer: (target, before) ->
    caretContainer = @createElementsFromString('<span class="non-editable-caret">' + @INVISIBLE_CHAR + '</span>')[0]
    if (before)
      $(caretContainer).insertBefore(target)
    else
      $(caretContainer).insertAfter(target)
    return caretContainer

  removeCaretContainer: (caretContainer) ->
    if (child = caretContainer.childNodes[0]) && child.nodeValue.charAt(0) == @INVISIBLE_CHAR
      child = child.deleteData(0, 1)
    contents = $(caretContainer).contents()
    $(caretContainer).replaceWith(contents)

  removeCaretContainers: ->
    range = @getCurrentRange()
    currentCaretContainer = @getCurrentCaretContainer(range)
    while (caretContainer = $('.non-editable-caret').not(currentCaretContainer)[0])
      child = caretContainer.childNodes[0]
      if child && child.nodeValue?.charAt(0) == @INVISIBLE_CHAR
        child = child.deleteData(0, 1)
      # via http://stackoverflow.com/questions/170004/how-to-remove-only-the-parent-element-and-not-its-child-elements-in-javascript
      contents = $(caretContainer).contents()
      $(caretContainer).replaceWith(contents)
      caretContainer.childNodes[caretContainer.childNodes.length-1]

  moveSelection: ->
    hasSideContent = (range, element, left) ->
      container = range.startContainer
      offset = range.startOffset

      if container.nodeType == 3
        len = container.nodeValue.length
        if (offset > 0 && offset < len) || (if left then offset == len else offset == 0)
          return
      return element

    @removeCaretContainers()
    return unless currentRange = @getCurrentRange()

    isCollapsed = currentRange.collapsed
    nonEditableStart = @getNonEditableParent(currentRange.startContainer)
    nonEditableEnd = @getNonEditableParent(currentRange.endContainer)
    parentCaret = @getCurrentCaretContainer(currentRange)

    if nonEditableStart || nonEditableEnd
      if currentRange.collapsed
        if (element = hasSideContent(currentRange, nonEditableStart || nonEditableEnd, true))
          caretContainer = @insertCaretContainer(element, true)
        else if (element = hasSideContent(currentRange, nonEditableStart || nonEditableEnd, false))
          caretContainer = @insertCaretContainer(element, false)

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
    else if parentCaret?.length > 0 and !@isNonEditable(@getNonEmptySideNode(currentRange, true)) and
    !@isNonEditable(@getNonEmptySideNode(currentRange, false))
        @removeCaretContainer(parentCaret[0])

  keyDown: (event) ->
    isCharacter = (keyCode) ->
      return keyCode >= 48 && keyCode <= 90 or   # [0-9a-z]
             keyCode >= 96 && keyCode <= 111 or  # num pad characters
             keyCode >= 186 && keyCode <= 222    # punctuation

    keyCode = event.keyCode
    @moveSelection()
    range = @getCurrentRange()
    isCollapsed = range.collapsed

    startElement = range.startContainer
    endElement = range.endContainer
    nonEditableParent = @isNonEditable(startElement) || @isNonEditable(endElement)
    leftNode = @getNonEditableOnLeft()
    rightNode = @getNonEditableOnRight()
    leftNodeDeep = @getNonEditableOnLeft(true)
    rightNodeDeep = @getNonEditableOnRight(true)

    if (event.metaKey || event.ctrlKey) && keyCode not in [@KEY_CODES.DELETE, @KEY_CODES.BACKSPACE]
      return

    if isCharacter(keyCode) or keyCode == @KEY_CODES.BACKSPACE or keyCode == @KEY_CODES.DELETE
      if (leftNode || rightNode) and !isCollapsed
        caret = @insertCaretContainer(leftNode || rightNode, if leftNode then false else true)
        @deleteRange(range)
        @selectElement(caret)
      else if nonEditableParent
        @deleteRange(range)  # special delete in case a non-editable is selected
        @selectElement()  # restore cursor
      if (keyCode == @KEY_CODES.BACKSPACE || keyCode == @KEY_CODES.DELETE) && !isCollapsed && nonEditableParent
        # We already performed the delete action
        return event.preventDefault()

    if leftNode
      if keyCode == @KEY_CODES.LEFT and isCollapsed
        @selectElement(leftNode, "none")
        event.preventDefault()
      else if keyCode == @KEY_CODES.BACKSPACE
        @selectElement(leftNode, "none")
    else if leftNodeDeep and keyCode == @KEY_CODES.BACKSPACE
      # This happens when the last node on the previous line is a non-editable
      @insertCaretContainer(leftNodeDeep, false)

    if rightNode
      if keyCode == @KEY_CODES.DELETE
        @selectElement(rightNode, "none")
      else if keyCode == @KEY_CODES.RIGHT and isCollapsed
        @selectElement(rightNode, "none")
        event.preventDefault()
    else if rightNodeDeep and keyCode == @KEY_CODES.DELETE and not rightNode
      # This happens when the first node on the next line is a non-editable
      @insertCaretContainer(rightNodeDeep, true)

  keyUp: (event) ->
    @_super()
    @moveSelection()
    @updateNonEditablePillContent()

  mouseDown: (event) ->
    @mouseDownTarget = event.target  # Save mousedown target for use in mouseup handler
    @moveSelection()

  mouseUp: (event) ->
    @_super()
    return unless @isTargetInEditor(event)
    @moveSelection()  # expand selection if only part of a non-editable was selected
    currentRange = @getCurrentRange()
    if @isNonEditable(event.target) and event.target == @mouseDownTarget and @isRangeWithinNonEditable(currentRange)
      # This prevents the user from putting the cursor within a non-editable that was previously selected
      @selectElement(event.target, "none")
      event.preventDefault()
    @updateNonEditablePillContent()

