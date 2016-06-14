popover = null;

module "Popover unit tests",
  teardown: ->
    Ember.run ->
      popover.destroy()

test 'The popover removes itself properly from the DOM', ->
  Ember.run ->
    popover = Ember.Widgets.PopoverComponent.popup
      rootElement: '#ember-testing'

  sinon.spy(popover, "hide")
  wait().then ->
    keyEvent('.popover-content', 'keyup', 27)
  wait().then ->
    ok(popover.hide.calledOnce, "`hide` gets called when hitting escape")
    popover.hide.restore()

test 'Popover respects hideOthers option', ->
  expect 2

  jQueryHide = sinon.stub($.fn, 'trigger');
  # Case 1: other popover should be hidden by default
  Ember.run ->
    popover = Ember.Widgets.PopoverComponent.popup({rootElement: '#ember-testing'})
  andThen ->
    ok(jQueryHide.calledOnce, "Hide action is triggered when hideOthers is not set")
    jQueryHide.reset()

  # Case 2: other popover should not be hidden when hideOthers is false
  Ember.run ->
    popover = Ember.Widgets.PopoverComponent.popup({rootElement: '#ember-testing'}, false)
  andThen ->
    ok(jQueryHide.notCalled, "Hide action is not triggered when hideOthers is false")
    jQueryHide.restore()
