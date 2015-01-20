`import Ember from 'ember'`

CarouselIndicator = Ember.View.extend
  classNameBindings: 'isActive:active'

  isActive: Ember.computed ->
    @get('contentIndex') is @get('controller.activeIndex')
  .property 'contentIndex', 'controller.activeIndex'

  click: ->
    @get('controller').to @get('contentIndex')

`export default CarouselIndicator`
