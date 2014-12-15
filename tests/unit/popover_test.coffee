popover = null;

module "Popover unit tests",
  setup: ->
    Ember.run ->
      popover = Ember.Widgets.PopoverComponent.popup
        rootElement: '#ember-testing'
  ,
  teardown: ->
    Ember.run ->
      popover.destroy()

test 'The popover removes itself properly from the DOM', ->
  sinon.spy(popover, "hide")
  wait().then ->
    keyEvent('.popover-content', 'keyup', 27)
  wait().then ->
    ok(popover.hide.calledOnce, "`hide` gets called when hitting escape")
