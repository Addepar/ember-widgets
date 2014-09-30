Ember.Widgets.TextEditorComponent = Ember.Component.extend
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
  mouseDown: (event) -> Ember.K
