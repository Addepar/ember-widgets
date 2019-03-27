import Ember from 'ember';
import NewPopoverModalAPIMixin from '../mixins/new-popover-modal-api';

/*
 * This base class should be used for components using `buildPopoverSpec()`
 * and `openPopoverSpec()` on the popover service. It is useful for any
 * kind of popup/alert/modal which does not share the behaviors of the
 * popover and modal classes, but which still benefits from the popover
 * infrastructure and rendering system.
 */
export default Ember.Component.extend(NewPopoverModalAPIMixin);
