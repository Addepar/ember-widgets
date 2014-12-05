Ember.Widgets.TextEditorConfigComponent = Ember.Component.extend
  layoutName: 'text-editor-config'
  classNames: Ember.A ['ember-text-editor-toolbar']
  selectedFontName: 'Helvetica Neue'
  selectedFontSize: '2'
  selectedForeColor: 'rgb(0, 0, 0)'
  textEditor: null

  # Options
  fontNames: Ember.computed ->
    Ember.A [
      'Arial',
      'Calibri',
      'Cambria',
      'Consolas',
      'Corsiva',
      'Courier New',
      'Georgia',
      'Helvetica Neue',
      'Helvetica',
      'Sans-Serif',
      'Serif',
      'Syncopate',
      'Times New Roman',
      'Trebuchet MS',
      'Verdana'
    ]

  fontSizes: Ember.computed ->
    Ember.A [
      {size:'1', name: '8'},
      {size:'2', name: '10'},
      {size:'3', name: '12'},
      {size:'4', name: '14'},
      {size:'5', name: '18'},
      {size:'6', name: '24'},
      {size:'7', name: '36'}
    ]

  fontChooserItemViewClass: Ember.Widgets.SelectOptionView.extend
    templateName: 'font-chooser-item'
    style: Ember.computed ->
      "font-family:#{@get('label')};"
    .property 'label'

  actions:
    applyFontSize: (options) ->
      @get('textEditor').fontSize options.size
      @get('textEditor').getEditor().focus()
    applyFontName: (font) ->
      @get('textEditor').fontName font
      @get('textEditor').getEditor().focus()
    applyForeColor: (color) ->
      @get('textEditor').foreColor color
      @get('textEditor').getEditor().focus()
    toggleBold: ->
      @get('textEditor').bold()
      @get('textEditor').getEditor().focus()
    toggleItalic: ->
      @get('textEditor').italic()
      @get('textEditor').getEditor().focus()
    toggleUnderline: ->
      @get('textEditor').underline()
      @get('textEditor').getEditor().focus()
    justifyLeft: ->
      @get('textEditor').justifyLeft()
      @get('textEditor').getEditor().focus()
    justifyCenter: ->
      @get('textEditor').justifyCenter()
      @get('textEditor').getEditor().focus()
    justifyRight: ->
      @get('textEditor').justifyRight()
      @get('textEditor').getEditor().focus()
    insertOrderedList: ->
      @get('textEditor').insertOrderedList()
      @get('textEditor').getEditor().focus()
    insertUnorderedList: ->
      @get('textEditor').insertUnorderedList()
      @get('textEditor').getEditor().focus()
    outdent: ->
      @get('textEditor').outdent()
      @get('textEditor').getEditor().focus()
    indent: ->
      @get('textEditor').indent()
      @get('textEditor').getEditor().focus()


Ember.Widgets.TextEditorWithNonEditableConfigComponent = Ember.Widgets.TextEditorConfigComponent.extend Ember.Widgets.PillInsertMixin,
  templateName: 'text-editor-with-non-editable-config'
