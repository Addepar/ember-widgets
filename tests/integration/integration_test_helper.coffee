document.write("""
  <div id="ember-testing-container">
    <div id="ember-testing"></div>
  </div>
  """)

App.rootElement = '#ember-testing'
Ember.testing = true
App.setupForTesting()
App.injectTestHelpers()
