(function() {

var _ref;

Ember.Widgets = Ember.Namespace.create();

Ember.Widgets.VERSION = '0.0.1';

if ((_ref = Ember.libraries) != null) {
  _ref.register('Ember Widgets', Ember.Widgets.VERSION);
}


})();

(function() {

Ember.TEMPLATES["accordion_group_layout"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"panel-heading\">\n  <h4 class=\"panel-title\">\n    <a class=\"accordion-toggle collapsed\">\n      ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    </a>\n  </h4>\n</div>\n<div class=\"panel-collapse collapse\">\n  <div class=\"panel-body\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["carousel"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


  hashContexts = {'tagName': depth0,'class': depth0,'contentBinding': depth0,'itemViewClass': depth0};
  hashTypes = {'tagName': "STRING",'class': "STRING",'contentBinding': "STRING",'itemViewClass': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.CollectionView", {hash:{
    'tagName': ("ol"),
    'class': ("carousel-indicators"),
    'contentBinding': ("view.content"),
    'itemViewClass': ("Ember.Widgets.CarouselIndicator")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n<div class=\"carousel-inner\">\n  ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n</div>\n<a class=\"left carousel-control\"  href=\"#\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "prev", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">‹</a>\n<a class=\"right carousel-control\" href=\"#\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "next", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">›</a>\n");
  return buffer;
  
});

Ember.TEMPLATES["editable_label"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n  ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "view.innerTextField", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n  <span ");
  hashContexts = {'target': depth0};
  hashTypes = {'target': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "editLabel", {hash:{
    'target': ("view")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.displayName", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "view.isEditing", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["modal"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n        <button type=\"button\" class=\"btn btn-primary\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "sendConfirm", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n          ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "confirmText", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        </button>\n      ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n        <button type=\"button\" class=\"btn btn-default\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "sendCancel", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n          ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "cancelText", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        </button>\n      ");
  return buffer;
  }

  data.buffer.push("<div class=\"modal-dialog\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      <button type=\"button\" class=\"close\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "sendCancel", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">&times;</button>\n      <h4 class=\"modal-title\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "headerText", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h4>\n    </div>\n    <div class=\"modal-body\">\n      ");
  hashContexts = {'contentBinding': depth0};
  hashTypes = {'contentBinding': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "_contentViewClass", {hash:{
    'contentBinding': ("content")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    </div>\n    <div class=\"modal-footer\">\n      ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "confirmText", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n      ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "cancelText", {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n  </div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["multi-select"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n    <span class=\"ember-select-no-results\">No results match \"");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "query", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\"</span>\n  ");
  return buffer;
  }

  data.buffer.push("<div class=\"ember-select-container ember-select-multi dropdown-toggle\">\n  <ul ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'class': (":ember-select-choices choicesFieldClass")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n    ");
  data.buffer.push("\n    ");
  hashContexts = {'itemViewClass': depth0};
  hashTypes = {'itemViewClass': "STRING"};
  data.buffer.push(escapeExpression(helpers.each.call(depth0, "selections", {hash:{
    'itemViewClass': ("view.selectionItemView")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    <li class=\"ember-select-search-field\">\n      ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "searchView", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    </li>\n  </ul>\n</div>\n\n<div class=\"dropdown-menu\">\n  ");
  hashContexts = {'tagName': depth0,'classNames': depth0,'heightBinding': depth0,'rowHeightBinding': depth0,'contentBinding': depth0,'itemViewClassBinding': depth0};
  hashTypes = {'tagName': "STRING",'classNames': "STRING",'heightBinding': "STRING",'rowHeightBinding': "STRING",'contentBinding': "STRING",'itemViewClassBinding': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "listView", {hash:{
    'tagName': ("ul"),
    'classNames': ("ember-select-results"),
    'heightBinding': ("dropdownHeight"),
    'rowHeightBinding': ("rowHeight"),
    'contentBinding': ("groupedContent"),
    'itemViewClassBinding': ("itemView")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "hasNoResults", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["multi_select_item"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("<div>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</div>\n<a class=\"ember-select-search-choice-close\" href=\"#\"\n  ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "removeSelectItem", "view.content", {hash:{},contexts:[depth0,depth0],types:["ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">×\n</a>\n");
  return buffer;
  
});

Ember.TEMPLATES["popover"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n  <h4 class=\"popover-title\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h4>\n");
  return buffer;
  }

  data.buffer.push("<div class=\"arrow\"></div>\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "title", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n<div class=\"popover-content\">\n  ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "view._contentViewClass", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["select"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n      ");
  hashContexts = {'contentBinding': depth0};
  hashTypes = {'contentBinding': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "selectedItemView", {hash:{
    'contentBinding': ("selection")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n      <i ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'class': ("view.dropdownToggleIcon")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("></i>\n    ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n      <span>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "prompt", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n      <i ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'class': ("view.dropdownToggleIcon")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("></i>\n    ");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n    <div class=\"ember-select-search\">\n      ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "searchView", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    </div>\n  ");
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n    <span class=\"ember-select-no-results\">No results match \"");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "query", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\"</span>\n  ");
  return buffer;
  }

  data.buffer.push("<div class=\"ember-select-container dropdown-toggle\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleDropdown", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n  <a ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'class': (":ember-select-choice buttonClass")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "selection", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </a>\n</div>\n\n<div class=\"dropdown-menu\">\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.unless.call(depth0, "isSelect", {hash:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  ");
  hashContexts = {'tagName': depth0,'classNames': depth0,'heightBinding': depth0,'rowHeightBinding': depth0,'contentBinding': depth0,'itemViewClassBinding': depth0};
  hashTypes = {'tagName': "STRING",'classNames': "STRING",'heightBinding': "STRING",'rowHeightBinding': "STRING",'contentBinding': "STRING",'itemViewClassBinding': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "listView", {hash:{
    'tagName': ("ul"),
    'classNames': ("ember-select-results"),
    'heightBinding': ("dropdownHeight"),
    'rowHeightBinding': ("rowHeight"),
    'contentBinding': ("groupedContent"),
    'itemViewClassBinding': ("itemView")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "hasNoResults", {hash:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["select_item"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.label", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["select_item_layout"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n  ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.content.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n  ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "view.content.isGroupOption", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["typeahead"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n  <div class=\"dropdown-menu\">\n    ");
  hashContexts = {'tagName': depth0,'classNames': depth0,'heightBinding': depth0,'rowHeightBinding': depth0,'contentBinding': depth0,'itemViewClassBinding': depth0};
  hashTypes = {'tagName': "STRING",'classNames': "STRING",'heightBinding': "STRING",'rowHeightBinding': "STRING",'contentBinding': "STRING",'itemViewClassBinding': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "listView", {hash:{
    'tagName': ("ul"),
    'classNames': ("ember-typeahead-results"),
    'heightBinding': ("dropdownHeight"),
    'rowHeightBinding': ("rowHeight"),
    'contentBinding': ("groupedContent"),
    'itemViewClassBinding': ("itemView")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n  </div>\n");
  return buffer;
  }

  data.buffer.push("<div>\n  ");
  hashContexts = {'classBinding': depth0};
  hashTypes = {'classBinding': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "searchView", {hash:{
    'classBinding': ("searchFieldClass")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n</div>\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.unless.call(depth0, "hasNoResults", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

})();

(function() {


Ember.Widgets.StyleBindingsMixin = Ember.Mixin.create({
  concatenatedProperties: ['styleBindings'],
  attributeBindings: ['style'],
  unitType: 'px',
  createStyleString: function(styleName, property) {
    var value;
    value = this.get(property);
    if (value === void 0) {
      return;
    }
    if (Ember.typeOf(value) === 'number') {
      value = value + this.get('unitType');
    }
    return "" + styleName + ":" + value + ";";
  },
  applyStyleBindings: function() {
    var lookup, properties, styleBindings, styleComputed, styles,
      _this = this;
    styleBindings = this.styleBindings;
    if (!styleBindings) {
      return;
    }
    lookup = {};
    styleBindings.forEach(function(binding) {
      var property, style, _ref;
      _ref = binding.split(':'), property = _ref[0], style = _ref[1];
      return lookup[style || property] = property;
    });
    styles = _.keys(lookup);
    properties = _.values(lookup);
    styleComputed = Ember.computed(function() {
      var styleString, styleTokens;
      styleTokens = styles.map(function(style) {
        return _this.createStyleString(style, lookup[style]);
      });
      styleString = styleTokens.join('');
      if (styleString.length !== 0) {
        return styleString;
      }
    });
    styleComputed.property.apply(styleComputed, properties);
    return Ember.defineProperty(this, 'style', styleComputed);
  },
  init: function() {
    this.applyStyleBindings();
    return this._super();
  }
});

Ember.Widgets.BodyEventListener = Ember.Mixin.create({
  bodyElementSelector: 'html',
  bodyClick: Ember.K,
  didInsertElement: function() {
    this._super();
    return Ember.run.next(this, this._setupDocumentHandlers);
  },
  willDestroyElement: function() {
    this._super();
    return this._removeDocumentHandlers();
  },
  click: function(event) {
    return event.stopPropagation();
  },
  _setupDocumentHandlers: function() {
    var _this = this;
    if (this._clickHandler) {
      return;
    }
    this._clickHandler = function() {
      return _this.bodyClick();
    };
    return $(this.get('bodyElementSelector')).on("click", this._clickHandler);
  },
  _removeDocumentHandlers: function() {
    $(this.get('bodyElementSelector')).off("click", this._clickHandler);
    return this._clickHandler = null;
  }
});


})();

(function() {


Ember.Widgets.AccordionComponent = Ember.Component.extend({
  classNames: 'panel-group',
  activeIndex: 0
});

Ember.Widgets.AccordionItem = Ember.View.extend({
  defaultTemplate: Ember.Handlebars.compile('{{view.content}}'),
  layoutName: 'accordion_group_layout',
  classNames: 'panel panel-default',
  title: 'Untitled Accordion Group',
  index: 0,
  isActive: false,
  content: Ember.computed.alias('parentView.content'),
  isActiveDidChange: Ember.observer(function() {
    this.set('isActive', this.get('parentView.activeIndex') === this.get('index'));
    if (this.get('isActive')) {
      return this.show();
    } else {
      return this.hide();
    }
  }, 'parentView.activeIndex'),
  didInsertElement: function() {
    var index;
    index = this.get('parentView').$('.panel').index(this.$());
    this.set('index', index);
    return this.isActiveDidChange();
  },
  click: function() {
    if (this.get('isActive')) {
      return this.set('parentView.activeIndex', null);
    } else {
      return this.set('parentView.activeIndex', this.get('index'));
    }
  },
  hide: function() {
    var $accordionBody,
      _this = this;
    $accordionBody = this.$('.panel-collapse');
    $accordionBody.height($accordionBody.height())[0].offsetHeight;
    $accordionBody.removeClass('collapse').removeClass('in').addClass('collapsing');
    return $accordionBody.height(0).one($.support.transition.end, function() {
      return $accordionBody.removeClass('collapsing').addClass('collapse');
    });
  },
  show: function() {
    var $accordionBody,
      _this = this;
    $accordionBody = this.$('.panel-collapse');
    $accordionBody.removeClass('collapse').addClass('collapsing').height(0);
    $accordionBody.height($accordionBody[0]['scrollHeight']);
    return this.$().one($.support.transition.end, function() {
      return $accordionBody.removeClass('collapsing').addClass('in').height('auto');
    });
  }
});

Ember.Handlebars.helper('accordion-component', Ember.Widgets.AccordionComponent);

Ember.Handlebars.helper('accordion-item', Ember.Widgets.AccordionItem);


})();

(function() {


Ember.Widgets.CarouselComponent = Ember.Component.extend({
  layoutName: 'carousel',
  classNames: ['carousel', 'slide'],
  classNameBindings: ['sliding'],
  activeIndex: 0,
  didInsertElement: function() {
    if (!this.get('content')) {
      return this.set('content', new Array(this.$('.item').length));
    }
  },
  prev: function() {
    var activeIndex, contentLength, nextIndex;
    if (this.get('sliding')) {
      return;
    }
    activeIndex = this.get('activeIndex');
    contentLength = this.get('content.length');
    nextIndex = activeIndex - 1;
    nextIndex = nextIndex < 0 ? contentLength - 1 : nextIndex;
    return this.slide('prev', nextIndex);
  },
  next: function() {
    var activeIndex, contentLength, nextIndex;
    if (this.get('sliding')) {
      return;
    }
    activeIndex = this.get('activeIndex');
    contentLength = this.get('content.length');
    nextIndex = activeIndex + 1;
    nextIndex = nextIndex >= contentLength ? 0 : nextIndex;
    return this.slide('next', nextIndex);
  },
  to: function(pos) {
    var direction,
      _this = this;
    if (!((0 <= pos && pos < this.get('content.length')))) {
      return;
    }
    if (this.get('sliding')) {
      return this.$().one('slid', function() {
        return _this.to(pos);
      });
    }
    direction = pos > this.get('activeIndex') ? 'next' : 'prev';
    return this.slide(direction, pos);
  },
  slide: function(type, nextIndex) {
    var $active, $next, direction,
      _this = this;
    if (this.get('activeIndex') === nextIndex) {
      return;
    }
    direction = type === 'next' ? 'left' : 'right';
    $active = $(this.$('.item').get(this.get('activeIndex')));
    $next = $(this.$('.item').get(nextIndex));
    this.set('sliding', true);
    $next.addClass(type);
    $next[0].offsetWidth;
    $active.addClass(direction);
    $next.addClass(direction);
    return this.$().one($.support.transition.end, function() {
      return Ember.run(_this, function() {
        this.set('activeIndex', nextIndex);
        $next.removeClass([type, direction].join(' ')).addClass('active');
        $active.removeClass(['active', direction].join(' '));
        return this.set('sliding', false);
      });
    });
  }
});

Ember.Widgets.CarouselIndicator = Ember.View.extend({
  classNameBindings: 'isActive:active',
  isActive: Ember.computed(function() {
    return this.get('contentIndex') === this.get('controller.activeIndex');
  }).property('contentIndex', 'controller.activeIndex'),
  click: function() {
    return this.get('controller').to(this.get('contentIndex'));
  }
});

Ember.Widgets.CarouselItem = Ember.View.extend({
  classNames: 'item'
});

Ember.Handlebars.helper('carousel-component', Ember.Widgets.CarouselComponent);

Ember.Handlebars.helper('carousel-item', Ember.Widgets.CarouselItem);


})();

(function() {


Ember.Widgets.EditableLabel = Ember.View.extend({
  templateName: 'editable_label',
  classNames: ['editable-label'],
  placeholder: '',
  isEditing: false,
  value: null,
  displayName: Ember.computed(function() {
    if (Ember.isNone(this.get('value')) || this.get('value') === '') {
      return this.get('placeholder');
    } else {
      return this.get('value');
    }
  }).property('value', 'placeholder'),
  innerTextField: Ember.TextField.extend({
    valueBinding: Ember.Binding.oneWay('parentView.value'),
    didInsertElement: function() {
      return this.$().focus();
    },
    blur: function() {
      this.set('parentView.isEditing', false);
      return this.set('parentView.value', this.get('value'));
    }
  }),
  editLabel: function() {
    return this.set('isEditing', true);
  }
});

Ember.Handlebars.helper('editable-label-component', Ember.Widgets.EditableLabel);


})();

(function() {


Ember.Widgets.ModalComponent = Ember.Component.extend(Ember.Widgets.StyleBindingsMixin, {
  layoutName: 'modal',
  classNames: ['modal'],
  classNameBindings: ['isShowing:in', 'fade'],
  modalPaneBackdrop: '<div class="modal-backdrop"></div>',
  bodyElementSelector: '.modal-backdrop',
  enforceModality: false,
  backdrop: true,
  isShowing: false,
  fade: true,
  headerText: "Modal Header",
  confirmText: "Confirm",
  cancelText: "Cancel",
  content: "",
  contentViewClass: null,
  confirm: Ember.K,
  cancel: Ember.K,
  defaultContentViewClass: Ember.View.extend({
    template: Ember.Handlebars.compile("<p>{{content}}</p>")
  }),
  _contentViewClass: Ember.computed(function() {
    var contentViewClass;
    contentViewClass = this.get('contentViewClass');
    if (!contentViewClass) {
      return this.get('defaultContentViewClass');
    }
    if (typeof contentViewClass === 'string') {
      return Ember.get(this.get('contentViewClass'));
    } else {
      return contentViewClass;
    }
  }).property('contentViewClass'),
  actions: {
    sendCancel: function() {
      var cancel;
      if (!this.get('isShowing')) {
        return;
      }
      cancel = this.get('cancel');
      if (typeof cancel === 'function') {
        cancel();
      } else {
        this.sendAction('cancel');
      }
      return this.hide();
    },
    sendConfirm: function() {
      var confirm;
      if (!this.get('isShowing')) {
        return;
      }
      confirm = this.get('confirm');
      if (typeof confirm === 'function') {
        confirm();
      } else {
        this.sendAction('confirm');
      }
      return this.hide();
    }
  },
  didInsertElement: function() {
    this._super();
    if (this.get('fade')) {
      this.$()[0].offsetWidth;
    }
    if (this.get('backdrop')) {
      this._appendBackdrop();
    }
    Ember.run.next(this, function() {
      return this.set('isShowing', true);
    });
    $(document.body).addClass('modal-open');
    return this._setupDocumentHandlers();
  },
  willDestroyElement: function() {
    this._super();
    return this._removeDocumentHandlers();
  },
  click: function(event) {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (!this.get('enforceModality')) {
      return this.hide();
    }
  },
  hide: function() {
    var _this = this;
    this.set('isShowing', false);
    $(document.body).removeClass('modal-open');
    this._backdrop.removeClass('in');
    return this.$().one($.support.transition.end, function() {
      if (_this._backdrop) {
        _this._backdrop.remove();
      }
      return Ember.run(_this, _this.destroy);
    });
  },
  _appendBackdrop: function() {
    var modalPaneBackdrop, parentLayer;
    parentLayer = this.$().parent();
    modalPaneBackdrop = this.get('modalPaneBackdrop');
    if (this.get('fade')) {
      this._backdrop = jQuery(modalPaneBackdrop).addClass('fade');
    }
    this._backdrop.appendTo(parentLayer);
    return Ember.run.next(this, function() {
      return this._backdrop.addClass('in');
    });
  },
  _setupDocumentHandlers: function() {
    var _this = this;
    this._super();
    if (!this._hideHandler) {
      this._hideHandler = function() {
        return _this.hide();
      };
      return $(document).on('modal:hide', this._hideHandler);
    }
  },
  _removeDocumentHandlers: function() {
    this._super();
    $(document).off('modal:hide', this._hideHandler);
    return this._hideHandler = null;
  }
});

Ember.Widgets.ModalComponent.reopenClass({
  rootElement: '.ember-application',
  poppedModal: null,
  hideAll: function() {
    return $(document).trigger('modal:hide');
  },
  popup: function(options) {
    var modal, rootElement;
    if (options == null) {
      options = {};
    }
    this.hideAll();
    rootElement = options.rootElement || this.rootElement;
    modal = this.create(options);
    modal.container = modal.get('targetObject.container');
    modal.appendTo(rootElement);
    return modal;
  }
});

Ember.Handlebars.helper('modal-component', Ember.Widgets.ModalComponent);


})();

(function() {


Ember.Widgets.PopoverComponent = Ember.Component.extend(Ember.Widgets.StyleBindingsMixin, Ember.Widgets.BodyEventListener, {
  layoutName: 'popover',
  classNames: ['popover'],
  classNameBindings: ['isShowing:in', 'fade', 'placement'],
  styleBindings: ['left', 'top', 'display', 'visibility'],
  targetElement: null,
  contentViewClass: null,
  placement: 'top',
  title: '',
  left: 0,
  top: 0,
  display: 'block',
  visibility: 'hidden',
  fade: true,
  isShowing: false,
  inserted: false,
  content: "",
  _resizeHandler: null,
  _scrollHandler: null,
  _contentViewClass: Ember.computed(function() {
    if (this.get('contentViewClass')) {
      return this.get('contentViewClass');
    }
    return Ember.View.extend({
      content: Ember.computed.alias('parentView.content'),
      template: Ember.Handlebars.compile('{{view.parentView.content}}')
    });
  }).property('contentViewClass'),
  didInsertElement: function() {
    this._super();
    return Ember.run.next(this, function() {
      this.snapToPosition();
      this.set('visibility', 'visible');
      return this.set('isShowing', true);
    });
  },
  bodyClick: function() {
    return this.hide();
  },
  hide: function() {
    var _this = this;
    this.set('isShowing', false);
    return this.$().one($.support.transition.end, function() {
      return Ember.run(_this, _this.destroy);
    });
  },
  snapToPosition: function() {
    var $target, actualHeight, actualWidth, pos;
    if (this.get('state') !== 'inDOM') {
      return;
    }
    $target = $(this.get('targetElement'));
    actualWidth = this.$()[0].offsetWidth;
    actualHeight = this.$()[0].offsetHeight;
    pos = $target.offset();
    pos.width = $target[0].offsetWidth;
    pos.height = $target[0].offsetHeight;
    switch (this.get('placement')) {
      case 'bottom':
        this.set('top', pos.top + pos.height);
        this.set('left', pos.left + pos.width / 2 - actualWidth / 2);
        break;
      case 'top':
        this.set('top', pos.top - actualHeight);
        this.set('left', pos.left + pos.width / 2 - actualWidth / 2);
        break;
      case 'top-right':
        this.set('top', pos.top);
        this.set('left', pos.left + pos.width);
        break;
      case 'top-left':
        this.set('top', pos.top);
        this.set('left', pos.left - actualWidth);
        break;
      case 'bottom-right':
        this.set('top', pos.top + pos.height);
        this.set('left', pos.left + pos.width - actualWidth);
        break;
      case 'bottom-left':
        this.set('top', pos.top + pos.height);
        this.set('left', pos.left);
        break;
      case 'left':
        this.set('top', pos.top + pos.height / 2 - actualHeight / 2);
        this.set('left', pos.left - actualWidth);
        break;
      case 'right':
        this.set('top', pos.top + pos.height / 2 - actualHeight / 2);
        this.set('left', pos.left + pos.width);
        break;
    }
    return this.correctHorizontalIfOffScreen();
  },
  correctHorizontalIfOffScreen: function() {
    var actualWidth, bodyWidth, hideArrow;
    bodyWidth = $('body').width();
    actualWidth = this.$()[0].offsetWidth;
    hideArrow = false;
    if (this.get('left') + actualWidth > bodyWidth) {
      this.set('left', bodyWidth - actualWidth);
      hideArrow = true;
    }
    if (this.get('left') < 0) {
      this.set('left', 0);
      hideArrow = true;
    }
    if (hideArrow) {
      return this.$().addClass('no-arrow');
    } else {
      return this.$().removeClass('no-arrow');
    }
  },
  debounceSnapToPosition: Ember.computed(function() {
    return Ember.run.debounce(this, this.snapToPosition, 100);
  }),
  _setupDocumentHandlers: function() {
    var _this = this;
    this._super();
    if (!this._hideHandler) {
      this._hideHandler = function() {
        return _this.hide();
      };
      $(document).on('popover:hide', this._hideHandler);
    }
    if (!this._resizeHandler) {
      this._resizeHandler = this.get('debounceSnapToPosition');
      $(document).on('resize', this._resizeHandler);
    }
    if (!this._scrollHandler) {
      this._scrollHandler = this.get('debounceSnapToPosition');
      return $(document).on('scroll', this._scrollHandler);
    }
  },
  _removeDocumentHandlers: function() {
    this._super();
    $(document).off('popover:hide', this._hideHandler);
    this._hideHandler = null;
    $(document).off('resize', this._resizeHandler);
    this._resizeHandler = null;
    $(document).off('scroll', this._scrollHandler);
    return this._scrollHandler = null;
  }
});

Ember.Widgets.PopoverComponent.reopenClass({
  rootElement: '.ember-application',
  hideAll: function() {
    return $(document).trigger('popover:hide');
  },
  popup: function(options) {
    var popover, rootElement;
    this.hideAll();
    rootElement = options.rootElement || this.rootElement;
    popover = this.create(options);
    popover.appendTo(rootElement);
    return popover;
  }
});

Ember.Handlebars.helper('popover-component', Ember.Widgets.PopoverComponent);


})();

(function() {


Ember.Widgets.PopoverLinkComponent = Ember.Component.extend({
  classNames: ['popover-link'],
  placement: 'top',
  content: null,
  title: null,
  contentViewClass: null,
  _contentViewClass: Ember.computed(function() {
    if (this.get('contentViewClass')) {
      return Ember.get(this.get('contentViewClass'));
    }
  }).property('contentViewClass'),
  click: function(event) {
    return Ember.Widgets.PopoverComponent.popup({
      targetElement: event.target,
      targetObject: this.get('targetObject'),
      container: this.get('container'),
      placement: this.get('placement'),
      title: this.get('title'),
      content: this.get('content'),
      contentViewClass: this.get('_contentViewClass')
    });
  }
});

Ember.Handlebars.helper('popover-link-component', Ember.Widgets.PopoverLinkComponent);


})();

(function() {

var get, set;

get = function(object, key) {
  if (!object) {
    return void 0;
  }
  if (!key) {
    return object;
  }
  return (typeof object.get === "function" ? object.get(key) : void 0) || object[key];
};

set = function(object, key, value) {
  if (!(object && key)) {
    return;
  }
  return (typeof object.set === "function" ? object.set(key, value) : void 0) || (object[key] = value);
};

Ember.Widgets.SelectOptionView = Ember.ListItemView.extend({
  tagName: 'li',
  templateName: 'select_item',
  layoutName: 'select_item_layout',
  classNames: 'ember-select-result-item',
  classNameBindings: ['content.isGroupOption:ember-select-group', 'isHighlighted:highlighted'],
  labelPath: Ember.computed.alias('controller.optionLabelPath'),
  isHighlighted: Ember.computed(function() {
    return this.get('controller.highlighted') === this.get('content');
  }).property('controller.highlighted', 'content'),
  labelPathDidChange: Ember.observer(function() {
    var labelPath, path;
    labelPath = this.get('labelPath');
    path = labelPath ? "content." + labelPath : 'content';
    Ember.defineProperty(this, 'label', Ember.computed.alias(path));
    return this.notifyPropertyChange('label');
  }, 'content', 'labelPath'),
  didInsertElement: function() {
    this._super();
    return this.labelPathDidChange();
  },
  updateContext: function(context) {
    this._super(context);
    return this.set('content', context);
  },
  click: function() {
    if (this.get('content.isGroupOption')) {
      return;
    }
    this.set('controller.selection', this.get('content'));
    this.get('controller').userDidSelect(this.get('content'));
    return this.get('controller').hideDropdown();
  },
  mouseEnter: function() {
    if (this.get('content.isGroupOption')) {
      return;
    }
    return this.set('controller.highlighted', this.get('content'));
  }
});

Ember.Widgets.SelectComponent = Ember.Component.extend(Ember.Widgets.BodyEventListener, {
  templateName: 'select',
  classNames: 'ember-select',
  attributeBindings: ['tabindex'],
  classNameBindings: ['showDropdown:open'],
  itemViewClass: 'Ember.Widgets.SelectOptionView',
  prompt: 'Select a Value',
  highlightedIndex: -1,
  tabindex: -1,
  showDropdown: false,
  dropdownHeight: 300,
  rowHeight: 26,
  sortLabels: true,
  isSelect: false,
  dropdownToggleIcon: 'fa fa-caret-down',
  buttonClass: 'btn btn-default',
  content: [],
  selection: null,
  query: '',
  optionLabelPath: '',
  optionValuePath: '',
  optionGroupPath: '',
  optionDefaultPath: '',
  itemView: Ember.computed(function() {
    var itemViewClass;
    itemViewClass = this.get('itemViewClass');
    if (typeof itemViewClass === 'string') {
      return Ember.get(itemViewClass);
    }
    return itemViewClass;
  }).property('itemViewClass'),
  selectedItemView: Ember.computed(function() {
    return this.get('itemView').extend({
      tagName: 'span',
      labelPath: Ember.computed.alias('controller.optionLabelPath'),
      context: Ember.computed.alias('controller.selection')
    });
  }).property('itemView'),
  selectedLabel: Ember.computed(function() {
    return get(this.get('selection'), this.get('optionLabelPath'));
  }).property('selection', 'optionLabelPath'),
  searchView: Ember.TextField.extend({
    placeholder: 'Search',
    valueBinding: 'parentView.query',
    showDropdownDidChange: Ember.observer(function() {
      return Ember.run.next(this, function() {
        if (this.get('state') === 'inDOM') {
          return this.$().focus();
        }
      });
    }, 'parentView.showDropdown')
  }),
  listView: Ember.ListView.extend({
    style: Ember.computed(function() {
      var height;
      height = Math.min(this.get('height'), this.get('totalHeight'));
      return "height: " + height + "px";
    }).property('height', 'totalHeight')
  }),
  filteredContent: Ember.computed(function() {
    var content, filteredContent, query,
      _this = this;
    content = this.get('content');
    query = this.get('query');
    if (!content) {
      return [];
    }
    filteredContent = this.get('content').filter(function(item) {
      return _this.matcher(query, item);
    });
    if (!this.get('sortLabels')) {
      return filteredContent;
    }
    return _.sortBy(filteredContent, function(item) {
      var _ref;
      return (_ref = get(item, _this.get('optionLabelPath'))) != null ? _ref.toLowerCase() : void 0;
    });
  }).property('content.@each', 'query', 'optionLabelPath', 'sortLabels'),
  groupedContent: Ember.computed(function() {
    var content, groups, path, result;
    path = this.get('optionGroupPath');
    content = this.get('filteredContent');
    if (!path) {
      return content;
    }
    groups = _.groupBy(content, function(item) {
      return get(item, path);
    });
    result = Ember.A();
    _.keys(groups).sort().forEach(function(key) {
      result.pushObject(Ember.Object.create({
        isGroupOption: true,
        name: key
      }));
      return result.pushObjects(groups[key]);
    });
    return result;
  }).property('filteredContent', 'optionGroupPath'),
  hasNoResults: Ember.computed.empty('filteredContent'),
  value: Ember.computed(function(key, value) {
    var selection, valuePath;
    if (arguments.length === 2) {
      valuePath = this.get('optionValuePath');
      selection = value;
      if (valuePath) {
        selection = this.get('content').findProperty(valuePath, value);
      }
      this.set('selection', selection);
      return value;
    } else {
      valuePath = this.get('optionValuePath');
      selection = this.get('selection');
      if (valuePath) {
        return get(selection, valuePath);
      } else {
        return selections;
      }
    }
  }).property('selection'),
  didInsertElement: function() {
    this._super();
    return this.setDefaultSelection();
  },
  matcher: function(searchText, item) {
    var escapedSearchText, label, regex;
    if (!searchText) {
      return true;
    }
    label = get(item, this.get('optionLabelPath'));
    escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    regex = new RegExp(escapedSearchText, 'i');
    return regex.test(label);
  },
  toggleDropdown: function(event) {
    return this.toggleProperty('showDropdown');
  },
  hideDropdown: function(event) {
    return this.set('showDropdown', false);
  },
  setDefaultSelection: Ember.observer(function() {
    var content, defaultPath;
    if (this.get('selection')) {
      return;
    }
    content = this.get('content');
    defaultPath = this.get('optionDefaultPath');
    if (!(content && defaultPath)) {
      return;
    }
    return this.set('selection', content.findProperty(defaultPath));
  }, 'content.@each'),
  selectableOptionsDidChange: Ember.observer(function() {
    var highlighted;
    highlighted = this.get('highlighted');
    if (!this.get('selectableOptions').contains(highlighted)) {
      return this.set('highlighted', this.get('selectableOptions.firstObject'));
    }
  }, 'selectableOptions'),
  /*
    # SELECTION RELATED
  */

  KEY_EVENTS: {
    8: 'deletePressed',
    27: 'escapePressed',
    13: 'enterPressed',
    38: 'upArrowPressed',
    40: 'downArrowPressed'
  },
  selectableOptions: Ember.computed(function() {
    return (this.get('groupedContent') || []).filter(function(item) {
      return !get(item, 'isGroupOption');
    });
  }).property('groupedContent'),
  highlighted: Ember.computed(function(key, value) {
    var content, index;
    content = this.get('selectableOptions') || [];
    value = value || [];
    if (arguments.length === 1) {
      index = this.get('highlightedIndex');
      value = content.objectAt(index);
    } else {
      index = content.indexOf(value);
      this.setHighlightedIndex(index, true);
    }
    return value;
  }).property('selectableOptions', 'highlightedIndex'),
  bodyClick: function() {
    return this.hideDropdown();
  },
  keyDown: function(event) {
    var map, method, _ref;
    if (!this.get('showDropdown')) {
      return this.set('showDropdown', true);
    }
    map = this.get('KEY_EVENTS');
    method = map[event.keyCode];
    if (method) {
      return (_ref = this.get(method)) != null ? _ref.apply(this, arguments) : void 0;
    }
  },
  deletePressed: Ember.K,
  escapePressed: function(event) {
    return this.hideDropdown();
  },
  enterPressed: function(event) {
    var item;
    item = this.get('highlighted');
    if (item) {
      this.set('selection', item);
    }
    if (item) {
      this.userDidSelect(item);
    }
    this.hideDropdown();
    return event.preventDefault();
  },
  upArrowPressed: function(event) {
    var index, sel;
    sel = this.get('highlightedIndex');
    index = event.ctrlKey || event.metaKey ? 0 : sel - 1;
    this.setHighlightedIndex(index, true);
    return event.preventDefault();
  },
  downArrowPressed: function(event) {
    var clen, index, sel;
    sel = this.get('highlightedIndex');
    clen = this.get('selectableOptions.length');
    index = event.ctrlKey || event.metaKey ? clen - 1 : sel + 1;
    this.setHighlightedIndex(index, true);
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
  ensureIndex: function(index) {
    var clen;
    clen = this.get('selectableOptions.length');
    return index >= 0 && index < clen;
  },
  ensureVisible: function(index) {
    var $listView, endIndex, item, listView, newIndex, numRows, startIndex;
    $listView = this.$('.ember-list-view');
    listView = Ember.View.views[$listView.attr('id')];
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
  userDidSelect: function(selection) {
    return this.sendAction('userSelected', selection);
  }
});

Ember.Handlebars.helper('select-component', Ember.Widgets.SelectComponent);


})();

(function() {

var get, set;

get = function(object, key) {
  if (!object) {
    return void 0;
  }
  if (!key) {
    return object;
  }
  return (typeof object.get === "function" ? object.get(key) : void 0) || object[key];
};

set = function(object, key, value) {
  if (!(object && key)) {
    return;
  }
  return (typeof object.set === "function" ? object.set(key, value) : void 0) || (object[key] = value);
};

Ember.Widgets.MultiSelectOptionView = Ember.View.extend({
  tagName: 'li',
  templateName: 'multi_select_item',
  classNames: 'ember-select-search-choice',
  labelPath: Ember.computed.alias('controller.optionLabelPath'),
  didInsertElement: function() {
    this._super();
    return this.labelPathDidChange();
  },
  labelPathDidChange: Ember.observer(function() {
    var labelPath, path;
    labelPath = this.get('labelPath');
    path = labelPath ? "context." + labelPath : 'context';
    Ember.defineProperty(this, 'label', Ember.computed.alias(path));
    return this.notifyPropertyChange('label');
  }, 'context', 'labelPath')
});

Ember.Widgets.MultiSelectComponent = Ember.Widgets.SelectComponent.extend({
  templateName: 'multi-select',
  selections: void 0,
  choicesFieldClass: '',
  values: Ember.computed(function(key, value) {
    var selections, valuePath;
    if (arguments.length === 2) {
      if (!value) {
        return;
      }
      valuePath = this.get('optionValuePath');
      this.set('selections', this.get('content').filter(function(item) {
        return value.contains(get(item, valuePath));
      }));
      return value;
    } else {
      valuePath = this.get('optionValuePath');
      selections = this.get('selections');
      if (valuePath) {
        return selections.getEach(valuePath);
      } else {
        return selections;
      }
    }
  }).property('selections.@each'),
  selectionItemView: Ember.Widgets.MultiSelectOptionView,
  searchView: Ember.TextField.extend({
    "class": 'ember-select-input',
    valueBinding: 'parentView.query',
    focusIn: function(event) {
      return this.set('parentView.showDropdown', true);
    }
  }),
  filteredContent: Ember.computed(function() {
    var content, query, selections,
      _this = this;
    content = this.get('content');
    query = this.get('query');
    selections = this.get('selections');
    if (!(content && selections)) {
      return [];
    }
    return this.get('content').filter(function(item) {
      return !selections.contains(item) && _this.matcher(query, item);
    });
  }).property('content.@each', 'optionLabelPath', 'query', 'selections.@each'),
  selectionDidChange: Ember.observer(function() {
    var selection, selections;
    selections = this.get('selections');
    selection = this.get('selection');
    this.set('selection', null);
    this.set('query', '');
    if (selection && !selections.contains(selection)) {
      return selections.pushObject(selection);
    }
  }, 'selection'),
  didInsertElement: function() {
    this._super();
    if (!this.get('selections')) {
      this.set('selections', []);
    }
    if (!this.get('values')) {
      return this.set('values', []);
    }
  },
  deletePressed: function(event) {
    if (event.target.selectionStart === 0) {
      return this.removeSelectItem(this.get('selections.lastObject'));
    }
  },
  removeSelectItem: function(item) {
    return this.get('selections').removeObject(item);
  }
});

Ember.Handlebars.helper('multi-select-component', Ember.Widgets.MultiSelectComponent);


})();

(function() {


Ember.Widgets.TypeaheadComponent = Ember.Widgets.SelectComponent.extend({
  templateName: 'typeahead',
  searchFieldClass: 'form-control',
  searchView: Ember.TextField.extend({
    "class": 'ember-select-input',
    valueBinding: 'parentView.query',
    focusIn: function(event) {
      return this.set('parentView.showDropdown', true);
    }
  }),
  selectionDidChange: Ember.observer(function() {
    return this.set('query', this.get('selection'));
  }, 'selection')
});

Ember.Handlebars.helper('typeahead-component', Ember.Widgets.TypeaheadComponent);


})();