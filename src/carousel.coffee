# A lot of the javascript came from bootstrap.js
# The bootstrap behavior was limited in how you could treat the slide list as a
# circular ring. I.e., bootstrap would only allow you to return to first slide
# by going forwards if you were in the last slide. We want the ability to seem
# like the carousel is moving forwards even if we are on an earlier slide and
# then want to go to the first slide. For example, imagine you are in the middle
# of a wizard, you want to click finish, the results of that wizard bring up the
# same wizard it should seem like it is the next step, not that you are going
# backwards.
Ember.Widgets.CarouselComponent = Ember.Component.extend
  layoutName: 'carousel'
  classNames: ['carousel', 'slide']
  classNameBindings: ['sliding']
  activeIndex: 0

  didInsertElement: ->
    # suppose a content array is not specified in use case 1, we use jquery to
    # figure out how many carousel items are there. This allows us to generate
    # the correct number of carousel indicator
    @set 'content', new Array(@$('.item').length) if not @get('content')

  prev: ->
    return if @get('sliding')
    activeIndex = @get 'activeIndex'
    contentLength = @get 'content.length'
    nextIndex = activeIndex - 1
    nextIndex = if nextIndex < 0 then contentLength - 1 else nextIndex
    @slide 'prev', nextIndex

  next: ->
    return if @get('sliding')
    activeIndex = @get 'activeIndex'
    contentLength = @get 'content.length'
    nextIndex = activeIndex + 1
    nextIndex = if nextIndex >= contentLength then 0 else nextIndex
    @slide 'next', nextIndex

  to: (pos) ->
    return  unless 0 <= pos < @get('content.length')
    return @$().one('slid', => @to(pos)) if @get('sliding')
    direction = if pos > @get('activeIndex') then 'next' else 'prev'
    @slide direction, pos

  # TODO(Peter): Further emberized this by keeping the turth out of the DOM
  # We can use slide to transition to any slide with any animation direction.
  # E.g., by specifiying type = 'next' and next = first_slide_index, we can
  # transition to the first slide by moving to the right.
  #
  # type: next | prev
  # next: is the index of the next slide
  slide: (type, nextIndex) ->
    return if @get('activeIndex') is nextIndex
    direction = if type == 'next' then 'left' else 'right'
    $active = $(@$('.item').get(@get('activeIndex')))
    $next = $(@$('.item').get(nextIndex))

    @set 'sliding', yes
    $next.addClass(type)
    # force reflow
    $next[0].offsetWidth
    $active.addClass(direction)
    $next.addClass(direction)

    # Bootstrap has this method for listening on end of transition
    @$().one $.support.transition.end, =>
      # This code is async and ember-testing requires us to wrap any code with
      # asynchronous side-effects in an Ember.run
      Ember.run this, ->
        @set 'activeIndex', nextIndex
        $next.removeClass([type, direction].join(' ')).addClass('active')
        $active.removeClass(['active', direction].join(' '))
        @set 'sliding', no

Ember.Widgets.CarouselIndicator = Ember.View.extend
  classNameBindings: 'isActive:active'

  isActive: Ember.computed ->
    @get('contentIndex') is @get('controller.activeIndex')
  .property 'contentIndex', 'controller.activeIndex'

  click: ->
    @get('controller').to @get('contentIndex')

Ember.Widgets.CarouselItem = Ember.View.extend
  classNames: 'item'

Ember.Handlebars.helper('carousel-component', Ember.Widgets.CarouselComponent)
Ember.Handlebars.helper('carousel-item', Ember.Widgets.CarouselItem)
