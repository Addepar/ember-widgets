`import Ember from 'ember'`

LargeHeroAffixMixin = Ember.Mixin.create
  didInsertElement: ->
    @_super()
    $('.sub-navigation-sidebar').affix offset:
      top: 500
      bottom: 450
    # in case affix is already initialized and won't let us update options
    # we don't care, and just set it anyways
    $('.sub-navigation-sidebar').data('bs.affix').options.offset.top = 500

`export default LargeHeroAffixMixin`
