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
  selectElement: (document, element, collapseMode="end") ->
    # http://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
    if(document.createRange)  # Firefox, Chrome, Opera, Safari, IE 9+
      range = document.createRange()
      # Select the entire contents of the element with the range
      range.selectNodeContents(element)
      if collapseMode != "none"
        # collapse the range to the end point. false means collapse to end rather than the start
        range.collapse(if collapseMode == "beginning" then true else false)
      @activateRange(document, range)

  activateRange: (document, range) ->
    selection = document.getSelection()
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

  convertElementsToString: (elements) ->
    $("<div/>").html(elements).html()

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

  wrapInDiv: (htmlElements) ->
    isDiv = htmlElements.map (i, el) -> el.tagName?.toLowerCase() == "div"
    isDiv = isDiv.toArray()
    return if isDiv.every (elem) -> elem
    return if htmlElements.length == 1 and htmlElements[0].className == "rangySelectionBoundary"
    while htmlElements.length > 0
      endSlice = isDiv.indexOf(true)
      if endSlice == -1
        endSlice = isDiv.length
      if endSlice > 0
        slicedElements = htmlElements.slice(0, endSlice)
        newElement = slicedElements.wrapAll('<div/>')
        slicedElements.wrapAll('<div/>').parent().replaceWith(newElement)
      else
        endSlice = 1
      htmlElements = htmlElements.slice(endSlice)
      isDiv = isDiv.slice(endSlice)
