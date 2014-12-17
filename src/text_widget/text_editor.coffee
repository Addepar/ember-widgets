Ember.Widgets.TextEditorComponent = Ember.Component.extend Ember.Widgets.DomHelper, 
  layoutName: 'text-editor'
  selectedFontName: 'Helvetica Neue'
  selectedFontSize: '2'
  selectedForeColor: 'rgb(0, 0, 0)'
  isToolbarVisible: true

  EDITOR_CLASS: 'text-editor'
  PLACEHOLDER_TEXT: 'Click to edit'

  commands: Ember.A [
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
        padding: 0 4px;
        margin: 0 1px;
        background-color: #e7e7e7;
        list-style-type: none;
      }
      .configurable {
        cursor: pointer;
      }
      p:first-of-type:empty:not(:focus):before {
        content: attr(data-ph);
        color: grey;
        font-style: italic;
      }
    </style>
    """
  .property 'EDITOR_CLASS'

  iframeBodyContents: Ember.computed ->
    '<p data-ph="' + @PLACEHOLDER_TEXT + '"></p>'
  .property 'PLACEHOLDER_TEXT'

  # Used only in test?
  getEditor: ->
    @$('iframe.text-editor-frame').contents().find('.' + @EDITOR_CLASS)

  getDocument: ->
    iframe = @$('iframe.text-editor-frame')[0]
    iframe.contentDocument || iframe.contentWindow.document

  didInsertElement: ->
    @_super()

    $iframe = @$('iframe.text-editor-frame')
    $iframeContents = $iframe.contents()

    $head = $iframeContents.find('head')
    $head.append(@get('iframeHeadContents'))

    $body = $iframeContents.find('body')
    $body.addClass @EDITOR_CLASS
    $body.attr 'contentEditable', true
    $body.append(@get('iframeBodyContents'))

    iframe = $iframe[0]
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
    if event.keyCode is @KEY_CODES.BACKSPACE
      # We need to make sure that we let one paragraph
      $iframe = @$('iframe.text-editor-frame')
      $iframeContents = $iframe.contents()
      $body = $iframeContents.find('body')
      if not $body.children().length
        $body.append(@get('iframeBodyContents'))
        # put the cursor back in the paragraph
        iframeDocument = @getDocument()
        selection = iframeDocument.getSelection()
        selection.removeAllRanges()
        range = iframeDocument.createRange()
        range.selectNodeContents iframeDocument.body.firstChild
        selection.addRange range
    else
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
  mouseDown: (event) -> Ember.K
