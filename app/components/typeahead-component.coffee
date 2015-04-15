`import Ember from 'ember'`
`import SelectComponent from '../components/select-component'`

TypeaheadComponent = SelectComponent.extend
  layoutName: 'typeahead'
  searchFieldClass: 'form-control'
  disabled: no

  searchView: Ember.TextField.extend
    class: 'ember-select-input'
    valueBinding: 'parentView.query'
    focusIn: (event) -> @set 'parentView.showDropdown', yes

  userDidSelect: (selection) ->
    @_super
    @set 'query', @get 'selection'

`export default TypeaheadComponent`
