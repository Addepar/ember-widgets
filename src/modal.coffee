Ember.Widgets.ModalComponent =
Ember.Component.extend Ember.Widgets.StyleBindingsMixin,
  layoutName: 'modal'
  classNames: ['modal']
  classNameBindings: ['isShowing:in', 'hasCloseButton::has-no-close-button', 'fadeEnabled:fade']
  modalPaneBackdrop: '<div class="modal-backdrop"></div>'
  bodyElementSelector: '.modal-backdrop'

  enforceModality:  no
  escToCancel:      yes
  backdrop:         yes
  isShowing:        no
  hasCloseButton:   yes
  fade:             yes
  headerText:       "Modal Header"
  confirmText:      "Confirm"
  cancelText:       "Cancel"
  closeText:        null
  content:          ""
  size:             "normal"
  isValid: true

  fadeEnabled: Ember.computed ->
    return false if Ember.Widgets.DISABLE_ANIMATIONS
    @get('fade')
  .property 'fade'

  confirm: Ember.K
  cancel: Ember.K
  close: Ember.K

  headerViewClass: Ember.View.extend
    templateName: 'modal_header'

  contentViewClass: Ember.View.extend
    template: Ember.Handlebars.compile("<p>{{content}}</p>")

  footerViewClass:  Ember.View.extend
    templateName: 'modal-footer'

  _headerViewClass: Ember.computed ->
    headerViewClass = @get 'headerViewClass'
    if typeof headerViewClass is 'string'
      Ember.get headerViewClass
    else headerViewClass
  .property 'headerViewClass'

  _contentViewClass: Ember.computed ->
    contentViewClass = @get 'contentViewClass'
    if typeof contentViewClass is 'string'
      Ember.get contentViewClass
    else contentViewClass
  .property 'contentViewClass'

  _footerViewClass: Ember.computed ->
    footerViewClass = @get 'footerViewClass'
    if typeof footerViewClass is 'string'
      Ember.get footerViewClass
    else footerViewClass
  .property 'footerViewClass'

  sizeClass: Ember.computed ->
    switch @get 'size'
      when 'large' then 'modal-lg'
      when 'small' then 'modal-sm'
      else ''
  .property 'size'

  actions:
    # Important: we do not want to send cancel after modal is closed.
    # It turns out that this happens sometimes which leads to undesire
    # behaviors
    sendCancel: ->
      return unless @get('isShowing')
      # NOTE: we support callback for backward compatibility.
      cancel = @get 'cancel'
      if typeof(cancel) is 'function' then @cancel(this)
      else @sendAction 'cancel'
      @hide()

    sendConfirm: ->
      return unless @get('isShowing')
      # NOTE: we support callback for backward compatibility.
      confirm = @get 'confirm'
      if typeof(confirm) is 'function' then @confirm(this)
      else @sendAction 'confirm'
      @hide()

    sendClose: ->
      return unless @get('isShowing')
      # NOTE: we support callback for backward compatibility.
      close = @get 'close'
      if typeof(close) is 'function' then @close(this)
      else @sendAction 'close'
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
    @_setupDocumentHandlers()

  willDestroyElement: ->
    @_super()
    @_removeDocumentHandlers()
    # remove backdrop
    @_backdrop.remove() if @_backdrop

  keyHandler: Ember.computed ->
    (event) =>
      if event.which is 27 and @get('escToCancel') # ESC
        @send 'sendCancel'

  click: (event) ->
    return unless event.target is event.currentTarget
    @send 'sendCancel' unless @get('enforceModality')

  hide: ->
    @set 'isShowing', no
    # bootstrap modal removes this class from the body when the modal closes
    # to transfer scroll behavior back to the app
    $(document.body).removeClass('modal-open')
    # fade out backdrop
    @_backdrop.removeClass('in') if @_backdrop
    if @get('fadeEnabled')
      # destroy modal after backdroop faded out. We need to wrap this in a
      # run-loop otherwise ember-testing will complain about auto run being
      # disabled when we are in testing mode.
      @$().one $.support.transition.end, => Ember.run this, @destroy
    else
      Ember.run this, @destroy

  _appendBackdrop: ->
    parentLayer = @$().parent()
    modalPaneBackdrop = @get 'modalPaneBackdrop'
    @_backdrop = jQuery(modalPaneBackdrop).addClass('fade') if @get('fadeEnabled')
    @_backdrop.appendTo(parentLayer)
    # show backdrop in next run loop so that it can fade in
    Ember.run.next this, -> @_backdrop.addClass('in')

  _setupDocumentHandlers: ->
    @_super()
    unless @_hideHandler
      @_hideHandler = => @hide()
      $(document).on 'modal:hide', @_hideHandler
    $(document).on 'keyup', @get('keyHandler')

  _removeDocumentHandlers: ->
    @_super()
    $(document).off 'modal:hide', @_hideHandler
    @_hideHandler = null
    $(document).off 'keyup', @get('keyHandler')

Ember.Widgets.ModalComponent.reopenClass
  rootElement: '.ember-application'
  poppedModal: null

  hideAll: -> $(document).trigger('modal:hide')

  popup: (options = {}) ->
    @hideAll()
    rootElement = options.rootElement or @rootElement
    modal = this.create options
    if modal.get('targetObject.container')
      modal.set 'container', modal.get('targetObject.container')
    modal.appendTo rootElement
    modal

Ember.Handlebars.helper('modal-component', Ember.Widgets.ModalComponent)
