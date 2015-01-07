`import Ember from 'ember'`
`import config from './config/environment'`

Router = Ember.Router.extend
  location: config.locationType

Router.map ->
  @route 'license'
  @resource 'emberWidgets', path: '/ember-widgets', ->
    @route 'overview'
    @route 'documentation'
    @route 'accordion'
    @route 'carousel'
    @route 'modal'
    @route 'popover'
    @route 'select'
    @route 'colorPicker'
    @route 'radioButton'
  @route 'ember-widgets-index-route'
  @route 'ember-widgets-overview'
  @route 'ember-widgets-select'
  @route 'ember-widgets-modal'
  @route 'ember-widgets-popover'

`export default Router`
