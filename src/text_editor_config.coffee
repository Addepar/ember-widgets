Ember.Widgets.TextEditorConfigComponent = Ember.Component.extend
  templateName: 'text_editor_config'
  classNames: ['ember-text-editor-toolbar']
  selectedFontName: 'Helvetica Neue'
  selectedFontSize: '2'
  selectedForeColor: 'rgb(0, 0, 0)'
  textEditor: null

  # Options
  pillOptions: [Ember.Widgets.TodaysDatePill, Ember.Widgets.NonEditableTextPill]

  _pillOptions : Ember.computed ->
    @getWithDefault('pillOptions', []).map (option) =>
      option.create textEditor: @get('textEditor')
  .property 'pillOptions', 'textEditor'

  fontNames: [
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
  fontSizes: [
    {size:'1', name: '8'},
    {size:'2', name: '10'},
    {size:'3', name: '12'},
    {size:'4', name: '14'},
    {size:'5', name: '18'},
    {size:'6', name: '24'},
    {size:'7', name: '36'}
  ]

  fontChooserItemViewClass: Ember.Widgets.SelectOptionView.extend
    templateName: 'font_chooser_item'
    style: Ember.computed ->
      "font-family:#{@get('label')};"
    .property 'label'

  actions:
    applyFontSize: (options) ->
      @get('textEditor').fontSize options.size
    applyFontName: (font) ->
      @get('textEditor').fontName font
    applyForeColor: (color) ->
      @get('textEditor').foreColor color
    toggleBold: ->
      @get('textEditor').bold()
    toggleItalic: ->
      @get('textEditor').italic()
    toggleUnderline: ->
      @get('textEditor').underline()
    justifyLeft: ->
      @get('textEditor').justifyLeft()
    justifyCenter: ->
      @get('textEditor').justifyCenter()
    justifyRight: ->
      @get('textEditor').justifyRight()
    insertOrderedList: ->
      @get('textEditor').insertOrderedList()
    insertUnorderedList: ->
      @get('textEditor').insertUnorderedList()
    outdent: ->
      @get('textEditor').outdent()
    indent: ->
      @get('textEditor').indent()
    insertPill: (selectedPillOption) ->
      selectedPillOption.configure()
      @set 'selectedPillOption', null
