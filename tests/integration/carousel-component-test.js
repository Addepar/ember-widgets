import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import startApp from '../helpers/start-app';

var carousel, app;

carousel = null;

moduleForComponent('carousel-component', '[Integration] Carousel component', {
  needs: ['template:carousel'],
  setup: function() {
    app = startApp();
    window.EMBER_WIDGETS_DISABLE_ANIMATIONS = true;
  },
  teardown: function() {
    Ember.run(function() {
      return carousel.destroy();
    });
    Ember.run(app, 'destroy');
    carousel = null;
    window.EMBER_WIDGETS_DISABLE_ANIMATIONS = false;
  }
});

test('The action transitionEnded is sent after sliding', function(assert) {
  assert.expect(1);
  Ember.run((function(_this) {
    return function() {
      carousel = _this.factory().extend({
        actions: {
          transitionEnded: function() {
            return assert.ok(true, 'The action is sent after sliding');
          }
        }
      }).create({
        container: _this.container
      });
      return carousel.appendTo('#ember-testing');
    };
  })(this));
  return Ember.run(function() {
    return carousel.slide('next', 1);
  });
});
