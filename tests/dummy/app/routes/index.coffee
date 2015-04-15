`import Ember from 'ember'`

IndexRoute = Ember.Route.extend
  beforeModel: ->
    @transitionTo('emberWidgets.overview')

`export default IndexRoute`
