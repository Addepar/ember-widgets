// Last commit: 278bd97 (2014-08-03 23:35:17 -0400)


// ==========================================================================
// Project:   Ember ListView
// Copyright: ©2012-2013 Erik Bryn, Yapp Inc., and contributors.
// License:   Licensed under MIT license
// ==========================================================================


(function() {
var get = Ember.get, set = Ember.set;

function samePosition(a, b) {
  return a && b && a.x === b.x && a.y === b.y;
}

function positionElement() {
  var element, position, _position;

  Ember.instrument('view.updateContext.positionElement', this, function() {
    element = get(this, 'element');
    position = this.position;
    _position = this._position;

    if (!position || !element) { return; }

    // TODO: avoid needing this by avoiding unnecessary
    // calls to this method in the first place
    if (samePosition(position, _position)) { return; }
    Ember.run.schedule('render', this, this._parentView.applyTransform, element, position.x, position.y);
    this._position = position;
  }, this);
}

Ember.ListItemViewMixin = Ember.Mixin.create({
  init: function(){
    this._super();
    this.one('didInsertElement', positionElement);
  },
  classNames: ['ember-list-item-view'],
  _position: null,
  updatePosition: function(position) {
    this.position = position;
    this._positionElement();
  },
  _positionElement: positionElement
});

})();



(function() {
var get = Ember.get, set = Ember.set;

var backportedInnerString = function(buffer) {
  var content = [], childBuffers = buffer.childBuffers;

  Ember.ArrayPolyfills.forEach.call(childBuffers, function(buffer) {
    var stringy = typeof buffer === 'string';
    if (stringy) {
      content.push(buffer);
    } else {
      buffer.array(content);
    }
  });

  return content.join('');
};

function willInsertElementIfNeeded(view) {
  if (view.willInsertElement) {
    view.willInsertElement();
  }
}

function didInsertElementIfNeeded(view) {
  if (view.didInsertElement) {
    view.didInsertElement();
  }
}

function rerender() {
  var element, buffer, context, hasChildViews;
  element = get(this, 'element');

  if (!element) { return; }

  context = get(this, 'context');

  // releases action helpers in contents
  // this means though that the ListItemView itself can't use classBindings or attributeBindings
  // need support for rerender contents in ember
  this.triggerRecursively('willClearRender');

  if (this.lengthAfterRender > this.lengthBeforeRender) {
    this.clearRenderedChildren();
    this._childViews.length = this.lengthBeforeRender; // triage bug in ember
  }

  if (context) {
    buffer = Ember.RenderBuffer();
    buffer = this.renderToBuffer(buffer);

    // check again for childViews, since rendering may have added some
    hasChildViews = this._childViews.length > 0;

    if (hasChildViews) {
      this.invokeRecursively(willInsertElementIfNeeded, false);
    }

    element.innerHTML = buffer.innerString ? buffer.innerString() : backportedInnerString(buffer);

    set(this, 'element', element);

    this.transitionTo('inDOM');

    if (hasChildViews) {
      this.invokeRecursively(didInsertElementIfNeeded, false);
    }
  } else {
    element.innerHTML = ''; // when there is no context, this view should be completely empty
  }
}

/**
  The `Ember.ListItemView` view class renders a
  [div](https://developer.mozilla.org/en/HTML/Element/div) HTML element
  with `ember-list-item-view` class. It allows you to specify a custom item
  handlebars template for `Ember.ListView`.

  Example:

  ```handlebars
  <script type="text/x-handlebars" data-template-name="row_item">
    {{name}}
  </script>
  ```

  ```javascript
  App.ListView = Ember.ListView.extend({
    height: 500,
    rowHeight: 20,
    itemViewClass: Ember.ListItemView.extend({templateName: "row_item"})
  });
  ```

  @extends Ember.View
  @class ListItemView
  @namespace Ember
*/
Ember.ListItemView = Ember.View.extend(Ember.ListItemViewMixin, {
  updateContext: function(newContext){
    var context = get(this, 'context');
    Ember.instrument('view.updateContext.render', this, function() {
      if (context !== newContext) {
        set(this, 'context', newContext);
        if (newContext && newContext.isController) {
          set(this, 'controller', newContext);
        }
      }
    }, this);
  },
  rerender: function () { Ember.run.scheduleOnce('render', this, rerender); },
  _contextDidChange: Ember.observer(rerender, 'context', 'controller')
});

})();



(function() {
var get = Ember.get, set = Ember.set;

Ember.ReusableListItemView = Ember.View.extend(Ember.ListItemViewMixin, {
  init: function(){
    this._super();
    var context = Ember.ObjectProxy.create();
    this.set('context', context);
    this._proxyContext = context;
  },
  isVisible: Ember.computed('context.content', function(){
    return !!this.get('context.content');
  }),
  updateContext: function(newContext){
    var context = get(this._proxyContext, 'content'), state;

    // Support old and new Ember versions
    state = this._state || this.state;

    if (context !== newContext) {
      if (state === 'inDOM') {
        this.prepareForReuse(newContext);
      }

      set(this._proxyContext, 'content', newContext);

      if (newContext && newContext.isController) {
        set(this, 'controller', newContext);
      }
    }
  },
  prepareForReuse: Ember.K
});

})();



