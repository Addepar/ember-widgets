`import Ember from 'ember'`

EmberWidgetsConfigInitializer = Ember.Object.create
  name: 'ember-widgets-config'
  initialize: (container, application) ->
    config = DISABLE_ANIMATIONS: no
    application.register '_ember-widgets:config', config, instantiate: no
    application.inject(
      'component'
      'emberWidgetsConfig'
      '_ember-widgets:config'
    )

`export default EmberWidgetsConfigInitializer`
