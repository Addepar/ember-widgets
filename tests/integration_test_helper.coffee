document.write("""
  <div id="ember-testing-container">
    <div id="ember-testing"></div>
  </div>
  """)

App.rootElement = '#ember-testing'
Ember.testing = true
App.setupForTesting()
App.injectTestHelpers()

Ember.Logger.log = Ember.K
Ember.Logger.debug = Ember.K

append = (item) ->
  Ember.run ->
    item.appendTo "#ember-testing"
    wait()
