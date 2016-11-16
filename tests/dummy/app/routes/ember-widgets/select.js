import Ember from 'ember';
import countryList from '../../data/countries';

export default Ember.Route.extend({
  model: function() {
    return countryList;
  }
});
