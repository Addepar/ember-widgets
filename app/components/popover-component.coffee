`import Ember from 'ember'`
`import PopoverMixin from '../mixins/popover'`

PopoverComponent = Ember.Component.extend PopoverMixin,
  rootElement: '.ember-application'
  hideAll: -> $(document).trigger('popover:hide')

  popup: (options) ->
    @hideAll()
    rootElement = options.rootElement or @rootElement
    popover = @create options
    if popover.get('targetObject.container')
      popover.set 'container', popover.get('targetObject.container')
    popover.appendTo rootElement
    popover

`export default PopoverComponent`
