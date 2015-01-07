`import Ember from 'ember'`
transEndEventNames = {
  "WebkitTransition" : "webkitTransitionEnd"
  "MozTransition"    : "transitionend"
  "OTransition"      : "oTransitionEnd"
  "msTransition"     : "MSTransitionEnd"
  "transition"       : "transitionend"
}

transitionend = transEndEventNames[Modernizr.prefixed('transition')]

`export default transitionend`

