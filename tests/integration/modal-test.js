import Ember from "ember";
import qunit from 'qunit';
import startApp from '../helpers/start-app';
var App;
/*jshint -W079 */
var module = qunit.module;
var test = qunit.test;

module('An Integration test', {
 beforeEach: function() {
   App = startApp();
 },
 afterEach: function() {
   Ember.run(App, App.destroy);
 }
});

test("Page contents", function(assert) {
 assert.expect(1);

 visit('/modal').then(function() {
   assert.equal(
     find('.main-content-container h2').text(),
     "Modal  Ember.Widgets.Modal",
     "Page contains list of models"
   );
 });
});

test("Show modal works", function(assert) {
 assert.expect(1);

 visit('/modal');
 click('button:contains(Show Modal):eq(0)');
 andThen( function() {
  assert.equal(find('.modal-dialog').length, 1, "The modal is displayed");
 });
});
