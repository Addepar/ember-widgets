Ember.Widgets.TypeaheadComponent = Ember.Widgets.SelectComponent.extend
  layoutName: 'typeahead'
  searchFieldClass: 'form-control'

  searchView: Ember.TextField.extend
    class: 'ember-select-input'
    valueBinding: 'parentView.query'
    focusIn: (event) -> @set 'parentView.showDropdown', yes

  selectionDidChange: Ember.observer ->
    @set 'query', @get 'selection' unless @get 'showDropdown'
  , 'showDropdown'

Ember.Handlebars.helper('typeahead-component', Ember.Widgets.TypeaheadComponent)
