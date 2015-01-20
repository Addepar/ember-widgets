`import Ember from 'ember'`

MultiSelectOptionView = Ember.View.extend
  tagName: 'li'
  templateName: 'multi-select-item'
  classNames:   'ember-select-search-choice'
  labelPath: Ember.computed.alias 'controller.optionLabelPath'

  didInsertElement: ->
    @_super()
    @labelPathDidChange()

  labelPathDidChange: Ember.observer ->
    labelPath = @get 'labelPath'
    path = if labelPath then "context.#{labelPath}" else 'context'
    Ember.defineProperty(this, 'label', Ember.computed.alias(path))
    @notifyPropertyChange 'label'
  , 'context', 'labelPath'

`export default MultiSelectOptionView`
