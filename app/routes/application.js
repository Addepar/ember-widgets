import Ember from 'ember';

export default Ember.Route.extend({
  enter: function() {
    $(document).attr('title', 'Addepar | Ember Widget');
  }
});
