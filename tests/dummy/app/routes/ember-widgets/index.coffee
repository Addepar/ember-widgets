`import Ember from 'ember'`

EmberWidgetsIndexRoute = Ember.Route.extend
  beforeModel: -> @transitionTo('emberWidgets.overview')

`export default EmberWidgetsIndexRoute`
