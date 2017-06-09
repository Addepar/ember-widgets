import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import startApp from '../helpers/start-app';

import {
  isPresent,
  isNotPresent
} from '../helpers/assertions';

var animationsDisabled, popoverLink, app;

animationsDisabled = false;

moduleForComponent('popover-link-component', '[Integration] Popover link tests', {
  needs: ['template:popover-link-popover', 'template:view-parent-view-content'],
  setup: function() {
    app = startApp();
    animationsDisabled = window.EMBER_WIDGETS_DISABLE_ANIMATIONS;
    window.EMBER_WIDGETS_DISABLE_ANIMATIONS = true;
  },
  teardown: function() {
    window.EMBER_WIDGETS_DISABLE_ANIMATIONS = animationsDisabled;
    Ember.run(function() {
      if (popoverLink != null) {
        popoverLink.destroy();
      }
    });
    Ember.run(app, 'destroy');
  }
});

test('Destroying a popover link destroys the associated popover', function() {
  expect(2);
  popoverLink = this.subject({
    rootElement: "#ember-testing"
  });
  this.append();
  click('.popover-link');
  andThen(function() {
    var popover;
    ok(isPresent('.popover'), "The popover is created");
    popover = popoverLink.get('_popover');
    return Ember.run(function() {
      popoverLink.destroy();
      return popoverLink = null;
    });
  });
  return andThen(function() {
    return ok(isNotPresent('.popover'), "The popover is destroyed");
  });
});

test('Popover links can be configured to be opened with left clicks', function() {
  expect(1);
  popoverLink = this.subject({
    rootElement: "#ember-testing",
    openOnLeftClick: true
  });
  this.append();
  click('.popover-link');
  return andThen(function() {
    return ok(isPresent('.popover'), "The popover is created");
  });
});

test('Popover links can be configured to not be opened with left clicks', function() {
  expect(1);
  popoverLink = this.subject({
    rootElement: "#ember-testing",
    openOnLeftClick: false
  });
  this.append();
  click('.popover-link');
  return andThen(function() {
    return ok(isNotPresent('.popover'), "The popover is not created");
  });
});

test('Popover links can be configured to be opened with right clicks', function() {
  expect(1);
  popoverLink = this.subject({
    rootElement: "#ember-testing",
    openOnRightClick: true
  });
  this.append();
  triggerEvent('.popover-link', 'contextmenu');
  return andThen(function() {
    return ok(isPresent('.popover'), "The popover is created");
  });
});

test('Popover links can be configured to not be opened with right clicks', function() {
  expect(1);
  popoverLink = this.subject({
    rootElement: "#ember-testing",
    openOnRightClick: false
  });
  this.append();
  triggerEvent('.popover-link', 'contextmenu');
  return andThen(function() {
    return ok(isNotPresent('.popover'), "The popover is not created");
  });
});

test('Popover links do not bubble left click events when configured to open with left clicks', function() {
  var bubbled;
  popoverLink = this.subject({
    rootElement: "#ember-testing",
    openOnLeftClick: true,
    _openPopover: Ember.K
  });
  this.append();
  bubbled = Ember.run(popoverLink, 'click');
  return ok(!bubbled, 'The event did not bubble');
});

test('Popover links bubble left click events when not configured to open with left clicks', function() {
  var bubbled;
  popoverLink = this.subject({
    rootElement: "#ember-testing",
    openOnLeftClick: false,
    _openPopover: Ember.K
  });
  this.append();
  bubbled = Ember.run(popoverLink, 'click');
  return ok(bubbled, 'The event bubbled');
});

test('Popover links do not bubble right click events when configured to open with right clicks', function() {
  var bubbled;
  popoverLink = this.subject({
    rootElement: "#ember-testing",
    openOnRightClick: true,
    _openPopover: Ember.K
  });
  this.append();
  bubbled = Ember.run(popoverLink, 'contextMenu');
  return ok(!bubbled, 'The event did not bubble');
});

test('Popover links bubble right click events when not configured to open with right clicks', function() {
  var bubbled;
  popoverLink = this.subject({
    rootElement: "#ember-testing",
    openOnRightClick: false,
    _openPopover: Ember.K
  });
  this.append();
  bubbled = Ember.run(popoverLink, 'contextMenu');
  return ok(bubbled, 'The event bubbled');
});

test('Popover links can be configured to hide other popovers when opening', function() {
  expect(2);
  $(document).on('popover:hide', function() {
    return ok(true, 'The popover:hide event was triggered');
  });
  popoverLink = this.subject({
    rootElement: "#ember-testing",
    hideOthers: true
  });
  this.append();
  click('.popover-link');
  andThen(function() {
    return ok(isPresent('.popover'), "The new popover was not hidden");
  });
  andThen(function() {
    return $(document).off('popover:hide');
  });
});

test('Popover links can be configured to not hide other popovers when opening', function() {
  expect(1);
  $(document).on('popover:hide', function() {
    return ok(false, 'The popover:hide event was not triggered');
  });
  popoverLink = this.subject({
    rootElement: "#ember-testing",
    hideOthers: false
  });
  this.append();
  click('.popover-link');
  andThen(function() {
    return ok(isPresent('.popover'), "The new popover was not hidden");
  });
  return $(document).off('popover:hide');
});
