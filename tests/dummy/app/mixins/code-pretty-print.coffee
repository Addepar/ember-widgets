`import Ember from 'ember'`

CodePrettyPrintMixin = Ember.Mixin.create
  didInsertElement: ->
    @_super()
    Ember.run.next this, -> prettyPrint()

`export default CodePrettyPrintMixin`
