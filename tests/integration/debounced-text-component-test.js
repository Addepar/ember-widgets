import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';

moduleForComponent('debounced-text-component', '[Integration] Debounced Text Component', {
  integration: true,
});

test('Test debounced text', function(assert) {
  assert.expect(1);

  this.on('valueChanged', (newText) => {
    assert.equal(newText, 'foo',
      'valueChanged action is fired once when value changed');
  });

  this.render(hbs`{{debounced-text-component valueChanged='valueChanged'}}`);

  this.$('input').val('fo');
  this.$('input').change();
  this.$('input').val('foo');
  this.$('input').change();
  return wait();
});
