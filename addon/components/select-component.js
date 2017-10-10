import Ember from 'ember';
import ListView from 'ember-list-view';

import BodyEventListener from '../mixins/body-event-listener';
import AddeparMixins from '../mysterious-dependency/ember-addepar-mixins/resize_handler';
import KeyboardHelper from '../mixins/keyboard-helper';
import DebouncedTextComponent from './debounced-text-component';

import SelectTooltipOptionView from '../views/select-tooltip-option';
import SelectOptionView from '../views/select-option';

export default Ember.Component.extend(
  BodyEventListener,
  AddeparMixins.ResizeHandlerMixin,
  KeyboardHelper,
{
  layoutName: 'select',
  classNames: 'ember-select',
  attributeBindings: Ember.A(['tabindex']),
  classNameBindings: Ember.A(['showDropdown:open', 'isDropup:dropup']),
  prompt: 'Select a Value',
  placeholder: void 0,
  disabled: false,
  hasFocus: false,
  showTooltip: true,
  highlightedIndex: -1,
  // we need to set tabindex so that div responds to key events
  tabindex: 0,
  showDropdown: false,
  dropdownHeight: 300,
  // Important: rowHeight must be synched with the CSS
  rowHeight: 26,
  // Option to indicate whether we should sort the labels
  sortLabels: true,
  // Use title on labels, containing content of the labels
  titleOnOptions: false,
  // If isSelect is true, we will not show the search box
  isSelect: false,
  // Align dropdown-menu above the button
  isDropup: false,
  // Align dropdown-menu to the right of the button
  isDropdownMenuPulledRight: false,
  // Change the icon when necessary
  dropdownToggleIcon: 'fa fa-caret-down',
  // Change the button class when necessary
  buttonClass: 'btn btn-default',
  dropdownMenuClass: '',
  // The list of options
  content: Ember.A([]),
  selection: null,
  query: '',
  optionLabelPath: '',
  optionValuePath: '',
  optionGroupPath: '',
  optionDefaultPath: '',
  /**
   * Comparator for sorting two groups of options. By default, sorts
   * by alphabetical ordering of the name of the group. Alternatively, you could
   * imagine your options are something like
   * [
   *   { name: 'aardvark', sound: 'oink'},
   *   { name: 'zebra', sound: 'oink'}
   *   { name: 'mouse', sound: 'moo'}
   * ]
   *
   * with optionGroupPath set to sound. By default, you would get
   *
   * moo
   *   mouse
   * oink
   *   aardvark
   *   zebra
   *
   * If instead you wanted to sort the groups by max alphaneumeric ranking of
   * an option within the group, you could override this property to get
   *
   * oink
   *   aardvark
   *   zebra
   * moo
   *   mouse
   *
   * The function should be of the form (groupObj1, groupObj2) -> number
   * where groupObj has the structure
   * {name: string, members: [your_content_type]}
   *
   * It should implement the
   * behavior of a compareFunction documented here: https://mzl.la/19buNlz
   *
   */
  groupSortFunction: function(groupObj1, groupObj2) {
    var name1 = Ember.get(groupObj1, 'name');
    var name2 = Ember.get(groupObj2, 'name');

    if (name1 < name2) {
      return -1;
    }
    if (name1 > name2) {
      return 1;
    }
    return 0;
  },
  /**
   * A flag to control data source. Sets this to true if you want to do server search.
  **/
  disableLocalSearch: false,

  // This augments the dropdown to provide a place for adding a select menu that
  // possibly says 'create item' or something along that line
  selectMenuView: null,
  tooltipItemViewClass: SelectTooltipOptionView,
  originalItemViewClass: SelectOptionView,

  /**
   * The name of the partial which contains the list view which is displayed when
   * the user opens the drop-down.
   * @type { string }
  */
  listViewPartial: 'select-list-view-partial',

  // a map of accepted keys to show dropdown when being pressed
  // these are keys to show dropdown when being pressed
  acceptedKeys: Ember.computed(function() {
    var i, j, keySet, mappedKeys, results, results1;
    mappedKeys = Ember.Map.create();
    // create a set of accepted keys from 'A'..'Z', 'a'..'z', '0'..'9'
    // and some special keys Enter, Spacebar, Up, Down
    keySet = _.union([this.KEY_CODES.ENTER, this.KEY_CODES.SPACEBAR], [this.KEY_CODES.DOWN, this.KEY_CODES.UP], (function() {
      results = [];
      for (i = 65; i <= 90; i++){ results.push(i); }
      return results;
    }).apply(this), (function() {
      results1 = [];
      for (j = 97; j <= 122; j++){ results1.push(j); }
      return results1;
    }).apply(this), [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
    keySet.forEach(function(key) {
      return mappedKeys[key] = true;
    });
    return mappedKeys;
  }).property(),
  itemViewClass: Ember.computed(function() {
    if (this.get('showTooltip')) {
      return this.get('tooltipItemViewClass');
    } else {
      return this.get('originalItemViewClass');
    }
  }).property('showTooltip'),
  emptyContentView: null,

  // This doesn't clean correctly if `optionLabelPath` changes
  willDestroy: function() {
    var contentProxy, propertyName;
    propertyName = 'contentProxy';
    if (this.cacheFor(propertyName)) {
      contentProxy = this.get(propertyName);
      contentProxy.destroy();
    }
    return this._super();
  },
  updateDropdownLayout: Ember.observer(function() {
    var dropdownButton, dropdownButtonHeight, dropdownButtonOffset, dropdownMargin, dropdownMenu, dropdownMenuBottom, dropdownMenuHeight, dropdownMenuOffset, dropdownMenuWidth, dropupMenuTop;
    if ((this.get('_state') || this.get('state')) !== 'inDOM' || this.get('showDropdown') === false) {
      return;
    }
    const highlightedIndex = this.get('highlightedIndex');
    // Render the dropdown in a hidden state to get the size
    this.$('.js-dropdown-menu').css('visibility', 'hidden');

    // Render the dropdown completely into the DOM for offset()
    dropdownButton = this.$('.js-dropdown-toggle')[0];
    dropdownButtonHeight = this.$(dropdownButton).outerHeight();
    dropdownButtonOffset = this.$(dropdownButton).offset();
    dropdownMenu = this.$('.js-dropdown-menu')[0];
    dropdownMenuHeight = this.$(dropdownMenu).outerHeight();
    dropdownMenuWidth = this.$(dropdownMenu).outerWidth();
    dropdownMenuOffset = this.$(dropdownMenu).offset();

    // Only switch from dropUp to dropDown if there's this much extra space
    // under where the dropDown would be. This prevents the popup from jiggling
    // up and down
    dropdownMargin = 15;
    if (this.get('isDropup')) {
      dropdownMenuBottom = dropdownButtonOffset.top + dropdownButtonHeight + dropdownMenuHeight + dropdownMargin;
    } else {
      dropdownMenuBottom = dropdownMenuOffset.top + dropdownMenuHeight;
    }

    // regardless of whether it is dropping up or down, we want to know
    // where dropUp will put the top since we don't want this to fall
    // above the top of the screen
    dropupMenuTop = dropdownButtonOffset.top - dropdownMenuHeight - dropdownMargin;
    this.set('isDropup', dropupMenuTop > window.scrollY && dropdownMenuBottom > window.innerHeight);
    this.set('isDropdownMenuPulledRight', dropdownButtonOffset.left + dropdownMenuWidth + dropdownMargin > window.innerWidth);
    this.$('.js-dropdown-menu').css('visibility', 'visible');

    // When the dropdown is opened or re-rendered, scroll to the highlighted option
    if (highlightedIndex !== -1 && this.get('shouldEnsureVisible')) {
      Ember.run.schedule('afterRender', () => this.ensureVisible(highlightedIndex));
    }
  }, 'showDropdown'),
  onResizeEnd: function() {
    // We need to put this on the run loop, because the resize event came from
    // the window. Otherwise, we get a warning when used in the tests. You have
    // turned on testing mode, which disables the run-loop's autorun. You
    // will need to wrap any code with asynchronous side-effects in an Ember.run
    return Ember.run(this, this.updateDropdownLayout);
  },

  // TODO(Peter): consider calling this optionViewClass?
  itemView: Ember.computed(function() {
    var itemViewClass;
    itemViewClass = this.get('itemViewClass');
    if (typeof itemViewClass === 'string') {
      return Ember.get(itemViewClass);
    }
    return itemViewClass;
  }).property('itemViewClass'),

  // TODO(Peter): consider calling this selectedOptionViewClass?
  selectedItemView: Ember.computed(function() {
    return this.get('itemView').extend({
      tagName: 'span',
      labelPath: Ember.computed.alias('controller.optionLabelPath'),
      context: Ember.computed.alias('controller.selection'),
      /**
      * Note: This view is an extension of the view used to display
      * each option in the dropdown list.
      * We would like to override the click event in the SelectOptionView
      * so that we can make sure that only when we click on a new option in the
      * list, the click event in the SelectOptionView is fired, not when we open
      * the dropdown. It will allow us to trigger the change item event when we
      * click to select a new option in the dropdown.
      * @override
      */

      click: Ember.K
    });
  }).property('itemView'),

  optionLabelPathChanges: Ember.on('init', Ember.observer(function() {
    var labelPath, path;
    labelPath = this.get('optionLabelPath');
    path = labelPath ? "selection." + labelPath : 'selection';
    return Ember.defineProperty(this, 'selectedLabel', Ember.computed.alias(path));
  }, 'selection', 'optionLabelPath')),

  searchView: DebouncedTextComponent.extend({
    placeholder: Ember.computed.alias('parentView.placeholder'),
    valueBinding: 'parentView.query',
    // we want to focus on search input when dropdown is opened. We need to put
    // this in a run loop to wait for the event that triggers the showDropdown
    // to finishes before trying to focus the input. Otherwise, focus when be
    // "stolen" from us.
    showDropdownDidChange: Ember.observer(function() {
      // when closing, don't need to focus the now-hidden search box
      if (this.get('parentView.showDropdown')) {
        return Ember.run.schedule('afterRender', this, function() {
          if ((this.get('_state') || this.get('state')) === 'inDOM') {
            return this.$().focus();
          }
        });
      // clear the query string when dropdown is hidden
      } else {
        return this.set('value', '');
      }
    }, 'parentView.showDropdown'),

    /**
      Delegates to parent view (The select component) to propagate this data up.

      @override
    */
    propagateNewText: function(newText) {
      this.get('parentView').send('valueChanged', newText);
    },
  }),
  // This is a hack. ListView doesn't handle case when total height
  // is less than height properly
  listView: ListView.extend({
    style: Ember.computed(function() {
      var height;
      height = Math.min(this.get('height'), this.get('totalHeight'));
      return "height: " + height + "px";
    }).property('height', 'totalHeight')
  }),

  // the list of content that is filtered down based on the query entered
  // in the textbox
  // Other than observing the changes on each elements, we need to observe the
  // `filteredContent`, and `sortedFilteredContent` because when the `content`
  // is overridden by a DS.PromiseArray, somehow it never triggers this function
  preparedContent: Ember.computed(function() {
    if (this.get('sortLabels')) {
      return this.get('sortedFilteredContent');
    } else {
      return this.get('filteredContent');
    }
  }).property('sortLabels', 'filteredContent.[]', 'sortedFilteredContent.[]', 'filteredContent', 'sortedFilteredContent'),

  contentProxy: Ember.computed(function() {
    var ContentProxy, observableString, optionLabelPath;
    optionLabelPath = this.get('optionLabelPath');
    if (optionLabelPath) {
      observableString = "content.@each." + optionLabelPath;
    } else {
      observableString = 'content.[]';
    }
    ContentProxy = Ember.ObjectProxy.extend({
      _select: null,
      content: Ember.computed.alias('_select.content'),
      query: Ember.computed.alias('_select.query'),
      filteredContent: Ember.computed(function() {
        var query, selectComponent;
        selectComponent = this.get('_select');
        query = this.get('query');
        return (this.get('content') || []).filter(function(item) {
          return selectComponent.matcher(query, item);
        });
      }).property(observableString, 'query'),
      sortedFilteredContent: Ember.computed(function() {
        return _.sortBy(this.get('filteredContent'), function(item){
          var ref;
          return (ref = Ember.get(item, optionLabelPath)) != null ? ref.toLowerCase() : void 0;
        });
      }).property('filteredContent.[]')
    });
    return ContentProxy.create({
      _select: this
    });
  }).property('optionLabelPath'),

  filteredContent: Ember.computed.alias('contentProxy.filteredContent'),

  sortedFilteredContent: Ember.computed.alias('contentProxy.sortedFilteredContent'),

  // the list of content that is grouped by the content in the optionGroupPath
  // e.g. {name: 'Addepar', location: 'Mountain View'}
  //      {name: 'Google', location: 'Mountain View'}
  // if we group by location we will get
  // Mountain View
  //   Addepar
  //   Google
  // For an unknown reason, we need to specify preparedContent as well as preparedContent.[] as a dependent properties
  // to force this property to recompute when we set content to an empty array and then immediately
  // set it to a non-empty array. This mirrors the dependent property list of preparedContent
  // @see preparedContent
  groupedContent: Ember.computed(function() {
    var path = this.get('optionGroupPath');
    var content = this.get('preparedContent');
    if (!path) {
      return Ember.A(content);
    }
    var groupedContent = _.groupBy(content, function(item) {
      return Ember.get(item, path);
    });
    var groupObjs = _.map(groupedContent, function(members, name) {
      return { name: name, members: Ember.A(members) };
    });
    var sortedGroupObjs = groupObjs.sort(this.get('groupSortFunction'));
    var result = Ember.A();
    sortedGroupObjs.forEach(function(groupObj) {
      result.pushObject(
        Ember.Object.create({
          isGroupOption: true,
          name: groupObj.name
        })
      );
      result.pushObjects(groupObj.members);
    });
    return result;
  }).property('preparedContent', 'preparedContent.[]', 'optionGroupPath', 'labels.[]', 'groupSortFunction'),

  isLoading: false,
  isLoaded: Ember.computed.not('isLoading'),
  filteredContentIsEmpty: Ember.computed.empty('filteredContent'),
  contentIsEmpty: Ember.computed.empty('content'),
  hasNoResults: Ember.computed.and('isLoaded', 'filteredContentIsEmpty'),

  value: Ember.computed(function(key, value) {
    var selection, valuePath, content;
    if (arguments.length === 2) {
      valuePath = this.get('optionValuePath');
      selection = value;
      content = this.get('content');
      if (valuePath && content) {
        if (typeof content.findProperty === 'function') {
          selection = content.findProperty(valuePath, value);
        } else {
          selection = _.find(content, valuePath, value);
        }
      }
      this.set('selection', selection);
      return value;
    } else {
      valuePath = this.get('optionValuePath');
      selection = this.get('selection');
      if (valuePath) {
        return Ember.get(selection, valuePath);
      } else {
        return selection;
      }
    }
  }).property('selection'),

  didInsertElement: function() {
    this._super();
    return this.setDefaultSelection();
  },

  // It matches the item label with the query. This can be overrideen for better
  matcher: function(searchText, item) {
    if (this.get('disableLocalSearch')) {
      return true;
    }
    var escapedSearchText, label, regex, trimmedLabel, trimmedSearchText;
    if (!searchText) {
      return true;
    }
    label = Ember.get(item, this.get('optionLabelPath'));
    if (!label) {
      return false;
    }
    trimmedLabel = label.trim().replace(/\s{2,}/g, ' ');
    // trim and eliminate duplicated spaces to avoid unintended spaces
    trimmedSearchText = searchText.trim().replace(/\s{2,}/g, ' ');
    // adding escapes to special characters to put it into RegEx
    escapedSearchText = trimmedSearchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    regex = new RegExp(escapedSearchText, 'i');
    return regex.test(trimmedLabel);
  },

  // TODO(Peter): This needs to be rethought
  setDefaultSelection: Ember.observer(function() {
    var content, defaultPath;

    // do not set default selection if selection is defined
    if (this.get('selection')) {
      return;
    }
    content = this.get('content');
    defaultPath = this.get('optionDefaultPath');
    if (!(content && defaultPath)) {
      return;
    }
    return this.set('selection', content.findProperty(defaultPath));
  }, 'content.[]'),
  selectableOptionsDidChange: Ember.observer(function() {
    const selectableOptions = this.get('selectableOptions');
    const selection = this.get('selection');
    const labelPath = this.get('optionLabelPath');
    const valuePath = this.get('optionValuePath');
    let highlighted;
    
    if (this.get('showDropdown')) {
      highlighted = this.get('highlighted');
      if (!selectableOptions.contains(highlighted)) {
        return this.set('highlighted', this.get('selectableOptions.firstObject'));
      }
    }

    // Update display name of selected option
    if (!Ember.isNone(selection) && !Ember.isEmpty(labelPath) && !Ember.isEmpty(valuePath)) {
      const selectedOption = 
        selectableOptions.findBy(valuePath, Ember.get(selection, valuePath));

      if (!Ember.isNone(selectedOption)) {
        this.set(`selection.${labelPath}`, Ember.get(selectedOption, labelPath));
      }
    }
  }, 'selectableOptions.[]', 'showDropdown'),

  /*
   * SELECTION RELATED
   */
  KEY_EVENTS: {
    8: 'deletePressed',
    27: 'escapePressed',
    13: 'enterPressed',
    38: 'upArrowPressed',
    40: 'downArrowPressed',
    9: 'tabPressed'
  },

  // All the selectable options - namely everything except for the non-group
  // options that are artificially created.
  selectableOptions: Ember.computed(function() {
    return Ember.A((this.get('groupedContent') || []).filter(function(item) {
      return !Ember.get(item, 'isGroupOption');
    }));
  }).property('groupedContent.[]'),

  //If yes, the highlighted selection option is always visible. This may result
  // in a 'jump': when there are duplicated options and mouse hovers over the
  // second occurrence of the option, it will jump to the first occurrence (if the
  // first occurrence is not visible at that point)
  shouldEnsureVisible: true,

  // The option that is currently highlighted.
  highlighted: Ember.computed(function(key, value) {
    var content, index;
    content = this.get('selectableOptions') || Ember.A();
    value = value || Ember.A();
    if (arguments.length === 1) {
      index = this.get('highlightedIndex');
      value = content.objectAt(index);
    } else {
      index = content.indexOf(value);
      this.setHighlightedIndex(index, this.get('shouldEnsureVisible'));
    }
    return value;
  }).property('selectableOptions.[]', 'highlightedIndex', 'shouldEnsureVisible'),

  setFocus: function() {
    var activeElem, selectComponent;
    activeElem = document.activeElement;
    selectComponent = this.$()[0];
    if (selectComponent.contains(activeElem) || selectComponent === activeElem) {
      return this.set('hasFocus', true);
    } else {
      return this.set('hasFocus', false);
    }
  },

  bodyClick: function() {
    return this.send('hideDropdown');
  },

  keyDown: function(event) {
    var acceptedKeys, map, method, ref;
    if (this.get('isDestroyed') || this.get('isDestroying')) {
      return;
    }
    this.setFocus();

    // show dropdown if it is not already showing
    // and the keycode should be in the list of accepted keys to show dropdown
    // [Spacebar, Enter, Up, Down, 'A'..'Z','a..z','0..9']
    acceptedKeys = this.get('acceptedKeys');
    if (acceptedKeys[event.keyCode] && !this.get('showDropdown')) {
      this.set('showDropdown', true);
      return;
    }
    map = this.get('KEY_EVENTS');
    method = map[event.keyCode];
    if (method) {
      return (ref = this.get(method)) != null ? ref.apply(this, arguments) : void 0;
    }
  },

  deletePressed: Ember.K,

  escapePressed: function(event) {
    if (this.get('showDropdown')) {
      this.send('hideDropdown');
      this.$().focus();
      return event.preventDefault();
    }
  },

  tabPressed: function() {
    if (this.get('showDropdown')) {
      return this.send('hideDropdown');
    }
  },

  enterPressed: function(event) {
    var item, ref;
    item = this.get('highlighted');
    if (!Ember.isEmpty(item)) {
      this.set('selection', item);
    }
    if (!Ember.isEmpty(item)) {
      this.userDidSelect(item);
    }
    // we want to set focus back the the component.
    // However, in some use cases, the select component is closed
    // depending on how the userDidSelect action is implemented.
    if ((ref = this.$()) != null) {
      ref.focus();
    }
    // in case dropdown doesn't close
    if (this.get('showDropdown')) {
      this.send('hideDropdown');
    }
    // TODO(Peter): HACK the web app somehow reloads when enter is pressed.
    return event.preventDefault();
  },

  upArrowPressed: function(event) {
    var index, sel;
    sel = this.get('highlightedIndex');
    index = event.ctrlKey || event.metaKey ? 0 : sel - 1;
    this.setHighlightedIndex(index, true);
    // we want to prevent the app from scroll when pressing up arrow
    return event.preventDefault();
  },

  downArrowPressed: function(event) {
    var clen, index, sel;
    sel = this.get('highlightedIndex');
    clen = this.get('selectableOptions.length');
    index = event.ctrlKey || event.metaKey ? clen - 1 : sel + 1;
    this.setHighlightedIndex(index, true);
    // we want to prevent the app from scroll when pressing down arrow
    return event.preventDefault();
  },

  setHighlightedIndex: function(index, ensureVisible) {
    if (!this.ensureIndex(index)) {
      return;
    }
    this.set('highlightedIndex', index);
    if (ensureVisible) {
      return this.ensureVisible(index);
    }
  },

  // Scroll the list to make sure the given index is visible.
  ensureIndex: function(index) {
    var clen;
    clen = this.get('selectableOptions.length');
    return index >= 0 && index < clen;
  },

  ensureVisible: function(index) {
    var $listView, endIndex, item, listView, newIndex, numRows, startIndex;
    $listView = this.$('.ember-list-view');
    listView = Ember.View.views[$listView.attr('id')];
    if (!listView) {
      return;
    }
    startIndex = listView._startingIndex();
    numRows = listView._childViewCount() - 1;
    endIndex = startIndex + numRows;
    item = this.get('selectableOptions').objectAt(index);
    newIndex = this.get('groupedContent').indexOf(item);
    if (index === 0) {
      return $listView.scrollTop(0);
    } else if (newIndex < startIndex) {
      return $listView.scrollTop(newIndex * this.get('rowHeight'));
    } else if (newIndex >= endIndex) {
      return $listView.scrollTop((newIndex - numRows + 1.5) * this.get('rowHeight'));
    }
  },

  // TODO Refactor other parts to use this method to set selection
  userDidSelect: function(selection) {
    return this.sendAction('userSelected', selection);
  },

  focusIn: function() {
    return this.set('hasFocus', true);
  },

  focusOut: function() {
    return this.set('hasFocus', false);
  },

  actions: {

    toggleDropdown: function() {
      if (this.get('disabled')) {
        return;
      }
      return this.toggleProperty('showDropdown');
    },

    hideDropdown: function() {
      if (this.get('isDestroyed') || this.get('isDestroying')) {
        return;
      }
      return this.set('showDropdown', false);
    },

    valueChanged: function(newText) {
      this.sendAction('valueChanged', newText);
    }
  }
});
