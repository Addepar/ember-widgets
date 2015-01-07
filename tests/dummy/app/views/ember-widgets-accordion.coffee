`import Ember from 'ember'`
`import SmallHeroAffixMixin from '.mixins/small-hero-affix'`
`import CodePrettyPrintMixin from '.mixins/code-pretty-print'`

EmberWidgetsAccordionView =
  Ember.View.extend(CodePrettyPrintMixin, SmallHeroAffixMixin)

`export default EmberWidgetsAccordionView`
