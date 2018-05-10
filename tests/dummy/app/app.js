import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import CarouselItem from 'ember-widgets/views/carousel-item';

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

// Legacy view-as-component weirdness. Don't ever ever ever do this.
Ember.Handlebars.helper('carousel-item', CarouselItem);

loadInitializers(App, config.modulePrefix);

export default App;
