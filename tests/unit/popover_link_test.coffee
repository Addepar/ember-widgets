popoverLink = null
animationsDisabled = false

moduleForComponent 'popover-link', "Popover link unit tests",
  needs: [
    'template:popover-link-popover'
    'template:view-parent-view-content'
  ]
  setup: ->
    animationsDisabled = Ember.Widgets.DISABLE_ANIMATIONS
    Ember.Widgets.DISABLE_ANIMATIONS = true
  teardown: ->
    Ember.Widgets.DISABLE_ANIMATIONS = animationsDisabled
    Ember.run ->
      popoverLink?.destroy()

test 'Destroying a popover link destroys the associated popover', ->
  expect 2

  popoverLink = @subject
    rootElement: "#ember-testing"

  @append()

  click '.popover-link'

  andThen ->
    ok isPresent('.popover'), "The popover is created"
    popover = popoverLink.get('_popover')
    Ember.run ->
      popoverLink.destroy()
      popoverLink = null

  andThen ->
    ok isNotPresent('.popover'), "The popover is destroyed"

test 'Popover links can be configured to be opened with left clicks', ->
  expect 1

  popoverLink = @subject
    rootElement: "#ember-testing"
    openOnLeftClick: true

  @append()

  click '.popover-link'
  andThen ->
    ok isPresent('.popover'), "The popover is created"

test 'Popover links can be configured to not be opened with left clicks', ->
  expect 1

  popoverLink = @subject
    rootElement: "#ember-testing"
    openOnLeftClick: false

  @append()

  click '.popover-link'
  andThen ->
    ok isNotPresent('.popover'), "The popover is not created"

test 'Popover links can be configured to be opened with right clicks', ->
  expect 1

  popoverLink = @subject
    rootElement: "#ember-testing"
    openOnRightClick: true

  @append()

  triggerEvent '.popover-link', 'contextmenu'
  andThen ->
    ok isPresent('.popover'), "The popover is created"

test 'Popover links can be configured to not be opened with right clicks', ->
  expect 1

  popoverLink = @subject
    rootElement: "#ember-testing"
    openOnRightClick: false

  @append()

  triggerEvent '.popover-link', 'contextmenu'
  andThen ->
    ok isNotPresent('.popover'), "The popover is not created"

test 'Popover links do not bubble left click events when configured to open with left clicks', ->
  popoverLink = @subject
    rootElement: "#ember-testing"
    openOnLeftClick: true
    _openPopover: Ember.K

  @append()
  bubbled = Ember.run popoverLink, 'click'
  ok not bubbled, 'The event did not bubble'

test 'Popover links bubble left click events when not configured to open with left clicks', ->
  popoverLink = @subject
    rootElement: "#ember-testing"
    openOnLeftClick: false
    _openPopover: Ember.K

  @append()
  bubbled = Ember.run popoverLink, 'click'
  ok bubbled, 'The event bubbled'

test 'Popover links do not bubble right click events when configured to open with right clicks', ->
  popoverLink = @subject
    rootElement: "#ember-testing"
    openOnRightClick: true
    _openPopover: Ember.K

  @append()
  bubbled = Ember.run popoverLink, 'contextMenu'
  ok not bubbled, 'The event did not bubble'

test 'Popover links bubble right click events when not configured to open with right clicks', ->
  popoverLink = @subject
    rootElement: "#ember-testing"
    openOnRightClick: false
    _openPopover: Ember.K

  @append()
  bubbled = Ember.run popoverLink, 'contextMenu'
  ok bubbled, 'The event bubbled'

test 'Popover links can be configured to hide other popovers when opening', ->
  expect 2

  $(document).on 'popover:hide', ->
    ok true, 'The popover:hide event was triggered'

  popoverLink = @subject
    rootElement: "#ember-testing"
    hideOthers: true

  @append()
  click '.popover-link'
  andThen ->
    ok isPresent('.popover'), "The new popover was not hidden"

  $(document).off 'popover:hide'

test 'Popover links can be configured to not hide other popovers when opening', ->
    expect 1

    $(document).on 'popover:hide', ->
      ok false, 'The popover:hide event was not triggered'

    popoverLink = @subject
      rootElement: "#ember-testing"
      hideOthers: false

    @append()
    click '.popover-link'
    andThen ->
      ok isPresent('.popover'), "The new popover was not hidden"

    $(document).off 'popover:hide'