(function() {
var el = document.createElement('div'), style = el.style;

var propPrefixes = ['Webkit', 'Moz', 'O', 'ms'];

function testProp(prop) {
  if (prop in style) return prop;
  var uppercaseProp = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i=0; i<propPrefixes.length; i++) {
    var prefixedProp = propPrefixes[i] + uppercaseProp;
    if (prefixedProp in style) {
      return prefixedProp;
    }
  }
  return null;
}

var transformProp = testProp('transform');
var perspectiveProp = testProp('perspective');

var supports2D = transformProp !== null;
var supports3D = perspectiveProp !== null;

Ember.ListViewHelper = {
  transformProp: transformProp,
  applyTransform: (function(){
    if (supports2D) {
      return function(element, x, y){
        element.style[transformProp] = 'translate(' + x + 'px, ' + y + 'px)';
      };
    } else {
      return function(element, x, y){
        element.style.top  = y + 'px';
        element.style.left = x + 'px';
      };
    }
  })(),
  apply3DTransform: (function(){
    if (supports3D) {
      return function(element, x, y){
        element.style[transformProp] = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
      };
    } else if (supports2D) {
      return function(element, x, y){
        element.style[transformProp] = 'translate(' + x + 'px, ' + y + 'px)';
      };
    } else {
      return function(element, x, y){
        element.style.top  = y + 'px';
        element.style.left = x + 'px';
      };
    }
  })()
};

})();



