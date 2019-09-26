self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  throwOnUnhandled: true,
  workflow: [
    { handler: "silence", matchMessage: "Global lookup of Ember from a Handlebars template is deprecated." },
    { handler: "silence", matchId: "ember-views.collection-view-deprecated" },
    { handler: "silence", matchId: "ember-views.dispatching-modify-property" },
    { handler: "silence", matchId: "ember-views.view-deprecated" },
    { handler: "silence", matchId: "ember-views.container-view" },
    { handler: "silence", matchMessage: "Setting `childViews` on a Container is deprecated." },
    { handler: "silence", matchId: "ember-test-helpers.test-module-for-component.test-type" },
    { handler: "silence", matchMessage: "Using deprecated `template` property on a View." }
  ]
};
