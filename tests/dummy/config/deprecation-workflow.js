self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  throwOnUnhandled: true,
  workflow: [
    { handler: "silence", matchId: "ember-legacy-views" },
    { handler: "silence", matchId: "ember-views.dispatching-modify-property" },
    { handler: "silence", matchMessage: "Global lookup of Ember from a Handlebars template is deprecated." },
    { handler: "silence", matchMessage: "Using deprecated `template` property on a View." }
  ]
};
