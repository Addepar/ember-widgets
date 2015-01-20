`import Ember from 'ember'`
`import TodaysDatePill from '../controllers/todays-date-pill'`
`import NonEditableTextPill from '../controllers/non-editable-text-pill'`

PillInsertMixin = Ember.Mixin.create
  pillOptions: Ember.A [
    TodaysDatePill
    NonEditableTextPill
  ]

  _pillOptions: Ember.computed( ->
    Ember.A @getWithDefault('pillOptions', []).map (option) ->
      label: option.create().name
      value: option
  ).property 'pillOptions'

  actions:
    insertPill: (pillOption) ->
      selectedPillOption =
        pillOption.value.create textEditor: @get('textEditor') or this
      selectedPillOption.configure()
      @set 'selectedPillOption', null

`export default PillInsertMixin`
