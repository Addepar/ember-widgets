`import Ember from 'ember'`
`import TodaysDatePill from './controllers/base-non-editable-pill'`

TodaysDatePill = BaseNonEditablePill.extend
  name: "Today's Date"

  result: -> Date()

`export default TodaysDatePill`
