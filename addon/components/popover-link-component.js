import Ember from 'ember';
import PopoverMixin from '../mixins/popover';
import PopoverComponent from './popover-component';

export default Ember.Component.extend({
  classNames: ['popover-link'],
  classNameBindings: ['disabled'],
  placement: 'top',
  content: null,
  title: null,
  contentViewClass: null,
  disabled: false,
  popoverClassNames: [],
  rootElement: '.ember-application',
  fade: true,
  openOnLeftClick: true,
  openOnRightClick: false,
  hideOthers: false,
  _popover: null,
  willDestroyElement: function() {
    var _ref;
    if ((_ref = this.get('_popover')) != null) {
      _ref.destroy();
    }
    return this._super();
  },
  _contentViewClass: Ember.computed(function() {
    var contentViewClass;
    contentViewClass = this.get('contentViewClass');
    if (typeof contentViewClass === 'string') {
      return Ember.get(contentViewClass);
    }
    return contentViewClass;
  }).property('contentViewClass'),
  _openPopover: function() {
    var popover, popoverView;
    if (this.get('disabled')) {
      return;
    }
    popover = this.get('_popover');
    if (((popover != null ? popover.get('_state') : void 0) || (popover != null ? popover.get('state') : void 0)) === 'inDOM') {
      return popover.hide();
    } else {
      if (this.get('hideOthers')) {
        PopoverComponent.hideAll();
      }
      popoverView = Ember.View.extend(PopoverMixin, {
        layoutName: 'popover-link-popover',
        classNames: this.get('popoverClassNames'),
        controller: this,
        targetElement: this.get('element'),
        container: this.get('container'),
        placement: Ember.computed.alias('controller.placement'),
        title: Ember.computed.alias('controller.title'),
        contentViewClass: this.get('_contentViewClass'),
        fade: this.get('fade')
      });
      popover = popoverView.create();
      this.set('_popover', popover);
      return popover.appendTo(this.get('rootElement'));
    }
  },
  click: function() {
    if (!this.get('openOnLeftClick')) {
      return true;
    }
    this._openPopover();
    return false;
  },
  contextMenu: function() {
    if (!this.get('openOnRightClick')) {
      return true;
    }
    this._openPopover();
    return false;
  }
});
