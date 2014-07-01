Ember.Widgets.TypeaheadComponent = Ember.Widgets.SelectComponent.extend
  templateName: 'typeahead'
  searchFieldClass: 'form-control'

  searchView: Ember.TextField.extend
    class: 'ember-select-input'
    valueBinding: 'parentView.query'
    focusIn: (event) -> @set 'parentView.showDropdown', yes

  selectionDidChange: Ember.observer ->
    @set 'query', @get 'selection'
  , 'selection'

Ember.Handlebars.helper('typeahead-component', Ember.Widgets.TypeaheadComponent)