(function() {
var get = Ember.get, set = Ember.set,
min = Math.min, max = Math.max, floor = Math.floor,
ceil = Math.ceil,
forEach = Ember.ArrayPolyfills.forEach;

function addContentArrayObserver() {
  var content = get(this, 'content');
  if (content) {
    content.addArrayObserver(this);
  }
}

function removeAndDestroy(object){
  this.removeObject(object);
  object.destroy();
}

function syncChildViews(){
  Ember.run.once(this, '_syncChildViews');
}

function sortByContentIndex (viewOne, viewTwo){
  return get(viewOne, 'contentIndex') - get(viewTwo, 'contentIndex');
}

function notifyMutationListeners() {
  if (Ember.View.notifyMutationListeners) {
    Ember.run.once(Ember.View, 'notifyMutationListeners');
  }
}

function removeEmptyView() {
  var emptyView = get(this, 'emptyView');
  if (emptyView && emptyView instanceof Ember.View) {
    emptyView.removeFromParent();
  }
}

function addEmptyView() {
  var emptyView = get(this, 'emptyView');

  if (!emptyView) { return; }

  if ('string' === typeof emptyView) {
    emptyView = get(emptyView) || emptyView;
  }

  emptyView = this.createChildView(emptyView);
  set(this, 'emptyView', emptyView);

  if (Ember.CoreView.detect(emptyView)) {
    this._createdEmptyView = emptyView;
  }

  this.unshiftObject(emptyView);
}

var domManager = Ember.create(Ember.ContainerView.proto().domManager);

domManager.prepend = function(view, html) {
  view.$('.ember-list-container').prepend(html);
  notifyMutationListeners();
};



function enableProfilingOutput() {
  function before(name, time, payload) {
    console.time(name);
  }

  function after (name, time, payload) {
    console.timeEnd(name);
  }

  if (Ember.ENABLE_PROFILING) {
    Ember.subscribe('view._scrollContentTo', {
      before: before,
      after: after
    });
    Ember.subscribe('view.updateContext', {
      before: before,
      after: after
    });
  }
}

/**
  @class Ember.ListViewMixin
  @namespace Ember
*/
Ember.ListViewMixin = Ember.Mixin.create({
  itemViewClass: Ember.ReusableListItemView,
  emptyViewClass: Ember.View,
  classNames: ['ember-list-view'],
  attributeBindings: ['style'],
  domManager: domManager,
  scrollTop: 0,
  bottomPadding: 0,
  _lastEndingIndex: 0,
  paddingCount: 1,

  /**
    @private

    Setup a mixin.
    - adding observer to content array
    - creating child views based on height and length of the content array

    @method init
  */
  init: function() {
    this._super();
    this.on('didInsertElement', this._syncListContainerWidth);
    this.columnCountDidChange();
    this._syncChildViews();
    this._addContentArrayObserver();
  },

  _addContentArrayObserver: Ember.beforeObserver(function() {
    addContentArrayObserver.call(this);
  }, 'content'),

  /**
    Called on your view when it should push strings of HTML into a
    `Ember.RenderBuffer`.

    Adds a [div](https://developer.mozilla.org/en-US/docs/HTML/Element/div)
    with a required `ember-list-container` class.

    @method render
    @param {Ember.RenderBuffer} buffer The render buffer
  */
  render: function(buffer) {
    buffer.push('<div class="ember-list-container">');
    this._super(buffer);
    buffer.push('</div>');
  },

  willInsertElement: function() {
    if (!this.get("height") || !this.get("rowHeight")) {
      throw new Error("A ListView must be created with a height and a rowHeight.");
    }
    this._super();
  },

  /**
    @private

    Sets inline styles of the view:
    - height
    - width
    - position
    - overflow
    - -webkit-overflow
    - overflow-scrolling

    Called while attributes binding.

    @property {Ember.ComputedProperty} style
  */
  style: Ember.computed('height', 'width', function() {
    var height, width, style, css;

    height = get(this, 'height');
    width = get(this, 'width');
    css = get(this, 'css');

    style = '';

    if (height) { style += 'height:' + height + 'px;'; }
    if (width)  { style += 'width:'  + width  + 'px;'; }

    for ( var rule in css ){
      if (css.hasOwnProperty(rule)) {
        style += rule + ':' + css[rule] + ';';
      }
    }

    return style;
  }),

  /**
    @private

    Performs visual scrolling. Is overridden in Ember.ListView.

    @method scrollTo
  */
  scrollTo: function(y) {
    throw new Error('must override to perform the visual scroll and effectively delegate to _scrollContentTo');
  },

  /**
    @private

    Internal method used to force scroll position

    @method scrollTo
  */
  _scrollTo: Ember.K,

  /**
    @private
    @method _scrollContentTo
  */
  _scrollContentTo: function(y) {
    var startingIndex, endingIndex,
        contentIndex, visibleEndingIndex, maxContentIndex,
        contentIndexEnd, contentLength, scrollTop, content;

    scrollTop = max(0, y);

    if (this.scrollTop === scrollTop) {
      return;
    }

    // allow a visual overscroll, but don't scroll the content. As we are doing needless
    // recycyling, and adding unexpected nodes to the DOM.
    var maxScrollTop = max(0, get(this, 'totalHeight') - get(this, 'height'));
    scrollTop = min(scrollTop, maxScrollTop);

    content = get(this, 'content');
    contentLength = get(content, 'length');
    startingIndex = this._startingIndex(contentLength);

    Ember.instrument('view._scrollContentTo', {
      scrollTop: scrollTop,
      content: content,
      startingIndex: startingIndex,
      endingIndex: min(max(contentLength - 1, 0), startingIndex + this._numChildViewsForViewport())
    }, function () {
      this.scrollTop = scrollTop;

      maxContentIndex = max(contentLength - 1, 0);

      startingIndex = this._startingIndex();
      visibleEndingIndex = startingIndex + this._numChildViewsForViewport();

      endingIndex = min(maxContentIndex, visibleEndingIndex);

      if (startingIndex === this._lastStartingIndex &&
          endingIndex === this._lastEndingIndex) {

        this.trigger('scrollYChanged', y);
        return;
      } else {

        Ember.run(this, function(){
          this._reuseChildren();

          this._lastStartingIndex = startingIndex;
          this._lastEndingIndex = endingIndex;
          this.trigger('scrollYChanged', y);
        });
      }
    }, this);

  },

  /**
    @private

    Computes the height for a `Ember.ListView` scrollable container div.
    You must specify `rowHeight` parameter for the height to be computed properly.

    @property {Ember.ComputedProperty} totalHeight
  */
  totalHeight: Ember.computed('content.length', 'rowHeight', 'columnCount', 'bottomPadding', function() {
    var contentLength, rowHeight, columnCount, bottomPadding;

    contentLength = get(this, 'content.length');
    rowHeight = get(this, 'rowHeight');
    columnCount = get(this, 'columnCount');
    bottomPadding = get(this, 'bottomPadding');

    return ((ceil(contentLength / columnCount)) * rowHeight) + bottomPadding;
  }),

  /**
    @private
    @method _prepareChildForReuse
  */
  _prepareChildForReuse: function(childView) {
    childView.prepareForReuse();
  },

  /**
    @private
    @method _reuseChildForContentIndex
  */
  _reuseChildForContentIndex: function(childView, contentIndex) {
    var content, context, newContext, childsCurrentContentIndex, position, enableProfiling;

    content = get(this, 'content');
    enableProfiling = get(this, 'enableProfiling');
    position = this.positionForIndex(contentIndex);
    childView.updatePosition(position);

    set(childView, 'contentIndex', contentIndex);

    if (enableProfiling) {
      Ember.instrument('view._reuseChildForContentIndex', position, function(){}, this);
    }

    newContext = content.objectAt(contentIndex);
    childView.updateContext(newContext);
  },

  /**
    @private
    @method positionForIndex
  */
  positionForIndex: function(index){
    var elementWidth, width, columnCount, rowHeight, y, x;

    elementWidth = get(this, 'elementWidth') || 1;
    width = get(this, 'width') || 1;
    columnCount = get(this, 'columnCount');
    rowHeight = get(this, 'rowHeight');

    y = (rowHeight * floor(index/columnCount));
    x = (index % columnCount) * elementWidth;

    return {
      y: y,
      x: x
    };
  },

  /**
    @private
    @method _childViewCount
  */
  _childViewCount: function() {
    var contentLength, childViewCountForHeight;

    contentLength = get(this, 'content.length');
    childViewCountForHeight = this._numChildViewsForViewport();

    return min(contentLength, childViewCountForHeight);
  },

  /**
    @private

    Returns a number of columns in the Ember.ListView (for grid layout).

    If you want to have a multi column layout, you need to specify both
    `width` and `elementWidth`.

    If no `elementWidth` is specified, it returns `1`. Otherwise, it will
    try to fit as many columns as possible for a given `width`.

    @property {Ember.ComputedProperty} columnCount
  */
  columnCount: Ember.computed('width', 'elementWidth', function() {
    var elementWidth, width, count;

    elementWidth = get(this, 'elementWidth');
    width = get(this, 'width');

    if (elementWidth && width > elementWidth) {
      count = floor(width / elementWidth);
    } else {
      count = 1;
    }

    return count;
  }),

  /**
    @private

    Fires every time column count is changed.

    @event columnCountDidChange
  */
  columnCountDidChange: Ember.observer(function(){
    var ratio, currentScrollTop, proposedScrollTop, maxScrollTop,
        scrollTop, lastColumnCount, newColumnCount, element;

    lastColumnCount = this._lastColumnCount;

    currentScrollTop = this.scrollTop;
    newColumnCount = get(this, 'columnCount');
    maxScrollTop = get(this, 'maxScrollTop');
    element = get(this, 'element');

    this._lastColumnCount = newColumnCount;

    if (lastColumnCount) {
      ratio = (lastColumnCount / newColumnCount);
      proposedScrollTop = currentScrollTop * ratio;
      scrollTop = min(maxScrollTop, proposedScrollTop);

      this._scrollTo(scrollTop);
      this.scrollTop = scrollTop;
    }

    if (arguments.length > 0) {
      // invoked by observer
      Ember.run.schedule('afterRender', this, this._syncListContainerWidth);
    }
  }, 'columnCount'),

  /**
    @private

    Computes max possible scrollTop value given the visible viewport
    and scrollable container div height.

    @property {Ember.ComputedProperty} maxScrollTop
  */
  maxScrollTop: Ember.computed('height', 'totalHeight', function(){
    var totalHeight, viewportHeight;

    totalHeight = get(this, 'totalHeight');
    viewportHeight = get(this, 'height');

    return max(0, totalHeight - viewportHeight);
  }),

  /**
    @private

    Determines whether the emptyView is the current childView.

    @method _isChildEmptyView
  */
  _isChildEmptyView: function() {
    var emptyView = get(this, 'emptyView');

    return emptyView && emptyView instanceof Ember.View &&
           this._childViews.length === 1 && this._childViews.indexOf(emptyView) === 0;
  },

  /**
    @private

    Computes the number of views that would fit in the viewport area.
    You must specify `height` and `rowHeight` parameters for the number of
    views to be computed properly.

    @method _numChildViewsForViewport
  */
  _numChildViewsForViewport: function() {
    var height, rowHeight, paddingCount, columnCount;

    height = get(this, 'height');
    rowHeight = get(this, 'rowHeight');
    paddingCount = get(this, 'paddingCount');
    columnCount = get(this, 'columnCount');

    return (ceil(height / rowHeight) * columnCount) + (paddingCount * columnCount);
  },

  /**
    @private

    Computes the starting index of the item views array.
    Takes `scrollTop` property of the element into account.

    Is used in `_syncChildViews`.

    @method _startingIndex
  */
  _startingIndex: function(_contentLength) {
    var scrollTop, rowHeight, columnCount, calculatedStartingIndex,
        contentLength, largestStartingIndex;

    if (_contentLength === undefined) {
      contentLength = get(this, 'content.length');
    } else {
      contentLength = _contentLength;
    }

    scrollTop = this.scrollTop;
    rowHeight = get(this, 'rowHeight');
    columnCount = get(this, 'columnCount');

    calculatedStartingIndex = floor(scrollTop / rowHeight) * columnCount;

    largestStartingIndex = max(contentLength - 1, 0);

    return min(calculatedStartingIndex, largestStartingIndex);
  },

  /**
    @private
    @event contentWillChange
  */
  contentWillChange: Ember.beforeObserver(function() {
    var content;

    content = get(this, 'content');

    if (content) {
      content.removeArrayObserver(this);
    }
  }, 'content'),

  /**),
    @private
    @event contentDidChange
  */
  contentDidChange: Ember.observer(function() {
    addContentArrayObserver.call(this);
    syncChildViews.call(this);
  }, 'content'),

  /**
    @private
    @property {Function} needsSyncChildViews
  */
  needsSyncChildViews: Ember.observer(syncChildViews, 'height', 'width', 'columnCount'),

  /**
    @private

    Returns a new item view. Takes `contentIndex` to set the context
    of the returned view properly.

    @param {Number} contentIndex item index in the content array
    @method _addItemView
  */
  _addItemView: function(contentIndex){
    var itemViewClass, childView;

    itemViewClass = get(this, 'itemViewClass');
    childView = this.createChildView(itemViewClass);

    this.pushObject(childView);
   },

  /**
    @private

    Intelligently manages the number of childviews.

    @method _syncChildViews
   **/
  _syncChildViews: function(){
    var childViews, childViewCount,
        numberOfChildViews, numberOfChildViewsNeeded,
        contentIndex, startingIndex, endingIndex,
        contentLength, emptyView, count, delta;

    if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
      return;
    }

    contentLength = get(this, 'content.length');
    emptyView = get(this, 'emptyView');

    childViewCount = this._childViewCount();
    childViews = this.positionOrderedChildViews();

    if (this._isChildEmptyView()) {
      removeEmptyView.call(this);
    }

    startingIndex = this._startingIndex();
    endingIndex = startingIndex + childViewCount;

    numberOfChildViewsNeeded = childViewCount;
    numberOfChildViews = childViews.length;

    delta = numberOfChildViewsNeeded - numberOfChildViews;

    if (delta === 0) {
      // no change
    } else if (delta > 0) {
      // more views are needed
      contentIndex = this._lastEndingIndex;

      for (count = 0; count < delta; count++, contentIndex++) {
        this._addItemView(contentIndex);
      }
    } else {
      // less views are needed
      forEach.call(
        childViews.splice(numberOfChildViewsNeeded, numberOfChildViews),
        removeAndDestroy,
        this
      );
    }

    this._reuseChildren();

    this._lastStartingIndex = startingIndex;
    this._lastEndingIndex   = this._lastEndingIndex + delta;

    if (contentLength === 0 || contentLength === undefined) {
      addEmptyView.call(this);
    }
  },

  /**
    @private

    Applies an inline width style to the list container.

    @method _syncListContainerWidth
   **/
  _syncListContainerWidth: function(){
    var elementWidth, columnCount, containerWidth, element;

    elementWidth = get(this, 'elementWidth');
    columnCount = get(this, 'columnCount');
    containerWidth = elementWidth * columnCount;
    element = this.$('.ember-list-container');

    if (containerWidth && element) {
      element.css('width', containerWidth);
    }
  },

  /**
    @private
    @method _reuseChildren
  */
  _reuseChildren: function(){
    var contentLength, childViews, childViewsLength,
        startingIndex, endingIndex, childView, attrs,
        contentIndex, visibleEndingIndex, maxContentIndex,
        contentIndexEnd, scrollTop;

    scrollTop = this.scrollTop;
    contentLength = get(this, 'content.length');
    maxContentIndex = max(contentLength - 1, 0);
    childViews = this.getReusableChildViews();
    childViewsLength =  childViews.length;

    startingIndex = this._startingIndex();
    visibleEndingIndex = startingIndex + this._numChildViewsForViewport();

    endingIndex = min(maxContentIndex, visibleEndingIndex);

    contentIndexEnd = min(visibleEndingIndex, startingIndex + childViewsLength);

    for (contentIndex = startingIndex; contentIndex < contentIndexEnd; contentIndex++) {
      childView = childViews[contentIndex % childViewsLength];
      this._reuseChildForContentIndex(childView, contentIndex);
    }
  },

  /**
    @private
    @method getReusableChildViews
  */
  getReusableChildViews: function() {
    return this._childViews;
  },

  /**
    @private
    @method positionOrderedChildViews
  */
  positionOrderedChildViews: function() {
    return this.getReusableChildViews().sort(sortByContentIndex);
  },

  arrayWillChange: Ember.K,

  /**
    @private
    @event arrayDidChange
  */
  // TODO: refactor
  arrayDidChange: function(content, start, removedCount, addedCount) {
    var index, contentIndex, state;

    removeEmptyView.call(this);

    // Support old and new Ember versions
    state = this._state || this.state;

    if (state === 'inDOM') {
      // ignore if all changes are out of the visible change
      if( start >= this._lastStartingIndex || start < this._lastEndingIndex) {
        index = 0;
        // ignore all changes not in the visible range
        // this can re-position many, rather then causing a cascade of re-renders
        forEach.call(
          this.positionOrderedChildViews(),
          function(childView) {
            contentIndex = this._lastStartingIndex + index;
            this._reuseChildForContentIndex(childView, contentIndex);
            index++;
          },
          this
        );
      }

      syncChildViews.call(this);
    }
  },

  destroy: function () {
    if (!this._super()) { return; }

    if (this._createdEmptyView) {
      this._createdEmptyView.destroy();
    }

    return this;
  }
});

})();



