Ember.Widgets.ModalComponent =
Ember.Component.extend Ember.Widgets.StyleBindingsMixin,
  layoutName: 'modal'
  classNames: ['modal']
  classNameBindings: ['isShowing:in', 'fade']
  modalPaneBackdrop: '<div class="modal-backdrop"></div>'
  bodyElementSelector: '.modal-backdrop'

  enforceModality: no
  escToCancel:  yes
  backdrop:     yes
  isShowing:    no
  fade:         yes
  headerText:   "Modal Header"
  confirmText:  "Confirm"
  cancelText:   "Cancel"
  content:      ""
  contentViewClass: null

  defaultContentViewClass: Ember.View.extend
    templateName: 'component_default_content'

  _contentViewClass: Ember.computed ->
    contentViewClass = @get 'contentViewClass'
    return @get('defaultContentViewClass') unless contentViewClass
    if typeof contentViewClass is 'string'
      Ember.get @get('contentViewClass')
    else contentViewClass
  .property 'contentViewClass'

  actions:
    sendCancel: ->
      @sendAction 'cancel'
      @hide()

    sendConfirm: ->
      @sendAction 'confirm'
      @hide()

  didInsertElement: ->
    @_super()
    # See force reflow at http://stackoverflow.com/questions/9016307/
    # force-reflow-in-css-transitions-in-bootstrap
    @$()[0].offsetWidth if @get('fade')
    # append backdrop
    @_appendBackdrop() if @get('backdrop')
    # show modal in next run loop so that it will fade in instead of appearing
    # abruptly on the screen
    Ember.run.next this, -> @set 'isShowing', yes
    # bootstrap modal adds this class to the body when the modal opens to
    # transfer scroll behavior to the modal
    $(document.body).addClass('modal-open')
    # add key handler
    $(document).on('keyup', _self: this, @keyHandler)

  keyHandler: (event) ->
    _self = event.data._self
    if event.which == 27 # ESC
      return if not _self.escToCancel
      _self.hide()

  click: (event) ->
    return if event.target isnt event.currentTarget
    @hide() unless @get('enforceModality')

  hide: ->
    @set 'isShowing', no
    # bootstrap modal removes this class from the body when the modal closes
    # to transfer scroll behavior back to the app
    $(document.body).removeClass('modal-open')
    # remove key handler
    $(document).off('keyup', @keyHandler)
    # fade out backdrop
    @_backdrop.removeClass('in')
    # remove backdrop and destroy modal only after transition is completed
    @$().one $.support.transition.end, =>
      @_backdrop.remove() if @_backdrop
      @destroy()

  _appendBackdrop: ->
    parentLayer = @$().parent()
    modalPaneBackdrop = @get 'modalPaneBackdrop'
    @_backdrop = jQuery(modalPaneBackdrop).addClass('fade') if @get('fade')
    @_backdrop.appendTo(parentLayer)
    # show backdrop in next run loop so that it can fade in
    Ember.run.next this, -> @_backdrop.addClass('in')

Ember.Widgets.ModalComponent.reopenClass
  rootElement: '.ember-application'
  hideAll: ->

  popup: (options = {}) ->
    rootElement = options.rootElement or @rootElement
    modal = this.create options
    modal.container = modal.get('targetObject.container')
    modal.appendTo rootElement
    modal

Ember.Handlebars.helper('modal-component', Ember.Widgets.ModalComponent)
