`import Ember from 'ember'`
`import BaseNonEditablePill from '../controllers/base-non-editable-pill'`

TodaysDatePill = BaseNonEditablePill.extend
  name: "Today's Date"

  result: -> Date()

`export default TodaysDatePill`
