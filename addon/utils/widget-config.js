import Ember from 'ember';
import { getOwner } from '@ember/application';

var Config =  Ember.Object.extend({
  disableAnimations: Ember.computed(function(){
    return getOwner(this).lookup('config:environment');
  })
});

export default Config.create();
