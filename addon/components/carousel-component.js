import Ember from 'ember';
import CarouselIndicatorView from '../views/carousel-indicator';

// A lot of the javascript came from bootstrap.js
// The bootstrap behavior was limited in how you could treat the slide list as a
// circular ring. I.e., bootstrap would only allow you to return to first slide
// by going forwards if you were in the last slide. We want the ability to seem
// like the carousel is moving forwards even if we are on an earlier slide and
// then want to go to the first slide. For example, imagine you are in the middle
// of a wizard, you want to click finish, the results of that wizard bring up the
// same wizard it should seem like it is the next step, not that you are going
// backwards.

export default Ember.Component.extend({
  layoutName: 'carousel',
  classNames: ['carousel', 'slide'],
  classNameBindings: Ember.A(['sliding']),
  activeIndex: 0,
  carouselIndicatorClass: CarouselIndicatorView,
  $nextItem: null,
  didInsertElement: function() {
    this._super();
    // suppose a content array is not specified in use case 1, we use jquery to
    // figure out how many carousel items are there. This allows us to generate
    // the correct number of carousel indicator
    if (!this.get('content')) {
      return this.set('content', Ember.A(new Array(this.$('.item').length)));
    }
  },
  willDestroyElement: function() {
    var ref;
    if ((ref = this.$nextItem) != null) {
      ref.off($.support.transition.end);
    }
    return this._super();
  },
  actions: {
    prev: function() {
      var activeIndex, contentLength, nextIndex;
      if (this.get('sliding')) {
        return;
      }
      activeIndex = this.get('activeIndex');
      contentLength = this.get('content.length');
      nextIndex = activeIndex - 1;
      nextIndex = nextIndex < 0 ? contentLength - 1 : nextIndex;
      return this.slide('prev', nextIndex);
    },
    next: function() {
      var activeIndex, contentLength, nextIndex;
      if (this.get('sliding')) {
        return;
      }
      activeIndex = this.get('activeIndex');
      contentLength = this.get('content.length');
      nextIndex = activeIndex + 1;
      nextIndex = nextIndex >= contentLength ? 0 : nextIndex;
      return this.slide('next', nextIndex);
    }
  },
  to: function(pos) {
    var direction;
    if (this.get('sliding')) {
      return;
    }
    if (!((0 <= pos && pos < this.get('content.length')))) {
      return;
    }
    direction = pos > this.get('activeIndex') ? 'next' : 'prev';
    return this.slide(direction, pos);
  },

  // TODO(Peter): Further emberized this by keeping the turth out of the DOM
  // We can use slide to transition to any slide with any animation direction.
  // E.g., by specifiying type = 'next' and next = first_slide_index, we can
  // transition to the first slide by moving to the right.

  // type: next | prev
  // next: is the index of the next slide
  slide: function(type, nextIndex) {
    var $active, direction, ref,
      _this = this;
    if (this.get('activeIndex') === nextIndex) {
      return;
    }
    direction = type === 'next' ? 'left' : 'right';
    $active = $(this.$('.item').get(this.get('activeIndex')));
    if ((ref = this.$nextItem) != null) {
      ref.off($.support.transition.end);
    }
    this.$nextItem = $(this.$('.item').get(nextIndex));
    if (!Ember.Widgets || !Ember.Widgets.DISABLE_ANIMATIONS) {
      this.set('sliding', true);
      this.$nextItem.addClass(type);
      // force reflow
      this.$nextItem[0].offsetWidth;
      $active.addClass(direction);
      this.$nextItem.addClass(direction);
    }
    // Bootstrap has this method for listening on end of transition
    return this._onTransitionEnd(this.$nextItem, function() {
      _this.$nextItem.off($.support.transition.end);
      // This code is async and ember-testing requires us to wrap any code with
        // asynchronous side-effects in an Ember.run
      Ember.run(_this, function() {
        this.set('activeIndex', nextIndex);
        this.$nextItem.removeClass([type, direction].join(' ')).addClass('active');
        $active.removeClass(['active', direction].join(' '));
        this.set('sliding', false);
        return this.send('transitionEnded');
      });
      return _this.$nextItem = null;
    });
  },
  _onTransitionEnd: function($el, callback) {
    if (Ember.Widgets && Ember.Widgets.DISABLE_ANIMATIONS) {
      return callback();
    } else {
      return $el.one($.support.transition.end, callback);
    }
  }
});
