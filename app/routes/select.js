import Ember from 'ember';
import countries from '../utils/countries';

export default Ember.Route.extend({
  model: function() {
    return countries;
  }
});
