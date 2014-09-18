Ember.Widgets.TypeaheadComponent = Ember.Widgets.SelectComponent.extend
  layoutName: 'typeahead'
  searchFieldClass: 'form-control'

  searchView: Ember.TextField.extend
    class: 'ember-select-input'
    valueBinding: 'parentView.query'
    focusIn: (event) -> @set 'parentView.showDropdown', yes

  userDidSelect: (selection) ->
    @_super
    @set 'query', @get 'selection'

Ember.Handlebars.helper('typeahead-component', Ember.Widgets.TypeaheadComponent)
