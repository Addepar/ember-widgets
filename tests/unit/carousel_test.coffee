carousel = null

moduleForComponent 'carousel', '[Unit] Carousel component',
  needs: [
    'template:ember-widgets-carousel'
  ]

  setup: ->
    Ember.Widgets.DISABLE_ANIMATIONS = yes

  teardown: ->
    Ember.run ->
      carousel.destroy()
    carousel = null
    Ember.Widgets.DISABLE_ANIMATIONS = no

test 'The action transitionEnded is sent after sliding', ->
  expect 1

  Ember.run =>
    carousel = @factory().extend
      actions:
        transitionEnded: ->
          ok yes, 'The action is sent after sliding'
    .create
      container: @container

    carousel.appendTo '#ember-testing'

  Ember.run ->
    carousel.slide('next', 1)
