`import Ember from 'ember'`

EmberWidgetsOverviewRoute = Ember.Route.extend
  activate: ->
    controller = @controllerFor('emberWidgets')
    controller.set 'showLargeHero', yes

  deactivate: ->
    controller = @controllerFor('emberWidgets')
    controller.set 'showLargeHero', no

`export default EmberWidgetsOverviewRoute`