(function() {
var get = Ember.get, set = Ember.set;

/**
  The `Ember.ListView` view class renders a
  [div](https://developer.mozilla.org/en/HTML/Element/div) HTML element,
  with `ember-list-view` class.

  The context of each item element within the `Ember.ListView` are populated
  from the objects in the `Element.ListView`'s `content` property.

  ### `content` as an Array of Objects

  The simplest version of an `Ember.ListView` takes an array of object as its
  `content` property. The object will be used as the `context` each item element
  inside the rendered `div`.

  Example:

  ```javascript
  App.ContributorsRoute = Ember.Route.extend({
    model: function() {
      return [{ name: 'Stefan Penner' }, { name: 'Alex Navasardyan' }, { name: 'Ray Cohen'}];
    }
  });
  ```

  ```handlebars
  {{#ember-list items=contributors height=500 rowHeight=50}}
    {{name}}
  {{/ember-list}}
  ```

  Would result in the following HTML:

  ```html
   <div id="ember181" class="ember-view ember-list-view" style="height:500px;width:500px;position:relative;overflow:scroll;-webkit-overflow-scrolling:touch;overflow-scrolling:touch;">
    <div class="ember-list-container">
      <div id="ember186" class="ember-view ember-list-item-view" style="-webkit-transform: translate3d(0px, 0px, 0);">
        <script id="metamorph-0-start" type="text/x-placeholder"></script>Stefan Penner<script id="metamorph-0-end" type="text/x-placeholder"></script>
      </div>
      <div id="ember187" class="ember-view ember-list-item-view" style="-webkit-transform: translate3d(0px, 50px, 0);">
        <script id="metamorph-1-start" type="text/x-placeholder"></script>Alex Navasardyan<script id="metamorph-1-end" type="text/x-placeholder"></script>
      </div>
      <div id="ember188" class="ember-view ember-list-item-view" style="-webkit-transform: translate3d(0px, 100px, 0);">
        <script id="metamorph-2-start" type="text/x-placeholder"></script>Rey Cohen<script id="metamorph-2-end" type="text/x-placeholder"></script>
      </div>
      <div id="ember189" class="ember-view ember-list-scrolling-view" style="height: 150px"></div>
    </div>
  </div>
  ```

  By default `Ember.ListView` provides support for `height`,
  `rowHeight`, `width`, `elementWidth`, `scrollTop` parameters.

  Note, that `height` and `rowHeight` are required parameters.

  ```handlebars
  {{#ember-list items=this height=500 rowHeight=50}}
    {{name}}
  {{/ember-list}}
  ```

  If you would like to have multiple columns in your view layout, you can
  set `width` and `elementWidth` parameters respectively.

  ```handlebars
  {{#ember-list items=this height=500 rowHeight=50 width=500 elementWidth=80}}
    {{name}}
  {{/ember-list}}
  ```

  ### extending `Ember.ListView`

  Example:

  ```handlebars
  {{view App.ListView contentBinding="content"}}

  <script type="text/x-handlebars" data-template-name="row_item">
    {{name}}
  </script>
  ```

  ```javascript
  App.ListView = Ember.ListView.extend({
    height: 500,
    width: 500,
    elementWidth: 80,
    rowHeight: 20,
    itemViewClass: Ember.ListItemView.extend({templateName: "row_item"})
  });
  ```

  @extends Ember.ContainerView
  @class ListView
  @namespace Ember
*/
Ember.ListView = Ember.ContainerView.extend(Ember.ListViewMixin, {
  css: {
    position: 'relative',
    overflow: 'auto',
    '-webkit-overflow-scrolling': 'touch',
    'overflow-scrolling': 'touch'
  },

  applyTransform: Ember.ListViewHelper.applyTransform,

  _scrollTo: function(scrollTop) {
    var element = get(this, 'element');

    if (element) { element.scrollTop = scrollTop; }
  },

  didInsertElement: function() {
    var that = this,
        element = get(this, 'element');

    this._updateScrollableHeight();

    this._scroll = function(e) { that.scroll(e); };

    Ember.$(element).on('scroll', this._scroll);
  },

  willDestroyElement: function() {
    var element;

    element = get(this, 'element');

    Ember.$(element).off('scroll', this._scroll);
  },

  scroll: function(e) {
    this.scrollTo(e.target.scrollTop);
  },

  scrollTo: function(y){
    var element = get(this, 'element');
    this._scrollTo(y);
    this._scrollContentTo(y);
  },

  totalHeightDidChange: Ember.observer(function () {
    Ember.run.scheduleOnce('afterRender', this, this._updateScrollableHeight);
  }, 'totalHeight'),

  _updateScrollableHeight: function () {
    var height, state;

    // Support old and new Ember versions
    state = this._state || this.state;

    if (state === 'inDOM') {
      // if the list is currently displaying the emptyView, remove the height
      if (this._isChildEmptyView()) {
          height = '';
      } else {
          height = get(this, 'totalHeight');
      }

      this.$('.ember-list-container').css({
        height: height
      });
    }
  }
});

})();



