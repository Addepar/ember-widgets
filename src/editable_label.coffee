Ember.Widgets.EditableLabel = Ember.View.extend
  templateName: 'editable-label'
  classNames: ['editable-label']
  placeholder: ''
  isEditing: no
  value: null

  displayName: Ember.computed ->
    if Ember.isNone(@get('value')) or @get('value') is ''
      @get('placeholder')
    else
      @get('value')
  .property 'value', 'placeholder'

  innerTextField: Ember.TextField.extend
    valueBinding: Ember.Binding.oneWay 'parentView.value'
    didInsertElement: -> @$().focus()
    blur: ->
      @set 'parentView.isEditing', no
      @set 'parentView.value', @get('value')

  editLabel: -> @set 'isEditing', yes

Ember.Handlebars.helper('editable-label-component', Ember.Widgets.EditableLabel)
