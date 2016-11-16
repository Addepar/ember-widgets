import Ember from 'ember';

var Config =  Ember.Object.extend({
  disableAnimations: Ember.computed(function(){
    return this.container.lookup('config:environment');
  })
});

export default Config.create();