(function() {
var fieldRegex = /input|textarea|select/i,
  hasTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
  handleStart, handleMove, handleEnd, handleCancel,
  startEvent, moveEvent, endEvent, cancelEvent;
if (hasTouch) {
  startEvent = 'touchstart';
  handleStart = function (e) {
    var touch = e.touches[0],
      target = touch && touch.target;
    // avoid e.preventDefault() on fields
    if (target && fieldRegex.test(target.tagName)) {
      return;
    }
    bindWindow(this.scrollerEventHandlers);
    this.willBeginScroll(e.touches, e.timeStamp);
    e.preventDefault();
  };
  moveEvent = 'touchmove';
  handleMove = function (e) {
    this.continueScroll(e.touches, e.timeStamp);
  };
  endEvent = 'touchend';
  handleEnd = function (e) {
    // if we didn't end up scrolling we need to
    // synthesize click since we did e.preventDefault()
    // on touchstart
    if (!this._isScrolling) {
      synthesizeClick(e);
    }
    unbindWindow(this.scrollerEventHandlers);
    this.endScroll(e.timeStamp);
  };
  cancelEvent = 'touchcancel';
  handleCancel = function (e) {
    unbindWindow(this.scrollerEventHandlers);
    this.endScroll(e.timeStamp);
  };
} else {
  startEvent = 'mousedown';
  handleStart = function (e) {
    if (e.which !== 1) return;
    var target = e.target;
    // avoid e.preventDefault() on fields
    if (target && fieldRegex.test(target.tagName)) {
      return;
    }
    bindWindow(this.scrollerEventHandlers);
    this.willBeginScroll([e], e.timeStamp);
    e.preventDefault();
  };
  moveEvent = 'mousemove';
  handleMove = function (e) {
    this.continueScroll([e], e.timeStamp);
  };
  endEvent = 'mouseup';
  handleEnd = function (e) {
    unbindWindow(this.scrollerEventHandlers);
    this.endScroll(e.timeStamp);
  };
  cancelEvent = 'mouseout';
  handleCancel = function (e) {
    if (e.relatedTarget) return;
    unbindWindow(this.scrollerEventHandlers);
    this.endScroll(e.timeStamp);
  };
}

function handleWheel(e) {
  this.mouseWheel(e);
  e.preventDefault();
}

function bindElement(el, handlers) {
  el.addEventListener(startEvent, handlers.start, false);
  el.addEventListener('mousewheel', handlers.wheel, false);
}

function unbindElement(el, handlers) {
  el.removeEventListener(startEvent, handlers.start, false);
  el.removeEventListener('mousewheel', handlers.wheel, false);
}

function bindWindow(handlers) {
  window.addEventListener(moveEvent, handlers.move, true);
  window.addEventListener(endEvent, handlers.end, true);
  window.addEventListener(cancelEvent, handlers.cancel, true);
}

function unbindWindow(handlers) {
  window.removeEventListener(moveEvent, handlers.move, true);
  window.removeEventListener(endEvent, handlers.end, true);
  window.removeEventListener(cancelEvent, handlers.cancel, true);
}

Ember.VirtualListScrollerEvents = Ember.Mixin.create({
  init: function() {
    this.on('didInsertElement', this, 'bindScrollerEvents');
    this.on('willDestroyElement', this, 'unbindScrollerEvents');
    this.scrollerEventHandlers = {
      start: bind(this, handleStart),
      move: bind(this, handleMove),
      end: bind(this, handleEnd),
      cancel: bind(this, handleCancel),
      wheel: bind(this, handleWheel)
    };
    return this._super();
  },
  scrollElement: Ember.computed.oneWay('element').readOnly(),
  bindScrollerEvents: function() {
    var el = this.get('scrollElement'),
      handlers = this.scrollerEventHandlers;
    bindElement(el, handlers);
  },
  unbindScrollerEvents: function() {
    var el = this.get('scrollElement'),
      handlers = this.scrollerEventHandlers;
    unbindElement(el, handlers);
    unbindWindow(handlers);
  }
});

function bind(view, handler) {
  return function (evt) {
    handler.call(view, evt);
  };
}

function synthesizeClick(e) {
  var point = e.changedTouches[0],
    target = point.target,
    ev;
  if (target && fieldRegex.test(target.tagName)) {
    ev = document.createEvent('MouseEvents');
    ev.initMouseEvent('click', true, true, e.view, 1, point.screenX, point.screenY, point.clientX, point.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
    return target.dispatchEvent(ev);
  }
}

})();



(function() {
/*global Scroller*/
var max = Math.max, get = Ember.get, set = Ember.set;

function updateScrollerDimensions(target) {
  var width, height, totalHeight;

  target = target || this;

  width = get(target, 'width');
  height = get(target, 'height');
  totalHeight = get(target, 'totalHeight');

  target.scroller.setDimensions(width, height, width, totalHeight);
  target.trigger('scrollerDimensionsDidChange');
}

/**
  VirtualListView

  @class VirtualListView
  @namespace Ember
*/
Ember.VirtualListView = Ember.ContainerView.extend(Ember.ListViewMixin, Ember.VirtualListScrollerEvents, {
  _isScrolling: false,
  _mouseWheel: null,
  css: {
    position: 'relative',
    overflow: 'hidden'
  },

  init: function(){
    this._super();
    this.setupScroller();
    this.setupPullToRefresh();
  },
  _scrollerTop: 0,
  applyTransform: Ember.ListViewHelper.apply3DTransform,

  setupScroller: function(){
    var view, y;

    view = this;

    view.scroller = new Scroller(function(left, top, zoom) {
      // Support old and new Ember versions
      var state = view._state || view.state;

      if (state !== 'inDOM') { return; }

      if (view.listContainerElement) {
        view._scrollerTop = top;
        view._scrollContentTo(top);
        view.applyTransform(view.listContainerElement, 0, -top);
      }
    }, {
      scrollingX: false,
      scrollingComplete: function(){
        view.trigger('scrollingDidComplete');
      }
    });

    view.trigger('didInitializeScroller');
    updateScrollerDimensions(view);
  },
  setupPullToRefresh: function() {
    if (!this.pullToRefreshViewClass) { return; }
    this._insertPullToRefreshView();
    this._activateScrollerPullToRefresh();
  },
  _insertPullToRefreshView: function(){
    this.pullToRefreshView = this.createChildView(this.pullToRefreshViewClass);
    this.insertAt(0, this.pullToRefreshView);
    var view = this;
    this.pullToRefreshView.on('didInsertElement', function(){
      Ember.run.schedule('afterRender', this, function(){
        view.applyTransform(this.get('element'), 0, -1 * view.pullToRefreshViewHeight);
      });
    });
  },
  _activateScrollerPullToRefresh: function(){
    var view = this;
    function activatePullToRefresh(){
      view.pullToRefreshView.set('active', true);
      view.trigger('activatePullToRefresh');
    }
    function deactivatePullToRefresh() {
      view.pullToRefreshView.set('active', false);
      view.trigger('deactivatePullToRefresh');
    }
    function startPullToRefresh() {
      Ember.run(function(){
        view.pullToRefreshView.set('refreshing', true);

        function finishRefresh(){
          if (view && !view.get('isDestroyed') && !view.get('isDestroying')) {
            view.scroller.finishPullToRefresh();
            view.pullToRefreshView.set('refreshing', false);
          }
        }
        view.startRefresh(finishRefresh);
      });
    }
    this.scroller.activatePullToRefresh(
      this.pullToRefreshViewHeight,
      activatePullToRefresh,
      deactivatePullToRefresh,
      startPullToRefresh
    );
  },

  getReusableChildViews: function(){
    var firstView = this._childViews[0];
    if (firstView && firstView === this.pullToRefreshView) {
      return this._childViews.slice(1);
    } else {
      return this._childViews;
    }
  },

  scrollerDimensionsNeedToChange: Ember.observer(function() {
    Ember.run.once(this, updateScrollerDimensions);
  }, 'width', 'height', 'totalHeight'),

  didInsertElement: function() {
    this.listContainerElement = this.$('> .ember-list-container')[0];
  },

  willBeginScroll: function(touches, timeStamp) {
    this._isScrolling = false;
    this.trigger('scrollingDidStart');

    this.scroller.doTouchStart(touches, timeStamp);
  },

  continueScroll: function(touches, timeStamp) {
    var startingScrollTop, endingScrollTop, event;

    if (this._isScrolling) {
      this.scroller.doTouchMove(touches, timeStamp);
    } else {
      startingScrollTop = this._scrollerTop;

      this.scroller.doTouchMove(touches, timeStamp);

      endingScrollTop = this._scrollerTop;

      if (startingScrollTop !== endingScrollTop) {
        event = Ember.$.Event("scrollerstart");
        Ember.$(touches[0].target).trigger(event);

        this._isScrolling = true;
      }
    }
  },

  endScroll: function(timeStamp) {
    this.scroller.doTouchEnd(timeStamp);
  },

  // api
  scrollTo: function(y, animate) {
    if (animate === undefined) {
      animate = true;
    }

    this.scroller.scrollTo(0, y, animate, 1);
  },

  // events
  mouseWheel: function(e){
    var inverted, delta, candidatePosition;

    inverted = e.webkitDirectionInvertedFromDevice;
    delta = e.wheelDeltaY * (inverted ? 0.8 : -0.8);
    candidatePosition = this.scroller.__scrollTop + delta;

    if ((candidatePosition >= 0) && (candidatePosition <= this.scroller.__maxScrollTop)) {
      this.scroller.scrollBy(0, delta, true);
      e.stopPropagation();
    }

    return false;
  }
});

})();



(function() {
Ember.Handlebars.registerHelper('ember-list', function emberList(options) {
  var hash = options.hash;
  var types = options.hashTypes;

  hash.content = hash.items;
  delete hash.items;

  types.content = types.items;
  delete types.items;

  if (!hash.content) {
    hash.content = "this";
    types.content = "ID";
  }

  for (var prop in hash) {
    if (/-/.test(prop)) {
      var camelized = Ember.String.camelize(prop);
      hash[camelized] = hash[prop];
      types[camelized] = types[prop];
      delete hash[prop];
      delete types[prop];
    }
  }

  return Ember.Handlebars.helpers.collection.call(this, 'Ember.ListView', options);
});


})();



(function() {

})();

