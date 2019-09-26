self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "Global lookup of Ember from a Handlebars template is deprecated." },
    { handler: "silence", matchId: "ember-views.collection-view-deprecated" },
    { handler: "silence", matchId: "ember-views.dispatching-modify-property" },
    { handler: "silence", matchMessage: "Passing the dependentKeys after the callback function in Ember.observer is deprecated. Ensure the callback function is the last argument." },
    { handler: "silence", matchId: "ember-views.view-deprecated" },
    { handler: "silence", matchId: "ember-views.container-view" },
    { handler: "silence", matchMessage: "Setting `childViews` on a Container is deprecated." },
    { handler: "silence", matchId: "ember-test-helpers.test-module-for-component.test-type" },
    // { handler: "silence", matchMessage: "Using the same function as getter and setter is deprecated." },
    { handler: "silence", matchMessage: "Using deprecated `template` property on a View." }
  ]
};
