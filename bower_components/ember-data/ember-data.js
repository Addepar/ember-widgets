(function() {
    "use strict";
    var ember$data$lib$system$model$errors$invalid$$create = Ember.create;
    var ember$data$lib$system$model$errors$invalid$$EmberError = Ember.Error;

    /**
      A `DS.InvalidError` is used by an adapter to signal the external API
      was unable to process a request because the content was not
      semantically correct or meaningful per the API. Usually this means a
      record failed some form of server side validation. When a promise
      from an adapter is rejected with a `DS.InvalidError` the record will
      transition to the `invalid` state and the errors will be set to the
      `errors` property on the record.

      For Ember Data to correctly map errors to their corresponding
      properties on the model, Ember Data expects each error to be
      namespaced under a key that matches the property name. For example
      if you had a Post model that looked like this.

      ```js
      App.Post = DS.Model.extend({
        title: DS.attr('string'),
        content: DS.attr('string')
      });
      ```

      To show an error from the server related to the `title` and
      `content` properties your adapter could return a promise that
      rejects with a `DS.InvalidError` object that looks like this:

      ```js
      App.PostAdapter = DS.RESTAdapter.extend({
        updateRecord: function() {
          // Fictional adapter that always rejects
          return Ember.RSVP.reject(new DS.InvalidError({
            title: ['Must be unique'],
            content: ['Must not be blank'],
          }));
        }
      });
      ```

      Your backend may use different property names for your records the
      store will attempt extract and normalize the errors using the
      serializer's `extractErrors` method before the errors get added to
      the the model. As a result, it is safe for the `InvalidError` to
      wrap the error payload unaltered.

      Example

      ```javascript
      App.ApplicationAdapter = DS.RESTAdapter.extend({
        ajaxError: function(jqXHR) {
          var error = this._super(jqXHR);

          // 422 is used by this fictional server to signal a validation error
          if (jqXHR && jqXHR.status === 422) {
            var jsonErrors = Ember.$.parseJSON(jqXHR.responseText);
            return new DS.InvalidError(jsonErrors);
          } else {
            // The ajax request failed however it is not a result of this
            // record being in an invalid state so we do not return a
            // `InvalidError` object.
            return error;
          }
        }
      });
      ```

      @class InvalidError
      @namespace DS
    */
    function ember$data$lib$system$model$errors$invalid$$InvalidError(errors) {
      ember$data$lib$system$model$errors$invalid$$EmberError.call(this, "The backend rejected the commit because it was invalid: " + Ember.inspect(errors));
      this.errors = errors;
    }

    ember$data$lib$system$model$errors$invalid$$InvalidError.prototype = ember$data$lib$system$model$errors$invalid$$create(ember$data$lib$system$model$errors$invalid$$EmberError.prototype);

    var ember$data$lib$system$model$errors$invalid$$default = ember$data$lib$system$model$errors$invalid$$InvalidError;

    /**
      @module ember-data
    */

    var ember$data$lib$system$adapter$$get = Ember.get;

    /**
      An adapter is an object that receives requests from a store and
      translates them into the appropriate action to take against your
      persistence layer. The persistence layer is usually an HTTP API, but
      may be anything, such as the browser's local storage. Typically the
      adapter is not invoked directly instead its functionality is accessed
      through the `store`.

      ### Creating an Adapter

      Create a new subclass of `DS.Adapter`, then assign
      it to the `ApplicationAdapter` property of the application.

      ```javascript
      var MyAdapter = DS.Adapter.extend({
        // ...your code here
      });

      App.ApplicationAdapter = MyAdapter;
      ```

      Model-specific adapters can be created by assigning your adapter
      class to the `ModelName` + `Adapter` property of the application.

      ```javascript
      var MyPostAdapter = DS.Adapter.extend({
        // ...Post-specific adapter code goes here
      });

      App.PostAdapter = MyPostAdapter;
      ```

      `DS.Adapter` is an abstract base class that you should override in your
      application to customize it for your backend. The minimum set of methods
      that you should implement is:

        * `find()`
        * `createRecord()`
        * `updateRecord()`
        * `deleteRecord()`
        * `findAll()`
        * `findQuery()`

      To improve the network performance of your application, you can optimize
      your adapter by overriding these lower-level methods:

        * `findMany()`


      For an example implementation, see `DS.RESTAdapter`, the
      included REST adapter.

      @class Adapter
      @namespace DS
      @extends Ember.Object
    */

    var ember$data$lib$system$adapter$$Adapter = Ember.Object.extend({

      /**
        If you would like your adapter to use a custom serializer you can
        set the `defaultSerializer` property to be the name of the custom
        serializer.

        Note the `defaultSerializer` serializer has a lower priority than
        a model specific serializer (i.e. `PostSerializer`) or the
        `application` serializer.

        ```javascript
        var DjangoAdapter = DS.Adapter.extend({
          defaultSerializer: 'django'
        });
        ```

        @property defaultSerializer
        @type {String}
      */

      /**
        The `find()` method is invoked when the store is asked for a record that
        has not previously been loaded. In response to `find()` being called, you
        should query your persistence layer for a record with the given ID. Once
        found, you can asynchronously call the store's `push()` method to push
        the record into the store.

        Here is an example `find` implementation:

        ```javascript
        App.ApplicationAdapter = DS.Adapter.extend({
          find: function(store, type, id, snapshot) {
            var url = [type.modelName, id].join('/');

            return new Ember.RSVP.Promise(function(resolve, reject) {
              jQuery.getJSON(url).then(function(data) {
                Ember.run(null, resolve, data);
              }, function(jqXHR) {
                jqXHR.then = null; // tame jQuery's ill mannered promises
                Ember.run(null, reject, jqXHR);
              });
            });
          }
        });
        ```

        @method find
        @param {DS.Store} store
        @param {subclass of DS.Model} type
        @param {String} id
        @param {DS.Snapshot} snapshot
        @return {Promise} promise
      */
      find: null,

      /**
        The `findAll()` method is called when you call `find` on the store
        without an ID (i.e. `store.find('post')`).

        Example

        ```javascript
        App.ApplicationAdapter = DS.Adapter.extend({
          findAll: function(store, type, sinceToken) {
            var url = type;
            var query = { since: sinceToken };
            return new Ember.RSVP.Promise(function(resolve, reject) {
              jQuery.getJSON(url, query).then(function(data) {
                Ember.run(null, resolve, data);
              }, function(jqXHR) {
                jqXHR.then = null; // tame jQuery's ill mannered promises
                Ember.run(null, reject, jqXHR);
              });
            });
          }
        });
        ```

        @private
        @method findAll
        @param {DS.Store} store
        @param {subclass of DS.Model} type
        @param {String} sinceToken
        @return {Promise} promise
      */
      findAll: null,

      /**
        This method is called when you call `find` on the store with a
        query object as the second parameter (i.e. `store.find('person', {
        page: 1 })`).

        Example

        ```javascript
        App.ApplicationAdapter = DS.Adapter.extend({
          findQuery: function(store, type, query) {
            var url = type;
            return new Ember.RSVP.Promise(function(resolve, reject) {
              jQuery.getJSON(url, query).then(function(data) {
                Ember.run(null, resolve, data);
              }, function(jqXHR) {
                jqXHR.then = null; // tame jQuery's ill mannered promises
                Ember.run(null, reject, jqXHR);
              });
            });
          }
        });
        ```

        @private
        @method findQuery
        @param {DS.Store} store
        @param {subclass of DS.Model} type
        @param {Object} query
        @param {DS.AdapterPopulatedRecordArray} recordArray
        @return {Promise} promise
      */
      findQuery: null,

      /**
        If the globally unique IDs for your records should be generated on the client,
        implement the `generateIdForRecord()` method. This method will be invoked
        each time you create a new record, and the value returned from it will be
        assigned to the record's `primaryKey`.

        Most traditional REST-like HTTP APIs will not use this method. Instead, the ID
        of the record will be set by the server, and your adapter will update the store
        with the new ID when it calls `didCreateRecord()`. Only implement this method if
        you intend to generate record IDs on the client-side.

        The `generateIdForRecord()` method will be invoked with the requesting store as
        the first parameter and the newly created record as the second parameter:

        ```javascript
        generateIdForRecord: function(store, inputProperties) {
          var uuid = App.generateUUIDWithStatisticallyLowOddsOfCollision();
          return uuid;
        }
        ```

        @method generateIdForRecord
        @param {DS.Store} store
        @param {subclass of DS.Model} type   the DS.Model class of the record
        @param {Object} inputProperties a hash of properties to set on the
          newly created record.
        @return {String|Number} id
      */
      generateIdForRecord: null,

      /**
        Proxies to the serializer's `serialize` method.

        Example

        ```javascript
        App.ApplicationAdapter = DS.Adapter.extend({
          createRecord: function(store, type, snapshot) {
            var data = this.serialize(snapshot, { includeId: true });
            var url = type;

            // ...
          }
        });
        ```

        @method serialize
        @param {DS.Snapshot} snapshot
        @param {Object}   options
        @return {Object} serialized snapshot
      */
      serialize: function(snapshot, options) {
        return ember$data$lib$system$adapter$$get(snapshot.record, 'store').serializerFor(snapshot.modelName).serialize(snapshot, options);
      },

      /**
        Implement this method in a subclass to handle the creation of
        new records.

        Serializes the record and send it to the server.

        Example

        ```javascript
        App.ApplicationAdapter = DS.Adapter.extend({
          createRecord: function(store, type, snapshot) {
            var data = this.serialize(snapshot, { includeId: true });
            var url = type;

            return new Ember.RSVP.Promise(function(resolve, reject) {
              jQuery.ajax({
                type: 'POST',
                url: url,
                dataType: 'json',
                data: data
              }).then(function(data) {
                Ember.run(null, resolve, data);
              }, function(jqXHR) {
                jqXHR.then = null; // tame jQuery's ill mannered promises
                Ember.run(null, reject, jqXHR);
              });
            });
          }
        });
        ```

        @method createRecord
        @param {DS.Store} store
        @param {subclass of DS.Model} type   the DS.Model class of the record
        @param {DS.Snapshot} snapshot
        @return {Promise} promise
      */
      createRecord: null,

      /**
        Implement this method in a subclass to handle the updating of
        a record.

        Serializes the record update and send it to the server.

        Example

        ```javascript
        App.ApplicationAdapter = DS.Adapter.extend({
          updateRecord: function(store, type, snapshot) {
            var data = this.serialize(snapshot, { includeId: true });
            var id = snapshot.id;
            var url = [type, id].join('/');

            return new Ember.RSVP.Promise(function(resolve, reject) {
              jQuery.ajax({
                type: 'PUT',
                url: url,
                dataType: 'json',
                data: data
              }).then(function(data) {
                Ember.run(null, resolve, data);
              }, function(jqXHR) {
                jqXHR.then = null; // tame jQuery's ill mannered promises
                Ember.run(null, reject, jqXHR);
              });
            });
          }
        });
        ```

        @method updateRecord
        @param {DS.Store} store
        @param {subclass of DS.Model} type   the DS.Model class of the record
        @param {DS.Snapshot} snapshot
        @return {Promise} promise
      */
      updateRecord: null,

      /**
        Implement this method in a subclass to handle the deletion of
        a record.

        Sends a delete request for the record to the server.

        Example

        ```javascript
        App.ApplicationAdapter = DS.Adapter.extend({
          deleteRecord: function(store, type, snapshot) {
            var data = this.serialize(snapshot, { includeId: true });
            var id = snapshot.id;
            var url = [type, id].join('/');

            return new Ember.RSVP.Promise(function(resolve, reject) {
              jQuery.ajax({
                type: 'DELETE',
                url: url,
                dataType: 'json',
                data: data
              }).then(function(data) {
                Ember.run(null, resolve, data);
              }, function(jqXHR) {
                jqXHR.then = null; // tame jQuery's ill mannered promises
                Ember.run(null, reject, jqXHR);
              });
            });
          }
        });
        ```

        @method deleteRecord
        @param {DS.Store} store
        @param {subclass of DS.Model} type   the DS.Model class of the record
        @param {DS.Snapshot} snapshot
        @return {Promise} promise
      */
      deleteRecord: null,

      /**
        By default the store will try to coalesce all `fetchRecord` calls within the same runloop
        into as few requests as possible by calling groupRecordsForFindMany and passing it into a findMany call.
        You can opt out of this behaviour by either not implementing the findMany hook or by setting
        coalesceFindRequests to false

        @property coalesceFindRequests
        @type {boolean}
      */
      coalesceFindRequests: true,

      /**
        Find multiple records at once if coalesceFindRequests is true

        @method findMany
        @param {DS.Store} store
        @param {subclass of DS.Model} type   the DS.Model class of the records
        @param {Array}    ids
        @param {Array} snapshots
        @return {Promise} promise
      */

      /**
        Organize records into groups, each of which is to be passed to separate
        calls to `findMany`.

        For example, if your api has nested URLs that depend on the parent, you will
        want to group records by their parent.

        The default implementation returns the records as a single group.

        @method groupRecordsForFindMany
        @param {DS.Store} store
        @param {Array} snapshots
        @return {Array}  an array of arrays of records, each of which is to be
                          loaded separately by `findMany`.
      */
      groupRecordsForFindMany: function(store, snapshots) {
        return [snapshots];
      }
    });

    var ember$data$lib$system$adapter$$default = ember$data$lib$system$adapter$$Adapter;
    var ember$data$lib$adapters$fixture$adapter$$get = Ember.get;
    var ember$data$lib$adapters$fixture$adapter$$fmt = Ember.String.fmt;
    var ember$data$lib$adapters$fixture$adapter$$indexOf = Ember.EnumerableUtils.indexOf;

    var ember$data$lib$adapters$fixture$adapter$$counter = 0;

    var ember$data$lib$adapters$fixture$adapter$$default = ember$data$lib$system$adapter$$default.extend({
      // by default, fixtures are already in normalized form
      serializer: null,
      // The fixture adapter does not support coalesceFindRequests
      coalesceFindRequests: false,

      /**
        If `simulateRemoteResponse` is `true` the `FixtureAdapter` will
        wait a number of milliseconds before resolving promises with the
        fixture values. The wait time can be configured via the `latency`
        property.

        @property simulateRemoteResponse
        @type {Boolean}
        @default true
      */
      simulateRemoteResponse: true,

      /**
        By default the `FixtureAdapter` will simulate a wait of the
        `latency` milliseconds before resolving promises with the fixture
        values. This behavior can be turned off via the
        `simulateRemoteResponse` property.

        @property latency
        @type {Number}
        @default 50
      */
      latency: 50,

      /**
        Implement this method in order to provide data associated with a type

        @method fixturesForType
        @param {Subclass of DS.Model} typeClass
        @return {Array}
      */
      fixturesForType: function(typeClass) {
        if (typeClass.FIXTURES) {
          var fixtures = Ember.A(typeClass.FIXTURES);
          return fixtures.map(function(fixture) {
            var fixtureIdType = typeof fixture.id;
            if (fixtureIdType !== "number" && fixtureIdType !== "string") {
              throw new Error(ember$data$lib$adapters$fixture$adapter$$fmt('the id property must be defined as a number or string for fixture %@', [fixture]));
            }
            fixture.id = fixture.id + '';
            return fixture;
          });
        }
        return null;
      },

      /**
        Implement this method in order to query fixtures data

        @method queryFixtures
        @param {Array} fixture
        @param {Object} query
        @param {Subclass of DS.Model} typeClass
        @return {Promise|Array}
      */
      queryFixtures: function(fixtures, query, typeClass) {
        Ember.assert('Not implemented: You must override the DS.FixtureAdapter::queryFixtures method to support querying the fixture store.');
      },

      /**
        @method updateFixtures
        @param {Subclass of DS.Model} typeClass
        @param {Array} fixture
      */
      updateFixtures: function(typeClass, fixture) {
        if (!typeClass.FIXTURES) {
          typeClass.FIXTURES = [];
        }

        var fixtures = typeClass.FIXTURES;

        this.deleteLoadedFixture(typeClass, fixture);

        fixtures.push(fixture);
      },

      /**
        Implement this method in order to provide json for CRUD methods

        @method mockJSON
        @param {DS.Store} store
        @param {Subclass of DS.Model} typeClass
        @param {DS.Snapshot} snapshot
      */
      mockJSON: function(store, typeClass, snapshot) {
        return store.serializerFor(snapshot.modelName).serialize(snapshot, { includeId: true });
      },

      /**
        @method generateIdForRecord
        @param {DS.Store} store
        @param {DS.Model} record
        @return {String} id
      */
      generateIdForRecord: function(store) {
        return "fixture-" + ember$data$lib$adapters$fixture$adapter$$counter++;
      },

      /**
        @method find
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {String} id
        @param {DS.Snapshot} snapshot
        @return {Promise} promise
      */
      find: function(store, typeClass, id, snapshot) {
        var fixtures = this.fixturesForType(typeClass);
        var fixture;

        Ember.assert("Unable to find fixtures for model type "+typeClass.toString() +". If you're defining your fixtures using `Model.FIXTURES = ...`, please change it to `Model.reopenClass({ FIXTURES: ... })`.", fixtures);

        if (fixtures) {
          fixture = Ember.A(fixtures).findBy('id', id);
        }

        if (fixture) {
          return this.simulateRemoteCall(function() {
            return fixture;
          }, this);
        }
      },

      /**
        @method findMany
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Array} ids
        @param {Array} snapshots
        @return {Promise} promise
      */
      findMany: function(store, typeClass, ids, snapshots) {
        var fixtures = this.fixturesForType(typeClass);

        Ember.assert("Unable to find fixtures for model type "+typeClass.toString(), fixtures);

        if (fixtures) {
          fixtures = fixtures.filter(function(item) {
            return ember$data$lib$adapters$fixture$adapter$$indexOf(ids, item.id) !== -1;
          });
        }

        if (fixtures) {
          return this.simulateRemoteCall(function() {
            return fixtures;
          }, this);
        }
      },

      /**
        @private
        @method findAll
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {String} sinceToken
        @return {Promise} promise
      */
      findAll: function(store, typeClass) {
        var fixtures = this.fixturesForType(typeClass);

        Ember.assert("Unable to find fixtures for model type "+typeClass.toString(), fixtures);

        return this.simulateRemoteCall(function() {
          return fixtures;
        }, this);
      },

      /**
        @private
        @method findQuery
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} query
        @param {DS.AdapterPopulatedRecordArray} recordArray
        @return {Promise} promise
      */
      findQuery: function(store, typeClass, query, array) {
        var fixtures = this.fixturesForType(typeClass);

        Ember.assert("Unable to find fixtures for model type " + typeClass.toString(), fixtures);

        fixtures = this.queryFixtures(fixtures, query, typeClass);

        if (fixtures) {
          return this.simulateRemoteCall(function() {
            return fixtures;
          }, this);
        }
      },

      /**
        @method createRecord
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {DS.Snapshot} snapshot
        @return {Promise} promise
      */
      createRecord: function(store, typeClass, snapshot) {
        var fixture = this.mockJSON(store, typeClass, snapshot);

        this.updateFixtures(typeClass, fixture);

        return this.simulateRemoteCall(function() {
          return fixture;
        }, this);
      },

      /**
        @method updateRecord
        @param {DS.Store} store
        @param {subclass of DS.Model} type
        @param {DS.Snapshot} snapshot
        @return {Promise} promise
      */
      updateRecord: function(store, typeClass, snapshot) {
        var fixture = this.mockJSON(store, typeClass, snapshot);

        this.updateFixtures(typeClass, fixture);

        return this.simulateRemoteCall(function() {
          return fixture;
        }, this);
      },

      /**
        @method deleteRecord
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {DS.Snapshot} snapshot
        @return {Promise} promise
      */
      deleteRecord: function(store, typeClass, snapshot) {
        this.deleteLoadedFixture(typeClass, snapshot);

        return this.simulateRemoteCall(function() {
          // no payload in a deletion
          return null;
        });
      },

      /*
        @method deleteLoadedFixture
        @private
        @param typeClass
        @param snapshot
      */
      deleteLoadedFixture: function(typeClass, snapshot) {
        var existingFixture = this.findExistingFixture(typeClass, snapshot);

        if (existingFixture) {
          var index = ember$data$lib$adapters$fixture$adapter$$indexOf(typeClass.FIXTURES, existingFixture);
          typeClass.FIXTURES.splice(index, 1);
          return true;
        }
      },

      /*
        @method findExistingFixture
        @private
        @param typeClass
        @param snapshot
      */
      findExistingFixture: function(typeClass, snapshot) {
        var fixtures = this.fixturesForType(typeClass);
        var id = snapshot.id;

        return this.findFixtureById(fixtures, id);
      },

      /*
        @method findFixtureById
        @private
        @param fixtures
        @param id
      */
      findFixtureById: function(fixtures, id) {
        return Ember.A(fixtures).find(function(r) {
          if (''+ember$data$lib$adapters$fixture$adapter$$get(r, 'id') === ''+id) {
            return true;
          } else {
            return false;
          }
        });
      },

      /*
        @method simulateRemoteCall
        @private
        @param callback
        @param context
      */
      simulateRemoteCall: function(callback, context) {
        var adapter = this;

        return new Ember.RSVP.Promise(function(resolve) {
          var value = Ember.copy(callback.call(context), true);
          if (ember$data$lib$adapters$fixture$adapter$$get(adapter, 'simulateRemoteResponse')) {
            // Schedule with setTimeout
            Ember.run.later(function() {
              resolve(value);
            }, ember$data$lib$adapters$fixture$adapter$$get(adapter, 'latency'));
          } else {
            // Asynchronous, but at the of the runloop with zero latency
            Ember.run.schedule('actions', null, function() {
              resolve(value);
            });
          }
        }, "DS: FixtureAdapter#simulateRemoteCall");
      }
    });

    var ember$data$lib$system$map$$Map            = Ember.Map;
    var ember$data$lib$system$map$$MapWithDefault = Ember.MapWithDefault;

    var ember$data$lib$system$map$$default = ember$data$lib$system$map$$Map;
    var ember$data$lib$adapters$build$url$mixin$$get = Ember.get;

    var ember$data$lib$adapters$build$url$mixin$$default = Ember.Mixin.create({
      /**
        Builds a URL for a given type and optional ID.

        By default, it pluralizes the type's name (for example, 'post'
        becomes 'posts' and 'person' becomes 'people'). To override the
        pluralization see [pathForType](#method_pathForType).

        If an ID is specified, it adds the ID to the path generated
        for the type, separated by a `/`.

        When called by RESTAdapter.findMany() the `id` and `snapshot` parameters
        will be arrays of ids and snapshots.

        @method buildURL
        @param {String} modelName
        @param {String|Array|Object} id single id or array of ids or query
        @param {DS.Snapshot|Array} snapshot single snapshot or array of snapshots
        @param {String} requestType
        @param {Object} query object of query parameters to send for findQuery requests.
        @return {String} url
      */
      buildURL: function(modelName, id, snapshot, requestType, query) {
        switch (requestType) {
          case 'find':
            return this.urlForFind(id, modelName, snapshot);
          case 'findAll':
            return this.urlForFindAll(modelName);
          case 'findQuery':
            return this.urlForFindQuery(query, modelName);
          case 'findMany':
            return this.urlForFindMany(id, modelName, snapshot);
          case 'findHasMany':
            return this.urlForFindHasMany(id, modelName);
          case 'findBelongsTo':
            return this.urlForFindBelongsTo(id, modelName);
          case 'createRecord':
            return this.urlForCreateRecord(modelName, snapshot);
          case 'updateRecord':
            return this.urlForUpdateRecord(id, modelName, snapshot);
          case 'deleteRecord':
            return this.urlForDeleteRecord(id, modelName, snapshot);
          default:
            return this._buildURL(modelName, id);
        }
      },

      /**
        @method _buildURL
        @private
        @param {String} modelName
        @param {String} id
        @return {String} url
      */
      _buildURL: function(modelName, id) {
        var url = [];
        var host = ember$data$lib$adapters$build$url$mixin$$get(this, 'host');
        var prefix = this.urlPrefix();
        var path;

        if (modelName) {
          path = this.pathForType(modelName);
          if (path) { url.push(path); }
        }

        if (id) { url.push(encodeURIComponent(id)); }
        if (prefix) { url.unshift(prefix); }

        url = url.join('/');
        if (!host && url && url.charAt(0) !== '/') {
          url = '/' + url;
        }

        return url;
      },

      /**
       * @method urlForFind
       * @param {String} id
       * @param {String} modelName
       * @param {DS.Snapshot} snapshot
       * @return {String} url
       */
      urlForFind: function(id, modelName, snapshot) {
        return this._buildURL(modelName, id);
      },

      /**
       * @method urlForFindAll
       * @param {String} modelName
       * @return {String} url
       */
      urlForFindAll: function(modelName) {
        return this._buildURL(modelName);
      },

      /**
       * @method urlForFindQuery
       * @param {Object} query
       * @param {String} modelName
       * @return {String} url
       */
      urlForFindQuery: function(query, modelName) {
        return this._buildURL(modelName);
      },

      /**
       * @method urlForFindMany
       * @param {Array} ids
       * @param {String} type
       * @param {Array} snapshots
       * @return {String} url
       */
      urlForFindMany: function(ids, modelName, snapshots) {
        return this._buildURL(modelName);
      },

      /**
       * @method urlForFindHasMany
       * @param {String} id
       * @param {String} modelName
       * @return {String} url
       */
      urlForFindHasMany: function(id, modelName) {
        return this._buildURL(modelName, id);
      },

      /**
       * @method urlForFindBelongTo
       * @param {String} id
       * @param {String} modelName
       * @return {String} url
       */
      urlForFindBelongsTo: function(id, modelName) {
        return this._buildURL(modelName, id);
      },

      /**
       * @method urlForCreateRecord
       * @param {String} modelName
       * @param {DS.Snapshot} snapshot
       * @return {String} url
       */
      urlForCreateRecord: function(modelName, snapshot) {
        return this._buildURL(modelName);
      },

      /**
       * @method urlForUpdateRecord
       * @param {String} id
       * @param {String} modelName
       * @param {DS.Snapshot} snapshot
       * @return {String} url
       */
      urlForUpdateRecord: function(id, modelName, snapshot) {
        return this._buildURL(modelName, id);
      },

      /**
       * @method urlForDeleteRecord
       * @param {String} id
       * @param {String} modelName
       * @param {DS.Snapshot} snapshot
       * @return {String} url
       */
      urlForDeleteRecord: function(id, modelName, snapshot) {
        return this._buildURL(modelName, id);
      },

      /**
        @method urlPrefix
        @private
        @param {String} path
        @param {String} parentUrl
        @return {String} urlPrefix
      */
      urlPrefix: function(path, parentURL) {
        var host = ember$data$lib$adapters$build$url$mixin$$get(this, 'host');
        var namespace = ember$data$lib$adapters$build$url$mixin$$get(this, 'namespace');
        var url = [];

        if (path) {
          // Protocol relative url
          //jscs:disable disallowEmptyBlocks
          if (/^\/\//.test(path)) {
            // Do nothing, the full host is already included. This branch
            // avoids the absolute path logic and the relative path logic.

          // Absolute path
          } else if (path.charAt(0) === '/') {
            //jscs:enable disallowEmptyBlocks
            if (host) {
              path = path.slice(1);
              url.push(host);
            }
          // Relative path
          } else if (!/^http(s)?:\/\//.test(path)) {
            url.push(parentURL);
          }
        } else {
          if (host) { url.push(host); }
          if (namespace) { url.push(namespace); }
        }

        if (path) {
          url.push(path);
        }

        return url.join('/');
      },


      /**
        Determines the pathname for a given type.

        By default, it pluralizes the type's name (for example,
        'post' becomes 'posts' and 'person' becomes 'people').

        ### Pathname customization

        For example if you have an object LineItem with an
        endpoint of "/line_items/".

        ```js
        App.ApplicationAdapter = DS.RESTAdapter.extend({
          pathForType: function(modelName) {
            var decamelized = Ember.String.decamelize(modelName);
            return Ember.String.pluralize(decamelized);
          }
        });
        ```

        @method pathForType
        @param {String} modelName
        @return {String} path
      **/
      pathForType: function(modelName) {
        var camelized = Ember.String.camelize(modelName);
        return Ember.String.pluralize(camelized);
      }
    });

    var ember$data$lib$adapters$rest$adapter$$get = Ember.get;
    var ember$data$lib$adapters$rest$adapter$$forEach = Ember.ArrayPolyfills.forEach;

    var ember$data$lib$adapters$rest$adapter$$default = ember$data$lib$system$adapter$$Adapter.extend(ember$data$lib$adapters$build$url$mixin$$default, {
      defaultSerializer: '-rest',

      /**
        By default, the RESTAdapter will send the query params sorted alphabetically to the
        server.

        For example:

        ```js
          store.find('posts', {sort: 'price', category: 'pets'});
        ```

        will generate a requests like this `/posts?category=pets&sort=price`, even if the
        parameters were specified in a different order.

        That way the generated URL will be deterministic and that simplifies caching mechanisms
        in the backend.

        Setting `sortQueryParams` to a falsey value will respect the original order.

        In case you want to sort the query parameters with a different criteria, set
        `sortQueryParams` to your custom sort function.

        ```js
        export default DS.RESTAdapter.extend({
          sortQueryParams: function(params) {
            var sortedKeys = Object.keys(params).sort().reverse();
            var len = sortedKeys.length, newParams = {};

            for (var i = 0; i < len; i++) {
              newParams[sortedKeys[i]] = params[sortedKeys[i]];
            }
            return newParams;
          }
        });
        ```

        @method sortQueryParams
        @param {Object} obj
        @return {Object}
      */
      sortQueryParams: function(obj) {
        var keys = Ember.keys(obj);
        var len = keys.length;
        if (len < 2) {
          return obj;
        }
        var newQueryParams = {};
        var sortedKeys = keys.sort();

        for (var i = 0; i < len; i++) {
          newQueryParams[sortedKeys[i]] = obj[sortedKeys[i]];
        }
        return newQueryParams;
      },

      /**
        By default the RESTAdapter will send each find request coming from a `store.find`
        or from accessing a relationship separately to the server. If your server supports passing
        ids as a query string, you can set coalesceFindRequests to true to coalesce all find requests
        within a single runloop.

        For example, if you have an initial payload of:

        ```javascript
        {
          post: {
            id: 1,
            comments: [1, 2]
          }
        }
        ```

        By default calling `post.get('comments')` will trigger the following requests(assuming the
        comments haven't been loaded before):

        ```
        GET /comments/1
        GET /comments/2
        ```

        If you set coalesceFindRequests to `true` it will instead trigger the following request:

        ```
        GET /comments?ids[]=1&ids[]=2
        ```

        Setting coalesceFindRequests to `true` also works for `store.find` requests and `belongsTo`
        relationships accessed within the same runloop. If you set `coalesceFindRequests: true`

        ```javascript
        store.find('comment', 1);
        store.find('comment', 2);
        ```

        will also send a request to: `GET /comments?ids[]=1&ids[]=2`

        Note: Requests coalescing rely on URL building strategy. So if you override `buildURL` in your app
        `groupRecordsForFindMany` more likely should be overridden as well in order for coalescing to work.

        @property coalesceFindRequests
        @type {boolean}
      */
      coalesceFindRequests: false,

      /**
        Endpoint paths can be prefixed with a `namespace` by setting the namespace
        property on the adapter:

        ```javascript
        DS.RESTAdapter.reopen({
          namespace: 'api/1'
        });
        ```

        Requests for `App.Post` would now target `/api/1/post/`.

        @property namespace
        @type {String}
      */

      /**
        An adapter can target other hosts by setting the `host` property.

        ```javascript
        DS.RESTAdapter.reopen({
          host: 'https://api.example.com'
        });
        ```

        Requests for `App.Post` would now target `https://api.example.com/post/`.

        @property host
        @type {String}
      */

      /**
        Some APIs require HTTP headers, e.g. to provide an API
        key. Arbitrary headers can be set as key/value pairs on the
        `RESTAdapter`'s `headers` object and Ember Data will send them
        along with each ajax request. For dynamic headers see [headers
        customization](/api/data/classes/DS.RESTAdapter.html#toc_headers-customization).

        ```javascript
        App.ApplicationAdapter = DS.RESTAdapter.extend({
          headers: {
            "API_KEY": "secret key",
            "ANOTHER_HEADER": "Some header value"
          }
        });
        ```

        @property headers
        @type {Object}
      */

      /**
        Called by the store in order to fetch the JSON for a given
        type and ID.

        The `find` method makes an Ajax request to a URL computed by `buildURL`, and returns a
        promise for the resulting payload.

        This method performs an HTTP `GET` request with the id provided as part of the query string.

        @method find
        @param {DS.Store} store
        @param {subclass of DS.Model} type
        @param {String} id
        @param {DS.Snapshot} snapshot
        @return {Promise} promise
      */
      find: function(store, type, id, snapshot) {
        return this.ajax(this.buildURL(type.modelName, id, snapshot, 'find'), 'GET');
      },

      /**
        Called by the store in order to fetch a JSON array for all
        of the records for a given type.

        The `findAll` method makes an Ajax (HTTP GET) request to a URL computed by `buildURL`, and returns a
        promise for the resulting payload.

        @private
        @method findAll
        @param {DS.Store} store
        @param {subclass of DS.Model} type
        @param {String} sinceToken
        @return {Promise} promise
      */
      findAll: function(store, type, sinceToken) {
        var query, url;

        if (sinceToken) {
          query = { since: sinceToken };
        }

        url = this.buildURL(type.modelName, null, null, 'findAll');

        return this.ajax(url, 'GET', { data: query });
      },

      /**
        Called by the store in order to fetch a JSON array for
        the records that match a particular query.

        The `findQuery` method makes an Ajax (HTTP GET) request to a URL computed by `buildURL`, and returns a
        promise for the resulting payload.

        The `query` argument is a simple JavaScript object that will be passed directly
        to the server as parameters.

        @private
        @method findQuery
        @param {DS.Store} store
        @param {subclass of DS.Model} type
        @param {Object} query
        @return {Promise} promise
      */
      findQuery: function(store, type, query) {
        var url = this.buildURL(type.modelName, null, null, 'findQuery', query);

        if (this.sortQueryParams) {
          query = this.sortQueryParams(query);
        }

        return this.ajax(url, 'GET', { data: query });
      },

      /**
        Called by the store in order to fetch several records together if `coalesceFindRequests` is true

        For example, if the original payload looks like:

        ```js
        {
          "id": 1,
          "title": "Rails is omakase",
          "comments": [ 1, 2, 3 ]
        }
        ```

        The IDs will be passed as a URL-encoded Array of IDs, in this form:

        ```
        ids[]=1&ids[]=2&ids[]=3
        ```

        Many servers, such as Rails and PHP, will automatically convert this URL-encoded array
        into an Array for you on the server-side. If you want to encode the
        IDs, differently, just override this (one-line) method.

        The `findMany` method makes an Ajax (HTTP GET) request to a URL computed by `buildURL`, and returns a
        promise for the resulting payload.

        @method findMany
        @param {DS.Store} store
        @param {subclass of DS.Model} type
        @param {Array} ids
        @param {Array} snapshots
        @return {Promise} promise
      */
      findMany: function(store, type, ids, snapshots) {
        var url = this.buildURL(type.modelName, ids, snapshots, 'findMany');
        return this.ajax(url, 'GET', { data: { ids: ids } });
      },

      /**
        Called by the store in order to fetch a JSON array for
        the unloaded records in a has-many relationship that were originally
        specified as a URL (inside of `links`).

        For example, if your original payload looks like this:

        ```js
        {
          "post": {
            "id": 1,
            "title": "Rails is omakase",
            "links": { "comments": "/posts/1/comments" }
          }
        }
        ```

        This method will be called with the parent record and `/posts/1/comments`.

        The `findHasMany` method will make an Ajax (HTTP GET) request to the originally specified URL.

        @method findHasMany
        @param {DS.Store} store
        @param {DS.Snapshot} snapshot
        @param {String} url
        @return {Promise} promise
      */
      findHasMany: function(store, snapshot, url, relationship) {
        var id   = snapshot.id;
        var type = snapshot.modelName;

        url = this.urlPrefix(url, this.buildURL(type, id, null, 'findHasMany'));

        return this.ajax(url, 'GET');
      },

      /**
        Called by the store in order to fetch a JSON array for
        the unloaded records in a belongs-to relationship that were originally
        specified as a URL (inside of `links`).

        For example, if your original payload looks like this:

        ```js
        {
          "person": {
            "id": 1,
            "name": "Tom Dale",
            "links": { "group": "/people/1/group" }
          }
        }
        ```

        This method will be called with the parent record and `/people/1/group`.

        The `findBelongsTo` method will make an Ajax (HTTP GET) request to the originally specified URL.

        @method findBelongsTo
        @param {DS.Store} store
        @param {DS.Snapshot} snapshot
        @param {String} url
        @return {Promise} promise
      */
      findBelongsTo: function(store, snapshot, url, relationship) {
        var id   = snapshot.id;
        var type = snapshot.modelName;

        url = this.urlPrefix(url, this.buildURL(type, id, null, 'findBelongsTo'));
        return this.ajax(url, 'GET');
      },

      /**
        Called by the store when a newly created record is
        saved via the `save` method on a model record instance.

        The `createRecord` method serializes the record and makes an Ajax (HTTP POST) request
        to a URL computed by `buildURL`.

        See `serialize` for information on how to customize the serialized form
        of a record.

        @method createRecord
        @param {DS.Store} store
        @param {subclass of DS.Model} type
        @param {DS.Snapshot} snapshot
        @return {Promise} promise
      */
      createRecord: function(store, type, snapshot) {
        var data = {};
        var serializer = store.serializerFor(type.modelName);
        var url = this.buildURL(type.modelName, null, snapshot, 'createRecord');

        serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

        return this.ajax(url, "POST", { data: data });
      },

      /**
        Called by the store when an existing record is saved
        via the `save` method on a model record instance.

        The `updateRecord` method serializes the record and makes an Ajax (HTTP PUT) request
        to a URL computed by `buildURL`.

        See `serialize` for information on how to customize the serialized form
        of a record.

        @method updateRecord
        @param {DS.Store} store
        @param {subclass of DS.Model} type
        @param {DS.Snapshot} snapshot
        @return {Promise} promise
      */
      updateRecord: function(store, type, snapshot) {
        var data = {};
        var serializer = store.serializerFor(type.modelName);

        serializer.serializeIntoHash(data, type, snapshot);

        var id = snapshot.id;
        var url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

        return this.ajax(url, "PUT", { data: data });
      },

      /**
        Called by the store when a record is deleted.

        The `deleteRecord` method  makes an Ajax (HTTP DELETE) request to a URL computed by `buildURL`.

        @method deleteRecord
        @param {DS.Store} store
        @param {subclass of DS.Model} type
        @param {DS.Snapshot} snapshot
        @return {Promise} promise
      */
      deleteRecord: function(store, type, snapshot) {
        var id = snapshot.id;

        return this.ajax(this.buildURL(type.modelName, id, snapshot, 'deleteRecord'), "DELETE");
      },

      _stripIDFromURL: function(store, snapshot) {
        var url = this.buildURL(snapshot.modelName, snapshot.id, snapshot);

        var expandedURL = url.split('/');
        //Case when the url is of the format ...something/:id
        var lastSegment = expandedURL[expandedURL.length - 1];
        var id = snapshot.id;
        if (lastSegment === id) {
          expandedURL[expandedURL.length - 1] = "";
        } else if (ember$data$lib$adapters$rest$adapter$$endsWith(lastSegment, '?id=' + id)) {
          //Case when the url is of the format ...something?id=:id
          expandedURL[expandedURL.length - 1] = lastSegment.substring(0, lastSegment.length - id.length - 1);
        }

        return expandedURL.join('/');
      },

      // http://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
      maxUrlLength: 2048,

      /**
        Organize records into groups, each of which is to be passed to separate
        calls to `findMany`.

        This implementation groups together records that have the same base URL but
        differing ids. For example `/comments/1` and `/comments/2` will be grouped together
        because we know findMany can coalesce them together as `/comments?ids[]=1&ids[]=2`

        It also supports urls where ids are passed as a query param, such as `/comments?id=1`
        but not those where there is more than 1 query param such as `/comments?id=2&name=David`
        Currently only the query param of `id` is supported. If you need to support others, please
        override this or the `_stripIDFromURL` method.

        It does not group records that have differing base urls, such as for example: `/posts/1/comments/2`
        and `/posts/2/comments/3`

        @method groupRecordsForFindMany
        @param {DS.Store} store
        @param {Array} snapshots
        @return {Array}  an array of arrays of records, each of which is to be
                          loaded separately by `findMany`.
      */
      groupRecordsForFindMany: function (store, snapshots) {
        var groups = ember$data$lib$system$map$$MapWithDefault.create({ defaultValue: function() { return []; } });
        var adapter = this;
        var maxUrlLength = this.maxUrlLength;

        ember$data$lib$adapters$rest$adapter$$forEach.call(snapshots, function(snapshot) {
          var baseUrl = adapter._stripIDFromURL(store, snapshot);
          groups.get(baseUrl).push(snapshot);
        });

        function splitGroupToFitInUrl(group, maxUrlLength, paramNameLength) {
          var baseUrl = adapter._stripIDFromURL(store, group[0]);
          var idsSize = 0;
          var splitGroups = [[]];

          ember$data$lib$adapters$rest$adapter$$forEach.call(group, function(snapshot) {
            var additionalLength = encodeURIComponent(snapshot.id).length + paramNameLength;
            if (baseUrl.length + idsSize + additionalLength >= maxUrlLength) {
              idsSize = 0;
              splitGroups.push([]);
            }

            idsSize += additionalLength;

            var lastGroupIndex = splitGroups.length - 1;
            splitGroups[lastGroupIndex].push(snapshot);
          });

          return splitGroups;
        }

        var groupsArray = [];
        groups.forEach(function(group, key) {
          var paramNameLength = '&ids%5B%5D='.length;
          var splitGroups = splitGroupToFitInUrl(group, maxUrlLength, paramNameLength);

          ember$data$lib$adapters$rest$adapter$$forEach.call(splitGroups, function(splitGroup) {
            groupsArray.push(splitGroup);
          });
        });

        return groupsArray;
      },


      /**
        Takes an ajax response, and returns an error payload.

        Returning a `DS.InvalidError` from this method will cause the
        record to transition into the `invalid` state and make the
        `errors` object available on the record. When returning an
        `InvalidError` the store will attempt to normalize the error data
        returned from the server using the serializer's `extractErrors`
        method.

        Example

        ```javascript
        App.ApplicationAdapter = DS.RESTAdapter.extend({
          ajaxError: function(jqXHR) {
            var error = this._super(jqXHR);

            if (jqXHR && jqXHR.status === 422) {
              var jsonErrors = Ember.$.parseJSON(jqXHR.responseText);

              return new DS.InvalidError(jsonErrors);
            } else {
              return error;
            }
          }
        });
        ```

        Note: As a correctness optimization, the default implementation of
        the `ajaxError` method strips out the `then` method from jquery's
        ajax response (jqXHR). This is important because the jqXHR's
        `then` method fulfills the promise with itself resulting in a
        circular "thenable" chain which may cause problems for some
        promise libraries.

        @method ajaxError
        @param  {Object} jqXHR
        @param  {Object} responseText
        @param  {Object} errorThrown
        @return {Object} jqXHR
      */
      ajaxError: function(jqXHR, responseText, errorThrown) {
        var isObject = jqXHR !== null && typeof jqXHR === 'object';

        if (isObject) {
          jqXHR.then = null;
          if (!jqXHR.errorThrown) {
            if (typeof errorThrown === 'string') {
              jqXHR.errorThrown = new Error(errorThrown);
            } else {
              jqXHR.errorThrown = errorThrown;
            }
          }
        }

        return jqXHR;
      },

      /**
        Takes an ajax response, and returns the json payload.

        By default this hook just returns the jsonPayload passed to it.
        You might want to override it in two cases:

        1. Your API might return useful results in the request headers.
        If you need to access these, you can override this hook to copy them
        from jqXHR to the payload object so they can be processed in you serializer.

        2. Your API might return errors as successful responses with status code
        200 and an Errors text or object. You can return a DS.InvalidError from
        this hook and it will automatically reject the promise and put your record
        into the invalid state.

        @method ajaxSuccess
        @param  {Object} jqXHR
        @param  {Object} jsonPayload
        @return {Object} jsonPayload
      */

      ajaxSuccess: function(jqXHR, jsonPayload) {
        return jsonPayload;
      },

      /**
        Takes a URL, an HTTP method and a hash of data, and makes an
        HTTP request.

        When the server responds with a payload, Ember Data will call into `extractSingle`
        or `extractArray` (depending on whether the original query was for one record or
        many records).

        By default, `ajax` method has the following behavior:

        * It sets the response `dataType` to `"json"`
        * If the HTTP method is not `"GET"`, it sets the `Content-Type` to be
          `application/json; charset=utf-8`
        * If the HTTP method is not `"GET"`, it stringifies the data passed in. The
          data is the serialized record in the case of a save.
        * Registers success and failure handlers.

        @method ajax
        @private
        @param {String} url
        @param {String} type The request type GET, POST, PUT, DELETE etc.
        @param {Object} options
        @return {Promise} promise
      */
      ajax: function(url, type, options) {
        var adapter = this;

        return new Ember.RSVP.Promise(function(resolve, reject) {
          var hash = adapter.ajaxOptions(url, type, options);

          hash.success = function(json, textStatus, jqXHR) {
            json = adapter.ajaxSuccess(jqXHR, json);
            if (json instanceof ember$data$lib$system$model$errors$invalid$$default) {
              Ember.run(null, reject, json);
            } else {
              Ember.run(null, resolve, json);
            }
          };

          hash.error = function(jqXHR, textStatus, errorThrown) {
            Ember.run(null, reject, adapter.ajaxError(jqXHR, jqXHR.responseText, errorThrown));
          };

          Ember.$.ajax(hash);
        }, 'DS: RESTAdapter#ajax ' + type + ' to ' + url);
      },

      /**
        @method ajaxOptions
        @private
        @param {String} url
        @param {String} type The request type GET, POST, PUT, DELETE etc.
        @param {Object} options
        @return {Object}
      */
      ajaxOptions: function(url, type, options) {
        var hash = options || {};
        hash.url = url;
        hash.type = type;
        hash.dataType = 'json';
        hash.context = this;

        if (hash.data && type !== 'GET') {
          hash.contentType = 'application/json; charset=utf-8';
          hash.data = JSON.stringify(hash.data);
        }

        var headers = ember$data$lib$adapters$rest$adapter$$get(this, 'headers');
        if (headers !== undefined) {
          hash.beforeSend = function (xhr) {
            ember$data$lib$adapters$rest$adapter$$forEach.call(Ember.keys(headers), function(key) {
              xhr.setRequestHeader(key, headers[key]);
            });
          };
        }

        return hash;
      }
    });

    //From http://stackoverflow.com/questions/280634/endswith-in-javascript
    function ember$data$lib$adapters$rest$adapter$$endsWith(string, suffix) {
      if (typeof String.prototype.endsWith !== 'function') {
        return string.indexOf(suffix, string.length - suffix.length) !== -1;
      } else {
        return string.endsWith(suffix);
      }
    }
    var ember$lib$main$$default = Ember;

    var ember$inflector$lib$lib$system$inflector$$capitalize = ember$lib$main$$default.String.capitalize;

    var ember$inflector$lib$lib$system$inflector$$BLANK_REGEX = /^\s*$/;
    var ember$inflector$lib$lib$system$inflector$$LAST_WORD_DASHED_REGEX = /(\w+[_-])([a-z\d]+$)/;
    var ember$inflector$lib$lib$system$inflector$$LAST_WORD_CAMELIZED_REGEX = /(\w+)([A-Z][a-z\d]*$)/;
    var ember$inflector$lib$lib$system$inflector$$CAMELIZED_REGEX = /[A-Z][a-z\d]*$/;

    function ember$inflector$lib$lib$system$inflector$$loadUncountable(rules, uncountable) {
      for (var i = 0, length = uncountable.length; i < length; i++) {
        rules.uncountable[uncountable[i].toLowerCase()] = true;
      }
    }

    function ember$inflector$lib$lib$system$inflector$$loadIrregular(rules, irregularPairs) {
      var pair;

      for (var i = 0, length = irregularPairs.length; i < length; i++) {
        pair = irregularPairs[i];

        //pluralizing
        rules.irregular[pair[0].toLowerCase()] = pair[1];
        rules.irregular[pair[1].toLowerCase()] = pair[1];

        //singularizing
        rules.irregularInverse[pair[1].toLowerCase()] = pair[0];
        rules.irregularInverse[pair[0].toLowerCase()] = pair[0];
      }
    }

    /**
      Inflector.Ember provides a mechanism for supplying inflection rules for your
      application. Ember includes a default set of inflection rules, and provides an
      API for providing additional rules.

      Examples:

      Creating an inflector with no rules.

      ```js
      var inflector = new Ember.Inflector();
      ```

      Creating an inflector with the default ember ruleset.

      ```js
      var inflector = new Ember.Inflector(Ember.Inflector.defaultRules);

      inflector.pluralize('cow'); //=> 'kine'
      inflector.singularize('kine'); //=> 'cow'
      ```

      Creating an inflector and adding rules later.

      ```javascript
      var inflector = Ember.Inflector.inflector;

      inflector.pluralize('advice'); // => 'advices'
      inflector.uncountable('advice');
      inflector.pluralize('advice'); // => 'advice'

      inflector.pluralize('formula'); // => 'formulas'
      inflector.irregular('formula', 'formulae');
      inflector.pluralize('formula'); // => 'formulae'

      // you would not need to add these as they are the default rules
      inflector.plural(/$/, 's');
      inflector.singular(/s$/i, '');
      ```

      Creating an inflector with a nondefault ruleset.

      ```javascript
      var rules = {
        plurals:  [ /$/, 's' ],
        singular: [ /\s$/, '' ],
        irregularPairs: [
          [ 'cow', 'kine' ]
        ],
        uncountable: [ 'fish' ]
      };

      var inflector = new Ember.Inflector(rules);
      ```

      @class Inflector
      @namespace Ember
    */
    function ember$inflector$lib$lib$system$inflector$$Inflector(ruleSet) {
      ruleSet = ruleSet || {};
      ruleSet.uncountable = ruleSet.uncountable || ember$inflector$lib$lib$system$inflector$$makeDictionary();
      ruleSet.irregularPairs = ruleSet.irregularPairs || ember$inflector$lib$lib$system$inflector$$makeDictionary();

      var rules = this.rules = {
        plurals:  ruleSet.plurals || [],
        singular: ruleSet.singular || [],
        irregular: ember$inflector$lib$lib$system$inflector$$makeDictionary(),
        irregularInverse: ember$inflector$lib$lib$system$inflector$$makeDictionary(),
        uncountable: ember$inflector$lib$lib$system$inflector$$makeDictionary()
      };

      ember$inflector$lib$lib$system$inflector$$loadUncountable(rules, ruleSet.uncountable);
      ember$inflector$lib$lib$system$inflector$$loadIrregular(rules, ruleSet.irregularPairs);

      this.enableCache();
    }

    if (!Object.create && !Object.create(null).hasOwnProperty) {
      throw new Error("This browser does not support Object.create(null), please polyfil with es5-sham: http://git.io/yBU2rg");
    }

    function ember$inflector$lib$lib$system$inflector$$makeDictionary() {
      var cache = Object.create(null);
      cache['_dict'] = null;
      delete cache['_dict'];
      return cache;
    }

    ember$inflector$lib$lib$system$inflector$$Inflector.prototype = {
      /**
        @public

        As inflections can be costly, and commonly the same subset of words are repeatedly
        inflected an optional cache is provided.

        @method enableCache
      */
      enableCache: function() {
        this.purgeCache();

        this.singularize = function(word) {
          this._cacheUsed = true;
          return this._sCache[word] || (this._sCache[word] = this._singularize(word));
        };

        this.pluralize = function(word) {
          this._cacheUsed = true;
          return this._pCache[word] || (this._pCache[word] = this._pluralize(word));
        };
      },

      /**
        @public

        @method purgedCache
      */
      purgeCache: function() {
        this._cacheUsed = false;
        this._sCache = ember$inflector$lib$lib$system$inflector$$makeDictionary();
        this._pCache = ember$inflector$lib$lib$system$inflector$$makeDictionary();
      },

      /**
        @public
        disable caching

        @method disableCache;
      */
      disableCache: function() {
        this._sCache = null;
        this._pCache = null;
        this.singularize = function(word) {
          return this._singularize(word);
        };

        this.pluralize = function(word) {
          return this._pluralize(word);
        };
      },

      /**
        @method plural
        @param {RegExp} regex
        @param {String} string
      */
      plural: function(regex, string) {
        if (this._cacheUsed) { this.purgeCache(); }
        this.rules.plurals.push([regex, string.toLowerCase()]);
      },

      /**
        @method singular
        @param {RegExp} regex
        @param {String} string
      */
      singular: function(regex, string) {
        if (this._cacheUsed) { this.purgeCache(); }
        this.rules.singular.push([regex, string.toLowerCase()]);
      },

      /**
        @method uncountable
        @param {String} regex
      */
      uncountable: function(string) {
        if (this._cacheUsed) { this.purgeCache(); }
        ember$inflector$lib$lib$system$inflector$$loadUncountable(this.rules, [string.toLowerCase()]);
      },

      /**
        @method irregular
        @param {String} singular
        @param {String} plural
      */
      irregular: function (singular, plural) {
        if (this._cacheUsed) { this.purgeCache(); }
        ember$inflector$lib$lib$system$inflector$$loadIrregular(this.rules, [[singular, plural]]);
      },

      /**
        @method pluralize
        @param {String} word
      */
      pluralize: function(word) {
        return this._pluralize(word);
      },

      _pluralize: function(word) {
        return this.inflect(word, this.rules.plurals, this.rules.irregular);
      },
      /**
        @method singularize
        @param {String} word
      */
      singularize: function(word) {
        return this._singularize(word);
      },

      _singularize: function(word) {
        return this.inflect(word, this.rules.singular,  this.rules.irregularInverse);
      },

      /**
        @protected

        @method inflect
        @param {String} word
        @param {Object} typeRules
        @param {Object} irregular
      */
      inflect: function(word, typeRules, irregular) {
        var inflection, substitution, result, lowercase, wordSplit,
          firstPhrase, lastWord, isBlank, isCamelized, isUncountable,
          isIrregular, rule;

        isBlank = !word || ember$inflector$lib$lib$system$inflector$$BLANK_REGEX.test(word);

        isCamelized = ember$inflector$lib$lib$system$inflector$$CAMELIZED_REGEX.test(word);
        firstPhrase = "";

        if (isBlank) {
          return word;
        }

        lowercase = word.toLowerCase();
        wordSplit = ember$inflector$lib$lib$system$inflector$$LAST_WORD_DASHED_REGEX.exec(word) || ember$inflector$lib$lib$system$inflector$$LAST_WORD_CAMELIZED_REGEX.exec(word);
        if (wordSplit){
          firstPhrase = wordSplit[1];
          lastWord = wordSplit[2].toLowerCase();
        }

        isUncountable = this.rules.uncountable[lowercase] || this.rules.uncountable[lastWord];

        if (isUncountable) {
          return word;
        }

        isIrregular = irregular && (irregular[lowercase] || irregular[lastWord]);

        if (isIrregular) {
          if (irregular[lowercase]){
            return isIrregular;
          }
          else {
            isIrregular = (isCamelized) ? ember$inflector$lib$lib$system$inflector$$capitalize(isIrregular) : isIrregular;
            return firstPhrase + isIrregular;
          }
        }

        for (var i = typeRules.length, min = 0; i > min; i--) {
           inflection = typeRules[i-1];
           rule = inflection[0];

          if (rule.test(word)) {
            break;
          }
        }

        inflection = inflection || [];

        rule = inflection[0];
        substitution = inflection[1];

        result = word.replace(rule, substitution);

        return result;
      }
    };

    var ember$inflector$lib$lib$system$inflector$$default = ember$inflector$lib$lib$system$inflector$$Inflector;

    function ember$inflector$lib$lib$system$string$$pluralize(word) {
      return ember$inflector$lib$lib$system$inflector$$default.inflector.pluralize(word);
    }

    function ember$inflector$lib$lib$system$string$$singularize(word) {
      return ember$inflector$lib$lib$system$inflector$$default.inflector.singularize(word);
    }

    var ember$inflector$lib$lib$system$inflections$$default = {
      plurals: [
        [/$/, 's'],
        [/s$/i, 's'],
        [/^(ax|test)is$/i, '$1es'],
        [/(octop|vir)us$/i, '$1i'],
        [/(octop|vir)i$/i, '$1i'],
        [/(alias|status)$/i, '$1es'],
        [/(bu)s$/i, '$1ses'],
        [/(buffal|tomat)o$/i, '$1oes'],
        [/([ti])um$/i, '$1a'],
        [/([ti])a$/i, '$1a'],
        [/sis$/i, 'ses'],
        [/(?:([^f])fe|([lr])f)$/i, '$1$2ves'],
        [/(hive)$/i, '$1s'],
        [/([^aeiouy]|qu)y$/i, '$1ies'],
        [/(x|ch|ss|sh)$/i, '$1es'],
        [/(matr|vert|ind)(?:ix|ex)$/i, '$1ices'],
        [/^(m|l)ouse$/i, '$1ice'],
        [/^(m|l)ice$/i, '$1ice'],
        [/^(ox)$/i, '$1en'],
        [/^(oxen)$/i, '$1'],
        [/(quiz)$/i, '$1zes']
      ],

      singular: [
        [/s$/i, ''],
        [/(ss)$/i, '$1'],
        [/(n)ews$/i, '$1ews'],
        [/([ti])a$/i, '$1um'],
        [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, '$1sis'],
        [/(^analy)(sis|ses)$/i, '$1sis'],
        [/([^f])ves$/i, '$1fe'],
        [/(hive)s$/i, '$1'],
        [/(tive)s$/i, '$1'],
        [/([lr])ves$/i, '$1f'],
        [/([^aeiouy]|qu)ies$/i, '$1y'],
        [/(s)eries$/i, '$1eries'],
        [/(m)ovies$/i, '$1ovie'],
        [/(x|ch|ss|sh)es$/i, '$1'],
        [/^(m|l)ice$/i, '$1ouse'],
        [/(bus)(es)?$/i, '$1'],
        [/(o)es$/i, '$1'],
        [/(shoe)s$/i, '$1'],
        [/(cris|test)(is|es)$/i, '$1is'],
        [/^(a)x[ie]s$/i, '$1xis'],
        [/(octop|vir)(us|i)$/i, '$1us'],
        [/(alias|status)(es)?$/i, '$1'],
        [/^(ox)en/i, '$1'],
        [/(vert|ind)ices$/i, '$1ex'],
        [/(matr)ices$/i, '$1ix'],
        [/(quiz)zes$/i, '$1'],
        [/(database)s$/i, '$1']
      ],

      irregularPairs: [
        ['person', 'people'],
        ['man', 'men'],
        ['child', 'children'],
        ['sex', 'sexes'],
        ['move', 'moves'],
        ['cow', 'kine'],
        ['zombie', 'zombies']
      ],

      uncountable: [
        'equipment',
        'information',
        'rice',
        'money',
        'species',
        'series',
        'fish',
        'sheep',
        'jeans',
        'police'
      ]
    };

    ember$inflector$lib$lib$system$inflector$$default.inflector = new ember$inflector$lib$lib$system$inflector$$default(ember$inflector$lib$lib$system$inflections$$default);

    function ember$inflector$lib$lib$utils$register$helper$$registerHelperIteration1(name, helperFunction) {
      //earlier versions of ember with htmlbars used this
      ember$lib$main$$default.HTMLBars.helpers[name] = helperFunction;
    }

    function ember$inflector$lib$lib$utils$register$helper$$registerHelperIteration2(name, helperFunction) {
      //registerHelper has been made private as _registerHelper
      //this is kept here if anyone is using it
      ember$lib$main$$default.HTMLBars.registerHelper(name, helperFunction);
    }

    function ember$inflector$lib$lib$utils$register$helper$$registerHelperIteration3(name, helperFunction) {
      //latest versin of ember uses this
      ember$lib$main$$default.HTMLBars._registerHelper(name, helperFunction);
    }

    function ember$inflector$lib$lib$utils$register$helper$$registerHelper(name, helperFunction) {
      if (ember$lib$main$$default.HTMLBars) {
        var fn = ember$lib$main$$default.HTMLBars.makeBoundHelper(helperFunction);

        if (ember$lib$main$$default.HTMLBars._registerHelper) {
          if (ember$lib$main$$default.HTMLBars.helpers) {
            ember$inflector$lib$lib$utils$register$helper$$registerHelperIteration1(name, fn);
          } else {
            ember$inflector$lib$lib$utils$register$helper$$registerHelperIteration3(name, fn);
          }
        } else if (ember$lib$main$$default.HTMLBars.registerHelper) {
          ember$inflector$lib$lib$utils$register$helper$$registerHelperIteration2(name, fn);
        }
      } else if (ember$lib$main$$default.Handlebars) {
        ember$lib$main$$default.Handlebars.helper(name, helperFunction);
      }
    }
    var ember$inflector$lib$lib$utils$register$helper$$default = ember$inflector$lib$lib$utils$register$helper$$registerHelper;

    /**
     *
     * If you have Ember Inflector (such as if Ember Data is present),
     * singularize a word. For example, turn "oxen" into "ox".
     *
     * Example:
     *
     * {{singularize myProperty}}
     * {{singularize "oxen"}}
     *
     * @for Ember.HTMLBars.helpers
     * @method singularize
     * @param {String|Property} word word to singularize
    */
    ember$inflector$lib$lib$utils$register$helper$$default('singularize', function(params){
      return ember$inflector$lib$lib$system$string$$singularize(params[0]);
    });

    /**
     *
     * If you have Ember Inflector (such as if Ember Data is present),
     * pluralize a word. For example, turn "ox" into "oxen".
     *
     * Example:
     *
     * {{pluralize count myProperty}}
     * {{pluralize 1 "oxen"}}
     * {{pluralize myProperty}}
     * {{pluralize "ox"}}
     *
     * @for Ember.HTMLBars.helpers
     * @method pluralize
     * @param {Number|Property} [count] count of objects
     * @param {String|Property} word word to pluralize
    */
    ember$inflector$lib$lib$utils$register$helper$$default('pluralize', function(params) {
      var count, word;

      if (params.length === 1) {
        word = params[0];
        return ember$inflector$lib$lib$system$string$$pluralize(word);
      } else {
        count = params[0];
        word  = params[1];

        if (count !== 1) {
          word = ember$inflector$lib$lib$system$string$$pluralize(word);
        }
        return count + " " + word;
      }
    });

    if (ember$lib$main$$default.EXTEND_PROTOTYPES === true || ember$lib$main$$default.EXTEND_PROTOTYPES.String) {
      /**
        See {{#crossLink "Ember.String/pluralize"}}{{/crossLink}}

        @method pluralize
        @for String
      */
      String.prototype.pluralize = function() {
        return ember$inflector$lib$lib$system$string$$pluralize(this);
      };

      /**
        See {{#crossLink "Ember.String/singularize"}}{{/crossLink}}

        @method singularize
        @for String
      */
      String.prototype.singularize = function() {
        return ember$inflector$lib$lib$system$string$$singularize(this);
      };
    }

    ember$inflector$lib$lib$system$inflector$$default.defaultRules = ember$inflector$lib$lib$system$inflections$$default;
    ember$lib$main$$default.Inflector        = ember$inflector$lib$lib$system$inflector$$default;

    ember$lib$main$$default.String.pluralize   = ember$inflector$lib$lib$system$string$$pluralize;
    ember$lib$main$$default.String.singularize = ember$inflector$lib$lib$system$string$$singularize;

    var ember$inflector$lib$main$$default = ember$inflector$lib$lib$system$inflector$$default;

    if (typeof define !== 'undefined' && define.amd){
      define('ember-inflector', ['exports'], function(__exports__){
        __exports__['default'] = ember$inflector$lib$lib$system$inflector$$default;
        return ember$inflector$lib$lib$system$inflector$$default;
      });
    } else if (typeof module !== 'undefined' && module['exports']){
      module['exports'] = ember$inflector$lib$lib$system$inflector$$default;
    }

    /**
      @module ember-data
    */

    var activemodel$adapter$lib$system$active$model$adapter$$decamelize = Ember.String.decamelize;
    var activemodel$adapter$lib$system$active$model$adapter$$underscore = Ember.String.underscore;

    /**
      The ActiveModelAdapter is a subclass of the RESTAdapter designed to integrate
      with a JSON API that uses an underscored naming convention instead of camelCasing.
      It has been designed to work out of the box with the
      [active\_model\_serializers](http://github.com/rails-api/active_model_serializers)
      Ruby gem. This Adapter expects specific settings using ActiveModel::Serializers,
      `embed :ids, embed_in_root: true` which sideloads the records.

      This adapter extends the DS.RESTAdapter by making consistent use of the camelization,
      decamelization and pluralization methods to normalize the serialized JSON into a
      format that is compatible with a conventional Rails backend and Ember Data.

      ## JSON Structure

      The ActiveModelAdapter expects the JSON returned from your server to follow
      the REST adapter conventions substituting underscored keys for camelcased ones.

      Unlike the DS.RESTAdapter, async relationship keys must be the singular form
      of the relationship name, followed by "_id" for DS.belongsTo relationships,
      or "_ids" for DS.hasMany relationships.

      ### Conventional Names

      Attribute names in your JSON payload should be the underscored versions of
      the attributes in your Ember.js models.

      For example, if you have a `Person` model:

      ```js
      App.FamousPerson = DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
        occupation: DS.attr('string')
      });
      ```

      The JSON returned should look like this:

      ```js
      {
        "famous_person": {
          "id": 1,
          "first_name": "Barack",
          "last_name": "Obama",
          "occupation": "President"
        }
      }
      ```

      Let's imagine that `Occupation` is just another model:

      ```js
      App.Person = DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
        occupation: DS.belongsTo('occupation')
      });

      App.Occupation = DS.Model.extend({
        name: DS.attr('string'),
        salary: DS.attr('number'),
        people: DS.hasMany('person')
      });
      ```

      The JSON needed to avoid extra server calls, should look like this:

      ```js
      {
        "people": [{
          "id": 1,
          "first_name": "Barack",
          "last_name": "Obama",
          "occupation_id": 1
        }],

        "occupations": [{
          "id": 1,
          "name": "President",
          "salary": 100000,
          "person_ids": [1]
        }]
      }
      ```

      @class ActiveModelAdapter
      @constructor
      @namespace DS
      @extends DS.RESTAdapter
    **/

    var activemodel$adapter$lib$system$active$model$adapter$$ActiveModelAdapter = ember$data$lib$adapters$rest$adapter$$default.extend({
      defaultSerializer: '-active-model',
      /**
        The ActiveModelAdapter overrides the `pathForType` method to build
        underscored URLs by decamelizing and pluralizing the object type name.

        ```js
          this.pathForType("famousPerson");
          //=> "famous_people"
        ```

        @method pathForType
        @param {String} modelName
        @return String
      */
      pathForType: function(modelName) {
        var decamelized = activemodel$adapter$lib$system$active$model$adapter$$decamelize(modelName);
        var underscored = activemodel$adapter$lib$system$active$model$adapter$$underscore(decamelized);
        return ember$inflector$lib$lib$system$string$$pluralize(underscored);
      },

      /**
        The ActiveModelAdapter overrides the `ajaxError` method
        to return a DS.InvalidError for all 422 Unprocessable Entity
        responses.

        A 422 HTTP response from the server generally implies that the request
        was well formed but the API was unable to process it because the
        content was not semantically correct or meaningful per the API.

        For more information on 422 HTTP Error code see 11.2 WebDAV RFC 4918
        https://tools.ietf.org/html/rfc4918#section-11.2

        @method ajaxError
        @param {Object} jqXHR
        @return error
      */
      ajaxError: function(jqXHR) {
        var error = this._super.apply(this, arguments);

        if (jqXHR && jqXHR.status === 422) {
          var response = Ember.$.parseJSON(jqXHR.responseText);
          return new ember$data$lib$system$model$errors$invalid$$default(response);
        } else {
          return error;
        }
      }
    });

    var activemodel$adapter$lib$system$active$model$adapter$$default = activemodel$adapter$lib$system$active$model$adapter$$ActiveModelAdapter;

    var ember$data$lib$system$serializer$$Serializer = Ember.Object.extend({
      /**
        The `store` property is the application's `store` that contains all records.
        It's injected as a service.
        It can be used to push records from a non flat data structure server
        response.

        @property store
        @type {DS.Store}
        @public
      */

      /**
        The `extract` method is used to deserialize the payload received from your
        data source into the form that Ember Data expects.

        @method extract
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} payload
        @param {String|Number} id
        @param {String} requestType
        @return {Object}
      */
      extract: null,

      /**
        The `serialize` method is used when a record is saved in order to convert
        the record into the form that your external data source expects.

        `serialize` takes an optional `options` hash with a single option:

        - `includeId`: If this is `true`, `serialize` should include the ID
          in the serialized object it builds.

        @method serialize
        @param {subclass of DS.Model} record
        @param {Object} [options]
        @return {Object}
      */
      serialize: null,

      /**
        The `normalize` method is used to convert a payload received from your
        external data source into the normalized form `store.push()` expects. You
        should override this method, munge the hash and return the normalized
        payload.

        @method normalize
        @param {subclass of DS.Model} typeClass
        @param {Object} hash
        @return {Object}
      */
      normalize: function(typeClass, hash) {
        return hash;
      }

    });

    var ember$data$lib$system$serializer$$default = ember$data$lib$system$serializer$$Serializer;

    var ember$data$lib$serializers$json$serializer$$get = Ember.get;
    var ember$data$lib$serializers$json$serializer$$isNone = Ember.isNone;
    var ember$data$lib$serializers$json$serializer$$map = Ember.ArrayPolyfills.map;
    var ember$data$lib$serializers$json$serializer$$merge = Ember.merge;

    var ember$data$lib$serializers$json$serializer$$default = ember$data$lib$system$serializer$$default.extend({
      /**
        The primaryKey is used when serializing and deserializing
        data. Ember Data always uses the `id` property to store the id of
        the record. The external source may not always follow this
        convention. In these cases it is useful to override the
        primaryKey property to match the primaryKey of your external
        store.

        Example

        ```javascript
        App.ApplicationSerializer = DS.JSONSerializer.extend({
          primaryKey: '_id'
        });
        ```

        @property primaryKey
        @type {String}
        @default 'id'
      */
      primaryKey: 'id',

      /**
        The `attrs` object can be used to declare a simple mapping between
        property names on `DS.Model` records and payload keys in the
        serialized JSON object representing the record. An object with the
        property `key` can also be used to designate the attribute's key on
        the response payload.

        Example

        ```javascript
        App.Person = DS.Model.extend({
          firstName: DS.attr('string'),
          lastName: DS.attr('string'),
          occupation: DS.attr('string'),
          admin: DS.attr('boolean')
        });

        App.PersonSerializer = DS.JSONSerializer.extend({
          attrs: {
            admin: 'is_admin',
            occupation: {key: 'career'}
          }
        });
        ```

        You can also remove attributes by setting the `serialize` key to
        false in your mapping object.

        Example

        ```javascript
        App.PersonSerializer = DS.JSONSerializer.extend({
          attrs: {
            admin: {serialize: false},
            occupation: {key: 'career'}
          }
        });
        ```

        When serialized:

        ```javascript
        {
          "firstName": "Harry",
          "lastName": "Houdini",
          "career": "magician"
        }
        ```

        Note that the `admin` is now not included in the payload.

        @property attrs
        @type {Object}
      */
      mergedProperties: ['attrs'],

      /**
       Given a subclass of `DS.Model` and a JSON object this method will
       iterate through each attribute of the `DS.Model` and invoke the
       `DS.Transform#deserialize` method on the matching property of the
       JSON object.  This method is typically called after the
       serializer's `normalize` method.

       @method applyTransforms
       @private
       @param {subclass of DS.Model} typeClass
       @param {Object} data The data to transform
       @return {Object} data The transformed data object
      */
      applyTransforms: function(typeClass, data) {
        typeClass.eachTransformedAttribute(function applyTransform(key, typeClass) {
          if (!data.hasOwnProperty(key)) { return; }

          var transform = this.transformFor(typeClass);
          data[key] = transform.deserialize(data[key]);
        }, this);

        return data;
      },

      /**
        Normalizes a part of the JSON payload returned by
        the server. You should override this method, munge the hash
        and call super if you have generic normalization to do.

        It takes the type of the record that is being normalized
        (as a DS.Model class), the property where the hash was
        originally found, and the hash to normalize.

        You can use this method, for example, to normalize underscored keys to camelized
        or other general-purpose normalizations.

        Example

        ```javascript
        App.ApplicationSerializer = DS.JSONSerializer.extend({
          normalize: function(typeClass, hash) {
            var fields = Ember.get(typeClass, 'fields');
            fields.forEach(function(field) {
              var payloadField = Ember.String.underscore(field);
              if (field === payloadField) { return; }

              hash[field] = hash[payloadField];
              delete hash[payloadField];
            });
            return this._super.apply(this, arguments);
          }
        });
        ```

        @method normalize
        @param {subclass of DS.Model} typeClass
        @param {Object} hash
        @return {Object}
      */
      normalize: function(typeClass, hash) {
        if (!hash) { return hash; }

        this.normalizeId(hash);
        this.normalizeAttributes(typeClass, hash);
        this.normalizeRelationships(typeClass, hash);

        this.normalizeUsingDeclaredMapping(typeClass, hash);
        this.applyTransforms(typeClass, hash);
        return hash;
      },

      /**
        You can use this method to normalize all payloads, regardless of whether they
        represent single records or an array.

        For example, you might want to remove some extraneous data from the payload:

        ```js
        App.ApplicationSerializer = DS.JSONSerializer.extend({
          normalizePayload: function(payload) {
            delete payload.version;
            delete payload.status;
            return payload;
          }
        });
        ```

        @method normalizePayload
        @param {Object} payload
        @return {Object} the normalized payload
      */
      normalizePayload: function(payload) {
        return payload;
      },

      /**
        @method normalizeAttributes
        @private
      */
      normalizeAttributes: function(typeClass, hash) {
        var payloadKey;

        if (this.keyForAttribute) {
          typeClass.eachAttribute(function(key) {
            payloadKey = this.keyForAttribute(key, 'deserialize');
            if (key === payloadKey) { return; }
            if (!hash.hasOwnProperty(payloadKey)) { return; }

            hash[key] = hash[payloadKey];
            delete hash[payloadKey];
          }, this);
        }
      },

      /**
        @method normalizeRelationships
        @private
      */
      normalizeRelationships: function(typeClass, hash) {
        var payloadKey;

        if (this.keyForRelationship) {
          typeClass.eachRelationship(function(key, relationship) {
            payloadKey = this.keyForRelationship(key, relationship.kind, 'deserialize');
            if (key === payloadKey) { return; }
            if (!hash.hasOwnProperty(payloadKey)) { return; }

            hash[key] = hash[payloadKey];
            delete hash[payloadKey];
          }, this);
        }
      },

      /**
        @method normalizeUsingDeclaredMapping
        @private
      */
      normalizeUsingDeclaredMapping: function(typeClass, hash) {
        var attrs = ember$data$lib$serializers$json$serializer$$get(this, 'attrs');
        var payloadKey, key;

        if (attrs) {
          for (key in attrs) {
            payloadKey = this._getMappedKey(key);
            if (!hash.hasOwnProperty(payloadKey)) { continue; }

            if (payloadKey !== key) {
              hash[key] = hash[payloadKey];
              delete hash[payloadKey];
            }
          }
        }
      },

      /**
        @method normalizeId
        @private
      */
      normalizeId: function(hash) {
        var primaryKey = ember$data$lib$serializers$json$serializer$$get(this, 'primaryKey');

        if (primaryKey === 'id') { return; }

        hash.id = hash[primaryKey];
        delete hash[primaryKey];
      },

      /**
        @method normalizeErrors
        @private
      */
      normalizeErrors: function(typeClass, hash) {
        this.normalizeId(hash);
        this.normalizeAttributes(typeClass, hash);
        this.normalizeRelationships(typeClass, hash);
        this.normalizeUsingDeclaredMapping(typeClass, hash);
      },

      /**
        Looks up the property key that was set by the custom `attr` mapping
        passed to the serializer.

        @method _getMappedKey
        @private
        @param {String} key
        @return {String} key
      */
      _getMappedKey: function(key) {
        var attrs = ember$data$lib$serializers$json$serializer$$get(this, 'attrs');
        var mappedKey;
        if (attrs && attrs[key]) {
          mappedKey = attrs[key];
          //We need to account for both the {title: 'post_title'} and
          //{title: {key: 'post_title'}} forms
          if (mappedKey.key) {
            mappedKey = mappedKey.key;
          }
          if (typeof mappedKey === 'string') {
            key = mappedKey;
          }
        }

        return key;
      },

      /**
        Check attrs.key.serialize property to inform if the `key`
        can be serialized

        @method _canSerialize
        @private
        @param {String} key
        @return {boolean} true if the key can be serialized
      */
      _canSerialize: function(key) {
        var attrs = ember$data$lib$serializers$json$serializer$$get(this, 'attrs');

        return !attrs || !attrs[key] || attrs[key].serialize !== false;
      },

      // SERIALIZE
      /**
        Called when a record is saved in order to convert the
        record into JSON.

        By default, it creates a JSON object with a key for
        each attribute and belongsTo relationship.

        For example, consider this model:

        ```javascript
        App.Comment = DS.Model.extend({
          title: DS.attr(),
          body: DS.attr(),

          author: DS.belongsTo('user')
        });
        ```

        The default serialization would create a JSON object like:

        ```javascript
        {
          "title": "Rails is unagi",
          "body": "Rails? Omakase? O_O",
          "author": 12
        }
        ```

        By default, attributes are passed through as-is, unless
        you specified an attribute type (`DS.attr('date')`). If
        you specify a transform, the JavaScript value will be
        serialized when inserted into the JSON hash.

        By default, belongs-to relationships are converted into
        IDs when inserted into the JSON hash.

        ## IDs

        `serialize` takes an options hash with a single option:
        `includeId`. If this option is `true`, `serialize` will,
        by default include the ID in the JSON object it builds.

        The adapter passes in `includeId: true` when serializing
        a record for `createRecord`, but not for `updateRecord`.

        ## Customization

        Your server may expect a different JSON format than the
        built-in serialization format.

        In that case, you can implement `serialize` yourself and
        return a JSON hash of your choosing.

        ```javascript
        App.PostSerializer = DS.JSONSerializer.extend({
          serialize: function(snapshot, options) {
            var json = {
              POST_TTL: snapshot.attr('title'),
              POST_BDY: snapshot.attr('body'),
              POST_CMS: snapshot.hasMany('comments', { ids: true })
            }

            if (options.includeId) {
              json.POST_ID_ = snapshot.id;
            }

            return json;
          }
        });
        ```

        ## Customizing an App-Wide Serializer

        If you want to define a serializer for your entire
        application, you'll probably want to use `eachAttribute`
        and `eachRelationship` on the record.

        ```javascript
        App.ApplicationSerializer = DS.JSONSerializer.extend({
          serialize: function(snapshot, options) {
            var json = {};

            snapshot.eachAttribute(function(name) {
              json[serverAttributeName(name)] = snapshot.attr(name);
            })

            snapshot.eachRelationship(function(name, relationship) {
              if (relationship.kind === 'hasMany') {
                json[serverHasManyName(name)] = snapshot.hasMany(name, { ids: true });
              }
            });

            if (options.includeId) {
              json.ID_ = snapshot.id;
            }

            return json;
          }
        });

        function serverAttributeName(attribute) {
          return attribute.underscore().toUpperCase();
        }

        function serverHasManyName(name) {
          return serverAttributeName(name.singularize()) + "_IDS";
        }
        ```

        This serializer will generate JSON that looks like this:

        ```javascript
        {
          "TITLE": "Rails is omakase",
          "BODY": "Yep. Omakase.",
          "COMMENT_IDS": [ 1, 2, 3 ]
        }
        ```

        ## Tweaking the Default JSON

        If you just want to do some small tweaks on the default JSON,
        you can call super first and make the tweaks on the returned
        JSON.

        ```javascript
        App.PostSerializer = DS.JSONSerializer.extend({
          serialize: function(snapshot, options) {
            var json = this._super.apply(this, arguments);

            json.subject = json.title;
            delete json.title;

            return json;
          }
        });
        ```

        @method serialize
        @param {DS.Snapshot} snapshot
        @param {Object} options
        @return {Object} json
      */
      serialize: function(snapshot, options) {
        var json = {};

        if (options && options.includeId) {
          var id = snapshot.id;

          if (id) {
            json[ember$data$lib$serializers$json$serializer$$get(this, 'primaryKey')] = id;
          }
        }

        snapshot.eachAttribute(function(key, attribute) {
          this.serializeAttribute(snapshot, json, key, attribute);
        }, this);

        snapshot.eachRelationship(function(key, relationship) {
          if (relationship.kind === 'belongsTo') {
            this.serializeBelongsTo(snapshot, json, relationship);
          } else if (relationship.kind === 'hasMany') {
            this.serializeHasMany(snapshot, json, relationship);
          }
        }, this);

        return json;
      },

      /**
        You can use this method to customize how a serialized record is added to the complete
        JSON hash to be sent to the server. By default the JSON Serializer does not namespace
        the payload and just sends the raw serialized JSON object.
        If your server expects namespaced keys, you should consider using the RESTSerializer.
        Otherwise you can override this method to customize how the record is added to the hash.

        For example, your server may expect underscored root objects.

        ```js
        App.ApplicationSerializer = DS.RESTSerializer.extend({
          serializeIntoHash: function(data, type, snapshot, options) {
            var root = Ember.String.decamelize(type.modelName);
            data[root] = this.serialize(snapshot, options);
          }
        });
        ```

        @method serializeIntoHash
        @param {Object} hash
        @param {subclass of DS.Model} typeClass
        @param {DS.Snapshot} snapshot
        @param {Object} options
      */
      serializeIntoHash: function(hash, typeClass, snapshot, options) {
        ember$data$lib$serializers$json$serializer$$merge(hash, this.serialize(snapshot, options));
      },

      /**
       `serializeAttribute` can be used to customize how `DS.attr`
       properties are serialized

       For example if you wanted to ensure all your attributes were always
       serialized as properties on an `attributes` object you could
       write:

       ```javascript
       App.ApplicationSerializer = DS.JSONSerializer.extend({
         serializeAttribute: function(snapshot, json, key, attributes) {
           json.attributes = json.attributes || {};
           this._super(snapshot, json.attributes, key, attributes);
         }
       });
       ```

       @method serializeAttribute
       @param {DS.Snapshot} snapshot
       @param {Object} json
       @param {String} key
       @param {Object} attribute
      */
      serializeAttribute: function(snapshot, json, key, attribute) {
        var type = attribute.type;

        if (this._canSerialize(key)) {
          var value = snapshot.attr(key);
          if (type) {
            var transform = this.transformFor(type);
            value = transform.serialize(value);
          }

          // if provided, use the mapping provided by `attrs` in
          // the serializer
          var payloadKey =  this._getMappedKey(key);

          if (payloadKey === key && this.keyForAttribute) {
            payloadKey = this.keyForAttribute(key, 'serialize');
          }

          json[payloadKey] = value;
        }
      },

      /**
       `serializeBelongsTo` can be used to customize how `DS.belongsTo`
       properties are serialized.

       Example

       ```javascript
       App.PostSerializer = DS.JSONSerializer.extend({
         serializeBelongsTo: function(snapshot, json, relationship) {
           var key = relationship.key;

           var belongsTo = snapshot.belongsTo(key);

           key = this.keyForRelationship ? this.keyForRelationship(key, "belongsTo", "serialize") : key;

           json[key] = Ember.isNone(belongsTo) ? belongsTo : belongsTo.record.toJSON();
         }
       });
       ```

       @method serializeBelongsTo
       @param {DS.Snapshot} snapshot
       @param {Object} json
       @param {Object} relationship
      */
      serializeBelongsTo: function(snapshot, json, relationship) {
        var key = relationship.key;

        if (this._canSerialize(key)) {
          var belongsToId = snapshot.belongsTo(key, { id: true });

          // if provided, use the mapping provided by `attrs` in
          // the serializer
          var payloadKey = this._getMappedKey(key);
          if (payloadKey === key && this.keyForRelationship) {
            payloadKey = this.keyForRelationship(key, "belongsTo", "serialize");
          }

          //Need to check whether the id is there for new&async records
          if (ember$data$lib$serializers$json$serializer$$isNone(belongsToId)) {
            json[payloadKey] = null;
          } else {
            json[payloadKey] = belongsToId;
          }

          if (relationship.options.polymorphic) {
            this.serializePolymorphicType(snapshot, json, relationship);
          }
        }
      },

      /**
       `serializeHasMany` can be used to customize how `DS.hasMany`
       properties are serialized.

       Example

       ```javascript
       App.PostSerializer = DS.JSONSerializer.extend({
         serializeHasMany: function(snapshot, json, relationship) {
           var key = relationship.key;
           if (key === 'comments') {
             return;
           } else {
             this._super.apply(this, arguments);
           }
         }
       });
       ```

       @method serializeHasMany
       @param {DS.Snapshot} snapshot
       @param {Object} json
       @param {Object} relationship
      */
      serializeHasMany: function(snapshot, json, relationship) {
        var key = relationship.key;

        if (this._canSerialize(key)) {
          var payloadKey;

          // if provided, use the mapping provided by `attrs` in
          // the serializer
          payloadKey = this._getMappedKey(key);
          if (payloadKey === key && this.keyForRelationship) {
            payloadKey = this.keyForRelationship(key, "hasMany", "serialize");
          }

          var relationshipType = snapshot.type.determineRelationshipType(relationship);

          if (relationshipType === 'manyToNone' || relationshipType === 'manyToMany') {
            json[payloadKey] = snapshot.hasMany(key, { ids: true });
            // TODO support for polymorphic manyToNone and manyToMany relationships
          }
        }
      },

      /**
        You can use this method to customize how polymorphic objects are
        serialized. Objects are considered to be polymorphic if
        `{polymorphic: true}` is pass as the second argument to the
        `DS.belongsTo` function.

        Example

        ```javascript
        App.CommentSerializer = DS.JSONSerializer.extend({
          serializePolymorphicType: function(snapshot, json, relationship) {
            var key = relationship.key,
                belongsTo = snapshot.belongsTo(key);
            key = this.keyForAttribute ? this.keyForAttribute(key, "serialize") : key;

            if (Ember.isNone(belongsTo)) {
              json[key + "_type"] = null;
            } else {
              json[key + "_type"] = belongsTo.modelName;
            }
          }
        });
       ```

        @method serializePolymorphicType
        @param {DS.Snapshot} snapshot
        @param {Object} json
        @param {Object} relationship
      */
      serializePolymorphicType: Ember.K,

      // EXTRACT

      /**
        The `extract` method is used to deserialize payload data from the
        server. By default the `JSONSerializer` does not push the records
        into the store. However records that subclass `JSONSerializer`
        such as the `RESTSerializer` may push records into the store as
        part of the extract call.

        This method delegates to a more specific extract method based on
        the `requestType`.

        To override this method with a custom one, make sure to call
        `return this._super(store, type, payload, id, requestType)` with your
        pre-processed data.

        Here's an example of using `extract` manually:

        ```javascript
        socket.on('message', function(message) {
          var data = message.data;
          var typeClass = store.modelFor(message.modelName);
          var serializer = store.serializerFor(typeClass.modelName);
          var record = serializer.extract(store, typeClass, data, data.id, 'single');

          store.push(message.modelName, record);
        });
        ```

        @method extract
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} payload
        @param {String or Number} id
        @param {String} requestType
        @return {Object} json The deserialized payload
      */
      extract: function(store, typeClass, payload, id, requestType) {
        this.extractMeta(store, typeClass, payload);

        var specificExtract = "extract" + requestType.charAt(0).toUpperCase() + requestType.substr(1);
        return this[specificExtract](store, typeClass, payload, id, requestType);
      },

      /**
        `extractFindAll` is a hook into the extract method used when a
        call is made to `DS.Store#findAll`. By default this method is an
        alias for [extractArray](#method_extractArray).

        @method extractFindAll
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} payload
        @param {String or Number} id
        @param {String} requestType
        @return {Array} array An array of deserialized objects
      */
      extractFindAll: function(store, typeClass, payload, id, requestType) {
        return this.extractArray(store, typeClass, payload, id, requestType);
      },
      /**
        `extractFindQuery` is a hook into the extract method used when a
        call is made to `DS.Store#findQuery`. By default this method is an
        alias for [extractArray](#method_extractArray).

        @method extractFindQuery
        @param {DS.Store} store
        @param {subclass of DS.Model} type
        @param {Object} payload
        @param {String or Number} id
        @param {String} requestType
        @return {Array} array An array of deserialized objects
      */
      extractFindQuery: function(store, typeClass, payload, id, requestType) {
        return this.extractArray(store, typeClass, payload, id, requestType);
      },
      /**
        `extractFindMany` is a hook into the extract method used when a
        call is made to `DS.Store#findMany`. By default this method is
        alias for [extractArray](#method_extractArray).

        @method extractFindMany
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} payload
        @param {String or Number} id
        @param {String} requestType
        @return {Array} array An array of deserialized objects
      */
      extractFindMany: function(store, typeClass, payload, id, requestType) {
        return this.extractArray(store, typeClass, payload, id, requestType);
      },
      /**
        `extractFindHasMany` is a hook into the extract method used when a
        call is made to `DS.Store#findHasMany`. By default this method is
        alias for [extractArray](#method_extractArray).

        @method extractFindHasMany
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} payload
        @param {String or Number} id
        @param {String} requestType
        @return {Array} array An array of deserialized objects
      */
      extractFindHasMany: function(store, typeClass, payload, id, requestType) {
        return this.extractArray(store, typeClass, payload, id, requestType);
      },

      /**
        `extractCreateRecord` is a hook into the extract method used when a
        call is made to `DS.Model#save` and the record is new. By default
        this method is alias for [extractSave](#method_extractSave).

        @method extractCreateRecord
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} payload
        @param {String or Number} id
        @param {String} requestType
        @return {Object} json The deserialized payload
      */
      extractCreateRecord: function(store, typeClass, payload, id, requestType) {
        return this.extractSave(store, typeClass, payload, id, requestType);
      },
      /**
        `extractUpdateRecord` is a hook into the extract method used when
        a call is made to `DS.Model#save` and the record has been updated.
        By default this method is alias for [extractSave](#method_extractSave).

        @method extractUpdateRecord
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} payload
        @param {String or Number} id
        @param {String} requestType
        @return {Object} json The deserialized payload
      */
      extractUpdateRecord: function(store, typeClass, payload, id, requestType) {
        return this.extractSave(store, typeClass, payload, id, requestType);
      },
      /**
        `extractDeleteRecord` is a hook into the extract method used when
        a call is made to `DS.Model#save` and the record has been deleted.
        By default this method is alias for [extractSave](#method_extractSave).

        @method extractDeleteRecord
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} payload
        @param {String or Number} id
        @param {String} requestType
        @return {Object} json The deserialized payload
      */
      extractDeleteRecord: function(store, typeClass, payload, id, requestType) {
        return this.extractSave(store, typeClass, payload, id, requestType);
      },

      /**
        `extractFind` is a hook into the extract method used when
        a call is made to `DS.Store#find`. By default this method is
        alias for [extractSingle](#method_extractSingle).

        @method extractFind
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} payload
        @param {String or Number} id
        @param {String} requestType
        @return {Object} json The deserialized payload
      */
      extractFind: function(store, typeClass, payload, id, requestType) {
        return this.extractSingle(store, typeClass, payload, id, requestType);
      },
      /**
        `extractFindBelongsTo` is a hook into the extract method used when
        a call is made to `DS.Store#findBelongsTo`. By default this method is
        alias for [extractSingle](#method_extractSingle).

        @method extractFindBelongsTo
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} payload
        @param {String or Number} id
        @param {String} requestType
        @return {Object} json The deserialized payload
      */
      extractFindBelongsTo: function(store, typeClass, payload, id, requestType) {
        return this.extractSingle(store, typeClass, payload, id, requestType);
      },
      /**
        `extractSave` is a hook into the extract method used when a call
        is made to `DS.Model#save`. By default this method is alias
        for [extractSingle](#method_extractSingle).

        @method extractSave
        @param {DS.Store} store
        @param {subclass of DS.Model} type
        @param {Object} payload
        @param {String or Number} id
        @param {String} requestType
        @return {Object} json The deserialized payload
      */
      extractSave: function(store, typeClass, payload, id, requestType) {
        return this.extractSingle(store, typeClass, payload, id, requestType);
      },

      /**
        `extractSingle` is used to deserialize a single record returned
        from the adapter.

        Example

        ```javascript
        App.PostSerializer = DS.JSONSerializer.extend({
          extractSingle: function(store, typeClass, payload) {
            payload.comments = payload._embedded.comment;
            delete payload._embedded;

            return this._super(store, typeClass, payload);
          },
        });
        ```

        @method extractSingle
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} payload
        @param {String or Number} id
        @param {String} requestType
        @return {Object} json The deserialized payload
      */
      extractSingle: function(store, typeClass, payload, id, requestType) {
        var normalizedPayload = this.normalizePayload(payload);
        return this.normalize(typeClass, normalizedPayload);
      },

      /**
        `extractArray` is used to deserialize an array of records
        returned from the adapter.

        Example

        ```javascript
        App.PostSerializer = DS.JSONSerializer.extend({
          extractArray: function(store, typeClass, payload) {
            return payload.map(function(json) {
              return this.extractSingle(store, typeClass, json);
            }, this);
          }
        });
        ```

        @method extractArray
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} payload
        @param {String or Number} id
        @param {String} requestType
        @return {Array} array An array of deserialized objects
      */
      extractArray: function(store, typeClass, arrayPayload, id, requestType) {
        var normalizedPayload = this.normalizePayload(arrayPayload);
        var serializer = this;

        return ember$data$lib$serializers$json$serializer$$map.call(normalizedPayload, function(singlePayload) {
          return serializer.normalize(typeClass, singlePayload);
        });
      },

      /**
        `extractMeta` is used to deserialize any meta information in the
        adapter payload. By default Ember Data expects meta information to
        be located on the `meta` property of the payload object.

        Example

        ```javascript
        App.PostSerializer = DS.JSONSerializer.extend({
          extractMeta: function(store, typeClass, payload) {
            if (payload && payload._pagination) {
              store.setMetadataFor(typeClass, payload._pagination);
              delete payload._pagination;
            }
          }
        });
        ```

        @method extractMeta
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} payload
      */
      extractMeta: function(store, typeClass, payload) {
        if (payload && payload.meta) {
          store.setMetadataFor(typeClass, payload.meta);
          delete payload.meta;
        }
      },

      /**
        `extractErrors` is used to extract model errors when a call is made
        to `DS.Model#save` which fails with an `InvalidError`. By default
        Ember Data expects error information to be located on the `errors`
        property of the payload object.

        Example

        ```javascript
        App.PostSerializer = DS.JSONSerializer.extend({
          extractErrors: function(store, typeClass, payload, id) {
            if (payload && typeof payload === 'object' && payload._problems) {
              payload = payload._problems;
              this.normalizeErrors(typeClass, payload);
            }
            return payload;
          }
        });
        ```

        @method extractErrors
        @param {DS.Store} store
        @param {subclass of DS.Model} typeClass
        @param {Object} payload
        @param {String or Number} id
        @return {Object} json The deserialized errors
      */
      extractErrors: function(store, typeClass, payload, id) {
        if (payload && typeof payload === 'object' && payload.errors) {
          payload = payload.errors;
          this.normalizeErrors(typeClass, payload);
        }
        return payload;
      },

      /**
       `keyForAttribute` can be used to define rules for how to convert an
       attribute name in your model to a key in your JSON.

       Example

       ```javascript
       App.ApplicationSerializer = DS.RESTSerializer.extend({
         keyForAttribute: function(attr, method) {
           return Ember.String.underscore(attr).toUpperCase();
         }
       });
       ```

       @method keyForAttribute
       @param {String} key
       @param {String} method
       @return {String} normalized key
      */
      keyForAttribute: function(key, method) {
        return key;
      },

      /**
       `keyForRelationship` can be used to define a custom key when
       serializing and deserializing relationship properties. By default
       `JSONSerializer` does not provide an implementation of this method.

       Example

        ```javascript
        App.PostSerializer = DS.JSONSerializer.extend({
          keyForRelationship: function(key, relationship, method) {
            return 'rel_' + Ember.String.underscore(key);
          }
        });
        ```

       @method keyForRelationship
       @param {String} key
       @param {String} relationship typeClass
       @param {String} method
       @return {String} normalized key
      */

      keyForRelationship: function(key, typeClass, method) {
        return key;
      },

      // HELPERS

      /**
       @method transformFor
       @private
       @param {String} attributeType
       @param {Boolean} skipAssertion
       @return {DS.Transform} transform
      */
      transformFor: function(attributeType, skipAssertion) {
        var transform = this.container.lookup('transform:' + attributeType);
        Ember.assert("Unable to find transform for '" + attributeType + "'", skipAssertion || !!transform);
        return transform;
      }
    });

    function ember$data$lib$system$normalize$model$name$$normalizeModelName(modelName) {
      return Ember.String.dasherize(modelName);
    }
    var ember$data$lib$system$normalize$model$name$$default = ember$data$lib$system$normalize$model$name$$normalizeModelName;

    var ember$data$lib$serializers$rest$serializer$$forEach = Ember.ArrayPolyfills.forEach;
    var ember$data$lib$serializers$rest$serializer$$map = Ember.ArrayPolyfills.map;
    var ember$data$lib$serializers$rest$serializer$$camelize = Ember.String.camelize;

    function ember$data$lib$serializers$rest$serializer$$coerceId(id) {
      return id == null ? null : id + '';
    }

    /**
      Normally, applications will use the `RESTSerializer` by implementing
      the `normalize` method and individual normalizations under
      `normalizeHash`.

      This allows you to do whatever kind of munging you need, and is
      especially useful if your server is inconsistent and you need to
      do munging differently for many different kinds of responses.

      See the `normalize` documentation for more information.

      ## Across the Board Normalization

      There are also a number of hooks that you might find useful to define
      across-the-board rules for your payload. These rules will be useful
      if your server is consistent, or if you're building an adapter for
      an infrastructure service, like Parse, and want to encode service
      conventions.

      For example, if all of your keys are underscored and all-caps, but
      otherwise consistent with the names you use in your models, you
      can implement across-the-board rules for how to convert an attribute
      name in your model to a key in your JSON.

      ```js
      App.ApplicationSerializer = DS.RESTSerializer.extend({
        keyForAttribute: function(attr, method) {
          return Ember.String.underscore(attr).toUpperCase();
        }
      });
      ```

      You can also implement `keyForRelationship`, which takes the name
      of the relationship as the first parameter, the kind of
      relationship (`hasMany` or `belongsTo`) as the second parameter, and
      the method (`serialize` or `deserialize`) as the third parameter.

      @class RESTSerializer
      @namespace DS
      @extends DS.JSONSerializer
    */
    var ember$data$lib$serializers$rest$serializer$$RESTSerializer = ember$data$lib$serializers$json$serializer$$default.extend({
      /**
        If you want to do normalizations specific to some part of the payload, you
        can specify those under `normalizeHash`.

        For example, given the following json where the the `IDs` under
        `"comments"` are provided as `_id` instead of `id`.

        ```javascript
        {
          "post": {
            "id": 1,
            "title": "Rails is omakase",
            "comments": [ 1, 2 ]
          },
          "comments": [{
            "_id": 1,
            "body": "FIRST"
          }, {
            "_id": 2,
            "body": "Rails is unagi"
          }]
        }
        ```

        You use `normalizeHash` to normalize just the comments:

        ```javascript
        App.PostSerializer = DS.RESTSerializer.extend({
          normalizeHash: {
            comments: function(hash) {
              hash.id = hash._id;
              delete hash._id;
              return hash;
            }
          }
        });
        ```

        The key under `normalizeHash` is usually just the original key
        that was in the original payload. However, key names will be
        impacted by any modifications done in the `normalizePayload`
        method. The `DS.RESTSerializer`'s default implementation makes no
        changes to the payload keys.

        @property normalizeHash
        @type {Object}
        @default undefined
      */

      /**
        Normalizes a part of the JSON payload returned by
        the server. You should override this method, munge the hash
        and call super if you have generic normalization to do.

        It takes the type of the record that is being normalized
        (as a DS.Model class), the property where the hash was
        originally found, and the hash to normalize.

        For example, if you have a payload that looks like this:

        ```js
        {
          "post": {
            "id": 1,
            "title": "Rails is omakase",
            "comments": [ 1, 2 ]
          },
          "comments": [{
            "id": 1,
            "body": "FIRST"
          }, {
            "id": 2,
            "body": "Rails is unagi"
          }]
        }
        ```

        The `normalize` method will be called three times:

        * With `App.Post`, `"posts"` and `{ id: 1, title: "Rails is omakase", ... }`
        * With `App.Comment`, `"comments"` and `{ id: 1, body: "FIRST" }`
        * With `App.Comment`, `"comments"` and `{ id: 2, body: "Rails is unagi" }`

        You can use this method, for example, to normalize underscored keys to camelized
        or other general-purpose normalizations.

        If you want to do normalizations specific to some part of the payload, you
        can specify those under `normalizeHash`.

        For example, if the `IDs` under `"comments"` are provided as `_id` instead of
        `id`, you can specify how to normalize just the comments:

        ```js
        App.PostSerializer = DS.RESTSerializer.extend({
          normalizeHash: {
            comments: function(hash) {
              hash.id = hash._id;
              delete hash._id;
              return hash;
            }
          }
        });
        ```

        The key under `normalizeHash` is just the original key that was in the original
        payload.

        @method normalize
        @param {subclass of DS.Model} typeClass
        @param {Object} hash
        @param {String} prop
        @return {Object}
      */
      normalize: function(typeClass, hash, prop) {
        this.normalizeId(hash);
        this.normalizeAttributes(typeClass, hash);
        this.normalizeRelationships(typeClass, hash);

        this.normalizeUsingDeclaredMapping(typeClass, hash);

        if (this.normalizeHash && this.normalizeHash[prop]) {
          this.normalizeHash[prop](hash);
        }

        this.applyTransforms(typeClass, hash);
        return hash;
      },


      /**
        Called when the server has returned a payload representing
        a single record, such as in response to a `find` or `save`.

        It is your opportunity to clean up the server's response into the normalized
        form expected by Ember Data.

        If you want, you can just restructure the top-level of your payload, and
        do more fine-grained normalization in the `normalize` method.

        For example, if you have a payload like this in response to a request for
        post 1:

        ```js
        {
          "id": 1,
          "title": "Rails is omakase",

          "_embedded": {
            "comment": [{
              "_id": 1,
              "comment_title": "FIRST"
            }, {
              "_id": 2,
              "comment_title": "Rails is unagi"
            }]
          }
        }
        ```

        You could implement a serializer that looks like this to get your payload
        into shape:

        ```js
        App.PostSerializer = DS.RESTSerializer.extend({
          // First, restructure the top-level so it's organized by type
          extractSingle: function(store, typeClass, payload, id) {
            var comments = payload._embedded.comment;
            delete payload._embedded;

            payload = { comments: comments, post: payload };
            return this._super(store, typeClass, payload, id);
          },

          normalizeHash: {
            // Next, normalize individual comments, which (after `extract`)
            // are now located under `comments`
            comments: function(hash) {
              hash.id = hash._id;
              hash.title = hash.comment_title;
              delete hash._id;
              delete hash.comment_title;
              return hash;
            }
          }
        })
        ```

        When you call super from your own implementation of `extractSingle`, the
        built-in implementation will find the primary record in your normalized
        payload and push the remaining records into the store.

        The primary record is the single hash found under `post` or the first
        element of the `posts` array.

        The primary record has special meaning when the record is being created
        for the first time or updated (`createRecord` or `updateRecord`). In
        particular, it will update the properties of the record that was saved.

        @method extractSingle
        @param {DS.Store} store
        @param {subclass of DS.Model} primaryTypeClass
        @param {Object} payload
        @param {String} recordId
        @return {Object} the primary response to the original request
      */
      extractSingle: function(store, primaryTypeClass, rawPayload, recordId) {
        var payload = this.normalizePayload(rawPayload);
        var primaryTypeClassName = primaryTypeClass.modelName;
        var primaryRecord;

        for (var prop in payload) {
          var typeName  = this.modelNameFromPayloadKey(prop);

          if (!store.modelFactoryFor(typeName)) {
            Ember.warn(this.warnMessageNoModelForKey(prop, typeName), false);
            continue;
          }
          var type = store.modelFor(typeName);
          var isPrimary = type.modelName === primaryTypeClassName;
          var value = payload[prop];

          if (value === null) {
            continue;
          }

          // legacy support for singular resources
          if (isPrimary && Ember.typeOf(value) !== "array" ) {
            primaryRecord = this.normalize(primaryTypeClass, value, prop);
            continue;
          }

          /*jshint loopfunc:true*/
          ember$data$lib$serializers$rest$serializer$$forEach.call(value, function(hash) {
            var typeName = this.modelNameFromPayloadKey(prop);
            var type = store.modelFor(typeName);
            var typeSerializer = store.serializerFor(type);

            hash = typeSerializer.normalize(type, hash, prop);

            var isFirstCreatedRecord = isPrimary && !recordId && !primaryRecord;
            var isUpdatedRecord = isPrimary && ember$data$lib$serializers$rest$serializer$$coerceId(hash.id) === recordId;

            // find the primary record.
            //
            // It's either:
            // * the record with the same ID as the original request
            // * in the case of a newly created record that didn't have an ID, the first
            //   record in the Array
            if (isFirstCreatedRecord || isUpdatedRecord) {
              primaryRecord = hash;
            } else {
              store.push(typeName, hash);
            }
          }, this);
        }

        return primaryRecord;
      },

      /**
        Called when the server has returned a payload representing
        multiple records, such as in response to a `findAll` or `findQuery`.

        It is your opportunity to clean up the server's response into the normalized
        form expected by Ember Data.

        If you want, you can just restructure the top-level of your payload, and
        do more fine-grained normalization in the `normalize` method.

        For example, if you have a payload like this in response to a request for
        all posts:

        ```js
        {
          "_embedded": {
            "post": [{
              "id": 1,
              "title": "Rails is omakase"
            }, {
              "id": 2,
              "title": "The Parley Letter"
            }],
            "comment": [{
              "_id": 1,
              "comment_title": "Rails is unagi",
              "post_id": 1
            }, {
              "_id": 2,
              "comment_title": "Don't tread on me",
              "post_id": 2
            }]
          }
        }
        ```

        You could implement a serializer that looks like this to get your payload
        into shape:

        ```js
        App.PostSerializer = DS.RESTSerializer.extend({
          // First, restructure the top-level so it's organized by type
          // and the comments are listed under a post's `comments` key.
          extractArray: function(store, type, payload) {
            var posts = payload._embedded.post;
            var comments = [];
            var postCache = {};

            posts.forEach(function(post) {
              post.comments = [];
              postCache[post.id] = post;
            });

            payload._embedded.comment.forEach(function(comment) {
              comments.push(comment);
              postCache[comment.post_id].comments.push(comment);
              delete comment.post_id;
            });

            payload = { comments: comments, posts: posts };

            return this._super(store, type, payload);
          },

          normalizeHash: {
            // Next, normalize individual comments, which (after `extract`)
            // are now located under `comments`
            comments: function(hash) {
              hash.id = hash._id;
              hash.title = hash.comment_title;
              delete hash._id;
              delete hash.comment_title;
              return hash;
            }
          }
        })
        ```

        When you call super from your own implementation of `extractArray`, the
        built-in implementation will find the primary array in your normalized
        payload and push the remaining records into the store.

        The primary array is the array found under `posts`.

        The primary record has special meaning when responding to `findQuery`
        or `findHasMany`. In particular, the primary array will become the
        list of records in the record array that kicked off the request.

        If your primary array contains secondary (embedded) records of the same type,
        you cannot place these into the primary array `posts`. Instead, place the
        secondary items into an underscore prefixed property `_posts`, which will
        push these items into the store and will not affect the resulting query.

        @method extractArray
        @param {DS.Store} store
        @param {subclass of DS.Model} primaryTypeClass
        @param {Object} payload
        @return {Array} The primary array that was returned in response
          to the original query.
      */
      extractArray: function(store, primaryTypeClass, rawPayload) {
        var payload = this.normalizePayload(rawPayload);
        var primaryTypeClassName = primaryTypeClass.modelName;
        var primaryArray;

        for (var prop in payload) {
          var modelName = prop;
          var forcedSecondary = false;

          if (prop.charAt(0) === '_') {
            forcedSecondary = true;
            modelName = prop.substr(1);
          }

          var typeName = this.modelNameFromPayloadKey(modelName);
          if (!store.modelFactoryFor(typeName)) {
            Ember.warn(this.warnMessageNoModelForKey(prop, typeName), false);
            continue;
          }
          var type = store.modelFor(typeName);
          var typeSerializer = store.serializerFor(type);
          var isPrimary = (!forcedSecondary && (type.modelName === primaryTypeClassName));

          /*jshint loopfunc:true*/
          var normalizedArray = ember$data$lib$serializers$rest$serializer$$map.call(payload[prop], function(hash) {
            return typeSerializer.normalize(type, hash, prop);
          }, this);

          if (isPrimary) {
            primaryArray = normalizedArray;
          } else {
            store.pushMany(typeName, normalizedArray);
          }
        }

        return primaryArray;
      },

      /**
        This method allows you to push a payload containing top-level
        collections of records organized per type.

        ```js
        {
          "posts": [{
            "id": "1",
            "title": "Rails is omakase",
            "author", "1",
            "comments": [ "1" ]
          }],
          "comments": [{
            "id": "1",
            "body": "FIRST"
          }],
          "users": [{
            "id": "1",
            "name": "@d2h"
          }]
        }
        ```

        It will first normalize the payload, so you can use this to push
        in data streaming in from your server structured the same way
        that fetches and saves are structured.

        @method pushPayload
        @param {DS.Store} store
        @param {Object} payload
      */
      pushPayload: function(store, rawPayload) {
        var payload = this.normalizePayload(rawPayload);

        for (var prop in payload) {
          var modelName = this.modelNameFromPayloadKey(prop);
          if (!store.modelFactoryFor(modelName)) {
            Ember.warn(this.warnMessageNoModelForKey(prop, modelName), false);
            continue;
          }
          var type = store.modelFor(modelName);
          var typeSerializer = store.serializerFor(type);

          /*jshint loopfunc:true*/
          var normalizedArray = ember$data$lib$serializers$rest$serializer$$map.call(Ember.makeArray(payload[prop]), function(hash) {
            return typeSerializer.normalize(type, hash, prop);
          }, this);

          store.pushMany(modelName, normalizedArray);
        }
      },

      /**
        This method is used to convert each JSON root key in the payload
        into a modelName that it can use to look up the appropriate model for
        that part of the payload.

        For example, your server may send a model name that does not correspond with
        the name of the model in your app. Let's take a look at an example model,
        and an example payload:

        ```javascript
        // Located in the file app/models/post.js
        import DS from 'ember-data';
        export default var Post = DS.Model.extend();
        ```

        ```javascript
          {
            "blog/post": {
              "id": "1
            }
          }
        ```

        Ember Data is going to normalize the payload's root key for the modelName. As a result,
        it will try to look up the "blog/post" model. Since we don't have a model called "blog/post"
        (or a file called app/models/blog/post.js in ember-cli), Ember Data will throw an error
        because it cannot find the "blog/post" model.

        Since we want to remove this namespace, we can define a serializer for the application that will
        remove "blog/" from the payload key whenver it's encountered by Ember Data:

        ```javascript
        // located in app/serializers/application.js
        import DS from 'ember-data';

        export default DS.RESTSerializer.extend({
          modelNameFromPayloadKey: function(payloadKey) {
            if (payloadKey === 'blog/post') {
              return this._super(payloadKey.replace('blog/', ''));
            } else {
             return this._super(payloadKey);
            }
          }
        });
        ```

        After refreshing, Ember Data will appropriately look up the "post" model.

        By default the modelName for a model is its
        name in dasherized form. This means that a payload key like "blogPost" would be
        normalized to "blog-post" when Ember Data looks up the model. Usually, Ember Data
        can use the correct inflection to do this for you. Most of the time, you won't
        need to override `modelNameFromPayloadKey` for this purpose.

        @method modelNameFromPayloadKey
        @param {String} key
        @return {String} the model's modelName
      */
      modelNameFromPayloadKey: function(key) {
        return ember$inflector$lib$lib$system$string$$singularize(ember$data$lib$system$normalize$model$name$$default(key));
      },

      // SERIALIZE

      /**
        Called when a record is saved in order to convert the
        record into JSON.

        By default, it creates a JSON object with a key for
        each attribute and belongsTo relationship.

        For example, consider this model:

        ```js
        App.Comment = DS.Model.extend({
          title: DS.attr(),
          body: DS.attr(),

          author: DS.belongsTo('user')
        });
        ```

        The default serialization would create a JSON object like:

        ```js
        {
          "title": "Rails is unagi",
          "body": "Rails? Omakase? O_O",
          "author": 12
        }
        ```

        By default, attributes are passed through as-is, unless
        you specified an attribute type (`DS.attr('date')`). If
        you specify a transform, the JavaScript value will be
        serialized when inserted into the JSON hash.

        By default, belongs-to relationships are converted into
        IDs when inserted into the JSON hash.

        ## IDs

        `serialize` takes an options hash with a single option:
        `includeId`. If this option is `true`, `serialize` will,
        by default include the ID in the JSON object it builds.

        The adapter passes in `includeId: true` when serializing
        a record for `createRecord`, but not for `updateRecord`.

        ## Customization

        Your server may expect a different JSON format than the
        built-in serialization format.

        In that case, you can implement `serialize` yourself and
        return a JSON hash of your choosing.

        ```js
        App.PostSerializer = DS.RESTSerializer.extend({
          serialize: function(snapshot, options) {
            var json = {
              POST_TTL: snapshot.attr('title'),
              POST_BDY: snapshot.attr('body'),
              POST_CMS: snapshot.hasMany('comments', { ids: true })
            }

            if (options.includeId) {
              json.POST_ID_ = snapshot.id;
            }

            return json;
          }
        });
        ```

        ## Customizing an App-Wide Serializer

        If you want to define a serializer for your entire
        application, you'll probably want to use `eachAttribute`
        and `eachRelationship` on the record.

        ```js
        App.ApplicationSerializer = DS.RESTSerializer.extend({
          serialize: function(snapshot, options) {
            var json = {};

            snapshot.eachAttribute(function(name) {
              json[serverAttributeName(name)] = snapshot.attr(name);
            })

            snapshot.eachRelationship(function(name, relationship) {
              if (relationship.kind === 'hasMany') {
                json[serverHasManyName(name)] = snapshot.hasMany(name, { ids: true });
              }
            });

            if (options.includeId) {
              json.ID_ = snapshot.id;
            }

            return json;
          }
        });

        function serverAttributeName(attribute) {
          return attribute.underscore().toUpperCase();
        }

        function serverHasManyName(name) {
          return serverAttributeName(name.singularize()) + "_IDS";
        }
        ```

        This serializer will generate JSON that looks like this:

        ```js
        {
          "TITLE": "Rails is omakase",
          "BODY": "Yep. Omakase.",
          "COMMENT_IDS": [ 1, 2, 3 ]
        }
        ```

        ## Tweaking the Default JSON

        If you just want to do some small tweaks on the default JSON,
        you can call super first and make the tweaks on the returned
        JSON.

        ```js
        App.PostSerializer = DS.RESTSerializer.extend({
          serialize: function(snapshot, options) {
            var json = this._super(snapshot, options);

            json.subject = json.title;
            delete json.title;

            return json;
          }
        });
        ```

        @method serialize
        @param {DS.Snapshot} snapshot
        @param {Object} options
        @return {Object} json
      */
      serialize: function(snapshot, options) {
        return this._super.apply(this, arguments);
      },

      /**
        You can use this method to customize the root keys serialized into the JSON.
        By default the REST Serializer sends the modelName of a model, which is a camelized
        version of the name.

        For example, your server may expect underscored root objects.

        ```js
        App.ApplicationSerializer = DS.RESTSerializer.extend({
          serializeIntoHash: function(data, type, record, options) {
            var root = Ember.String.decamelize(type.modelName);
            data[root] = this.serialize(record, options);
          }
        });
        ```

        @method serializeIntoHash
        @param {Object} hash
        @param {subclass of DS.Model} typeClass
        @param {DS.Snapshot} snapshot
        @param {Object} options
      */
      serializeIntoHash: function(hash, typeClass, snapshot, options) {
        var normalizedRootKey = this.payloadKeyFromModelName(typeClass.modelName);
        hash[normalizedRootKey] = this.serialize(snapshot, options);
      },

      /**
        You can use `payloadKeyFromModelName` to override the root key for an outgoing
        request. By default, the RESTSerializer returns a camelized version of the
        model's name.

        For a model called TacoParty, its `modelName` would be the string `taco-party`. The RESTSerializer
        will send it to the server with `tacoParty` as the root key in the JSON payload:

        ```js
        {
          "tacoParty": {
            "id": "1",
            "location": "Matthew Beale's House"
          }
        }
        ```

        For example, your server may expect dasherized root objects:

        ```js
        App.ApplicationSerializer = DS.RESTSerializer.extend({
          payloadKeyFromModelName: function(modelName) {
            return Ember.String.dasherize(modelName);
          }
        });
        ```

        Given a `TacoParty' model, calling `save` on a tacoModel would produce an outgoing
        request like:

        ```js
        {
          "taco-party": {
            "id": "1",
            "location": "Matthew Beale's House"
          }
        }
        ```

        @method payloadKeyFromModelName
        @param {String} modelName
        @returns {String}
      */
      payloadKeyFromModelName: function(modelName) {
        return ember$data$lib$serializers$rest$serializer$$camelize(modelName);
      },

      /**
       Deprecated. Use payloadKeyFromModelName instead

        @method typeForRoot
        @param {String} modelName
        @returns {String}
        @deprecated
      */
      typeForRoot: function(modelName) {
        Ember.deprecate("typeForRoot is deprecated. Use modelNameFromPayloadKey instead.");
        return this.modelNameFromPayloadKey(modelName);
      },

      /**
        You can use this method to customize how polymorphic objects are serialized.
        By default the JSON Serializer creates the key by appending `Type` to
        the attribute and value from the model's camelcased model name.

        @method serializePolymorphicType
        @param {DS.Snapshot} snapshot
        @param {Object} json
        @param {Object} relationship
      */
      serializePolymorphicType: function(snapshot, json, relationship) {
        var key = relationship.key;
        var belongsTo = snapshot.belongsTo(key);
        key = this.keyForAttribute ? this.keyForAttribute(key, "serialize") : key;
        if (Ember.isNone(belongsTo)) {
          json[key + "Type"] = null;
        } else {
          json[key + "Type"] = Ember.String.camelize(belongsTo.modelName);
        }
      }
    });

    Ember.runInDebug(function() {
      ember$data$lib$serializers$rest$serializer$$RESTSerializer.reopen({
        warnMessageNoModelForKey: function(prop, modelName) {
          return 'Encountered "' + prop + '" in payload, but no model was found for model name "' + modelName + '" (resolved model name using ' + this.constructor.toString() + '.typeForRoot("' + prop + '"))';
        }
      });
    });

    var ember$data$lib$serializers$rest$serializer$$default = ember$data$lib$serializers$rest$serializer$$RESTSerializer;
    /**
      @module ember-data
    */

    var activemodel$adapter$lib$system$active$model$serializer$$forEach = Ember.EnumerableUtils.forEach;
    var activemodel$adapter$lib$system$active$model$serializer$$camelize =   Ember.String.camelize;
    var activemodel$adapter$lib$system$active$model$serializer$$classify = Ember.String.classify;
    var activemodel$adapter$lib$system$active$model$serializer$$decamelize = Ember.String.decamelize;
    var activemodel$adapter$lib$system$active$model$serializer$$underscore = Ember.String.underscore;

    /**
      The ActiveModelSerializer is a subclass of the RESTSerializer designed to integrate
      with a JSON API that uses an underscored naming convention instead of camelCasing.
      It has been designed to work out of the box with the
      [active\_model\_serializers](http://github.com/rails-api/active_model_serializers)
      Ruby gem. This Serializer expects specific settings using ActiveModel::Serializers,
      `embed :ids, embed_in_root: true` which sideloads the records.

      This serializer extends the DS.RESTSerializer by making consistent
      use of the camelization, decamelization and pluralization methods to
      normalize the serialized JSON into a format that is compatible with
      a conventional Rails backend and Ember Data.

      ## JSON Structure

      The ActiveModelSerializer expects the JSON returned from your server
      to follow the REST adapter conventions substituting underscored keys
      for camelcased ones.

      ### Conventional Names

      Attribute names in your JSON payload should be the underscored versions of
      the attributes in your Ember.js models.

      For example, if you have a `Person` model:

      ```js
      App.FamousPerson = DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
        occupation: DS.attr('string')
      });
      ```

      The JSON returned should look like this:

      ```js
      {
        "famous_person": {
          "id": 1,
          "first_name": "Barack",
          "last_name": "Obama",
          "occupation": "President"
        }
      }
      ```

      Let's imagine that `Occupation` is just another model:

      ```js
      App.Person = DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
        occupation: DS.belongsTo('occupation')
      });

      App.Occupation = DS.Model.extend({
        name: DS.attr('string'),
        salary: DS.attr('number'),
        people: DS.hasMany('person')
      });
      ```

      The JSON needed to avoid extra server calls, should look like this:

      ```js
      {
        "people": [{
          "id": 1,
          "first_name": "Barack",
          "last_name": "Obama",
          "occupation_id": 1
        }],

        "occupations": [{
          "id": 1,
          "name": "President",
          "salary": 100000,
          "person_ids": [1]
        }]
      }
      ```

      @class ActiveModelSerializer
      @namespace DS
      @extends DS.RESTSerializer
    */
    var activemodel$adapter$lib$system$active$model$serializer$$ActiveModelSerializer = ember$data$lib$serializers$rest$serializer$$default.extend({
      // SERIALIZE

      /**
        Converts camelCased attributes to underscored when serializing.

        @method keyForAttribute
        @param {String} attribute
        @return String
      */
      keyForAttribute: function(attr) {
        return activemodel$adapter$lib$system$active$model$serializer$$decamelize(attr);
      },

      /**
        Underscores relationship names and appends "_id" or "_ids" when serializing
        relationship keys.

        @method keyForRelationship
        @param {String} relationshipTypeKey
        @param {String} kind
        @return String
      */
      keyForRelationship: function(relationshipTypeKey, kind) {
        var key = activemodel$adapter$lib$system$active$model$serializer$$decamelize(relationshipTypeKey);
        if (kind === "belongsTo") {
          return key + "_id";
        } else if (kind === "hasMany") {
          return ember$inflector$lib$lib$system$string$$singularize(key) + "_ids";
        } else {
          return key;
        }
      },

      /*
        Does not serialize hasMany relationships by default.
      */
      serializeHasMany: Ember.K,

      /**
       Underscores the JSON root keys when serializing.

        @method payloadKeyFromModelName
        @param {String} modelName
        @returns {String}
      */
      payloadKeyFromModelName: function(modelName) {
        return activemodel$adapter$lib$system$active$model$serializer$$underscore(activemodel$adapter$lib$system$active$model$serializer$$decamelize(modelName));
      },

      /**
        Serializes a polymorphic type as a fully capitalized model name.

        @method serializePolymorphicType
        @param {DS.Snapshot} snapshot
        @param {Object} json
        @param {Object} relationship
      */
      serializePolymorphicType: function(snapshot, json, relationship) {
        var key = relationship.key;
        var belongsTo = snapshot.belongsTo(key);
        var jsonKey = activemodel$adapter$lib$system$active$model$serializer$$underscore(key + "_type");

        if (Ember.isNone(belongsTo)) {
          json[jsonKey] = null;
        } else {
          json[jsonKey] = activemodel$adapter$lib$system$active$model$serializer$$classify(belongsTo.modelName).replace(/(\/)([a-z])/g, function(match, separator, chr) {
            return match.toUpperCase();
          }).replace('/', '::');
        }
      },

      // EXTRACT

      /**
        Add extra step to `DS.RESTSerializer.normalize` so links are normalized.

        If your payload looks like:

        ```js
        {
          "post": {
            "id": 1,
            "title": "Rails is omakase",
            "links": { "flagged_comments": "api/comments/flagged" }
          }
        }
        ```

        The normalized version would look like this

        ```js
        {
          "post": {
            "id": 1,
            "title": "Rails is omakase",
            "links": { "flaggedComments": "api/comments/flagged" }
          }
        }
        ```

        @method normalize
        @param {subclass of DS.Model} typeClass
        @param {Object} hash
        @param {String} prop
        @return Object
      */

      normalize: function(typeClass, hash, prop) {
        this.normalizeLinks(hash);

        return this._super(typeClass, hash, prop);
      },

      /**
        Convert `snake_cased` links  to `camelCase`

        @method normalizeLinks
        @param {Object} data
      */

      normalizeLinks: function(data) {
        if (data.links) {
          var links = data.links;

          for (var link in links) {
            var camelizedLink = activemodel$adapter$lib$system$active$model$serializer$$camelize(link);

            if (camelizedLink !== link) {
              links[camelizedLink] = links[link];
              delete links[link];
            }
          }
        }
      },

      /**
        Normalize the polymorphic type from the JSON.

        Normalize:
        ```js
          {
            id: "1"
            minion: { type: "evil_minion", id: "12"}
          }
        ```

        To:
        ```js
          {
            id: "1"
            minion: { type: "evilMinion", id: "12"}
          }
        ```

        @param {Subclass of DS.Model} typeClass
        @method normalizeRelationships
        @private
      */
      normalizeRelationships: function(typeClass, hash) {

        if (this.keyForRelationship) {
          typeClass.eachRelationship(function(key, relationship) {
            var payloadKey, payload;
            if (relationship.options.polymorphic) {
              payloadKey = this.keyForAttribute(key, "deserialize");
              payload = hash[payloadKey];
              if (payload && payload.type) {
                payload.type = this.modelNameFromPayloadKey(payload.type);
              } else if (payload && relationship.kind === "hasMany") {
                var self = this;
                activemodel$adapter$lib$system$active$model$serializer$$forEach(payload, function(single) {
                  single.type = self.modelNameFromPayloadKey(single.type);
                });
              }
            } else {
              payloadKey = this.keyForRelationship(key, relationship.kind, "deserialize");
              if (!hash.hasOwnProperty(payloadKey)) { return; }
              payload = hash[payloadKey];
            }

            hash[key] = payload;

            if (key !== payloadKey) {
              delete hash[payloadKey];
            }
          }, this);
        }
      },
      modelNameFromPayloadKey: function(key) {
        var convertedFromRubyModule = activemodel$adapter$lib$system$active$model$serializer$$camelize(ember$inflector$lib$lib$system$string$$singularize(key)).replace(/(^|\:)([A-Z])/g, function(match, separator, chr) {
          return match.toLowerCase();
        }).replace('::', '/');
        return ember$data$lib$system$normalize$model$name$$default(convertedFromRubyModule);
      }
    });

    var activemodel$adapter$lib$system$active$model$serializer$$default = activemodel$adapter$lib$system$active$model$serializer$$ActiveModelSerializer;
    function ember$data$lib$system$container$proxy$$ContainerProxy(container) {
      this.container = container;
    }

    ember$data$lib$system$container$proxy$$ContainerProxy.prototype.aliasedFactory = function(path, preLookup) {
      var _this = this;

      return {
        create: function() {
          if (preLookup) { preLookup(); }

          return _this.container.lookup(path);
        }
      };
    };

    ember$data$lib$system$container$proxy$$ContainerProxy.prototype.registerAlias = function(source, dest, preLookup) {
      var factory = this.aliasedFactory(dest, preLookup);

      return this.container.register(source, factory);
    };

    ember$data$lib$system$container$proxy$$ContainerProxy.prototype.registerDeprecation = function(deprecated, valid) {
      var preLookupCallback = function() {
        Ember.deprecate("You tried to look up '" + deprecated + "', " +
                        "but this has been deprecated in favor of '" + valid + "'.", false);
      };

      return this.registerAlias(deprecated, valid, preLookupCallback);
    };

    ember$data$lib$system$container$proxy$$ContainerProxy.prototype.registerDeprecations = function(proxyPairs) {
      var i, proxyPair, deprecated, valid;

      for (i = proxyPairs.length; i > 0; i--) {
        proxyPair = proxyPairs[i - 1];
        deprecated = proxyPair['deprecated'];
        valid = proxyPair['valid'];

        this.registerDeprecation(deprecated, valid);
      }
    };

    var ember$data$lib$system$container$proxy$$default = ember$data$lib$system$container$proxy$$ContainerProxy;
    function activemodel$adapter$lib$setup$container$$setupActiveModelAdapter(registry, application) {
      var proxy = new ember$data$lib$system$container$proxy$$default(registry);
      proxy.registerDeprecations([
        { deprecated: 'serializer:_ams',  valid: 'serializer:-active-model' },
        { deprecated: 'adapter:_ams',     valid: 'adapter:-active-model' }
      ]);

      registry.register('serializer:-active-model', activemodel$adapter$lib$system$active$model$serializer$$default);
      registry.register('adapter:-active-model', activemodel$adapter$lib$system$active$model$adapter$$default);
    }
    var activemodel$adapter$lib$setup$container$$default = activemodel$adapter$lib$setup$container$$setupActiveModelAdapter;
    var ember$data$lib$core$$DS = Ember.Namespace.create({
      VERSION: '1.0.0-beta.18'
    });

    if (Ember.libraries) {
      Ember.libraries.registerCoreLibrary('Ember Data', ember$data$lib$core$$DS.VERSION);
    }

    var ember$data$lib$core$$default = ember$data$lib$core$$DS;
    var ember$data$lib$system$promise$proxies$$Promise = Ember.RSVP.Promise;
    var ember$data$lib$system$promise$proxies$$get = Ember.get;

    /**
      A `PromiseArray` is an object that acts like both an `Ember.Array`
      and a promise. When the promise is resolved the resulting value
      will be set to the `PromiseArray`'s `content` property. This makes
      it easy to create data bindings with the `PromiseArray` that will be
      updated when the promise resolves.

      For more information see the [Ember.PromiseProxyMixin
      documentation](/api/classes/Ember.PromiseProxyMixin.html).

      Example

      ```javascript
      var promiseArray = DS.PromiseArray.create({
        promise: $.getJSON('/some/remote/data.json')
      });

      promiseArray.get('length'); // 0

      promiseArray.then(function() {
        promiseArray.get('length'); // 100
      });
      ```

      @class PromiseArray
      @namespace DS
      @extends Ember.ArrayProxy
      @uses Ember.PromiseProxyMixin
    */
    var ember$data$lib$system$promise$proxies$$PromiseArray = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin);

    /**
      A `PromiseObject` is an object that acts like both an `Ember.Object`
      and a promise. When the promise is resolved, then the resulting value
      will be set to the `PromiseObject`'s `content` property. This makes
      it easy to create data bindings with the `PromiseObject` that will
      be updated when the promise resolves.

      For more information see the [Ember.PromiseProxyMixin
      documentation](/api/classes/Ember.PromiseProxyMixin.html).

      Example

      ```javascript
      var promiseObject = DS.PromiseObject.create({
        promise: $.getJSON('/some/remote/data.json')
      });

      promiseObject.get('name'); // null

      promiseObject.then(function() {
        promiseObject.get('name'); // 'Tomster'
      });
      ```

      @class PromiseObject
      @namespace DS
      @extends Ember.ObjectProxy
      @uses Ember.PromiseProxyMixin
    */
    var ember$data$lib$system$promise$proxies$$PromiseObject = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

    var ember$data$lib$system$promise$proxies$$promiseObject = function(promise, label) {
      return ember$data$lib$system$promise$proxies$$PromiseObject.create({
        promise: ember$data$lib$system$promise$proxies$$Promise.resolve(promise, label)
      });
    };

    var ember$data$lib$system$promise$proxies$$promiseArray = function(promise, label) {
      return ember$data$lib$system$promise$proxies$$PromiseArray.create({
        promise: ember$data$lib$system$promise$proxies$$Promise.resolve(promise, label)
      });
    };

    /**
      A PromiseManyArray is a PromiseArray that also proxies certain method calls
      to the underlying manyArray.
      Right now we proxy:

        * `reload()`
        * `createRecord()`
        * `on()`
        * `one()`
        * `trigger()`
        * `off()`
        * `has()`

      @class PromiseManyArray
      @namespace DS
      @extends Ember.ArrayProxy
    */

    function ember$data$lib$system$promise$proxies$$proxyToContent(method) {
      return function() {
        var content = ember$data$lib$system$promise$proxies$$get(this, 'content');
        return content[method].apply(content, arguments);
      };
    }

    var ember$data$lib$system$promise$proxies$$PromiseManyArray = ember$data$lib$system$promise$proxies$$PromiseArray.extend({
      reload: function() {
        //I don't think this should ever happen right now, but worth guarding if we refactor the async relationships
        Ember.assert('You are trying to reload an async manyArray before it has been created', ember$data$lib$system$promise$proxies$$get(this, 'content'));
        return ember$data$lib$system$promise$proxies$$PromiseManyArray.create({
          promise: ember$data$lib$system$promise$proxies$$get(this, 'content').reload()
        });
      },

      createRecord: ember$data$lib$system$promise$proxies$$proxyToContent('createRecord'),

      on: ember$data$lib$system$promise$proxies$$proxyToContent('on'),

      one: ember$data$lib$system$promise$proxies$$proxyToContent('one'),

      trigger: ember$data$lib$system$promise$proxies$$proxyToContent('trigger'),

      off: ember$data$lib$system$promise$proxies$$proxyToContent('off'),

      has: ember$data$lib$system$promise$proxies$$proxyToContent('has')
    });

    var ember$data$lib$system$promise$proxies$$promiseManyArray = function(promise, label) {
      return ember$data$lib$system$promise$proxies$$PromiseManyArray.create({
        promise: ember$data$lib$system$promise$proxies$$Promise.resolve(promise, label)
      });
    };


    var ember$data$lib$system$store$common$$get = Ember.get;

    function ember$data$lib$system$store$common$$_bind(fn) {
      var args = Array.prototype.slice.call(arguments, 1);

      return function() {
        return fn.apply(undefined, args);
      };
    }

    function ember$data$lib$system$store$common$$_guard(promise, test) {
      var guarded = promise['finally'](function() {
        if (!test()) {
          guarded._subscribers.length = 0;
        }
      });

      return guarded;
    }

    function ember$data$lib$system$store$common$$_objectIsAlive(object) {
      return !(ember$data$lib$system$store$common$$get(object, "isDestroyed") || ember$data$lib$system$store$common$$get(object, "isDestroying"));
    }
    function ember$data$lib$system$store$serializers$$serializerForAdapter(store, adapter, type) {
      var serializer = adapter.serializer;

      if (serializer === undefined) {
        serializer = store.serializerFor(type);
      }

      if (serializer === null || serializer === undefined) {
        serializer = {
          extract: function(store, type, payload) { return payload; }
        };
      }

      return serializer;
    }


    var ember$data$lib$system$store$finders$$get = Ember.get;
    var ember$data$lib$system$store$finders$$Promise = Ember.RSVP.Promise;

    function ember$data$lib$system$store$finders$$_find(adapter, store, typeClass, id, record) {
      var snapshot = record._createSnapshot();
      var promise = adapter.find(store, typeClass, id, snapshot);
      var serializer = ember$data$lib$system$store$serializers$$serializerForAdapter(store, adapter, typeClass);
      var label = "DS: Handle Adapter#find of " + typeClass + " with id: " + id;

      promise = ember$data$lib$system$store$finders$$Promise.cast(promise, label);
      promise = ember$data$lib$system$store$common$$_guard(promise, ember$data$lib$system$store$common$$_bind(ember$data$lib$system$store$common$$_objectIsAlive, store));

      return promise.then(function(adapterPayload) {
        Ember.assert("You made a request for a " + typeClass.typeClassKey + " with id " + id + ", but the adapter's response did not have any data", adapterPayload);
        return store._adapterRun(function() {
          var payload = serializer.extract(store, typeClass, adapterPayload, id, 'find');

          return store.push(typeClass, payload);
        });
      }, function(error) {
        record.notFound();
        if (ember$data$lib$system$store$finders$$get(record, 'isEmpty')) {
          store.unloadRecord(record);
        }

        throw error;
      }, "DS: Extract payload of '" + typeClass + "'");
    }


    function ember$data$lib$system$store$finders$$_findMany(adapter, store, typeClass, ids, records) {
      var snapshots = Ember.A(records).invoke('_createSnapshot');
      var promise = adapter.findMany(store, typeClass, ids, snapshots);
      var serializer = ember$data$lib$system$store$serializers$$serializerForAdapter(store, adapter, typeClass);
      var label = "DS: Handle Adapter#findMany of " + typeClass;

      if (promise === undefined) {
        throw new Error('adapter.findMany returned undefined, this was very likely a mistake');
      }

      promise = ember$data$lib$system$store$finders$$Promise.cast(promise, label);
      promise = ember$data$lib$system$store$common$$_guard(promise, ember$data$lib$system$store$common$$_bind(ember$data$lib$system$store$common$$_objectIsAlive, store));

      return promise.then(function(adapterPayload) {
        return store._adapterRun(function() {
          var payload = serializer.extract(store, typeClass, adapterPayload, null, 'findMany');

          Ember.assert("The response from a findMany must be an Array, not " + Ember.inspect(payload), Ember.typeOf(payload) === 'array');

          return store.pushMany(typeClass, payload);
        });
      }, null, "DS: Extract payload of " + typeClass);
    }

    function ember$data$lib$system$store$finders$$_findHasMany(adapter, store, record, link, relationship) {
      var snapshot = record._createSnapshot();
      var promise = adapter.findHasMany(store, snapshot, link, relationship);
      var serializer = ember$data$lib$system$store$serializers$$serializerForAdapter(store, adapter, relationship.type);
      var label = "DS: Handle Adapter#findHasMany of " + record + " : " + relationship.type;

      promise = ember$data$lib$system$store$finders$$Promise.cast(promise, label);
      promise = ember$data$lib$system$store$common$$_guard(promise, ember$data$lib$system$store$common$$_bind(ember$data$lib$system$store$common$$_objectIsAlive, store));
      promise = ember$data$lib$system$store$common$$_guard(promise, ember$data$lib$system$store$common$$_bind(ember$data$lib$system$store$common$$_objectIsAlive, record));

      return promise.then(function(adapterPayload) {
        return store._adapterRun(function() {
          var payload = serializer.extract(store, relationship.type, adapterPayload, null, 'findHasMany');

          Ember.assert("The response from a findHasMany must be an Array, not " + Ember.inspect(payload), Ember.typeOf(payload) === 'array');

          var records = store.pushMany(relationship.type, payload);
          return records;
        });
      }, null, "DS: Extract payload of " + record + " : hasMany " + relationship.type);
    }

    function ember$data$lib$system$store$finders$$_findBelongsTo(adapter, store, record, link, relationship) {
      var snapshot = record._createSnapshot();
      var promise = adapter.findBelongsTo(store, snapshot, link, relationship);
      var serializer = ember$data$lib$system$store$serializers$$serializerForAdapter(store, adapter, relationship.type);
      var label = "DS: Handle Adapter#findBelongsTo of " + record + " : " + relationship.type;

      promise = ember$data$lib$system$store$finders$$Promise.cast(promise, label);
      promise = ember$data$lib$system$store$common$$_guard(promise, ember$data$lib$system$store$common$$_bind(ember$data$lib$system$store$common$$_objectIsAlive, store));
      promise = ember$data$lib$system$store$common$$_guard(promise, ember$data$lib$system$store$common$$_bind(ember$data$lib$system$store$common$$_objectIsAlive, record));

      return promise.then(function(adapterPayload) {
        return store._adapterRun(function() {
          var payload = serializer.extract(store, relationship.type, adapterPayload, null, 'findBelongsTo');

          if (!payload) {
            return null;
          }

          var record = store.push(relationship.type, payload);
          return record;
        });
      }, null, "DS: Extract payload of " + record + " : " + relationship.type);
    }

    function ember$data$lib$system$store$finders$$_findAll(adapter, store, typeClass, sinceToken) {
      var promise = adapter.findAll(store, typeClass, sinceToken);
      var serializer = ember$data$lib$system$store$serializers$$serializerForAdapter(store, adapter, typeClass);
      var label = "DS: Handle Adapter#findAll of " + typeClass;

      promise = ember$data$lib$system$store$finders$$Promise.cast(promise, label);
      promise = ember$data$lib$system$store$common$$_guard(promise, ember$data$lib$system$store$common$$_bind(ember$data$lib$system$store$common$$_objectIsAlive, store));

      return promise.then(function(adapterPayload) {
        store._adapterRun(function() {
          var payload = serializer.extract(store, typeClass, adapterPayload, null, 'findAll');

          Ember.assert("The response from a findAll must be an Array, not " + Ember.inspect(payload), Ember.typeOf(payload) === 'array');

          store.pushMany(typeClass, payload);
        });

        store.didUpdateAll(typeClass);
        return store.all(typeClass);
      }, null, "DS: Extract payload of findAll " + typeClass);
    }

    function ember$data$lib$system$store$finders$$_findQuery(adapter, store, typeClass, query, recordArray) {
      var promise = adapter.findQuery(store, typeClass, query, recordArray);
      var serializer = ember$data$lib$system$store$serializers$$serializerForAdapter(store, adapter, typeClass);
      var label = "DS: Handle Adapter#findQuery of " + typeClass;

      promise = ember$data$lib$system$store$finders$$Promise.cast(promise, label);
      promise = ember$data$lib$system$store$common$$_guard(promise, ember$data$lib$system$store$common$$_bind(ember$data$lib$system$store$common$$_objectIsAlive, store));

      return promise.then(function(adapterPayload) {
        var payload;
        store._adapterRun(function() {
          payload = serializer.extract(store, typeClass, adapterPayload, null, 'findQuery');

          Ember.assert("The response from a findQuery must be an Array, not " + Ember.inspect(payload), Ember.typeOf(payload) === 'array');
        });

        recordArray.load(payload);
        return recordArray;

      }, null, "DS: Extract payload of findQuery " + typeClass);
    }
    var ember$data$lib$system$record$arrays$record$array$$get = Ember.get;
    var ember$data$lib$system$record$arrays$record$array$$set = Ember.set;

    var ember$data$lib$system$record$arrays$record$array$$default = Ember.ArrayProxy.extend(Ember.Evented, {
      /**
        The model type contained by this record array.

        @property type
        @type DS.Model
      */
      type: null,

      /**
        The array of client ids backing the record array. When a
        record is requested from the record array, the record
        for the client id at the same index is materialized, if
        necessary, by the store.

        @property content
        @private
        @type Ember.Array
      */
      content: null,

      /**
        The flag to signal a `RecordArray` is finished loading data.

        Example

        ```javascript
        var people = store.all('person');
        people.get('isLoaded'); // true
        ```

        @property isLoaded
        @type Boolean
      */
      isLoaded: false,
      /**
        The flag to signal a `RecordArray` is currently loading data.

        Example

        ```javascript
        var people = store.all('person');
        people.get('isUpdating'); // false
        people.update();
        people.get('isUpdating'); // true
        ```

        @property isUpdating
        @type Boolean
      */
      isUpdating: false,

      /**
        The store that created this record array.

        @property store
        @private
        @type DS.Store
      */
      store: null,

      /**
        Retrieves an object from the content by index.

        @method objectAtContent
        @private
        @param {Number} index
        @return {DS.Model} record
      */
      objectAtContent: function(index) {
        var content = ember$data$lib$system$record$arrays$record$array$$get(this, 'content');

        return content.objectAt(index);
      },

      /**
        Used to get the latest version of all of the records in this array
        from the adapter.

        Example

        ```javascript
        var people = store.all('person');
        people.get('isUpdating'); // false
        people.update();
        people.get('isUpdating'); // true
        ```

        @method update
      */
      update: function() {
        if (ember$data$lib$system$record$arrays$record$array$$get(this, 'isUpdating')) { return; }

        var store = ember$data$lib$system$record$arrays$record$array$$get(this, 'store');
        var type = ember$data$lib$system$record$arrays$record$array$$get(this, 'type');

        return store.fetchAll(type, this);
      },

      /**
        Adds a record to the `RecordArray` without duplicates

        @method addRecord
        @private
        @param {DS.Model} record
        @param {DS.Model} an optional index to insert at
      */
      addRecord: function(record, idx) {
        var content = ember$data$lib$system$record$arrays$record$array$$get(this, 'content');
        if (idx === undefined) {
          content.addObject(record);
        } else if (!content.contains(record)) {
          content.insertAt(idx, record);
        }
      },

      _pushRecord: function(record) {
        ember$data$lib$system$record$arrays$record$array$$get(this, 'content').pushObject(record);
      },

      /**
        Adds a record to the `RecordArray`, but allows duplicates

        @deprecated
        @method pushRecord
        @private
        @param {DS.Model} record
      */
      pushRecord: function(record) {
        Ember.deprecate('Usage of `recordArray.pushRecord` is deprecated, use `recordArray.addObject` instead');
        this._pushRecord(record);
      },
      /**
        Removes a record to the `RecordArray`.

        @method removeRecord
        @private
        @param {DS.Model} record
      */
      removeRecord: function(record) {
        ember$data$lib$system$record$arrays$record$array$$get(this, 'content').removeObject(record);
      },

      /**
        Saves all of the records in the `RecordArray`.

        Example

        ```javascript
        var messages = store.all('message');
        messages.forEach(function(message) {
          message.set('hasBeenSeen', true);
        });
        messages.save();
        ```

        @method save
        @return {DS.PromiseArray} promise
      */
      save: function() {
        var recordArray = this;
        var promiseLabel = "DS: RecordArray#save " + ember$data$lib$system$record$arrays$record$array$$get(this, 'type');
        var promise = Ember.RSVP.all(this.invoke("save"), promiseLabel).then(function(array) {
          return recordArray;
        }, null, "DS: RecordArray#save return RecordArray");

        return ember$data$lib$system$promise$proxies$$PromiseArray.create({ promise: promise });
      },

      _dissociateFromOwnRecords: function() {
        var array = this;

        this.forEach(function(record) {
          var recordArrays = record._recordArrays;

          if (recordArrays) {
            recordArrays["delete"](array);
          }
        });
      },

      /**
        @method _unregisterFromManager
        @private
      */
      _unregisterFromManager: function() {
        var manager = ember$data$lib$system$record$arrays$record$array$$get(this, 'manager');
        //We will stop needing this stupid if statement soon, once manyArray are refactored to not be RecordArrays
        if (manager) {
          manager.unregisterFilteredRecordArray(this);
        }
      },

      willDestroy: function() {
        this._unregisterFromManager();
        this._dissociateFromOwnRecords();
        ember$data$lib$system$record$arrays$record$array$$set(this, 'content', undefined);
        this._super.apply(this, arguments);
      }
    });

    /**
      @module ember-data
    */

    var ember$data$lib$system$record$arrays$filtered$record$array$$get = Ember.get;

    var ember$data$lib$system$record$arrays$filtered$record$array$$default = ember$data$lib$system$record$arrays$record$array$$default.extend({
      /**
        The filterFunction is a function used to test records from the store to
        determine if they should be part of the record array.

        Example

        ```javascript
        var allPeople = store.all('person');
        allPeople.mapBy('name'); // ["Tom Dale", "Yehuda Katz", "Trek Glowacki"]

        var people = store.filter('person', function(person) {
          if (person.get('name').match(/Katz$/)) { return true; }
        });
        people.mapBy('name'); // ["Yehuda Katz"]

        var notKatzFilter = function(person) {
          return !person.get('name').match(/Katz$/);
        };
        people.set('filterFunction', notKatzFilter);
        people.mapBy('name'); // ["Tom Dale", "Trek Glowacki"]
        ```

        @method filterFunction
        @param {DS.Model} record
        @return {Boolean} `true` if the record should be in the array
      */
      filterFunction: null,
      isLoaded: true,

      replace: function() {
        var type = ember$data$lib$system$record$arrays$filtered$record$array$$get(this, 'type').toString();
        throw new Error("The result of a client-side filter (on " + type + ") is immutable.");
      },

      /**
        @method updateFilter
        @private
      */
      _updateFilter: function() {
        var manager = ember$data$lib$system$record$arrays$filtered$record$array$$get(this, 'manager');
        manager.updateFilter(this, ember$data$lib$system$record$arrays$filtered$record$array$$get(this, 'type'), ember$data$lib$system$record$arrays$filtered$record$array$$get(this, 'filterFunction'));
      },

      updateFilter: Ember.observer(function() {
        Ember.run.once(this, this._updateFilter);
      }, 'filterFunction')
    });

    /**
      @module ember-data
    */

    var ember$data$lib$system$record$arrays$adapter$populated$record$array$$get = Ember.get;

    function ember$data$lib$system$record$arrays$adapter$populated$record$array$$cloneNull(source) {
      var clone = Ember.create(null);
      for (var key in source) {
        clone[key] = source[key];
      }
      return clone;
    }

    var ember$data$lib$system$record$arrays$adapter$populated$record$array$$default = ember$data$lib$system$record$arrays$record$array$$default.extend({
      query: null,

      replace: function() {
        var type = ember$data$lib$system$record$arrays$adapter$populated$record$array$$get(this, 'type').toString();
        throw new Error("The result of a server query (on " + type + ") is immutable.");
      },

      /**
        @method load
        @private
        @param {Array} data
      */
      load: function(data) {
        var store = ember$data$lib$system$record$arrays$adapter$populated$record$array$$get(this, 'store');
        var type = ember$data$lib$system$record$arrays$adapter$populated$record$array$$get(this, 'type');
        var records = store.pushMany(type, data);
        var meta = store.metadataFor(type);

        this.setProperties({
          content: Ember.A(records),
          isLoaded: true,
          meta: ember$data$lib$system$record$arrays$adapter$populated$record$array$$cloneNull(meta)
        });

        records.forEach(function(record) {
          this.manager.recordArraysForRecord(record).add(this);
        }, this);

        // TODO: should triggering didLoad event be the last action of the runLoop?
        Ember.run.once(this, 'trigger', 'didLoad');
      }
    });

    var ember$data$lib$system$ordered$set$$EmberOrderedSet = Ember.OrderedSet;
    var ember$data$lib$system$ordered$set$$guidFor = Ember.guidFor;

    var ember$data$lib$system$ordered$set$$OrderedSet = function() {
      this._super$constructor();
    };

    ember$data$lib$system$ordered$set$$OrderedSet.create = function() {
      var Constructor = this;
      return new Constructor();
    };

    ember$data$lib$system$ordered$set$$OrderedSet.prototype = Ember.create(ember$data$lib$system$ordered$set$$EmberOrderedSet.prototype);
    ember$data$lib$system$ordered$set$$OrderedSet.prototype.constructor = ember$data$lib$system$ordered$set$$OrderedSet;
    ember$data$lib$system$ordered$set$$OrderedSet.prototype._super$constructor = ember$data$lib$system$ordered$set$$EmberOrderedSet;

    ember$data$lib$system$ordered$set$$OrderedSet.prototype.addWithIndex = function(obj, idx) {
      var guid = ember$data$lib$system$ordered$set$$guidFor(obj);
      var presenceSet = this.presenceSet;
      var list = this.list;

      if (presenceSet[guid] === true) {
        return;
      }

      presenceSet[guid] = true;

      if (idx === undefined || idx == null) {
        list.push(obj);
      } else {
        list.splice(idx, 0, obj);
      }

      this.size += 1;

      return this;
    };

    var ember$data$lib$system$ordered$set$$default = ember$data$lib$system$ordered$set$$OrderedSet;
    var ember$data$lib$system$record$array$manager$$get = Ember.get;
    var ember$data$lib$system$record$array$manager$$forEach = Ember.EnumerableUtils.forEach;
    var ember$data$lib$system$record$array$manager$$indexOf = Ember.EnumerableUtils.indexOf;

    var ember$data$lib$system$record$array$manager$$default = Ember.Object.extend({
      init: function() {
        this.filteredRecordArrays = ember$data$lib$system$map$$MapWithDefault.create({
          defaultValue: function() { return []; }
        });

        this.changedRecords = [];
        this._adapterPopulatedRecordArrays = [];
      },

      recordDidChange: function(record) {
        if (this.changedRecords.push(record) !== 1) { return; }

        Ember.run.schedule('actions', this, this.updateRecordArrays);
      },

      recordArraysForRecord: function(record) {
        record._recordArrays = record._recordArrays || ember$data$lib$system$ordered$set$$default.create();
        return record._recordArrays;
      },

      /**
        This method is invoked whenever data is loaded into the store by the
        adapter or updated by the adapter, or when a record has changed.

        It updates all record arrays that a record belongs to.

        To avoid thrashing, it only runs at most once per run loop.

        @method updateRecordArrays
      */
      updateRecordArrays: function() {
        ember$data$lib$system$record$array$manager$$forEach(this.changedRecords, function(record) {
          if (ember$data$lib$system$record$array$manager$$get(record, 'isDeleted')) {
            this._recordWasDeleted(record);
          } else {
            this._recordWasChanged(record);
          }
        }, this);

        this.changedRecords.length = 0;
      },

      _recordWasDeleted: function (record) {
        var recordArrays = record._recordArrays;

        if (!recordArrays) { return; }

        recordArrays.forEach(function(array) {
          array.removeRecord(record);
        });

        record._recordArrays = null;
      },


      //Don't need to update non filtered arrays on simple changes
      _recordWasChanged: function (record) {
        var typeClass = record.constructor;
        var recordArrays = this.filteredRecordArrays.get(typeClass);
        var filter;

        ember$data$lib$system$record$array$manager$$forEach(recordArrays, function(array) {
          filter = ember$data$lib$system$record$array$manager$$get(array, 'filterFunction');
          if (filter) {
            this.updateRecordArray(array, filter, typeClass, record);
          }
        }, this);
      },

      //Need to update live arrays on loading
      recordWasLoaded: function(record) {
        var typeClass = record.constructor;
        var recordArrays = this.filteredRecordArrays.get(typeClass);
        var filter;

        ember$data$lib$system$record$array$manager$$forEach(recordArrays, function(array) {
          filter = ember$data$lib$system$record$array$manager$$get(array, 'filterFunction');
          this.updateRecordArray(array, filter, typeClass, record);
        }, this);
      },
      /**
        Update an individual filter.

        @method updateRecordArray
        @param {DS.FilteredRecordArray} array
        @param {Function} filter
        @param {subclass of DS.Model} typeClass
        @param {Number|String} clientId
      */
      updateRecordArray: function(array, filter, typeClass, record) {
        var shouldBeInArray;

        if (!filter) {
          shouldBeInArray = true;
        } else {
          shouldBeInArray = filter(record);
        }

        var recordArrays = this.recordArraysForRecord(record);

        if (shouldBeInArray) {
          if (!recordArrays.has(array)) {
            array._pushRecord(record);
            recordArrays.add(array);
          }
        } else if (!shouldBeInArray) {
          recordArrays["delete"](array);
          array.removeRecord(record);
        }
      },

      /**
        This method is invoked if the `filterFunction` property is
        changed on a `DS.FilteredRecordArray`.

        It essentially re-runs the filter from scratch. This same
        method is invoked when the filter is created in th first place.

        @method updateFilter
        @param {Array} array
        @param {String} modelName
        @param {Function} filter
      */
      updateFilter: function(array, modelName, filter) {
        var typeMap = this.store.typeMapFor(modelName);
        var records = typeMap.records;
        var record;

        for (var i = 0, l = records.length; i < l; i++) {
          record = records[i];

          if (!ember$data$lib$system$record$array$manager$$get(record, 'isDeleted') && !ember$data$lib$system$record$array$manager$$get(record, 'isEmpty')) {
            this.updateRecordArray(array, filter, modelName, record);
          }
        }
      },

      /**
        Create a `DS.RecordArray` for a type and register it for updates.

        @method createRecordArray
        @param {Class} typeClass
        @return {DS.RecordArray}
      */
      createRecordArray: function(typeClass) {
        var array = ember$data$lib$system$record$arrays$record$array$$default.create({
          type: typeClass,
          content: Ember.A(),
          store: this.store,
          isLoaded: true,
          manager: this
        });

        this.registerFilteredRecordArray(array, typeClass);

        return array;
      },

      /**
        Create a `DS.FilteredRecordArray` for a type and register it for updates.

        @method createFilteredRecordArray
        @param {subclass of DS.Model} typeClass
        @param {Function} filter
        @param {Object} query (optional
        @return {DS.FilteredRecordArray}
      */
      createFilteredRecordArray: function(typeClass, filter, query) {
        var array = ember$data$lib$system$record$arrays$filtered$record$array$$default.create({
          query: query,
          type: typeClass,
          content: Ember.A(),
          store: this.store,
          manager: this,
          filterFunction: filter
        });

        this.registerFilteredRecordArray(array, typeClass, filter);

        return array;
      },

      /**
        Create a `DS.AdapterPopulatedRecordArray` for a type with given query.

        @method createAdapterPopulatedRecordArray
        @param {subclass of DS.Model} typeClass
        @param {Object} query
        @return {DS.AdapterPopulatedRecordArray}
      */
      createAdapterPopulatedRecordArray: function(typeClass, query) {
        var array = ember$data$lib$system$record$arrays$adapter$populated$record$array$$default.create({
          type: typeClass,
          query: query,
          content: Ember.A(),
          store: this.store,
          manager: this
        });

        this._adapterPopulatedRecordArrays.push(array);

        return array;
      },

      /**
        Register a RecordArray for a given type to be backed by
        a filter function. This will cause the array to update
        automatically when records of that type change attribute
        values or states.

        @method registerFilteredRecordArray
        @param {DS.RecordArray} array
        @param {subclass of DS.Model} typeClass
        @param {Function} filter
      */
      registerFilteredRecordArray: function(array, typeClass, filter) {
        var recordArrays = this.filteredRecordArrays.get(typeClass);
        recordArrays.push(array);

        this.updateFilter(array, typeClass, filter);
      },

      /**
        Unregister a FilteredRecordArray.
        So manager will not update this array.

        @method unregisterFilteredRecordArray
        @param {DS.RecordArray} array
      */
      unregisterFilteredRecordArray: function(array) {
        var recordArrays = this.filteredRecordArrays.get(array.type);
        var index = ember$data$lib$system$record$array$manager$$indexOf(recordArrays, array);
        recordArrays.splice(index, 1);
      },

      willDestroy: function() {
        this._super.apply(this, arguments);

        this.filteredRecordArrays.forEach(function(value) {
          ember$data$lib$system$record$array$manager$$forEach(ember$data$lib$system$record$array$manager$$flatten(value), ember$data$lib$system$record$array$manager$$destroy);
        });
        ember$data$lib$system$record$array$manager$$forEach(this._adapterPopulatedRecordArrays, ember$data$lib$system$record$array$manager$$destroy);
      }
    });

    function ember$data$lib$system$record$array$manager$$destroy(entry) {
      entry.destroy();
    }

    function ember$data$lib$system$record$array$manager$$flatten(list) {
      var length = list.length;
      var result = Ember.A();

      for (var i = 0; i < length; i++) {
        result = result.concat(list[i]);
      }

      return result;
    }

    var ember$data$lib$system$model$states$$get = Ember.get;
    var ember$data$lib$system$model$states$$set = Ember.set;
    /*
      This file encapsulates the various states that a record can transition
      through during its lifecycle.
    */
    /**
      ### State

      Each record has a `currentState` property that explicitly tracks what
      state a record is in at any given time. For instance, if a record is
      newly created and has not yet been sent to the adapter to be saved,
      it would be in the `root.loaded.created.uncommitted` state.  If a
      record has had local modifications made to it that are in the
      process of being saved, the record would be in the
      `root.loaded.updated.inFlight` state. (This state paths will be
      explained in more detail below.)

      Events are sent by the record or its store to the record's
      `currentState` property. How the state reacts to these events is
      dependent on which state it is in. In some states, certain events
      will be invalid and will cause an exception to be raised.

      States are hierarchical and every state is a substate of the
      `RootState`. For example, a record can be in the
      `root.deleted.uncommitted` state, then transition into the
      `root.deleted.inFlight` state. If a child state does not implement
      an event handler, the state manager will attempt to invoke the event
      on all parent states until the root state is reached. The state
      hierarchy of a record is described in terms of a path string. You
      can determine a record's current state by getting the state's
      `stateName` property:

      ```javascript
      record.get('currentState.stateName');
      //=> "root.created.uncommitted"
       ```

      The hierarchy of valid states that ship with ember data looks like
      this:

      ```text
      * root
        * deleted
          * saved
          * uncommitted
          * inFlight
        * empty
        * loaded
          * created
            * uncommitted
            * inFlight
          * saved
          * updated
            * uncommitted
            * inFlight
        * loading
      ```

      The `DS.Model` states are themselves stateless. What that means is
      that, the hierarchical states that each of *those* points to is a
      shared data structure. For performance reasons, instead of each
      record getting its own copy of the hierarchy of states, each record
      points to this global, immutable shared instance. How does a state
      know which record it should be acting on? We pass the record
      instance into the state's event handlers as the first argument.

      The record passed as the first parameter is where you should stash
      state about the record if needed; you should never store data on the state
      object itself.

      ### Events and Flags

      A state may implement zero or more events and flags.

      #### Events

      Events are named functions that are invoked when sent to a record. The
      record will first look for a method with the given name on the
      current state. If no method is found, it will search the current
      state's parent, and then its grandparent, and so on until reaching
      the top of the hierarchy. If the root is reached without an event
      handler being found, an exception will be raised. This can be very
      helpful when debugging new features.

      Here's an example implementation of a state with a `myEvent` event handler:

      ```javascript
      aState: DS.State.create({
        myEvent: function(manager, param) {
          console.log("Received myEvent with", param);
        }
      })
      ```

      To trigger this event:

      ```javascript
      record.send('myEvent', 'foo');
      //=> "Received myEvent with foo"
      ```

      Note that an optional parameter can be sent to a record's `send()` method,
      which will be passed as the second parameter to the event handler.

      Events should transition to a different state if appropriate. This can be
      done by calling the record's `transitionTo()` method with a path to the
      desired state. The state manager will attempt to resolve the state path
      relative to the current state. If no state is found at that path, it will
      attempt to resolve it relative to the current state's parent, and then its
      parent, and so on until the root is reached. For example, imagine a hierarchy
      like this:

          * created
            * uncommitted <-- currentState
            * inFlight
          * updated
            * inFlight

      If we are currently in the `uncommitted` state, calling
      `transitionTo('inFlight')` would transition to the `created.inFlight` state,
      while calling `transitionTo('updated.inFlight')` would transition to
      the `updated.inFlight` state.

      Remember that *only events* should ever cause a state transition. You should
      never call `transitionTo()` from outside a state's event handler. If you are
      tempted to do so, create a new event and send that to the state manager.

      #### Flags

      Flags are Boolean values that can be used to introspect a record's current
      state in a more user-friendly way than examining its state path. For example,
      instead of doing this:

      ```javascript
      var statePath = record.get('stateManager.currentPath');
      if (statePath === 'created.inFlight') {
        doSomething();
      }
      ```

      You can say:

      ```javascript
      if (record.get('isNew') && record.get('isSaving')) {
        doSomething();
      }
      ```

      If your state does not set a value for a given flag, the value will
      be inherited from its parent (or the first place in the state hierarchy
      where it is defined).

      The current set of flags are defined below. If you want to add a new flag,
      in addition to the area below, you will also need to declare it in the
      `DS.Model` class.


       * [isEmpty](DS.Model.html#property_isEmpty)
       * [isLoading](DS.Model.html#property_isLoading)
       * [isLoaded](DS.Model.html#property_isLoaded)
       * [isDirty](DS.Model.html#property_isDirty)
       * [isSaving](DS.Model.html#property_isSaving)
       * [isDeleted](DS.Model.html#property_isDeleted)
       * [isNew](DS.Model.html#property_isNew)
       * [isValid](DS.Model.html#property_isValid)

      @namespace DS
      @class RootState
    */

    function ember$data$lib$system$model$states$$didSetProperty(record, context) {
      if (context.value === context.originalValue) {
        delete record._attributes[context.name];
        record.send('propertyWasReset', context.name);
      } else if (context.value !== context.oldValue) {
        record.send('becomeDirty');
      }

      record.updateRecordArraysLater();
    }

    // Implementation notes:
    //
    // Each state has a boolean value for all of the following flags:
    //
    // * isLoaded: The record has a populated `data` property. When a
    //   record is loaded via `store.find`, `isLoaded` is false
    //   until the adapter sets it. When a record is created locally,
    //   its `isLoaded` property is always true.
    // * isDirty: The record has local changes that have not yet been
    //   saved by the adapter. This includes records that have been
    //   created (but not yet saved) or deleted.
    // * isSaving: The record has been committed, but
    //   the adapter has not yet acknowledged that the changes have
    //   been persisted to the backend.
    // * isDeleted: The record was marked for deletion. When `isDeleted`
    //   is true and `isDirty` is true, the record is deleted locally
    //   but the deletion was not yet persisted. When `isSaving` is
    //   true, the change is in-flight. When both `isDirty` and
    //   `isSaving` are false, the change has persisted.
    // * isError: The adapter reported that it was unable to save
    //   local changes to the backend. This may also result in the
    //   record having its `isValid` property become false if the
    //   adapter reported that server-side validations failed.
    // * isNew: The record was created on the client and the adapter
    //   did not yet report that it was successfully saved.
    // * isValid: The adapter did not report any server-side validation
    //   failures.

    // The dirty state is a abstract state whose functionality is
    // shared between the `created` and `updated` states.
    //
    // The deleted state shares the `isDirty` flag with the
    // subclasses of `DirtyState`, but with a very different
    // implementation.
    //
    // Dirty states have three child states:
    //
    // `uncommitted`: the store has not yet handed off the record
    //   to be saved.
    // `inFlight`: the store has handed off the record to be saved,
    //   but the adapter has not yet acknowledged success.
    // `invalid`: the record has invalid information and cannot be
    //   send to the adapter yet.
    var ember$data$lib$system$model$states$$DirtyState = {
      initialState: 'uncommitted',

      // FLAGS
      isDirty: true,

      // SUBSTATES

      // When a record first becomes dirty, it is `uncommitted`.
      // This means that there are local pending changes, but they
      // have not yet begun to be saved, and are not invalid.
      uncommitted: {
        // EVENTS
        didSetProperty: ember$data$lib$system$model$states$$didSetProperty,

        //TODO(Igor) reloading now triggers a
        //loadingData event, though it seems fine?
        loadingData: Ember.K,

        propertyWasReset: function(record, name) {
          var length = Ember.keys(record._attributes).length;
          var stillDirty = length > 0;

          if (!stillDirty) { record.send('rolledBack'); }
        },

        pushedData: Ember.K,

        becomeDirty: Ember.K,

        willCommit: function(record) {
          record.transitionTo('inFlight');
        },

        reloadRecord: function(record, resolve) {
          resolve(ember$data$lib$system$model$states$$get(record, 'store').reloadRecord(record));
        },

        rolledBack: function(record) {
          record.transitionTo('loaded.saved');
        },

        becameInvalid: function(record) {
          record.transitionTo('invalid');
        },

        rollback: function(record) {
          record.rollback();
          record.triggerLater('ready');
        }
      },

      // Once a record has been handed off to the adapter to be
      // saved, it is in the 'in flight' state. Changes to the
      // record cannot be made during this window.
      inFlight: {
        // FLAGS
        isSaving: true,

        // EVENTS
        didSetProperty: ember$data$lib$system$model$states$$didSetProperty,
        becomeDirty: Ember.K,
        pushedData: Ember.K,

        unloadRecord: function(record) {
          Ember.assert("You can only unload a record which is not inFlight. `" + Ember.inspect(record) + " `", false);
        },

        // TODO: More robust semantics around save-while-in-flight
        willCommit: Ember.K,

        didCommit: function(record) {
          var dirtyType = ember$data$lib$system$model$states$$get(this, 'dirtyType');

          record.transitionTo('saved');
          record.send('invokeLifecycleCallbacks', dirtyType);
        },

        becameInvalid: function(record) {
          record.transitionTo('invalid');
          record.send('invokeLifecycleCallbacks');
        },

        becameError: function(record) {
          record.transitionTo('uncommitted');
          record.triggerLater('becameError', record);
        }
      },

      // A record is in the `invalid` if the adapter has indicated
      // the the record failed server-side invalidations.
      invalid: {
        // FLAGS
        isValid: false,

        // EVENTS
        deleteRecord: function(record) {
          record.transitionTo('deleted.uncommitted');
          record.disconnectRelationships();
        },

        didSetProperty: function(record, context) {
          ember$data$lib$system$model$states$$get(record, 'errors').remove(context.name);

          ember$data$lib$system$model$states$$didSetProperty(record, context);
        },

        becomeDirty: Ember.K,

        willCommit: function(record) {
          ember$data$lib$system$model$states$$get(record, 'errors').clear();
          record.transitionTo('inFlight');
        },

        rolledBack: function(record) {
          ember$data$lib$system$model$states$$get(record, 'errors').clear();
          record.triggerLater('ready');
        },

        becameValid: function(record) {
          record.transitionTo('uncommitted');
        },

        invokeLifecycleCallbacks: function(record) {
          record.triggerLater('becameInvalid', record);
        },

        exit: function(record) {
          record._inFlightAttributes = {};
        }
      }
    };

    // The created and updated states are created outside the state
    // chart so we can reopen their substates and add mixins as
    // necessary.

    function ember$data$lib$system$model$states$$deepClone(object) {
      var clone = {};
      var value;

      for (var prop in object) {
        value = object[prop];
        if (value && typeof value === 'object') {
          clone[prop] = ember$data$lib$system$model$states$$deepClone(value);
        } else {
          clone[prop] = value;
        }
      }

      return clone;
    }

    function ember$data$lib$system$model$states$$mixin(original, hash) {
      for (var prop in hash) {
        original[prop] = hash[prop];
      }

      return original;
    }

    function ember$data$lib$system$model$states$$dirtyState(options) {
      var newState = ember$data$lib$system$model$states$$deepClone(ember$data$lib$system$model$states$$DirtyState);
      return ember$data$lib$system$model$states$$mixin(newState, options);
    }

    var ember$data$lib$system$model$states$$createdState = ember$data$lib$system$model$states$$dirtyState({
      dirtyType: 'created',
      // FLAGS
      isNew: true
    });

    ember$data$lib$system$model$states$$createdState.uncommitted.rolledBack = function(record) {
      record.transitionTo('deleted.saved');
    };

    var ember$data$lib$system$model$states$$updatedState = ember$data$lib$system$model$states$$dirtyState({
      dirtyType: 'updated'
    });

    ember$data$lib$system$model$states$$createdState.uncommitted.deleteRecord = function(record) {
      record.disconnectRelationships();
      record.transitionTo('deleted.saved');
      record.send('invokeLifecycleCallbacks');
    };

    ember$data$lib$system$model$states$$createdState.uncommitted.rollback = function(record) {
      ember$data$lib$system$model$states$$DirtyState.uncommitted.rollback.apply(this, arguments);
      record.transitionTo('deleted.saved');
    };

    ember$data$lib$system$model$states$$createdState.uncommitted.pushedData = function(record) {
      record.transitionTo('loaded.updated.uncommitted');
      record.triggerLater('didLoad');
    };

    ember$data$lib$system$model$states$$createdState.uncommitted.propertyWasReset = Ember.K;

    function ember$data$lib$system$model$states$$assertAgainstUnloadRecord(record) {
      Ember.assert("You can only unload a record which is not inFlight. `" + Ember.inspect(record) + "`", false);
    }

    ember$data$lib$system$model$states$$updatedState.inFlight.unloadRecord = ember$data$lib$system$model$states$$assertAgainstUnloadRecord;

    ember$data$lib$system$model$states$$updatedState.uncommitted.deleteRecord = function(record) {
      record.transitionTo('deleted.uncommitted');
      record.disconnectRelationships();
    };

    var ember$data$lib$system$model$states$$RootState = {
      // FLAGS
      isEmpty: false,
      isLoading: false,
      isLoaded: false,
      isDirty: false,
      isSaving: false,
      isDeleted: false,
      isNew: false,
      isValid: true,

      // DEFAULT EVENTS

      // Trying to roll back if you're not in the dirty state
      // doesn't change your state. For example, if you're in the
      // in-flight state, rolling back the record doesn't move
      // you out of the in-flight state.
      rolledBack: Ember.K,
      unloadRecord: function(record) {
        // clear relationships before moving to deleted state
        // otherwise it fails
        record.clearRelationships();
        record.transitionTo('deleted.saved');
      },


      propertyWasReset: Ember.K,

      // SUBSTATES

      // A record begins its lifecycle in the `empty` state.
      // If its data will come from the adapter, it will
      // transition into the `loading` state. Otherwise, if
      // the record is being created on the client, it will
      // transition into the `created` state.
      empty: {
        isEmpty: true,

        // EVENTS
        loadingData: function(record, promise) {
          record._loadingPromise = promise;
          record.transitionTo('loading');
        },

        loadedData: function(record) {
          record.transitionTo('loaded.created.uncommitted');
          record.triggerLater('ready');
        },

        pushedData: function(record) {
          record.transitionTo('loaded.saved');
          record.triggerLater('didLoad');
          record.triggerLater('ready');
        }
      },

      // A record enters this state when the store asks
      // the adapter for its data. It remains in this state
      // until the adapter provides the requested data.
      //
      // Usually, this process is asynchronous, using an
      // XHR to retrieve the data.
      loading: {
        // FLAGS
        isLoading: true,

        exit: function(record) {
          record._loadingPromise = null;
        },

        // EVENTS
        pushedData: function(record) {
          record.transitionTo('loaded.saved');
          record.triggerLater('didLoad');
          record.triggerLater('ready');
          ember$data$lib$system$model$states$$set(record, 'isError', false);
        },

        becameError: function(record) {
          record.triggerLater('becameError', record);
        },

        notFound: function(record) {
          record.transitionTo('empty');
        }
      },

      // A record enters this state when its data is populated.
      // Most of a record's lifecycle is spent inside substates
      // of the `loaded` state.
      loaded: {
        initialState: 'saved',

        // FLAGS
        isLoaded: true,

        //TODO(Igor) Reloading now triggers a loadingData event,
        //but it should be ok?
        loadingData: Ember.K,

        // SUBSTATES

        // If there are no local changes to a record, it remains
        // in the `saved` state.
        saved: {
          setup: function(record) {
            var attrs = record._attributes;
            var isDirty = Ember.keys(attrs).length > 0;

            if (isDirty) {
              record.adapterDidDirty();
            }
          },

          // EVENTS
          didSetProperty: ember$data$lib$system$model$states$$didSetProperty,

          pushedData: Ember.K,

          becomeDirty: function(record) {
            record.transitionTo('updated.uncommitted');
          },

          willCommit: function(record) {
            record.transitionTo('updated.inFlight');
          },

          reloadRecord: function(record, resolve) {
            resolve(ember$data$lib$system$model$states$$get(record, 'store').reloadRecord(record));
          },

          deleteRecord: function(record) {
            record.transitionTo('deleted.uncommitted');
            record.disconnectRelationships();
          },

          unloadRecord: function(record) {
            // clear relationships before moving to deleted state
            // otherwise it fails
            record.clearRelationships();
            record.transitionTo('deleted.saved');
          },

          didCommit: function(record) {
            record.send('invokeLifecycleCallbacks', ember$data$lib$system$model$states$$get(record, 'lastDirtyType'));
          },

          // loaded.saved.notFound would be triggered by a failed
          // `reload()` on an unchanged record
          notFound: Ember.K

        },

        // A record is in this state after it has been locally
        // created but before the adapter has indicated that
        // it has been saved.
        created: ember$data$lib$system$model$states$$createdState,

        // A record is in this state if it has already been
        // saved to the server, but there are new local changes
        // that have not yet been saved.
        updated: ember$data$lib$system$model$states$$updatedState
      },

      // A record is in this state if it was deleted from the store.
      deleted: {
        initialState: 'uncommitted',
        dirtyType: 'deleted',

        // FLAGS
        isDeleted: true,
        isLoaded: true,
        isDirty: true,

        // TRANSITIONS
        setup: function(record) {
          record.updateRecordArrays();
        },

        // SUBSTATES

        // When a record is deleted, it enters the `start`
        // state. It will exit this state when the record
        // starts to commit.
        uncommitted: {

          // EVENTS

          willCommit: function(record) {
            record.transitionTo('inFlight');
          },

          rollback: function(record) {
            record.rollback();
            record.triggerLater('ready');
          },

          pushedData: Ember.K,
          becomeDirty: Ember.K,
          deleteRecord: Ember.K,

          rolledBack: function(record) {
            record.transitionTo('loaded.saved');
            record.triggerLater('ready');
          }
        },

        // After a record starts committing, but
        // before the adapter indicates that the deletion
        // has saved to the server, a record is in the
        // `inFlight` substate of `deleted`.
        inFlight: {
          // FLAGS
          isSaving: true,

          // EVENTS

          unloadRecord: ember$data$lib$system$model$states$$assertAgainstUnloadRecord,

          // TODO: More robust semantics around save-while-in-flight
          willCommit: Ember.K,
          didCommit: function(record) {
            record.transitionTo('saved');

            record.send('invokeLifecycleCallbacks');
          },

          becameError: function(record) {
            record.transitionTo('uncommitted');
            record.triggerLater('becameError', record);
          },

          becameInvalid: function(record) {
            record.transitionTo('invalid');
            record.triggerLater('becameInvalid', record);
          }
        },

        // Once the adapter indicates that the deletion has
        // been saved, the record enters the `saved` substate
        // of `deleted`.
        saved: {
          // FLAGS
          isDirty: false,

          setup: function(record) {
            var store = ember$data$lib$system$model$states$$get(record, 'store');
            store._dematerializeRecord(record);
          },

          invokeLifecycleCallbacks: function(record) {
            record.triggerLater('didDelete', record);
            record.triggerLater('didCommit', record);
          },

          willCommit: Ember.K,

          didCommit: Ember.K
        },

        invalid: {
          isValid: false,

          didSetProperty: function(record, context) {
            ember$data$lib$system$model$states$$get(record, 'errors').remove(context.name);

            ember$data$lib$system$model$states$$didSetProperty(record, context);
          },

          deleteRecord: Ember.K,
          becomeDirty: Ember.K,
          willCommit: Ember.K,


          rolledBack: function(record) {
            ember$data$lib$system$model$states$$get(record, 'errors').clear();
            record.transitionTo('loaded.saved');
            record.triggerLater('ready');
          },

          becameValid: function(record) {
            record.transitionTo('uncommitted');
          }

        }
      },

      invokeLifecycleCallbacks: function(record, dirtyType) {
        if (dirtyType === 'created') {
          record.triggerLater('didCreate', record);
        } else {
          record.triggerLater('didUpdate', record);
        }

        record.triggerLater('didCommit', record);
      }
    };

    function ember$data$lib$system$model$states$$wireState(object, parent, name) {
      /*jshint proto:true*/
      // TODO: Use Object.create and copy instead
      object = ember$data$lib$system$model$states$$mixin(parent ? Ember.create(parent) : {}, object);
      object.parentState = parent;
      object.stateName = name;

      for (var prop in object) {
        if (!object.hasOwnProperty(prop) || prop === 'parentState' || prop === 'stateName') { continue; }
        if (typeof object[prop] === 'object') {
          object[prop] = ember$data$lib$system$model$states$$wireState(object[prop], object, name + "." + prop);
        }
      }

      return object;
    }

    ember$data$lib$system$model$states$$RootState = ember$data$lib$system$model$states$$wireState(ember$data$lib$system$model$states$$RootState, null, "root");

    var ember$data$lib$system$model$states$$default = ember$data$lib$system$model$states$$RootState;
    var ember$data$lib$system$model$errors$$get = Ember.get;
    var ember$data$lib$system$model$errors$$isEmpty = Ember.isEmpty;
    var ember$data$lib$system$model$errors$$map = Ember.EnumerableUtils.map;

    var ember$data$lib$system$model$errors$$default = Ember.Object.extend(Ember.Enumerable, Ember.Evented, {
      /**
        Register with target handler

        @method registerHandlers
        @param {Object} target
        @param {Function} becameInvalid
        @param {Function} becameValid
      */
      registerHandlers: function(target, becameInvalid, becameValid) {
        this.on('becameInvalid', target, becameInvalid);
        this.on('becameValid', target, becameValid);
      },

      /**
        @property errorsByAttributeName
        @type {Ember.MapWithDefault}
        @private
      */
      errorsByAttributeName: Ember.reduceComputed("content", {
        initialValue: function() {
          return ember$data$lib$system$map$$MapWithDefault.create({
            defaultValue: function() {
              return Ember.A();
            }
          });
        },

        addedItem: function(errors, error) {
          errors.get(error.attribute).pushObject(error);

          return errors;
        },

        removedItem: function(errors, error) {
          errors.get(error.attribute).removeObject(error);

          return errors;
        }
      }),

      /**
        Returns errors for a given attribute

        ```javascript
        var user = store.createRecord('user', {
          username: 'tomster',
          email: 'invalidEmail'
        });
        user.save().catch(function(){
          user.get('errors').errorsFor('email'); // returns:
          // [{attribute: "email", message: "Doesn't look like a valid email."}]
        });
        ```

        @method errorsFor
        @param {String} attribute
        @return {Array}
      */
      errorsFor: function(attribute) {
        return ember$data$lib$system$model$errors$$get(this, 'errorsByAttributeName').get(attribute);
      },

      /**
        An array containing all of the error messages for this
        record. This is useful for displaying all errors to the user.

        ```handlebars
        {{#each model.errors.messages as |message|}}
          <div class="error">
            {{message}}
          </div>
        {{/each}}
        ```

        @property messages
        @type {Array}
      */
      messages: Ember.computed.mapBy('content', 'message'),

      /**
        @property content
        @type {Array}
        @private
      */
      content: Ember.computed(function() {
        return Ember.A();
      }),

      /**
        @method unknownProperty
        @private
      */
      unknownProperty: function(attribute) {
        var errors = this.errorsFor(attribute);
        if (ember$data$lib$system$model$errors$$isEmpty(errors)) { return null; }
        return errors;
      },

      /**
        @method nextObject
        @private
      */
      nextObject: function(index, previousObject, context) {
        return ember$data$lib$system$model$errors$$get(this, 'content').objectAt(index);
      },

      /**
        Total number of errors.

        @property length
        @type {Number}
        @readOnly
      */
      length: Ember.computed.oneWay('content.length').readOnly(),

      /**
        @property isEmpty
        @type {Boolean}
        @readOnly
      */
      isEmpty: Ember.computed.not('length').readOnly(),

      /**
        Adds error messages to a given attribute and sends
        `becameInvalid` event to the record.

        Example:

        ```javascript
        if (!user.get('username') {
          user.get('errors').add('username', 'This field is required');
        }
        ```

        @method add
        @param {String} attribute
        @param {Array|String} messages
      */
      add: function(attribute, messages) {
        var wasEmpty = ember$data$lib$system$model$errors$$get(this, 'isEmpty');

        messages = this._findOrCreateMessages(attribute, messages);
        ember$data$lib$system$model$errors$$get(this, 'content').addObjects(messages);

        this.notifyPropertyChange(attribute);
        this.enumerableContentDidChange();

        if (wasEmpty && !ember$data$lib$system$model$errors$$get(this, 'isEmpty')) {
          this.trigger('becameInvalid');
        }
      },

      /**
        @method _findOrCreateMessages
        @private
      */
      _findOrCreateMessages: function(attribute, messages) {
        var errors = this.errorsFor(attribute);

        return ember$data$lib$system$model$errors$$map(Ember.makeArray(messages), function(message) {
          return errors.findBy('message', message) || {
            attribute: attribute,
            message: message
          };
        });
      },

      /**
        Removes all error messages from the given attribute and sends
        `becameValid` event to the record if there no more errors left.

        Example:

        ```javascript
        App.User = DS.Model.extend({
          email: DS.attr('string'),
          twoFactorAuth: DS.attr('boolean'),
          phone: DS.attr('string')
        });

        App.UserEditRoute = Ember.Route.extend({
          actions: {
            save: function(user) {
               if (!user.get('twoFactorAuth')) {
                 user.get('errors').remove('phone');
               }
               user.save();
             }
          }
        });
        ```

        @method remove
        @param {String} attribute
      */
      remove: function(attribute) {
        if (ember$data$lib$system$model$errors$$get(this, 'isEmpty')) { return; }

        var content = ember$data$lib$system$model$errors$$get(this, 'content').rejectBy('attribute', attribute);
        ember$data$lib$system$model$errors$$get(this, 'content').setObjects(content);

        this.notifyPropertyChange(attribute);
        this.enumerableContentDidChange();

        if (ember$data$lib$system$model$errors$$get(this, 'isEmpty')) {
          this.trigger('becameValid');
        }
      },

      /**
        Removes all error messages and sends `becameValid` event
        to the record.

        Example:

        ```javascript
        App.UserEditRoute = Ember.Route.extend({
          actions: {
            retrySave: function(user) {
               user.get('errors').clear();
               user.save();
             }
          }
        });
        ```

        @method clear
      */
      clear: function() {
        if (ember$data$lib$system$model$errors$$get(this, 'isEmpty')) { return; }

        ember$data$lib$system$model$errors$$get(this, 'content').clear();
        this.enumerableContentDidChange();

        this.trigger('becameValid');
      },

      /**
        Checks if there is error messages for the given attribute.

        ```javascript
        App.UserEditRoute = Ember.Route.extend({
          actions: {
            save: function(user) {
               if (user.get('errors').has('email')) {
                 return alert('Please update your email before attempting to save.');
               }
               user.save();
             }
          }
        });
        ```

        @method has
        @param {String} attribute
        @return {Boolean} true if there some errors on given attribute
      */
      has: function(attribute) {
        return !ember$data$lib$system$model$errors$$isEmpty(this.errorsFor(attribute));
      }
    });

    function ember$data$lib$system$merge$$merge(original, updates) {
      if (!updates || typeof updates !== 'object') {
        return original;
      }

      var props = Ember.keys(updates);
      var prop;
      var length = props.length;

      for (var i = 0; i < length; i++) {
        prop = props[i];
        original[prop] = updates[prop];
      }

      return original;
    }

    var ember$data$lib$system$merge$$default = ember$data$lib$system$merge$$merge;

    var ember$data$lib$system$relationships$state$relationship$$forEach = Ember.EnumerableUtils.forEach;

    var ember$data$lib$system$relationships$state$relationship$$Relationship = function(store, record, inverseKey, relationshipMeta) {
      this.members = new ember$data$lib$system$ordered$set$$default();
      this.canonicalMembers = new ember$data$lib$system$ordered$set$$default();
      this.store = store;
      this.key = relationshipMeta.key;
      this.inverseKey = inverseKey;
      this.record = record;
      this.isAsync = relationshipMeta.options.async;
      this.relationshipMeta = relationshipMeta;
      //This probably breaks for polymorphic relationship in complex scenarios, due to
      //multiple possible modelNames
      this.inverseKeyForImplicit = this.store.modelFor(this.record.constructor).modelName + this.key;
      this.linkPromise = null;
      this.hasData = false;
    };

    ember$data$lib$system$relationships$state$relationship$$Relationship.prototype = {
      constructor: ember$data$lib$system$relationships$state$relationship$$Relationship,

      destroy: Ember.K,

      clear: function() {
        var members = this.members.list;
        var member;

        while (members.length > 0) {
          member = members[0];
          this.removeRecord(member);
        }
      },

      disconnect: function() {
        this.members.forEach(function(member) {
          this.removeRecordFromInverse(member);
        }, this);
      },

      reconnect: function() {
        this.members.forEach(function(member) {
          this.addRecordToInverse(member);
        }, this);
      },

      removeRecords: function(records) {
        var self = this;
        ember$data$lib$system$relationships$state$relationship$$forEach(records, function(record) {
          self.removeRecord(record);
        });
      },

      addRecords: function(records, idx) {
        var self = this;
        ember$data$lib$system$relationships$state$relationship$$forEach(records, function(record) {
          self.addRecord(record, idx);
          if (idx !== undefined) {
            idx++;
          }
        });
      },

      addCanonicalRecords: function(records, idx) {
        for (var i=0; i<records.length; i++) {
          if (idx !== undefined) {
            this.addCanonicalRecord(records[i], i+idx);
          } else {
            this.addCanonicalRecord(records[i]);
          }
        }
      },

      addCanonicalRecord: function(record, idx) {
        if (!this.canonicalMembers.has(record)) {
          this.canonicalMembers.add(record);
          if (this.inverseKey) {
            record._relationships[this.inverseKey].addCanonicalRecord(this.record);
          } else {
            if (!record._implicitRelationships[this.inverseKeyForImplicit]) {
              record._implicitRelationships[this.inverseKeyForImplicit] = new ember$data$lib$system$relationships$state$relationship$$Relationship(this.store, record, this.key,  { options: {} });
            }
            record._implicitRelationships[this.inverseKeyForImplicit].addCanonicalRecord(this.record);
          }
        }
        this.flushCanonicalLater();
        this.setHasData(true);
      },

      removeCanonicalRecords: function(records, idx) {
        for (var i=0; i<records.length; i++) {
          if (idx !== undefined) {
            this.removeCanonicalRecord(records[i], i+idx);
          } else {
            this.removeCanonicalRecord(records[i]);
          }
        }
      },

      removeCanonicalRecord: function(record, idx) {
        if (this.canonicalMembers.has(record)) {
          this.removeCanonicalRecordFromOwn(record);
          if (this.inverseKey) {
            this.removeCanonicalRecordFromInverse(record);
          } else {
            if (record._implicitRelationships[this.inverseKeyForImplicit]) {
              record._implicitRelationships[this.inverseKeyForImplicit].removeCanonicalRecord(this.record);
            }
          }
        }
        this.flushCanonicalLater();
      },

      addRecord: function(record, idx) {
        if (!this.members.has(record)) {
          this.members.addWithIndex(record, idx);
          this.notifyRecordRelationshipAdded(record, idx);
          if (this.inverseKey) {
            record._relationships[this.inverseKey].addRecord(this.record);
          } else {
            if (!record._implicitRelationships[this.inverseKeyForImplicit]) {
              record._implicitRelationships[this.inverseKeyForImplicit] = new ember$data$lib$system$relationships$state$relationship$$Relationship(this.store, record, this.key,  { options: {} });
            }
            record._implicitRelationships[this.inverseKeyForImplicit].addRecord(this.record);
          }
          this.record.updateRecordArraysLater();
        }
        this.setHasData(true);
      },

      removeRecord: function(record) {
        if (this.members.has(record)) {
          this.removeRecordFromOwn(record);
          if (this.inverseKey) {
            this.removeRecordFromInverse(record);
          } else {
            if (record._implicitRelationships[this.inverseKeyForImplicit]) {
              record._implicitRelationships[this.inverseKeyForImplicit].removeRecord(this.record);
            }
          }
        }
      },

      addRecordToInverse: function(record) {
        if (this.inverseKey) {
          record._relationships[this.inverseKey].addRecord(this.record);
        }
      },

      removeRecordFromInverse: function(record) {
        var inverseRelationship = record._relationships[this.inverseKey];
        //Need to check for existence, as the record might unloading at the moment
        if (inverseRelationship) {
          inverseRelationship.removeRecordFromOwn(this.record);
        }
      },

      removeRecordFromOwn: function(record) {
        this.members["delete"](record);
        this.notifyRecordRelationshipRemoved(record);
        this.record.updateRecordArrays();
      },

      removeCanonicalRecordFromInverse: function(record) {
        var inverseRelationship = record._relationships[this.inverseKey];
        //Need to check for existence, as the record might unloading at the moment
        if (inverseRelationship) {
          inverseRelationship.removeCanonicalRecordFromOwn(this.record);
        }
      },

      removeCanonicalRecordFromOwn: function(record) {
        this.canonicalMembers["delete"](record);
        this.flushCanonicalLater();
      },

      flushCanonical: function() {
        this.willSync = false;
        //a hack for not removing new records
        //TODO remove once we have proper diffing
        var newRecords = [];
        for (var i=0; i<this.members.list.length; i++) {
          if (this.members.list[i].get('isNew')) {
            newRecords.push(this.members.list[i]);
          }
        }
        //TODO(Igor) make this less abysmally slow
        this.members = this.canonicalMembers.copy();
        for (i=0; i<newRecords.length; i++) {
          this.members.add(newRecords[i]);
        }
      },

      flushCanonicalLater: function() {
        if (this.willSync) {
          return;
        }
        this.willSync = true;
        var self = this;
        this.store._backburner.join(function() {
          self.store._backburner.schedule('syncRelationships', self, self.flushCanonical);
        });
      },

      updateLink: function(link) {
        Ember.warn("You have pushed a record of type '" + this.record.constructor.modelName + "' with '" + this.key + "' as a link, but the association is not an async relationship.", this.isAsync);
        Ember.assert("You have pushed a record of type '" + this.record.constructor.modelName + "' with '" + this.key + "' as a link, but the value of that link is not a string.", typeof link === 'string' || link === null);
        if (link !== this.link) {
          this.link = link;
          this.linkPromise = null;
          this.record.notifyPropertyChange(this.key);
        }
      },

      findLink: function() {
        if (this.linkPromise) {
          return this.linkPromise;
        } else {
          var promise = this.fetchLink();
          this.linkPromise = promise;
          return promise.then(function(result) {
            return result;
          });
        }
      },

      updateRecordsFromAdapter: function(records) {
        //TODO(Igor) move this to a proper place
        var self = this;
        //TODO Once we have adapter support, we need to handle updated and canonical changes
        self.computeChanges(records);
        self.setHasData(true);
      },

      notifyRecordRelationshipAdded: Ember.K,
      notifyRecordRelationshipRemoved: Ember.K,

      setHasData: function(value) {
        this.hasData = value;
      }
    };




    var ember$data$lib$system$relationships$state$relationship$$default = ember$data$lib$system$relationships$state$relationship$$Relationship;

    var ember$data$lib$system$many$array$$get = Ember.get;
    var ember$data$lib$system$many$array$$set = Ember.set;
    var ember$data$lib$system$many$array$$filter = Ember.ArrayPolyfills.filter;

    var ember$data$lib$system$many$array$$default = Ember.Object.extend(Ember.MutableArray, Ember.Evented, {
      init: function() {
        this.currentState = Ember.A([]);
      },

      record: null,

      canonicalState: null,
      currentState: null,

      length: 0,

      objectAt: function(index) {
        return this.currentState[index];
      },

      flushCanonical: function() {
        //TODO make this smarter, currently its plenty stupid
        var toSet = ember$data$lib$system$many$array$$filter.call(this.canonicalState, function(record) {
          return !record.get('isDeleted');
        });

        //a hack for not removing new records
        //TODO remove once we have proper diffing
        var newRecords = this.currentState.filter(function(record) {
          return record.get('isNew');
        });
        toSet = toSet.concat(newRecords);
        var oldLength = this.length;
        this.arrayContentWillChange(0, this.length, toSet.length);
        this.set('length', toSet.length);
        this.currentState = toSet;
        this.arrayContentDidChange(0, oldLength, this.length);
        //TODO Figure out to notify only on additions and maybe only if unloaded
        this.relationship.notifyHasManyChanged();
        this.record.updateRecordArrays();
      },
      /**
        `true` if the relationship is polymorphic, `false` otherwise.

        @property {Boolean} isPolymorphic
        @private
      */
      isPolymorphic: false,

      /**
        The loading state of this array

        @property {Boolean} isLoaded
      */
      isLoaded: false,

      /**
        The relationship which manages this array.

        @property {ManyRelationship} relationship
        @private
      */
      relationship: null,

      internalReplace: function(idx, amt, objects) {
        if (!objects) {
          objects = [];
        }
        this.arrayContentWillChange(idx, amt, objects.length);
        this.currentState.splice.apply(this.currentState, [idx, amt].concat(objects));
        this.set('length', this.currentState.length);
        this.arrayContentDidChange(idx, amt, objects.length);
        if (objects) {
          //TODO(Igor) probably needed only for unloaded records
          this.relationship.notifyHasManyChanged();
        }
        this.record.updateRecordArrays();
      },

      //TODO(Igor) optimize
      internalRemoveRecords: function(records) {
        var index;
        for (var i=0; i < records.length; i++) {
          index = this.currentState.indexOf(records[i]);
          this.internalReplace(index, 1);
        }
      },

      //TODO(Igor) optimize
      internalAddRecords: function(records, idx) {
        if (idx === undefined) {
          idx = this.currentState.length;
        }
        this.internalReplace(idx, 0, records);
      },

      replace: function(idx, amt, objects) {
        var records;
        if (amt > 0) {
          records = this.currentState.slice(idx, idx+amt);
          this.get('relationship').removeRecords(records);
        }
        if (objects) {
          this.get('relationship').addRecords(objects, idx);
        }
      },
      /**
        Used for async `hasMany` arrays
        to keep track of when they will resolve.

        @property {Ember.RSVP.Promise} promise
        @private
      */
      promise: null,

      /**
        @method loadingRecordsCount
        @param {Number} count
        @private
      */
      loadingRecordsCount: function(count) {
        this.loadingRecordsCount = count;
      },

      /**
        @method loadedRecord
        @private
      */
      loadedRecord: function() {
        this.loadingRecordsCount--;
        if (this.loadingRecordsCount === 0) {
          ember$data$lib$system$many$array$$set(this, 'isLoaded', true);
          this.trigger('didLoad');
        }
      },

      /**
        @method reload
        @public
      */
      reload: function() {
        return this.relationship.reload();
      },

      /**
        Saves all of the records in the `ManyArray`.

        Example

        ```javascript
        store.find('inbox', 1).then(function(inbox) {
          inbox.get('messages').then(function(messages) {
            messages.forEach(function(message) {
              message.set('isRead', true);
            });
            messages.save()
          });
        });
        ```

        @method save
        @return {DS.PromiseArray} promise
      */
      save: function() {
        var manyArray = this;
        var promiseLabel = "DS: ManyArray#save " + ember$data$lib$system$many$array$$get(this, 'type');
        var promise = Ember.RSVP.all(this.invoke("save"), promiseLabel).then(function(array) {
          return manyArray;
        }, null, "DS: ManyArray#save return ManyArray");

        return ember$data$lib$system$promise$proxies$$PromiseArray.create({ promise: promise });
      },

      /**
        Create a child record within the owner

        @method createRecord
        @private
        @param {Object} hash
        @return {DS.Model} record
      */
      createRecord: function(hash) {
        var store = ember$data$lib$system$many$array$$get(this, 'store');
        var type = ember$data$lib$system$many$array$$get(this, 'type');
        var record;

        Ember.assert("You cannot add '" + type.modelName + "' records to this polymorphic relationship.", !ember$data$lib$system$many$array$$get(this, 'isPolymorphic'));

        record = store.createRecord(type, hash);
        this.pushObject(record);

        return record;
      },

      /**
        @method addRecord
        @param {DS.Model} record
        @deprecated Use `addObject()` instead
      */
      addRecord: function(record) {
        Ember.deprecate('Using manyArray.addRecord() has been deprecated. You should use manyArray.addObject() instead.');
        this.addObject(record);
      },

      /**
        @method removeRecord
        @param {DS.Model} record
        @deprecated Use `removeObject()` instead
      */
      removeRecord: function(record) {
        Ember.deprecate('Using manyArray.removeRecord() has been deprecated. You should use manyArray.removeObject() instead.');
        this.removeObject(record);
      }
    });

    var ember$data$lib$system$relationships$state$has$many$$ManyRelationship = function(store, record, inverseKey, relationshipMeta) {
      this._super$constructor(store, record, inverseKey, relationshipMeta);
      this.belongsToType = relationshipMeta.type;
      this.canonicalState = [];
      this.manyArray = ember$data$lib$system$many$array$$default.create({
        canonicalState: this.canonicalState,
        store: this.store,
        relationship: this,
        type: this.belongsToType,
        record: record
      });
      this.isPolymorphic = relationshipMeta.options.polymorphic;
      this.manyArray.isPolymorphic = this.isPolymorphic;
    };

    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype = Ember.create(ember$data$lib$system$relationships$state$relationship$$default.prototype);
    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype.constructor = ember$data$lib$system$relationships$state$has$many$$ManyRelationship;
    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype._super$constructor = ember$data$lib$system$relationships$state$relationship$$default;

    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype.destroy = function() {
      this.manyArray.destroy();
    };

    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype._super$addCanonicalRecord = ember$data$lib$system$relationships$state$relationship$$default.prototype.addCanonicalRecord;
    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype.addCanonicalRecord = function(record, idx) {
      if (this.canonicalMembers.has(record)) {
        return;
      }
      if (idx !== undefined) {
        this.canonicalState.splice(idx, 0, record);
      } else {
        this.canonicalState.push(record);
      }
      this._super$addCanonicalRecord(record, idx);
    };

    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype._super$addRecord = ember$data$lib$system$relationships$state$relationship$$default.prototype.addRecord;
    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype.addRecord = function(record, idx) {
      if (this.members.has(record)) {
        return;
      }
      this._super$addRecord(record, idx);
      this.manyArray.internalAddRecords([record], idx);
    };

    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype._super$removeCanonicalRecordFromOwn = ember$data$lib$system$relationships$state$relationship$$default.prototype.removeCanonicalRecordFromOwn;
    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype.removeCanonicalRecordFromOwn = function(record, idx) {
      var i = idx;
      if (!this.canonicalMembers.has(record)) {
        return;
      }
      if (i === undefined) {
        i = this.canonicalState.indexOf(record);
      }
      if (i > -1) {
        this.canonicalState.splice(i, 1);
      }
      this._super$removeCanonicalRecordFromOwn(record, idx);
    };

    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype._super$flushCanonical = ember$data$lib$system$relationships$state$relationship$$default.prototype.flushCanonical;
    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype.flushCanonical = function() {
      this.manyArray.flushCanonical();
      this._super$flushCanonical();
    };

    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype._super$removeRecordFromOwn = ember$data$lib$system$relationships$state$relationship$$default.prototype.removeRecordFromOwn;
    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype.removeRecordFromOwn = function(record, idx) {
      if (!this.members.has(record)) {
        return;
      }
      this._super$removeRecordFromOwn(record, idx);
      if (idx !== undefined) {
        //TODO(Igor) not used currently, fix
        this.manyArray.currentState.removeAt(idx);
      } else {
        this.manyArray.internalRemoveRecords([record]);
      }
    };

    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype.notifyRecordRelationshipAdded = function(record, idx) {
      var type = this.relationshipMeta.type;
      Ember.assert("You cannot add '" + record.constructor.modelName + "' records to the " + this.record.constructor.modelName + "." + this.key + " relationship (only '" + this.belongsToType.modelName + "' allowed)", (function () {
        if (type.__isMixin) {
          return type.__mixin.detect(record);
        }
        if (Ember.MODEL_FACTORY_INJECTIONS) {
          type = type.superclass;
        }
        return record instanceof type;
      })());

      this.record.notifyHasManyAdded(this.key, record, idx);
    };

    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype.reload = function() {
      var self = this;
      if (this.link) {
        return this.fetchLink();
      } else {
        return this.store.scheduleFetchMany(this.manyArray.toArray()).then(function() {
          //Goes away after the manyArray refactor
          self.manyArray.set('isLoaded', true);
          return self.manyArray;
        });
      }
    };

    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype.computeChanges = function(records) {
      var members = this.canonicalMembers;
      var recordsToRemove = [];
      var length;
      var record;
      var i;

      records = ember$data$lib$system$relationships$state$has$many$$setForArray(records);

      members.forEach(function(member) {
        if (records.has(member)) { return; }

        recordsToRemove.push(member);
      });

      this.removeCanonicalRecords(recordsToRemove);

      // Using records.toArray() since currently using
      // removeRecord can modify length, messing stuff up
      // forEach since it directly looks at "length" each
      // iteration
      records = records.toArray();
      length = records.length;
      for (i = 0; i < length; i++) {
        record = records[i];
        this.removeCanonicalRecord(record);
        this.addCanonicalRecord(record, i);
      }
    };

    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype.fetchLink = function() {
      var self = this;
      return this.store.findHasMany(this.record, this.link, this.relationshipMeta).then(function(records) {
        self.store._backburner.join(function() {
          self.updateRecordsFromAdapter(records);
        });
        return self.manyArray;
      });
    };

    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype.findRecords = function() {
      var manyArray = this.manyArray;
      return this.store.findMany(manyArray.toArray()).then(function() {
        //Goes away after the manyArray refactor
        manyArray.set('isLoaded', true);
        return manyArray;
      });
    };
    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype.notifyHasManyChanged = function() {
      this.record.notifyHasManyAdded(this.key);
    };

    ember$data$lib$system$relationships$state$has$many$$ManyRelationship.prototype.getRecords = function() {
      //TODO(Igor) sync server here, once our syncing is not stupid
      if (this.isAsync) {
        var self = this;
        var promise;
        if (this.link) {
          promise = this.findLink().then(function() {
            return self.findRecords();
          });
        } else {
          promise = this.findRecords();
        }
        return ember$data$lib$system$promise$proxies$$PromiseManyArray.create({
          content: this.manyArray,
          promise: promise
        });
      } else {
        Ember.assert("You looked up the '" + this.key + "' relationship on a '" + this.record.constructor.modelName + "' with id " + this.record.get('id') +  " but some of the associated records were not loaded. Either make sure they are all loaded together with the parent record, or specify that the relationship is async (`DS.hasMany({ async: true })`)", this.manyArray.isEvery('isEmpty', false));

        //TODO(Igor) WTF DO I DO HERE?
        if (!this.manyArray.get('isDestroyed')) {
          this.manyArray.set('isLoaded', true);
        }
        return this.manyArray;
      }
    };

    function ember$data$lib$system$relationships$state$has$many$$setForArray(array) {
      var set = new ember$data$lib$system$ordered$set$$default();

      if (array) {
        for (var i=0, l=array.length; i<l; i++) {
          set.add(array[i]);
        }
      }

      return set;
    }

    var ember$data$lib$system$relationships$state$has$many$$default = ember$data$lib$system$relationships$state$has$many$$ManyRelationship;

    var ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship = function(store, record, inverseKey, relationshipMeta) {
      this._super$constructor(store, record, inverseKey, relationshipMeta);
      this.record = record;
      this.key = relationshipMeta.key;
      this.inverseRecord = null;
      this.canonicalState = null;
    };

    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype = Ember.create(ember$data$lib$system$relationships$state$relationship$$default.prototype);
    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype.constructor = ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship;
    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype._super$constructor = ember$data$lib$system$relationships$state$relationship$$default;

    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype.setRecord = function(newRecord) {
      if (newRecord) {
        this.addRecord(newRecord);
      } else if (this.inverseRecord) {
        this.removeRecord(this.inverseRecord);
      }
      this.setHasData(true);
    };

    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype.setCanonicalRecord = function(newRecord) {
      if (newRecord) {
        this.addCanonicalRecord(newRecord);
      } else if (this.inverseRecord) {
        this.removeCanonicalRecord(this.inverseRecord);
      }
      this.setHasData(true);
    };

    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype._super$addCanonicalRecord = ember$data$lib$system$relationships$state$relationship$$default.prototype.addCanonicalRecord;
    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype.addCanonicalRecord = function(newRecord) {
      if (this.canonicalMembers.has(newRecord)) { return;}

      if (this.canonicalState) {
        this.removeCanonicalRecord(this.canonicalState);
      }

      this.canonicalState = newRecord;
      this._super$addCanonicalRecord(newRecord);
    };

    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype._super$flushCanonical = ember$data$lib$system$relationships$state$relationship$$default.prototype.flushCanonical;
    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype.flushCanonical = function() {
      //temporary fix to not remove newly created records if server returned null.
      //TODO remove once we have proper diffing
      if (this.inverseRecord && this.inverseRecord.get('isNew') && !this.canonicalState) {
        return;
      }
      this.inverseRecord = this.canonicalState;
      this.record.notifyBelongsToChanged(this.key);
      this._super$flushCanonical();
    };

    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype._super$addRecord = ember$data$lib$system$relationships$state$relationship$$default.prototype.addRecord;
    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype.addRecord = function(newRecord) {
      if (this.members.has(newRecord)) { return;}
      var type = this.relationshipMeta.type;
      Ember.assert("You cannot add a '" + newRecord.constructor.modelName + "' record to the '" + this.record.constructor.modelName + "." + this.key +"'. " + "You can only add a '" + type.modelName + "' record to this relationship.", (function () {
        if (type.__isMixin) {
          return type.__mixin.detect(newRecord);
        }
        if (Ember.MODEL_FACTORY_INJECTIONS) {
          type = type.superclass;
        }
        return newRecord instanceof type;
      })());

      if (this.inverseRecord) {
        this.removeRecord(this.inverseRecord);
      }

      this.inverseRecord = newRecord;
      this._super$addRecord(newRecord);
      this.record.notifyBelongsToChanged(this.key);
    };

    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype.setRecordPromise = function(newPromise) {
      var content = newPromise.get && newPromise.get('content');
      Ember.assert("You passed in a promise that did not originate from an EmberData relationship. You can only pass promises that come from a belongsTo or hasMany relationship to the get call.", content !== undefined);
      this.setRecord(content);
    };

    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype._super$removeRecordFromOwn = ember$data$lib$system$relationships$state$relationship$$default.prototype.removeRecordFromOwn;
    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype.removeRecordFromOwn = function(record) {
      if (!this.members.has(record)) { return;}
      this.inverseRecord = null;
      this._super$removeRecordFromOwn(record);
      this.record.notifyBelongsToChanged(this.key);
    };

    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype._super$removeCanonicalRecordFromOwn = ember$data$lib$system$relationships$state$relationship$$default.prototype.removeCanonicalRecordFromOwn;
    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype.removeCanonicalRecordFromOwn = function(record) {
      if (!this.canonicalMembers.has(record)) { return;}
      this.canonicalState = null;
      this._super$removeCanonicalRecordFromOwn(record);
    };

    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype.findRecord = function() {
      if (this.inverseRecord) {
        return this.store._findByRecord(this.inverseRecord);
      } else {
        return Ember.RSVP.Promise.resolve(null);
      }
    };

    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype.fetchLink = function() {
      var self = this;
      return this.store.findBelongsTo(this.record, this.link, this.relationshipMeta).then(function(record) {
        if (record) {
          self.addRecord(record);
        }
        return record;
      });
    };

    ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship.prototype.getRecord = function() {
      //TODO(Igor) flushCanonical here once our syncing is not stupid
      if (this.isAsync) {
        var promise;
        if (this.link) {
          var self = this;
          promise = this.findLink().then(function() {
            return self.findRecord();
          });
        } else {
          promise = this.findRecord();
        }

        return ember$data$lib$system$promise$proxies$$PromiseObject.create({
          promise: promise,
          content: this.inverseRecord
        });
      } else {
        Ember.assert("You looked up the '" + this.key + "' relationship on a '" + this.record.constructor.modelName + "' with id " + this.record.get('id') +  " but some of the associated records were not loaded. Either make sure they are all loaded together with the parent record, or specify that the relationship is async (`DS.belongsTo({ async: true })`)", this.inverseRecord === null || !this.inverseRecord.get('isEmpty'));
        return this.inverseRecord;
      }
    };

    var ember$data$lib$system$relationships$state$belongs$to$$default = ember$data$lib$system$relationships$state$belongs$to$$BelongsToRelationship;

    var ember$data$lib$system$relationships$state$create$$createRelationshipFor = function(record, relationshipMeta, store) {
      var inverseKey;
      var inverse = record.constructor.inverseFor(relationshipMeta.key);

      if (inverse) {
        inverseKey = inverse.name;
      }

      if (relationshipMeta.kind === 'hasMany') {
        return new ember$data$lib$system$relationships$state$has$many$$default(store, record, inverseKey, relationshipMeta);
      } else {
        return new ember$data$lib$system$relationships$state$belongs$to$$default(store, record, inverseKey, relationshipMeta);
      }
    };

    var ember$data$lib$system$relationships$state$create$$default = ember$data$lib$system$relationships$state$create$$createRelationshipFor;

    var ember$data$lib$system$snapshot$$get = Ember.get;

    /**
      @class Snapshot
      @namespace DS
      @private
      @constructor
      @param {DS.Model} record The record to create a snapshot from
    */
    function ember$data$lib$system$snapshot$$Snapshot(record) {
      this._attributes = Ember.create(null);
      this._belongsToRelationships = Ember.create(null);
      this._belongsToIds = Ember.create(null);
      this._hasManyRelationships = Ember.create(null);
      this._hasManyIds = Ember.create(null);

      record.eachAttribute(function(keyName) {
        this._attributes[keyName] = ember$data$lib$system$snapshot$$get(record, keyName);
      }, this);

      this.id = ember$data$lib$system$snapshot$$get(record, 'id');
      this.record = record;
      this.type = record.constructor;
      this.modelName = record.constructor.modelName;

      // The following code is here to keep backwards compatibility when accessing
      // `constructor` directly.
      //
      // With snapshots you should use `type` instead of `constructor`.
      //
      // Remove for Ember Data 1.0.
      if (Ember.platform.hasPropertyAccessors) {
        var callDeprecate = true;

        Ember.defineProperty(this, 'constructor', {
          get: function() {
            // Ugly hack since accessing error.stack (done in `Ember.deprecate()`)
            // causes the internals of Chrome to access the constructor, which then
            // causes an infinite loop if accessed and calls `Ember.deprecate()`
            // again.
            if (callDeprecate) {
              callDeprecate = false;
              Ember.deprecate('Usage of `snapshot.constructor` is deprecated, use `snapshot.type` instead.');
              callDeprecate = true;
            }

            return this.type;
          }
        });
      } else {
        this.constructor = this.type;
      }
    }

    ember$data$lib$system$snapshot$$Snapshot.prototype = {
      constructor: ember$data$lib$system$snapshot$$Snapshot,

      /**
        The id of the snapshot's underlying record

        Example

        ```javascript
        // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
        postSnapshot.id; // => '1'
        ```

        @property id
        @type {String}
      */
      id: null,

      /**
        The underlying record for this snapshot. Can be used to access methods and
        properties defined on the record.

        Example

        ```javascript
        var json = snapshot.record.toJSON();
        ```

        @property record
        @type {DS.Model}
      */
      record: null,

      /**
        The type of the underlying record for this snapshot, as a subclass of DS.Model.

        @property type
        @type {subclass of DS.Model}
      */
      type: null,

      /**
        The name of the type of the underlying record for this snapshot, as a string.

        @property modelName
        @type {String}
      */
      modelName: null,

      /**
        Returns the value of an attribute.

        Example

        ```javascript
        // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
        postSnapshot.attr('author'); // => 'Tomster'
        postSnapshot.attr('title'); // => 'Ember.js rocks'
        ```

        Note: Values are loaded eagerly and cached when the snapshot is created.

        @method attr
        @param {String} keyName
        @return {Object} The attribute value or undefined
      */
      attr: function(keyName) {
        if (keyName in this._attributes) {
          return this._attributes[keyName];
        }
        throw new Ember.Error("Model '" + Ember.inspect(this.record) + "' has no attribute named '" + keyName + "' defined.");
      },

      /**
        Returns all attributes and their corresponding values.

        Example

        ```javascript
        // store.push('post', { id: 1, author: 'Tomster', title: 'Hello World' });
        postSnapshot.attributes(); // => { author: 'Tomster', title: 'Ember.js rocks' }
        ```

        @method attributes
        @return {Object} All attributes of the current snapshot
      */
      attributes: function() {
        return Ember.copy(this._attributes);
      },

      /**
        Returns the current value of a belongsTo relationship.

        `belongsTo` takes an optional hash of options as a second parameter,
        currently supported options are:

       - `id`: set to `true` if you only want the ID of the related record to be
          returned.

        Example

        ```javascript
        // store.push('post', { id: 1, title: 'Hello World' });
        // store.createRecord('comment', { body: 'Lorem ipsum', post: post });
        commentSnapshot.belongsTo('post'); // => DS.Snapshot
        commentSnapshot.belongsTo('post', { id: true }); // => '1'

        // store.push('comment', { id: 1, body: 'Lorem ipsum' });
        commentSnapshot.belongsTo('post'); // => undefined
        ```

        Calling `belongsTo` will return a new Snapshot as long as there's any known
        data for the relationship available, such as an ID. If the relationship is
        known but unset, `belongsTo` will return `null`. If the contents of the
        relationship is unknown `belongsTo` will return `undefined`.

        Note: Relationships are loaded lazily and cached upon first access.

        @method belongsTo
        @param {String} keyName
        @param {Object} [options]
        @return {DS.Snapshot|String|null|undefined} A snapshot or ID of a known
          relationship or null if the relationship is known but unset. undefined
          will be returned if the contents of the relationship is unknown.
      */
      belongsTo: function(keyName, options) {
        var id = options && options.id;
        var relationship, inverseRecord, hasData;
        var result;

        if (id && keyName in this._belongsToIds) {
          return this._belongsToIds[keyName];
        }

        if (!id && keyName in this._belongsToRelationships) {
          return this._belongsToRelationships[keyName];
        }

        relationship = this.record._relationships[keyName];
        if (!(relationship && relationship.relationshipMeta.kind === 'belongsTo')) {
          throw new Ember.Error("Model '" + Ember.inspect(this.record) + "' has no belongsTo relationship named '" + keyName + "' defined.");
        }

        hasData = ember$data$lib$system$snapshot$$get(relationship, 'hasData');
        inverseRecord = ember$data$lib$system$snapshot$$get(relationship, 'inverseRecord');

        if (hasData) {
          if (inverseRecord) {
            if (id) {
              result = ember$data$lib$system$snapshot$$get(inverseRecord, 'id');
            } else {
              result = inverseRecord._createSnapshot();
            }
          } else {
            result = null;
          }
        }

        if (id) {
          this._belongsToIds[keyName] = result;
        } else {
          this._belongsToRelationships[keyName] = result;
        }

        return result;
      },

      /**
        Returns the current value of a hasMany relationship.

        `hasMany` takes an optional hash of options as a second parameter,
        currently supported options are:

       - `ids`: set to `true` if you only want the IDs of the related records to be
          returned.

        Example

        ```javascript
        // store.push('post', { id: 1, title: 'Hello World', comments: [2, 3] });
        postSnapshot.hasMany('comments'); // => [DS.Snapshot, DS.Snapshot]
        postSnapshot.hasMany('comments', { ids: true }); // => ['2', '3']

        // store.push('post', { id: 1, title: 'Hello World' });
        postSnapshot.hasMany('comments'); // => undefined
        ```

        Note: Relationships are loaded lazily and cached upon first access.

        @method hasMany
        @param {String} keyName
        @param {Object} [options]
        @return {Array|undefined} An array of snapshots or IDs of a known
          relationship or an empty array if the relationship is known but unset.
          undefined will be returned if the contents of the relationship is unknown.
      */
      hasMany: function(keyName, options) {
        var ids = options && options.ids;
        var relationship, members, hasData;
        var results;

        if (ids && keyName in this._hasManyIds) {
          return this._hasManyIds[keyName];
        }

        if (!ids && keyName in this._hasManyRelationships) {
          return this._hasManyRelationships[keyName];
        }

        relationship = this.record._relationships[keyName];
        if (!(relationship && relationship.relationshipMeta.kind === 'hasMany')) {
          throw new Ember.Error("Model '" + Ember.inspect(this.record) + "' has no hasMany relationship named '" + keyName + "' defined.");
        }

        hasData = ember$data$lib$system$snapshot$$get(relationship, 'hasData');
        members = ember$data$lib$system$snapshot$$get(relationship, 'members');

        if (hasData) {
          results = [];
          members.forEach(function(member) {
            if (ids) {
              results.push(ember$data$lib$system$snapshot$$get(member, 'id'));
            } else {
              results.push(member._createSnapshot());
            }
          });
        }

        if (ids) {
          this._hasManyIds[keyName] = results;
        } else {
          this._hasManyRelationships[keyName] = results;
        }

        return results;
      },

      /**
        Iterates through all the attributes of the model, calling the passed
        function on each attribute.

        Example

        ```javascript
        snapshot.eachAttribute(function(name, meta) {
          // ...
        });
        ```

        @method eachAttribute
        @param {Function} callback the callback to execute
        @param {Object} [binding] the value to which the callback's `this` should be bound
      */
      eachAttribute: function(callback, binding) {
        this.record.eachAttribute(callback, binding);
      },

      /**
        Iterates through all the relationships of the model, calling the passed
        function on each relationship.

        Example

        ```javascript
        snapshot.eachRelationship(function(name, relationship) {
          // ...
        });
        ```

        @method eachRelationship
        @param {Function} callback the callback to execute
        @param {Object} [binding] the value to which the callback's `this` should be bound
      */
      eachRelationship: function(callback, binding) {
        this.record.eachRelationship(callback, binding);
      },

      /**
        @method get
        @param {String} keyName
        @return {Object} The property value
        @deprecated Use [attr](#method_attr), [belongsTo](#method_belongsTo) or [hasMany](#method_hasMany) instead
      */
      get: function(keyName) {
        Ember.deprecate('Using DS.Snapshot.get() is deprecated. Use .attr(), .belongsTo() or .hasMany() instead.');

        if (keyName === 'id') {
          return this.id;
        }

        if (keyName in this._attributes) {
          return this.attr(keyName);
        }

        var relationship = this.record._relationships[keyName];

        if (relationship && relationship.relationshipMeta.kind === 'belongsTo') {
          return this.belongsTo(keyName);
        }
        if (relationship && relationship.relationshipMeta.kind === 'hasMany') {
          return this.hasMany(keyName);
        }

        return ember$data$lib$system$snapshot$$get(this.record, keyName);
      },

      /**
        @method unknownProperty
        @param {String} keyName
        @return {Object} The property value
        @deprecated Use [attr](#method_attr), [belongsTo](#method_belongsTo) or [hasMany](#method_hasMany) instead
      */
      unknownProperty: function(keyName) {
        return this.get(keyName);
      },

      /**
        @method _createSnapshot
        @private
      */
      _createSnapshot: function() {
        Ember.deprecate("You called _createSnapshot on what's already a DS.Snapshot. You shouldn't manually create snapshots in your adapter since the store passes snapshots to adapters by default.");
        return this;
      }
    };

    Ember.defineProperty(ember$data$lib$system$snapshot$$Snapshot.prototype, 'typeKey', {
      enumerable: false,
      get: function() {
        Ember.deprecate('Snapshot.typeKey is deprecated. Use snapshot.modelName instead.');
        return this.modelName;
      },
      set: function() {
        Ember.assert('Setting snapshot.typeKey is not supported. In addition, Snapshot.typeKey has been deprecated for Snapshot.modelName.');
      }
    });

    var ember$data$lib$system$snapshot$$default = ember$data$lib$system$snapshot$$Snapshot;

    /**
      @module ember-data
    */

    var ember$data$lib$system$model$model$$get = Ember.get;
    var ember$data$lib$system$model$model$$set = Ember.set;
    var ember$data$lib$system$model$model$$Promise = Ember.RSVP.Promise;
    var ember$data$lib$system$model$model$$forEach = Ember.ArrayPolyfills.forEach;
    var ember$data$lib$system$model$model$$map = Ember.ArrayPolyfills.map;
    var ember$data$lib$system$model$model$$intersection = Ember.EnumerableUtils.intersection;
    var ember$data$lib$system$model$model$$RESERVED_MODEL_PROPS = [
      'currentState', 'data', 'store'
    ];

    var ember$data$lib$system$model$model$$retrieveFromCurrentState = Ember.computed('currentState', function(key) {
      return ember$data$lib$system$model$model$$get(ember$data$lib$system$model$model$$get(this, 'currentState'), key);
    }).readOnly();

    var ember$data$lib$system$model$model$$_extractPivotNameCache = Ember.create(null);
    var ember$data$lib$system$model$model$$_splitOnDotCache = Ember.create(null);

    function ember$data$lib$system$model$model$$splitOnDot(name) {
      return ember$data$lib$system$model$model$$_splitOnDotCache[name] || (
        (ember$data$lib$system$model$model$$_splitOnDotCache[name] = name.split('.'))
      );
    }

    function ember$data$lib$system$model$model$$extractPivotName(name) {
      return ember$data$lib$system$model$model$$_extractPivotNameCache[name] || (
        (ember$data$lib$system$model$model$$_extractPivotNameCache[name] = ember$data$lib$system$model$model$$splitOnDot(name)[0])
      );
    }

    // Like Ember.merge, but instead returns a list of keys
    // for values that fail a strict equality check
    // instead of the original object.
    function ember$data$lib$system$model$model$$mergeAndReturnChangedKeys(original, updates) {
      var changedKeys = [];

      if (!updates || typeof updates !== 'object') {
        return changedKeys;
      }

      var keys   = Ember.keys(updates);
      var length = keys.length;
      var i, val, key;

      for (i = 0; i < length; i++) {
        key = keys[i];
        val = updates[key];

        if (original[key] !== val) {
          changedKeys.push(key);
        }

        original[key] = val;
      }
      return changedKeys;
    }

    /**

      The model class that all Ember Data records descend from.

      @class Model
      @namespace DS
      @extends Ember.Object
      @uses Ember.Evented
    */
    var ember$data$lib$system$model$model$$Model = Ember.Object.extend(Ember.Evented, {
      _recordArrays: undefined,
      _relationships: undefined,

      store: null,

      /**
        If this property is `true` the record is in the `empty`
        state. Empty is the first state all records enter after they have
        been created. Most records created by the store will quickly
        transition to the `loading` state if data needs to be fetched from
        the server or the `created` state if the record is created on the
        client. A record can also enter the empty state if the adapter is
        unable to locate the record.

        @property isEmpty
        @type {Boolean}
        @readOnly
      */
      isEmpty: ember$data$lib$system$model$model$$retrieveFromCurrentState,
      /**
        If this property is `true` the record is in the `loading` state. A
        record enters this state when the store asks the adapter for its
        data. It remains in this state until the adapter provides the
        requested data.

        @property isLoading
        @type {Boolean}
        @readOnly
      */
      isLoading: ember$data$lib$system$model$model$$retrieveFromCurrentState,
      /**
        If this property is `true` the record is in the `loaded` state. A
        record enters this state when its data is populated. Most of a
        record's lifecycle is spent inside substates of the `loaded`
        state.

        Example

        ```javascript
        var record = store.createRecord('model');
        record.get('isLoaded'); // true

        store.find('model', 1).then(function(model) {
          model.get('isLoaded'); // true
        });
        ```

        @property isLoaded
        @type {Boolean}
        @readOnly
      */
      isLoaded: ember$data$lib$system$model$model$$retrieveFromCurrentState,
      /**
        If this property is `true` the record is in the `dirty` state. The
        record has local changes that have not yet been saved by the
        adapter. This includes records that have been created (but not yet
        saved) or deleted.

        Example

        ```javascript
        var record = store.createRecord('model');
        record.get('isDirty'); // true

        store.find('model', 1).then(function(model) {
          model.get('isDirty'); // false
          model.set('foo', 'some value');
          model.get('isDirty'); // true
        });
        ```

        @property isDirty
        @type {Boolean}
        @readOnly
      */
      isDirty: ember$data$lib$system$model$model$$retrieveFromCurrentState,
      /**
        If this property is `true` the record is in the `saving` state. A
        record enters the saving state when `save` is called, but the
        adapter has not yet acknowledged that the changes have been
        persisted to the backend.

        Example

        ```javascript
        var record = store.createRecord('model');
        record.get('isSaving'); // false
        var promise = record.save();
        record.get('isSaving'); // true
        promise.then(function() {
          record.get('isSaving'); // false
        });
        ```

        @property isSaving
        @type {Boolean}
        @readOnly
      */
      isSaving: ember$data$lib$system$model$model$$retrieveFromCurrentState,
      /**
        If this property is `true` the record is in the `deleted` state
        and has been marked for deletion. When `isDeleted` is true and
        `isDirty` is true, the record is deleted locally but the deletion
        was not yet persisted. When `isSaving` is true, the change is
        in-flight. When both `isDirty` and `isSaving` are false, the
        change has persisted.

        Example

        ```javascript
        var record = store.createRecord('model');
        record.get('isDeleted');    // false
        record.deleteRecord();

        // Locally deleted
        record.get('isDeleted');    // true
        record.get('isDirty');      // true
        record.get('isSaving');     // false

        // Persisting the deletion
        var promise = record.save();
        record.get('isDeleted');    // true
        record.get('isSaving');     // true

        // Deletion Persisted
        promise.then(function() {
          record.get('isDeleted');  // true
          record.get('isSaving');   // false
          record.get('isDirty');    // false
        });
        ```

        @property isDeleted
        @type {Boolean}
        @readOnly
      */
      isDeleted: ember$data$lib$system$model$model$$retrieveFromCurrentState,
      /**
        If this property is `true` the record is in the `new` state. A
        record will be in the `new` state when it has been created on the
        client and the adapter has not yet report that it was successfully
        saved.

        Example

        ```javascript
        var record = store.createRecord('model');
        record.get('isNew'); // true

        record.save().then(function(model) {
          model.get('isNew'); // false
        });
        ```

        @property isNew
        @type {Boolean}
        @readOnly
      */
      isNew: ember$data$lib$system$model$model$$retrieveFromCurrentState,
      /**
        If this property is `true` the record is in the `valid` state.

        A record will be in the `valid` state when the adapter did not report any
        server-side validation failures.

        @property isValid
        @type {Boolean}
        @readOnly
      */
      isValid: ember$data$lib$system$model$model$$retrieveFromCurrentState,
      /**
        If the record is in the dirty state this property will report what
        kind of change has caused it to move into the dirty
        state. Possible values are:

        - `created` The record has been created by the client and not yet saved to the adapter.
        - `updated` The record has been updated by the client and not yet saved to the adapter.
        - `deleted` The record has been deleted by the client and not yet saved to the adapter.

        Example

        ```javascript
        var record = store.createRecord('model');
        record.get('dirtyType'); // 'created'
        ```

        @property dirtyType
        @type {String}
        @readOnly
      */
      dirtyType: ember$data$lib$system$model$model$$retrieveFromCurrentState,

      /**
        If `true` the adapter reported that it was unable to save local
        changes to the backend for any reason other than a server-side
        validation error.

        Example

        ```javascript
        record.get('isError'); // false
        record.set('foo', 'valid value');
        record.save().then(null, function() {
          record.get('isError'); // true
        });
        ```

        @property isError
        @type {Boolean}
        @readOnly
      */
      isError: false,
      /**
        If `true` the store is attempting to reload the record form the adapter.

        Example

        ```javascript
        record.get('isReloading'); // false
        record.reload();
        record.get('isReloading'); // true
        ```

        @property isReloading
        @type {Boolean}
        @readOnly
      */
      isReloading: false,

      /**
        The `clientId` property is a transient numerical identifier
        generated at runtime by the data store. It is important
        primarily because newly created objects may not yet have an
        externally generated id.

        @property clientId
        @private
        @type {Number|String}
      */
      clientId: null,
      /**
        All ember models have an id property. This is an identifier
        managed by an external source. These are always coerced to be
        strings before being used internally. Note when declaring the
        attributes for a model it is an error to declare an id
        attribute.

        ```javascript
        var record = store.createRecord('model');
        record.get('id'); // null

        store.find('model', 1).then(function(model) {
          model.get('id'); // '1'
        });
        ```

        @property id
        @type {String}
      */
      id: null,

      /**
        @property currentState
        @private
        @type {Object}
      */
      currentState: ember$data$lib$system$model$states$$default.empty,

      /**
        When the record is in the `invalid` state this object will contain
        any errors returned by the adapter. When present the errors hash
        contains keys corresponding to the invalid property names
        and values which are arrays of Javascript objects with two keys:

        - `message` A string containing the error message from the backend
        - `attribute` The name of the property associated with this error message

        ```javascript
        record.get('errors.length'); // 0
        record.set('foo', 'invalid value');
        record.save().catch(function() {
          record.get('errors').get('foo');
          // [{message: 'foo should be a number.', attribute: 'foo'}]
        });
        ```

        The `errors` property us useful for displaying error messages to
        the user.

        ```handlebars
        <label>Username: {{input value=username}} </label>
        {{#each model.errors.username as |error|}}
          <div class="error">
            {{error.message}}
          </div>
        {{/each}}
        <label>Email: {{input value=email}} </label>
        {{#each model.errors.email as |error|}}
          <div class="error">
            {{error.message}}
          </div>
        {{/each}}
        ```


        You can also access the special `messages` property on the error
        object to get an array of all the error strings.

        ```handlebars
        {{#each model.errors.messages as |message|}}
          <div class="error">
            {{message}}
          </div>
        {{/each}}
        ```

        @property errors
        @type {DS.Errors}
      */
      errors: Ember.computed(function() {
        var errors = ember$data$lib$system$model$errors$$default.create();

        errors.registerHandlers(this, function() {
          this.send('becameInvalid');
        }, function() {
          this.send('becameValid');
        });

        return errors;
      }).readOnly(),

      /**
        Create a JSON representation of the record, using the serialization
        strategy of the store's adapter.

       `serialize` takes an optional hash as a parameter, currently
        supported options are:

       - `includeId`: `true` if the record's ID should be included in the
          JSON representation.

        @method serialize
        @param {Object} options
        @return {Object} an object whose values are primitive JSON values only
      */
      serialize: function(options) {
        return this.store.serialize(this, options);
      },

      /**
        Use [DS.JSONSerializer](DS.JSONSerializer.html) to
        get the JSON representation of a record.

        `toJSON` takes an optional hash as a parameter, currently
        supported options are:

        - `includeId`: `true` if the record's ID should be included in the
          JSON representation.

        @method toJSON
        @param {Object} options
        @return {Object} A JSON representation of the object.
      */
      toJSON: function(options) {
        // container is for lazy transform lookups
        var serializer = ember$data$lib$serializers$json$serializer$$default.create({ container: this.container });
        var snapshot = this._createSnapshot();

        return serializer.serialize(snapshot, options);
      },

      /**
        Fired when the record is ready to be interacted with,
        that is either loaded from the server or created locally.

        @event ready
      */
      ready: function() {
        this.store.recordArrayManager.recordWasLoaded(this);
      },
      /**
        Fired when the record is loaded from the server.

        @event didLoad
      */
      didLoad: Ember.K,

      /**
        Fired when the record is updated.

        @event didUpdate
      */
      didUpdate: Ember.K,

      /**
        Fired when a new record is commited to the server.

        @event didCreate
      */
      didCreate: Ember.K,

      /**
        Fired when the record is deleted.

        @event didDelete
      */
      didDelete: Ember.K,

      /**
        Fired when the record becomes invalid.

        @event becameInvalid
      */
      becameInvalid: Ember.K,

      /**
        Fired when the record enters the error state.

        @event becameError
      */
      becameError: Ember.K,

      /**
        Fired when the record is rolled back.

        @event rolledBack
      */
      rolledBack: Ember.K,

      /**
        @property data
        @private
        @type {Object}
      */
      data: Ember.computed(function() {
        this._data = this._data || {};
        return this._data;
      }).readOnly(),

      _data: null,

      init: function() {
        this._super.apply(this, arguments);
        this._setup();
      },

      _setup: function() {
        this._changesToSync = {};
        this._deferredTriggers = [];
        this._data = {};
        this._attributes = Ember.create(null);
        this._inFlightAttributes = Ember.create(null);
        this._relationships = {};
        /*
          implicit relationships are relationship which have not been declared but the inverse side exists on
          another record somewhere
          For example if there was
          ```
            App.Comment = DS.Model.extend({
              name: DS.attr()
            })
          ```
          but there is also
          ```
            App.Post = DS.Model.extend({
              name: DS.attr(),
              comments: DS.hasMany('comment')
            })
          ```

          would have a implicit post relationship in order to be do things like remove ourselves from the post
          when we are deleted
        */
        this._implicitRelationships = Ember.create(null);
        var model = this;
        //TODO Move into a getter for better perf
        this.constructor.eachRelationship(function(key, descriptor) {
          model._relationships[key] = ember$data$lib$system$relationships$state$create$$default(model, descriptor, model.store);
        });

      },

      /**
        @method send
        @private
        @param {String} name
        @param {Object} context
      */
      send: function(name, context) {
        var currentState = ember$data$lib$system$model$model$$get(this, 'currentState');

        if (!currentState[name]) {
          this._unhandledEvent(currentState, name, context);
        }

        return currentState[name](this, context);
      },

      /**
        @method transitionTo
        @private
        @param {String} name
      */
      transitionTo: function(name) {
        // POSSIBLE TODO: Remove this code and replace with
        // always having direct references to state objects

        var pivotName = ember$data$lib$system$model$model$$extractPivotName(name);
        var currentState = ember$data$lib$system$model$model$$get(this, 'currentState');
        var state = currentState;

        do {
          if (state.exit) { state.exit(this); }
          state = state.parentState;
        } while (!state.hasOwnProperty(pivotName));

        var path = ember$data$lib$system$model$model$$splitOnDot(name);
        var setups = [];
        var enters = [];
        var i, l;

        for (i=0, l=path.length; i<l; i++) {
          state = state[path[i]];

          if (state.enter) { enters.push(state); }
          if (state.setup) { setups.push(state); }
        }

        for (i=0, l=enters.length; i<l; i++) {
          enters[i].enter(this);
        }

        ember$data$lib$system$model$model$$set(this, 'currentState', state);

        for (i=0, l=setups.length; i<l; i++) {
          setups[i].setup(this);
        }

        this.updateRecordArraysLater();
      },

      _unhandledEvent: function(state, name, context) {
        var errorMessage = "Attempted to handle event `" + name + "` ";
        errorMessage    += "on " + String(this) + " while in state ";
        errorMessage    += state.stateName + ". ";

        if (context !== undefined) {
          errorMessage  += "Called with " + Ember.inspect(context) + ".";
        }

        throw new Ember.Error(errorMessage);
      },

      withTransaction: function(fn) {
        var transaction = ember$data$lib$system$model$model$$get(this, 'transaction');
        if (transaction) { fn(transaction); }
      },

      /**
        @method loadingData
        @private
        @param {Promise} promise
      */
      loadingData: function(promise) {
        this.send('loadingData', promise);
      },

      /**
        @method loadedData
        @private
      */
      loadedData: function() {
        this.send('loadedData');
      },

      /**
        @method notFound
        @private
      */
      notFound: function() {
        this.send('notFound');
      },

      /**
        @method pushedData
        @private
      */
      pushedData: function() {
        this.send('pushedData');
      },

      /**
        Marks the record as deleted but does not save it. You must call
        `save` afterwards if you want to persist it. You might use this
        method if you want to allow the user to still `rollback()` a
        delete after it was made.

        Example

        ```javascript
        App.ModelDeleteRoute = Ember.Route.extend({
          actions: {
            softDelete: function() {
              this.controller.get('model').deleteRecord();
            },
            confirm: function() {
              this.controller.get('model').save();
            },
            undo: function() {
              this.controller.get('model').rollback();
            }
          }
        });
        ```

        @method deleteRecord
      */
      deleteRecord: function() {
        this.send('deleteRecord');
      },

      /**
        Same as `deleteRecord`, but saves the record immediately.

        Example

        ```javascript
        App.ModelDeleteRoute = Ember.Route.extend({
          actions: {
            delete: function() {
              var controller = this.controller;
              controller.get('model').destroyRecord().then(function() {
                controller.transitionToRoute('model.index');
              });
            }
          }
        });
        ```

        @method destroyRecord
        @return {Promise} a promise that will be resolved when the adapter returns
        successfully or rejected if the adapter returns with an error.
      */
      destroyRecord: function() {
        this.deleteRecord();
        return this.save();
      },

      /**
        @method unloadRecord
        @private
      */
      unloadRecord: function() {
        if (this.isDestroyed) { return; }

        this.send('unloadRecord');
      },

      /**
        @method clearRelationships
        @private
      */
      clearRelationships: function() {
        this.eachRelationship(function(name, relationship) {
          var rel = this._relationships[name];
          if (rel) {
            //TODO(Igor) figure out whether we want to clear or disconnect
            rel.clear();
            rel.destroy();
          }
        }, this);
        var model = this;
        ember$data$lib$system$model$model$$forEach.call(Ember.keys(this._implicitRelationships), function(key) {
          model._implicitRelationships[key].clear();
          model._implicitRelationships[key].destroy();
        });
      },

      disconnectRelationships: function() {
        this.eachRelationship(function(name, relationship) {
          this._relationships[name].disconnect();
        }, this);
        var model = this;
        ember$data$lib$system$model$model$$forEach.call(Ember.keys(this._implicitRelationships), function(key) {
          model._implicitRelationships[key].disconnect();
        });
      },

      reconnectRelationships: function() {
        this.eachRelationship(function(name, relationship) {
          this._relationships[name].reconnect();
        }, this);
        var model = this;
        ember$data$lib$system$model$model$$forEach.call(Ember.keys(this._implicitRelationships), function(key) {
          model._implicitRelationships[key].reconnect();
        });
      },


      /**
        @method updateRecordArrays
        @private
      */
      updateRecordArrays: function() {
        this._updatingRecordArraysLater = false;
        this.store.dataWasUpdated(this.constructor, this);
      },

      /**
        When a find request is triggered on the store, the user can optionally pass in
        attributes and relationships to be preloaded. These are meant to behave as if they
        came back from the server, except the user obtained them out of band and is informing
        the store of their existence. The most common use case is for supporting client side
        nested URLs, such as `/posts/1/comments/2` so the user can do
        `store.find('comment', 2, {post:1})` without having to fetch the post.

        Preloaded data can be attributes and relationships passed in either as IDs or as actual
        models.

        @method _preloadData
        @private
        @param {Object} preload
      */
      _preloadData: function(preload) {
        var record = this;
        //TODO(Igor) consider the polymorphic case
        ember$data$lib$system$model$model$$forEach.call(Ember.keys(preload), function(key) {
          var preloadValue = ember$data$lib$system$model$model$$get(preload, key);
          var relationshipMeta = record.constructor.metaForProperty(key);
          if (relationshipMeta.isRelationship) {
            record._preloadRelationship(key, preloadValue);
          } else {
            ember$data$lib$system$model$model$$get(record, '_data')[key] = preloadValue;
          }
        });
      },

      _preloadRelationship: function(key, preloadValue) {
        var relationshipMeta = this.constructor.metaForProperty(key);
        var type = relationshipMeta.type;
        if (relationshipMeta.kind === 'hasMany') {
          this._preloadHasMany(key, preloadValue, type);
        } else {
          this._preloadBelongsTo(key, preloadValue, type);
        }
      },

      _preloadHasMany: function(key, preloadValue, type) {
        Ember.assert("You need to pass in an array to set a hasMany property on a record", Ember.isArray(preloadValue));
        var record = this;

        var recordsToSet = ember$data$lib$system$model$model$$map.call(preloadValue, function(recordToPush) {
          return record._convertStringOrNumberIntoRecord(recordToPush, type);
        });
        //We use the pathway of setting the hasMany as if it came from the adapter
        //because the user told us that they know this relationships exists already
        this._relationships[key].updateRecordsFromAdapter(recordsToSet);
      },

      _preloadBelongsTo: function(key, preloadValue, type) {
        var recordToSet = this._convertStringOrNumberIntoRecord(preloadValue, type);

        //We use the pathway of setting the hasMany as if it came from the adapter
        //because the user told us that they know this relationships exists already
        this._relationships[key].setRecord(recordToSet);
      },

      _convertStringOrNumberIntoRecord: function(value, type) {
        if (Ember.typeOf(value) === 'string' || Ember.typeOf(value) === 'number') {
          return this.store.recordForId(type, value);
        }
        return value;
      },

      /**
        @method _notifyProperties
        @private
      */
      _notifyProperties: function(keys) {
        Ember.beginPropertyChanges();
        var key;
        for (var i = 0, length = keys.length; i < length; i++) {
          key = keys[i];
          this.notifyPropertyChange(key);
        }
        Ember.endPropertyChanges();
      },

      /**
        Returns an object, whose keys are changed properties, and value is
        an [oldProp, newProp] array.

        Example

        ```javascript
        var attr = DS.attr;
        App.Mascot = DS.Model.extend({
          name: attr('string')
        });

        var mascot = store.createRecord('mascot');
        mascot.changedAttributes(); // {}
        mascot.set('name', 'Tomster');
        mascot.changedAttributes(); // {name: [undefined, 'Tomster']}
        ```

        @method changedAttributes
        @return {Object} an object, whose keys are changed properties,
          and value is an [oldProp, newProp] array.
      */
      changedAttributes: function() {
        var oldData = ember$data$lib$system$model$model$$get(this, '_data');
        var newData = ember$data$lib$system$model$model$$get(this, '_attributes');
        var diffData = {};
        var prop;

        for (prop in newData) {
          diffData[prop] = [oldData[prop], newData[prop]];
        }

        return diffData;
      },

      /**
        @method adapterWillCommit
        @private
      */
      adapterWillCommit: function() {
        this.send('willCommit');
      },

      /**
        If the adapter did not return a hash in response to a commit,
        merge the changed attributes and relationships into the existing
        saved data.

        @method adapterDidCommit
      */
      adapterDidCommit: function(data) {
        var changedKeys;
        ember$data$lib$system$model$model$$set(this, 'isError', false);

        if (data) {
          changedKeys = ember$data$lib$system$model$model$$mergeAndReturnChangedKeys(this._data, data);
        } else {
          ember$data$lib$system$merge$$default(this._data, this._inFlightAttributes);
        }

        this._inFlightAttributes = Ember.create(null);

        this.send('didCommit');
        this.updateRecordArraysLater();

        if (!data) { return; }

        this._notifyProperties(changedKeys);
      },

      /**
        @method adapterDidDirty
        @private
      */
      adapterDidDirty: function() {
        this.send('becomeDirty');
        this.updateRecordArraysLater();
      },


      /**
        @method updateRecordArraysLater
        @private
      */
      updateRecordArraysLater: function() {
        // quick hack (something like this could be pushed into run.once
        if (this._updatingRecordArraysLater) { return; }
        this._updatingRecordArraysLater = true;

        Ember.run.schedule('actions', this, this.updateRecordArrays);
      },

      /**
        @method setupData
        @private
        @param {Object} data
      */
      setupData: function(data) {
        Ember.assert("Expected an object as `data` in `setupData`", Ember.typeOf(data) === 'object');

        var changedKeys = ember$data$lib$system$model$model$$mergeAndReturnChangedKeys(this._data, data);

        this.pushedData();

        this._notifyProperties(changedKeys);
      },

      materializeId: function(id) {
        ember$data$lib$system$model$model$$set(this, 'id', id);
      },

      materializeAttributes: function(attributes) {
        Ember.assert("Must pass an object to materializeAttributes", !!attributes);
        ember$data$lib$system$merge$$default(this._data, attributes);
      },

      materializeAttribute: function(name, value) {
        this._data[name] = value;
      },

      /**
        If the model `isDirty` this function will discard any unsaved
        changes

        Example

        ```javascript
        record.get('name'); // 'Untitled Document'
        record.set('name', 'Doc 1');
        record.get('name'); // 'Doc 1'
        record.rollback();
        record.get('name'); // 'Untitled Document'
        ```

        @method rollback
      */
      rollback: function() {
        var dirtyKeys = Ember.keys(this._attributes);

        this._attributes = Ember.create(null);

        if (ember$data$lib$system$model$model$$get(this, 'isError')) {
          this._inFlightAttributes = Ember.create(null);
          ember$data$lib$system$model$model$$set(this, 'isError', false);
        }

        //Eventually rollback will always work for relationships
        //For now we support it only out of deleted state, because we
        //have an explicit way of knowing when the server acked the relationship change
        if (ember$data$lib$system$model$model$$get(this, 'isDeleted')) {
          this.reconnectRelationships();
        }

        if (ember$data$lib$system$model$model$$get(this, 'isNew')) {
          this.clearRelationships();
        }

        if (!ember$data$lib$system$model$model$$get(this, 'isValid')) {
          this._inFlightAttributes = Ember.create(null);
        }

        this.send('rolledBack');

        this._notifyProperties(dirtyKeys);
      },

      /**
        @method _createSnapshot
        @private
      */
      _createSnapshot: function() {
        return new ember$data$lib$system$snapshot$$default(this);
      },

      toStringExtension: function() {
        return ember$data$lib$system$model$model$$get(this, 'id');
      },

      /**
        Save the record and persist any changes to the record to an
        external source via the adapter.

        Example

        ```javascript
        record.set('name', 'Tomster');
        record.save().then(function() {
          // Success callback
        }, function() {
          // Error callback
        });
        ```
        @method save
        @return {Promise} a promise that will be resolved when the adapter returns
        successfully or rejected if the adapter returns with an error.
      */
      save: function() {
        var promiseLabel = "DS: Model#save " + this;
        var resolver = Ember.RSVP.defer(promiseLabel);

        this.store.scheduleSave(this, resolver);
        this._inFlightAttributes = this._attributes;
        this._attributes = Ember.create(null);

        return ember$data$lib$system$promise$proxies$$PromiseObject.create({
          promise: resolver.promise
        });
      },

      /**
        Reload the record from the adapter.

        This will only work if the record has already finished loading
        and has not yet been modified (`isLoaded` but not `isDirty`,
        or `isSaving`).

        Example

        ```javascript
        App.ModelViewRoute = Ember.Route.extend({
          actions: {
            reload: function() {
              this.controller.get('model').reload().then(function(model) {
                // do something with the reloaded model
              });
            }
          }
        });
        ```

        @method reload
        @return {Promise} a promise that will be resolved with the record when the
        adapter returns successfully or rejected if the adapter returns
        with an error.
      */
      reload: function() {
        ember$data$lib$system$model$model$$set(this, 'isReloading', true);

        var record = this;
        var promiseLabel = "DS: Model#reload of " + this;
        var promise = new ember$data$lib$system$model$model$$Promise(function(resolve) {
          record.send('reloadRecord', resolve);
        }, promiseLabel).then(function() {
          record.set('isError', false);
          return record;
        }, function(reason) {
          record.set('isError', true);
          throw reason;
        }, "DS: Model#reload complete, update flags")['finally'](function () {
          record.set('isReloading', false);
          record.updateRecordArrays();
        });

        return ember$data$lib$system$promise$proxies$$PromiseObject.create({
          promise: promise
        });
      },

      // FOR USE DURING COMMIT PROCESS

      /**
        @method adapterDidInvalidate
        @private
      */
      adapterDidInvalidate: function(errors) {
        var recordErrors = ember$data$lib$system$model$model$$get(this, 'errors');
        for (var key in errors) {
          if (!errors.hasOwnProperty(key)) {
            continue;
          }
          recordErrors.add(key, errors[key]);
        }
        this._saveWasRejected();
      },

      /**
        @method adapterDidError
        @private
      */
      adapterDidError: function() {
        this.send('becameError');
        ember$data$lib$system$model$model$$set(this, 'isError', true);
        this._saveWasRejected();
      },

      _saveWasRejected: function() {
        var keys = Ember.keys(this._inFlightAttributes);
        for (var i=0; i < keys.length; i++) {
          if (this._attributes[keys[i]] === undefined) {
            this._attributes[keys[i]] = this._inFlightAttributes[keys[i]];
          }
        }
        this._inFlightAttributes = Ember.create(null);
      },

      /**
        Override the default event firing from Ember.Evented to
        also call methods with the given name.

        @method trigger
        @private
        @param {String} name
      */
      trigger: function() {
        var length = arguments.length;
        var args = new Array(length - 1);
        var name = arguments[0];

        for (var i = 1; i < length; i++) {
          args[i - 1] = arguments[i];
        }

        Ember.tryInvoke(this, name, args);
        this._super.apply(this, arguments);
      },

      triggerLater: function() {
        var length = arguments.length;
        var args = new Array(length);

        for (var i = 0; i < length; i++) {
          args[i] = arguments[i];
        }

        if (this._deferredTriggers.push(args) !== 1) {
          return;
        }
        Ember.run.schedule('actions', this, '_triggerDeferredTriggers');
      },

      _triggerDeferredTriggers: function() {
        for (var i=0, l= this._deferredTriggers.length; i<l; i++) {
          this.trigger.apply(this, this._deferredTriggers[i]);
        }

        this._deferredTriggers.length = 0;
      },

      willDestroy: function() {
        this._super.apply(this, arguments);
        this.clearRelationships();
      },

      // This is a temporary solution until we refactor DS.Model to not
      // rely on the data property.
      willMergeMixin: function(props) {
        var constructor = this.constructor;
        Ember.assert('`' + ember$data$lib$system$model$model$$intersection(Ember.keys(props), ember$data$lib$system$model$model$$RESERVED_MODEL_PROPS)[0] + '` is a reserved property name on DS.Model objects. Please choose a different property name for ' + constructor.toString(), !ember$data$lib$system$model$model$$intersection(Ember.keys(props), ember$data$lib$system$model$model$$RESERVED_MODEL_PROPS)[0]);
      },

      attr: function() {
        Ember.assert("The `attr` method is not available on DS.Model, a DS.Snapshot was probably expected. Are you passing a DS.Model instead of a DS.Snapshot to your serializer?", false);
      },

      belongsTo: function() {
        Ember.assert("The `belongsTo` method is not available on DS.Model, a DS.Snapshot was probably expected. Are you passing a DS.Model instead of a DS.Snapshot to your serializer?", false);
      },

      hasMany: function() {
        Ember.assert("The `hasMany` method is not available on DS.Model, a DS.Snapshot was probably expected. Are you passing a DS.Model instead of a DS.Snapshot to your serializer?", false);
      }
    });

    ember$data$lib$system$model$model$$Model.reopenClass({
      /**
        Alias DS.Model's `create` method to `_create`. This allows us to create DS.Model
        instances from within the store, but if end users accidentally call `create()`
        (instead of `createRecord()`), we can raise an error.

        @method _create
        @private
        @static
      */
      _create: ember$data$lib$system$model$model$$Model.create,

      /**
        Override the class' `create()` method to raise an error. This
        prevents end users from inadvertently calling `create()` instead
        of `createRecord()`. The store is still able to create instances
        by calling the `_create()` method. To create an instance of a
        `DS.Model` use [store.createRecord](DS.Store.html#method_createRecord).

        @method create
        @private
        @static
      */
      create: function() {
        throw new Ember.Error("You should not call `create` on a model. Instead, call `store.createRecord` with the attributes you would like to set.");
      },

      /**
       Represents the model's class name as a string. This can be used to look up the model through
       DS.Store's modelFor method.

       `modelName` is generated for you by Ember Data. It will be a lowercased, dasherized string.
       For example:

       ```javascript
       store.modelFor('post').modelName; // 'post'
       store.modelFor('blog-post').modelName; // 'blog-post'
       ```

       The most common place you'll want to access `modelName` is in your serializer's `payloadKeyFromModelName` method. For example, to change payload
       keys to underscore (instead of dasherized), you might use the following code:

       ```javascript
       export default var PostSerializer = DS.RESTSerializer.extend({
         payloadKeyFromModelName: function(modelName) {
           return Ember.String.underscore(modelName);
         }
       });
       ```
       @property
       @type String
       @readonly
      */
      modelName: null
    });

    var ember$data$lib$system$model$model$$default = ember$data$lib$system$model$model$$Model;
    var ember$data$lib$utils$supports$computed$getter$setter$$supportsComputedGetterSetter;

    try {
      Ember.computed({
        get: function() { },
        set: function() { }
      });
      ember$data$lib$utils$supports$computed$getter$setter$$supportsComputedGetterSetter = true;
    } catch(e) {
      ember$data$lib$utils$supports$computed$getter$setter$$supportsComputedGetterSetter = false;
    }

    var ember$data$lib$utils$supports$computed$getter$setter$$default = ember$data$lib$utils$supports$computed$getter$setter$$supportsComputedGetterSetter;

    var ember$data$lib$utils$computed$polyfill$$computed = Ember.computed;

    var ember$data$lib$utils$computed$polyfill$$default = function() {
      var polyfillArguments = [];
      var config = arguments[arguments.length - 1];

      if (typeof config === 'function' || ember$data$lib$utils$supports$computed$getter$setter$$default) {
        return ember$data$lib$utils$computed$polyfill$$computed.apply(null, arguments);
      }

      for (var i = 0, l = arguments.length - 1; i < l; i++) {
        polyfillArguments.push(arguments[i]);
      }

      var func;
      if (config.set) {
        func = function(key, value) {
          if (arguments.length > 1) {
            return config.set.call(this, key, value);
          } else {
            return config.get.call(this, key);
          }
        };
      } else {
        func = function(key) {
          return config.get.call(this, key);
        };
      }

      polyfillArguments.push(func);

      return ember$data$lib$utils$computed$polyfill$$computed.apply(null, polyfillArguments);
    };

    /**
      @module ember-data
    */

    var ember$data$lib$system$model$attributes$$get = Ember.get;

    /**
      @class Model
      @namespace DS
    */
    ember$data$lib$system$model$model$$default.reopenClass({
      /**
        A map whose keys are the attributes of the model (properties
        described by DS.attr) and whose values are the meta object for the
        property.

        Example

        ```javascript

        App.Person = DS.Model.extend({
          firstName: attr('string'),
          lastName: attr('string'),
          birthday: attr('date')
        });

        var attributes = Ember.get(App.Person, 'attributes')

        attributes.forEach(function(name, meta) {
          console.log(name, meta);
        });

        // prints:
        // firstName {type: "string", isAttribute: true, options: Object, parentType: function, name: "firstName"}
        // lastName {type: "string", isAttribute: true, options: Object, parentType: function, name: "lastName"}
        // birthday {type: "date", isAttribute: true, options: Object, parentType: function, name: "birthday"}
        ```

        @property attributes
        @static
        @type {Ember.Map}
        @readOnly
      */
      attributes: Ember.computed(function() {
        var map = ember$data$lib$system$map$$Map.create();

        this.eachComputedProperty(function(name, meta) {
          if (meta.isAttribute) {
            Ember.assert("You may not set `id` as an attribute on your model. Please remove any lines that look like: `id: DS.attr('<type>')` from " + this.toString(), name !== 'id');

            meta.name = name;
            map.set(name, meta);
          }
        });

        return map;
      }).readOnly(),

      /**
        A map whose keys are the attributes of the model (properties
        described by DS.attr) and whose values are type of transformation
        applied to each attribute. This map does not include any
        attributes that do not have an transformation type.

        Example

        ```javascript
        App.Person = DS.Model.extend({
          firstName: attr(),
          lastName: attr('string'),
          birthday: attr('date')
        });

        var transformedAttributes = Ember.get(App.Person, 'transformedAttributes')

        transformedAttributes.forEach(function(field, type) {
          console.log(field, type);
        });

        // prints:
        // lastName string
        // birthday date
        ```

        @property transformedAttributes
        @static
        @type {Ember.Map}
        @readOnly
      */
      transformedAttributes: Ember.computed(function() {
        var map = ember$data$lib$system$map$$Map.create();

        this.eachAttribute(function(key, meta) {
          if (meta.type) {
            map.set(key, meta.type);
          }
        });

        return map;
      }).readOnly(),

      /**
        Iterates through the attributes of the model, calling the passed function on each
        attribute.

        The callback method you provide should have the following signature (all
        parameters are optional):

        ```javascript
        function(name, meta);
        ```

        - `name` the name of the current property in the iteration
        - `meta` the meta object for the attribute property in the iteration

        Note that in addition to a callback, you can also pass an optional target
        object that will be set as `this` on the context.

        Example

        ```javascript
        App.Person = DS.Model.extend({
          firstName: attr('string'),
          lastName: attr('string'),
          birthday: attr('date')
        });

        App.Person.eachAttribute(function(name, meta) {
          console.log(name, meta);
        });

        // prints:
        // firstName {type: "string", isAttribute: true, options: Object, parentType: function, name: "firstName"}
        // lastName {type: "string", isAttribute: true, options: Object, parentType: function, name: "lastName"}
        // birthday {type: "date", isAttribute: true, options: Object, parentType: function, name: "birthday"}
       ```

        @method eachAttribute
        @param {Function} callback The callback to execute
        @param {Object} [target] The target object to use
        @static
      */
      eachAttribute: function(callback, binding) {
        ember$data$lib$system$model$attributes$$get(this, 'attributes').forEach(function(meta, name) {
          callback.call(binding, name, meta);
        }, binding);
      },

      /**
        Iterates through the transformedAttributes of the model, calling
        the passed function on each attribute. Note the callback will not be
        called for any attributes that do not have an transformation type.

        The callback method you provide should have the following signature (all
        parameters are optional):

        ```javascript
        function(name, type);
        ```

        - `name` the name of the current property in the iteration
        - `type` a string containing the name of the type of transformed
          applied to the attribute

        Note that in addition to a callback, you can also pass an optional target
        object that will be set as `this` on the context.

        Example

        ```javascript
        App.Person = DS.Model.extend({
          firstName: attr(),
          lastName: attr('string'),
          birthday: attr('date')
        });

        App.Person.eachTransformedAttribute(function(name, type) {
          console.log(name, type);
        });

        // prints:
        // lastName string
        // birthday date
       ```

        @method eachTransformedAttribute
        @param {Function} callback The callback to execute
        @param {Object} [target] The target object to use
        @static
      */
      eachTransformedAttribute: function(callback, binding) {
        ember$data$lib$system$model$attributes$$get(this, 'transformedAttributes').forEach(function(type, name) {
          callback.call(binding, name, type);
        });
      }
    });


    ember$data$lib$system$model$model$$default.reopen({
      eachAttribute: function(callback, binding) {
        this.constructor.eachAttribute(callback, binding);
      }
    });

    function ember$data$lib$system$model$attributes$$getDefaultValue(record, options, key) {
      if (typeof options.defaultValue === "function") {
        return options.defaultValue.apply(null, arguments);
      } else {
        return options.defaultValue;
      }
    }

    function ember$data$lib$system$model$attributes$$hasValue(record, key) {
      return key in record._attributes ||
             key in record._inFlightAttributes ||
             record._data.hasOwnProperty(key);
    }

    function ember$data$lib$system$model$attributes$$getValue(record, key) {
      if (key in record._attributes) {
        return record._attributes[key];
      } else if (key in record._inFlightAttributes) {
        return record._inFlightAttributes[key];
      } else {
        return record._data[key];
      }
    }

    function ember$data$lib$system$model$attributes$$attr(type, options) {
      if (typeof type === 'object') {
        options = type;
        type = undefined;
      } else {
        options = options || {};
      }

      var meta = {
        type: type,
        isAttribute: true,
        options: options
      };

      return ember$data$lib$utils$computed$polyfill$$default({
        get: function(key) {
          if (ember$data$lib$system$model$attributes$$hasValue(this, key)) {
            return ember$data$lib$system$model$attributes$$getValue(this, key);
          } else {
            return ember$data$lib$system$model$attributes$$getDefaultValue(this, options, key);
          }
        },
        set: function(key, value) {
          Ember.assert("You may not set `id` as an attribute on your model. Please remove any lines that look like: `id: DS.attr('<type>')` from " + this.constructor.toString(), key !== 'id');
          var oldValue = ember$data$lib$system$model$attributes$$getValue(this, key);

          if (value !== oldValue) {
            // Add the new value to the changed attributes hash; it will get deleted by
            // the 'didSetProperty' handler if it is no different from the original value
            this._attributes[key] = value;

            this.send('didSetProperty', {
              name: key,
              oldValue: oldValue,
              originalValue: this._data[key],
              value: value
            });
          }

          return value;
        }
      }).meta(meta);
    }
    var ember$data$lib$system$model$attributes$$default = ember$data$lib$system$model$attributes$$attr;
    var ember$data$lib$system$model$$default = ember$data$lib$system$model$model$$default;

    //Stanley told me to do this
    var ember$data$lib$system$store$$Backburner = Ember.__loader.require('backburner')['default'] || Ember.__loader.require('backburner')['Backburner'];

    //Shim Backburner.join
    if (!ember$data$lib$system$store$$Backburner.prototype.join) {
      var ember$data$lib$system$store$$isString = function(suspect) {
        return typeof suspect === 'string';
      };

      ember$data$lib$system$store$$Backburner.prototype.join = function(/*target, method, args */) {
        var method, target;

        if (this.currentInstance) {
          var length = arguments.length;
          if (length === 1) {
            method = arguments[0];
            target = null;
          } else {
            target = arguments[0];
            method = arguments[1];
          }

          if (ember$data$lib$system$store$$isString(method)) {
            method = target[method];
          }

          if (length === 1) {
            return method();
          } else if (length === 2) {
            return method.call(target);
          } else {
            var args = new Array(length - 2);
            for (var i =0, l = length - 2; i < l; i++) {
              args[i] = arguments[i + 2];
            }
            return method.apply(target, args);
          }
        } else {
          return this.run.apply(this, arguments);
        }
      };
    }


    var ember$data$lib$system$store$$get = Ember.get;
    var ember$data$lib$system$store$$set = Ember.set;
    var ember$data$lib$system$store$$once = Ember.run.once;
    var ember$data$lib$system$store$$isNone = Ember.isNone;
    var ember$data$lib$system$store$$forEach = Ember.EnumerableUtils.forEach;
    var ember$data$lib$system$store$$indexOf = Ember.EnumerableUtils.indexOf;
    var ember$data$lib$system$store$$map = Ember.EnumerableUtils.map;
    var ember$data$lib$system$store$$Promise = Ember.RSVP.Promise;
    var ember$data$lib$system$store$$copy = Ember.copy;
    var ember$data$lib$system$store$$Store;

    var ember$data$lib$system$store$$Service = Ember.Service;
    if (!ember$data$lib$system$store$$Service) {
      ember$data$lib$system$store$$Service = Ember.Object;
    }

    // Implementors Note:
    //
    //   The variables in this file are consistently named according to the following
    //   scheme:
    //
    //   * +id+ means an identifier managed by an external source, provided inside
    //     the data provided by that source. These are always coerced to be strings
    //     before being used internally.
    //   * +clientId+ means a transient numerical identifier generated at runtime by
    //     the data store. It is important primarily because newly created objects may
    //     not yet have an externally generated id.
    //   * +reference+ means a record reference object, which holds metadata about a
    //     record, even if it has not yet been fully materialized.
    //   * +type+ means a subclass of DS.Model.

    // Used by the store to normalize IDs entering the store.  Despite the fact
    // that developers may provide IDs as numbers (e.g., `store.find(Person, 1)`),
    // it is important that internally we use strings, since IDs may be serialized
    // and lose type information.  For example, Ember's router may put a record's
    // ID into the URL, and if we later try to deserialize that URL and find the
    // corresponding record, we will not know if it is a string or a number.
    function ember$data$lib$system$store$$coerceId(id) {
      return id == null ? null : id+'';
    }

    /**
      The store contains all of the data for records loaded from the server.
      It is also responsible for creating instances of `DS.Model` that wrap
      the individual data for a record, so that they can be bound to in your
      Handlebars templates.

      Define your application's store like this:

      ```javascript
      MyApp.ApplicationStore = DS.Store.extend();
      ```

      Most Ember.js applications will only have a single `DS.Store` that is
      automatically created by their `Ember.Application`.

      You can retrieve models from the store in several ways. To retrieve a record
      for a specific id, use `DS.Store`'s `find()` method:

      ```javascript
      store.find('person', 123).then(function (person) {
      });
      ```

      By default, the store will talk to your backend using a standard
      REST mechanism. You can customize how the store talks to your
      backend by specifying a custom adapter:

      ```javascript
      MyApp.ApplicationAdapter = MyApp.CustomAdapter
      ```

      You can learn more about writing a custom adapter by reading the `DS.Adapter`
      documentation.

      ### Store createRecord() vs. push() vs. pushPayload()

      The store provides multiple ways to create new record objects. They have
      some subtle differences in their use which are detailed below:

      [createRecord](#method_createRecord) is used for creating new
      records on the client side. This will return a new record in the
      `created.uncommitted` state. In order to persist this record to the
      backend you will need to call `record.save()`.

      [push](#method_push) is used to notify Ember Data's store of new or
      updated records that exist in the backend. This will return a record
      in the `loaded.saved` state. The primary use-case for `store#push` is
      to notify Ember Data about record updates (full or partial) that happen
      outside of the normal adapter methods (for example
      [SSE](http://dev.w3.org/html5/eventsource/) or [Web
      Sockets](http://www.w3.org/TR/2009/WD-websockets-20091222/)).

      [pushPayload](#method_pushPayload) is a convenience wrapper for
      `store#push` that will deserialize payloads if the
      Serializer implements a `pushPayload` method.

      Note: When creating a new record using any of the above methods
      Ember Data will update `DS.RecordArray`s such as those returned by
      `store#all()`, `store#findAll()` or `store#filter()`. This means any
      data bindings or computed properties that depend on the RecordArray
      will automatically be synced to include the new or updated record
      values.

      @class Store
      @namespace DS
      @extends Ember.Service
    */
    ember$data$lib$system$store$$Store = ember$data$lib$system$store$$Service.extend({

      /**
        @method init
        @private
      */
      init: function() {
        this._backburner = new ember$data$lib$system$store$$Backburner(['normalizeRelationships', 'syncRelationships', 'finished']);
        // internal bookkeeping; not observable
        this.typeMaps = {};
        this.recordArrayManager = ember$data$lib$system$record$array$manager$$default.create({
          store: this
        });
        this._pendingSave = [];
        this._containerCache = Ember.create(null);
        //Used to keep track of all the find requests that need to be coalesced
        this._pendingFetch = ember$data$lib$system$map$$Map.create();
      },

      /**
        The adapter to use to communicate to a backend server or other persistence layer.

        This can be specified as an instance, class, or string.

        If you want to specify `App.CustomAdapter` as a string, do:

        ```js
        adapter: 'custom'
        ```

        @property adapter
        @default DS.RESTAdapter
        @type {DS.Adapter|String}
      */
      adapter: '-rest',

      /**
        Returns a JSON representation of the record using a custom
        type-specific serializer, if one exists.

        The available options are:

        * `includeId`: `true` if the record's ID should be included in
          the JSON representation

        @method serialize
        @private
        @param {DS.Model} record the record to serialize
        @param {Object} options an options hash
      */
      serialize: function(record, options) {
        var snapshot = record._createSnapshot();
        return this.serializerFor(snapshot.modelName).serialize(snapshot, options);
      },

      /**
        This property returns the adapter, after resolving a possible
        string key.

        If the supplied `adapter` was a class, or a String property
        path resolved to a class, this property will instantiate the
        class.

        This property is cacheable, so the same instance of a specified
        adapter class should be used for the lifetime of the store.

        @property defaultAdapter
        @private
        @return DS.Adapter
      */
      defaultAdapter: Ember.computed('adapter', function() {
        var adapter = ember$data$lib$system$store$$get(this, 'adapter');

        Ember.assert('You tried to set `adapter` property to an instance of `DS.Adapter`, where it should be a name or a factory', !(adapter instanceof ember$data$lib$system$adapter$$Adapter));

        if (typeof adapter === 'string') {
          adapter = this.container.lookup('adapter:' + adapter) || this.container.lookup('adapter:application') || this.container.lookup('adapter:-rest');
        }

        if (DS.Adapter.detect(adapter)) {
          adapter = adapter.create({
            container: this.container,
            store: this
          });
        }

        return adapter;
      }),

      // .....................
      // . CREATE NEW RECORD .
      // .....................

      /**
        Create a new record in the current store. The properties passed
        to this method are set on the newly created record.

        To create a new instance of `App.Post`:

        ```js
        store.createRecord('post', {
          title: "Rails is omakase"
        });
        ```

        @method createRecord
        @param {String} modelName
        @param {Object} properties a hash of properties to set on the
          newly created record.
        @return {DS.Model} record
      */
      createRecord: function(modelName, inputProperties) {
        var typeClass = this.modelFor(modelName);
        var properties = ember$data$lib$system$store$$copy(inputProperties) || {};

        // If the passed properties do not include a primary key,
        // give the adapter an opportunity to generate one. Typically,
        // client-side ID generators will use something like uuid.js
        // to avoid conflicts.

        if (ember$data$lib$system$store$$isNone(properties.id)) {
          properties.id = this._generateId(typeClass, properties);
        }

        // Coerce ID to a string
        properties.id = ember$data$lib$system$store$$coerceId(properties.id);

        var record = this.buildRecord(typeClass, properties.id);

        // Move the record out of its initial `empty` state into
        // the `loaded` state.
        record.loadedData();

        // Set the properties specified on the record.
        record.setProperties(properties);

        record.eachRelationship(function(key, descriptor) {
          record._relationships[key].setHasData(true);
        });

        return record;
      },

      /**
        If possible, this method asks the adapter to generate an ID for
        a newly created record.

        @method _generateId
        @private
        @param {String} modelName
        @param {Object} properties from the new record
        @return {String} if the adapter can generate one, an ID
      */
      _generateId: function(modelName, properties) {
        var adapter = this.adapterFor(modelName);

        if (adapter && adapter.generateIdForRecord) {
          return adapter.generateIdForRecord(this, modelName, properties);
        }

        return null;
      },

      // .................
      // . DELETE RECORD .
      // .................

      /**
        For symmetry, a record can be deleted via the store.

        Example

        ```javascript
        var post = store.createRecord('post', {
          title: "Rails is omakase"
        });

        store.deleteRecord(post);
        ```

        @method deleteRecord
        @param {DS.Model} record
      */
      deleteRecord: function(record) {
        record.deleteRecord();
      },

      /**
        For symmetry, a record can be unloaded via the store. Only
        non-dirty records can be unloaded.

        Example

        ```javascript
        store.find('post', 1).then(function(post) {
          store.unloadRecord(post);
        });
        ```

        @method unloadRecord
        @param {DS.Model} record
      */
      unloadRecord: function(record) {
        record.unloadRecord();
      },

      // ................
      // . FIND RECORDS .
      // ................

      /**
        This is the main entry point into finding records. The first parameter to
        this method is the model's name as a string.

        ---

        To find a record by ID, pass the `id` as the second parameter:

        ```javascript
        store.find('person', 1);
        ```

        The `find` method will always return a **promise** that will be resolved
        with the record. If the record was already in the store, the promise will
        be resolved immediately. Otherwise, the store will ask the adapter's `find`
        method to find the necessary data.

        The `find` method will always resolve its promise with the same object for
        a given type and `id`.

        ---

        You can optionally `preload` specific attributes and relationships that you know of
        by passing them as the third argument to find.

        For example, if your Ember route looks like `/posts/1/comments/2` and your API route
        for the comment also looks like `/posts/1/comments/2` if you want to fetch the comment
        without fetching the post you can pass in the post to the `find` call:

        ```javascript
        store.find('comment', 2, {post: 1});
        ```

        If you have access to the post model you can also pass the model itself:

        ```javascript
        store.find('post', 1).then(function (myPostModel) {
          store.find('comment', 2, {post: myPostModel});
        });
        ```

        This way, your adapter's `find` or `buildURL` method will be able to look up the
        relationship on the record and construct the nested URL without having to first
        fetch the post.

        ---

        To find all records for a type, call `find` with no additional parameters:

        ```javascript
        store.find('person');
        ```

        This will ask the adapter's `findAll` method to find the records for the
        given type, and return a promise that will be resolved once the server
        returns the values. The promise will resolve into all records of this type
        present in the store, even if the server only returns a subset of them.

        ---

        To find a record by a query, call `find` with a hash as the second
        parameter:

        ```javascript
        store.find('person', { page: 1 });
        ```

        By passing an object `{page: 1}` as an argument to the find method, it
        delegates to the adapter's findQuery method. The adapter then makes
        a call to the server, transforming the object `{page: 1}` as parameters
        that are sent along, and will return a RecordArray when the promise
        resolves.

        Exposing queries this way seems preferable to creating an abstract query
        language for all server-side queries, and then require all adapters to
        implement them.

        The call made to the server, using a Rails backend, will look something like this:

        ```
        Started GET "/api/v1/person?page=1"
        Processing by Api::V1::PersonsController#index as HTML
        Parameters: {"page"=>"1"}
        ```

        If you do something like this:

        ```javascript
        store.find('person', {ids: [1, 2, 3]});
        ```

        The call to the server, using a Rails backend, will look something like this:

        ```
        Started GET "/api/v1/person?ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3"
        Processing by Api::V1::PersonsController#index as HTML
        Parameters: {"ids"=>["1", "2", "3"]}
        ```

        @method find
        @param {String} modelName
        @param {Object|String|Integer|null} id
        @param {Object} preload - optional set of attributes and relationships passed in either as IDs or as actual models
        @return {Promise} promise
      */
      find: function(modelName, id, preload) {
        Ember.assert("You need to pass a type to the store's find method", arguments.length >= 1);
        Ember.assert("You may not pass `" + id + "` as id to the store's find method", arguments.length === 1 || !Ember.isNone(id));

        if (arguments.length === 1) {
          return this.findAll(modelName);
        }

        // We are passed a query instead of an id.
        if (Ember.typeOf(id) === 'object') {
          return this.findQuery(modelName, id);
        }

        return this.findById(modelName, ember$data$lib$system$store$$coerceId(id), preload);
      },

      /**
        This method returns a fresh record for a given type and id combination.

        If a record is available for the given type/id combination, then
        it will fetch this record from the store and call `reload()` on it.
        That will fire a request to server and return a promise that will
        resolve once the record has been reloaded.
        If there's no record corresponding in the store it will simply call
        `store.find`.

        Example

        ```javascript
        App.PostRoute = Ember.Route.extend({
          model: function(params) {
            return this.store.fetchById('post', params.post_id);
          }
        });
        ```

        @method fetchById
        @param {String} modelName
        @param {String|Integer} id
        @param {Object} preload - optional set of attributes and relationships passed in either as IDs or as actual models
        @return {Promise} promise
      */
      fetchById: function(modelName, id, preload) {
        if (this.hasRecordForId(modelName, id)) {
          return this.getById(modelName, id).reload();
        } else {
          return this.find(modelName, id, preload);
        }
      },

      /**
        This method returns a fresh collection from the server, regardless of if there is already records
        in the store or not.

        @method fetchAll
        @param {String} modelName
        @return {Promise} promise
      */
      fetchAll: function(modelName) {
        var typeClass = this.modelFor(modelName);

        return this._fetchAll(typeClass, this.all(modelName));
      },

      /**
        @method fetch
        @param {String} modelName
        @param {String|Integer} id
        @param {Object} preload - optional set of attributes and relationships passed in either as IDs or as actual models
        @return {Promise} promise
        @deprecated Use [fetchById](#method_fetchById) instead
      */
      fetch: function(modelName, id, preload) {
        Ember.deprecate('Using store.fetch() has been deprecated. Use store.fetchById for fetching individual records or store.fetchAll for collections');
        return this.fetchById(modelName, id, preload);
      },

      /**
        This method returns a record for a given type and id combination.

        @method findById
        @private
        @param {String} modelName
        @param {String|Integer} id
        @param {Object} preload - optional set of attributes and relationships passed in either as IDs or as actual models
        @return {Promise} promise
      */
      findById: function(modelName, id, preload) {

        var typeClass = this.modelFor(modelName);
        var record = this.recordForId(typeClass, id);

        return this._findByRecord(record, preload);
      },

      _findByRecord: function(record, preload) {
        var fetchedRecord;

        if (preload) {
          record._preloadData(preload);
        }

        if (ember$data$lib$system$store$$get(record, 'isEmpty')) {
          fetchedRecord = this.scheduleFetch(record);
          //TODO double check about reloading
        } else if (ember$data$lib$system$store$$get(record, 'isLoading')) {
          fetchedRecord = record._loadingPromise;
        }

        return ember$data$lib$system$promise$proxies$$promiseObject(fetchedRecord || record, "DS: Store#findByRecord " + record.modelName + " with id: " + ember$data$lib$system$store$$get(record, 'id'));
      },

      /**
        This method makes a series of requests to the adapter's `find` method
        and returns a promise that resolves once they are all loaded.

        @private
        @method findByIds
        @param {String} modelName
        @param {Array} ids
        @return {Promise} promise
      */
      findByIds: function(modelName, ids) {
        var store = this;

        return ember$data$lib$system$promise$proxies$$promiseArray(Ember.RSVP.all(ember$data$lib$system$store$$map(ids, function(id) {
          return store.findById(modelName, id);
        })).then(Ember.A, null, "DS: Store#findByIds of " + modelName + " complete"));
      },

      /**
        This method is called by `findById` if it discovers that a particular
        type/id pair hasn't been loaded yet to kick off a request to the
        adapter.

        @method fetchRecord
        @private
        @param {DS.Model} record
        @return {Promise} promise
      */
      fetchRecord: function(record) {
        var typeClass = record.constructor;
        var id = ember$data$lib$system$store$$get(record, 'id');
        var adapter = this.adapterFor(typeClass);

        Ember.assert("You tried to find a record but you have no adapter (for " + typeClass + ")", adapter);
        Ember.assert("You tried to find a record but your adapter (for " + typeClass + ") does not implement 'find'", typeof adapter.find === 'function');

        var promise = ember$data$lib$system$store$finders$$_find(adapter, this, typeClass, id, record);
        return promise;
      },

      scheduleFetchMany: function(records) {
        return ember$data$lib$system$store$$Promise.all(ember$data$lib$system$store$$map(records, this.scheduleFetch, this));
      },

      scheduleFetch: function(record) {
        var typeClass = record.constructor;
        if (ember$data$lib$system$store$$isNone(record)) { return null; }
        if (record._loadingPromise) { return record._loadingPromise; }

        var resolver = Ember.RSVP.defer('Fetching ' + typeClass + 'with id: ' + record.get('id'));
        var recordResolverPair = {
          record: record,
          resolver: resolver
        };
        var promise = resolver.promise;

        record.loadingData(promise);

        if (!this._pendingFetch.get(typeClass)) {
          this._pendingFetch.set(typeClass, [recordResolverPair]);
        } else {
          this._pendingFetch.get(typeClass).push(recordResolverPair);
        }
        Ember.run.scheduleOnce('afterRender', this, this.flushAllPendingFetches);

        return promise;
      },

      flushAllPendingFetches: function() {
        if (this.isDestroyed || this.isDestroying) {
          return;
        }

        this._pendingFetch.forEach(this._flushPendingFetchForType, this);
        this._pendingFetch = ember$data$lib$system$map$$Map.create();
      },

      _flushPendingFetchForType: function (recordResolverPairs, typeClass) {
        var store = this;
        var adapter = store.adapterFor(typeClass);
        var shouldCoalesce = !!adapter.findMany && adapter.coalesceFindRequests;
        var records = Ember.A(recordResolverPairs).mapBy('record');

        function _fetchRecord(recordResolverPair) {
          recordResolverPair.resolver.resolve(store.fetchRecord(recordResolverPair.record));
        }

        function resolveFoundRecords(records) {
          ember$data$lib$system$store$$forEach(records, function(record) {
            var pair = Ember.A(recordResolverPairs).findBy('record', record);
            if (pair) {
              var resolver = pair.resolver;
              resolver.resolve(record);
            }
          });
          return records;
        }

        function makeMissingRecordsRejector(requestedRecords) {
          return function rejectMissingRecords(resolvedRecords) {
            resolvedRecords = Ember.A(resolvedRecords);
            var missingRecords = requestedRecords.reject(function(record) {
              return resolvedRecords.contains(record);
            });
            if (missingRecords.length) {
              Ember.warn('Ember Data expected to find records with the following ids in the adapter response but they were missing: ' + Ember.inspect(Ember.A(missingRecords).mapBy('id')), false);
            }
            rejectRecords(missingRecords);
          };
        }

        function makeRecordsRejector(records) {
          return function (error) {
            rejectRecords(records, error);
          };
        }

        function rejectRecords(records, error) {
          ember$data$lib$system$store$$forEach(records, function(record) {
            var pair = Ember.A(recordResolverPairs).findBy('record', record);
            if (pair) {
              var resolver = pair.resolver;
              resolver.reject(error);
            }
          });
        }

        if (recordResolverPairs.length === 1) {
          _fetchRecord(recordResolverPairs[0]);
        } else if (shouldCoalesce) {

          // TODO: Improve records => snapshots => records => snapshots
          //
          // We want to provide records to all store methods and snapshots to all
          // adapter methods. To make sure we're doing that we're providing an array
          // of snapshots to adapter.groupRecordsForFindMany(), which in turn will
          // return grouped snapshots instead of grouped records.
          //
          // But since the _findMany() finder is a store method we need to get the
          // records from the grouped snapshots even though the _findMany() finder
          // will once again convert the records to snapshots for adapter.findMany()

          var snapshots = Ember.A(records).invoke('_createSnapshot');
          var groups = adapter.groupRecordsForFindMany(this, snapshots);
          ember$data$lib$system$store$$forEach(groups, function (groupOfSnapshots) {
            var groupOfRecords = Ember.A(groupOfSnapshots).mapBy('record');
            var requestedRecords = Ember.A(groupOfRecords);
            var ids = requestedRecords.mapBy('id');
            if (ids.length > 1) {
              ember$data$lib$system$store$finders$$_findMany(adapter, store, typeClass, ids, requestedRecords).
                then(resolveFoundRecords).
                then(makeMissingRecordsRejector(requestedRecords)).
                then(null, makeRecordsRejector(requestedRecords));
            } else if (ids.length === 1) {
              var pair = Ember.A(recordResolverPairs).findBy('record', groupOfRecords[0]);
              _fetchRecord(pair);
            } else {
              Ember.assert("You cannot return an empty array from adapter's method groupRecordsForFindMany", false);
            }
          });
        } else {
          ember$data$lib$system$store$$forEach(recordResolverPairs, _fetchRecord);
        }
      },

      /**
        Get a record by a given type and ID without triggering a fetch.

        This method will synchronously return the record if it is available in the store,
        otherwise it will return `null`. A record is available if it has been fetched earlier, or
        pushed manually into the store.

        _Note: This is an synchronous method and does not return a promise._

        ```js
        var post = store.getById('post', 1);

        post.get('id'); // 1
        ```

        @method getById
        @param {String or subclass of DS.Model} type
        @param {String|Integer} id
        @return {DS.Model|null} record
      */
      getById: function(type, id) {
        if (this.hasRecordForId(type, id)) {
          return this.recordForId(type, id);
        } else {
          return null;
        }
      },

      /**
        This method is called by the record's `reload` method.

        This method calls the adapter's `find` method, which returns a promise. When
        **that** promise resolves, `reloadRecord` will resolve the promise returned
        by the record's `reload`.

        @method reloadRecord
        @private
        @param {DS.Model} record
        @return {Promise} promise
      */
      reloadRecord: function(record) {
        var type = record.constructor;
        var adapter = this.adapterFor(type);
        var id = ember$data$lib$system$store$$get(record, 'id');

        Ember.assert("You cannot reload a record without an ID", id);
        Ember.assert("You tried to reload a record but you have no adapter (for " + type + ")", adapter);
        Ember.assert("You tried to reload a record but your adapter does not implement `find`", typeof adapter.find === 'function');

        return this.scheduleFetch(record);
      },

      /**
        Returns true if a record for a given type and ID is already loaded.

        @method hasRecordForId
        @param {String or subclass of DS.Model} type
        @param {String|Integer} id
        @return {Boolean}
      */
      hasRecordForId: function(modelName, inputId) {
        var typeClass = this.modelFor(modelName);
        var id = ember$data$lib$system$store$$coerceId(inputId);
        var record = this.typeMapFor(typeClass).idToRecord[id];
        return !!record && ember$data$lib$system$store$$get(record, 'isLoaded');
      },

      /**
        Returns id record for a given type and ID. If one isn't already loaded,
        it builds a new record and leaves it in the `empty` state.

        @method recordForId
        @private
        @param {String} modelName
        @param {String|Integer} id
        @return {DS.Model} record
      */
      recordForId: function(modelName, inputId) {
        var typeClass = this.modelFor(modelName);
        var id = ember$data$lib$system$store$$coerceId(inputId);
        var idToRecord = this.typeMapFor(typeClass).idToRecord;
        var record = idToRecord[id];

        if (!record || !idToRecord[id]) {
          record = this.buildRecord(typeClass, id);
        }

        return record;
      },

      /**
        @method findMany
        @private
        @param {DS.Model} owner
        @param {Array} records
        @param {String or subclass of DS.Model} type
        @param {Resolver} resolver
        @return {Promise} promise
      */
      findMany: function(records) {
        var store = this;
        return ember$data$lib$system$store$$Promise.all(ember$data$lib$system$store$$map(records, function(record) {
          return store._findByRecord(record);
        }));
      },


      /**
        If a relationship was originally populated by the adapter as a link
        (as opposed to a list of IDs), this method is called when the
        relationship is fetched.

        The link (which is usually a URL) is passed through unchanged, so the
        adapter can make whatever request it wants.

        The usual use-case is for the server to register a URL as a link, and
        then use that URL in the future to make a request for the relationship.

        @method findHasMany
        @private
        @param {DS.Model} owner
        @param {any} link
        @param {String or subclass of DS.Model} type
        @return {Promise} promise
      */
      findHasMany: function(owner, link, type) {
        var adapter = this.adapterFor(owner.constructor);

        Ember.assert("You tried to load a hasMany relationship but you have no adapter (for " + owner.constructor + ")", adapter);
        Ember.assert("You tried to load a hasMany relationship from a specified `link` in the original payload but your adapter does not implement `findHasMany`", typeof adapter.findHasMany === 'function');

        return ember$data$lib$system$store$finders$$_findHasMany(adapter, this, owner, link, type);
      },

      /**
        @method findBelongsTo
        @private
        @param {DS.Model} owner
        @param {any} link
        @param {Relationship} relationship
        @return {Promise} promise
      */
      findBelongsTo: function(owner, link, relationship) {
        var adapter = this.adapterFor(owner.constructor);

        Ember.assert("You tried to load a belongsTo relationship but you have no adapter (for " + owner.constructor + ")", adapter);
        Ember.assert("You tried to load a belongsTo relationship from a specified `link` in the original payload but your adapter does not implement `findBelongsTo`", typeof adapter.findBelongsTo === 'function');

        return ember$data$lib$system$store$finders$$_findBelongsTo(adapter, this, owner, link, relationship);
      },

      /**
        This method delegates a query to the adapter. This is the one place where
        adapter-level semantics are exposed to the application.

        Exposing queries this way seems preferable to creating an abstract query
        language for all server-side queries, and then require all adapters to
        implement them.

        This method returns a promise, which is resolved with a `RecordArray`
        once the server returns.

        @method findQuery
        @private
        @param {String or subclass of DS.Model} type
        @param {any} query an opaque query to be used by the adapter
        @return {Promise} promise
      */
      findQuery: function(typeName, query) {
        var type = this.modelFor(typeName);
        var array = this.recordArrayManager
          .createAdapterPopulatedRecordArray(type, query);

        var adapter = this.adapterFor(type);

        Ember.assert("You tried to load a query but you have no adapter (for " + type + ")", adapter);
        Ember.assert("You tried to load a query but your adapter does not implement `findQuery`", typeof adapter.findQuery === 'function');

        return ember$data$lib$system$promise$proxies$$promiseArray(ember$data$lib$system$store$finders$$_findQuery(adapter, this, type, query, array));
      },

      /**
        This method returns an array of all records adapter can find.
        It triggers the adapter's `findAll` method to give it an opportunity to populate
        the array with records of that type.

        @method findAll
        @private
        @param {String} modelName
        @return {DS.AdapterPopulatedRecordArray}
      */
      findAll: function(modelName) {
        return this.fetchAll(modelName);
      },

      /**
        @method _fetchAll
        @private
        @param {DS.Model} typeClass
        @param {DS.RecordArray} array
        @return {Promise} promise
      */
      _fetchAll: function(typeClass, array) {
        var adapter = this.adapterFor(typeClass);
        var sinceToken = this.typeMapFor(typeClass).metadata.since;

        ember$data$lib$system$store$$set(array, 'isUpdating', true);

        Ember.assert("You tried to load all records but you have no adapter (for " + typeClass + ")", adapter);
        Ember.assert("You tried to load all records but your adapter does not implement `findAll`", typeof adapter.findAll === 'function');

        return ember$data$lib$system$promise$proxies$$promiseArray(ember$data$lib$system$store$finders$$_findAll(adapter, this, typeClass, sinceToken));
      },

      /**
        @method didUpdateAll
        @param {DS.Model} typeClass
      */
      didUpdateAll: function(typeClass) {
        var findAllCache = this.typeMapFor(typeClass).findAllCache;
        ember$data$lib$system$store$$set(findAllCache, 'isUpdating', false);
      },

      /**
        This method returns a filtered array that contains all of the
        known records for a given type in the store.

        Note that because it's just a filter, the result will contain any
        locally created records of the type, however, it will not make a
        request to the backend to retrieve additional records. If you
        would like to request all the records from the backend please use
        [store.find](#method_find).

        Also note that multiple calls to `all` for a given type will always
        return the same `RecordArray`.

        Example

        ```javascript
        var localPosts = store.all('post');
        ```

        @method all
        @param {String} modelName
        @return {DS.RecordArray}
      */
      all: function(modelName) {
        var typeClass = this.modelFor(modelName);
        var typeMap = this.typeMapFor(typeClass);
        var findAllCache = typeMap.findAllCache;

        if (findAllCache) {
          this.recordArrayManager.updateFilter(findAllCache, typeClass);
          return findAllCache;
        }

        var array = this.recordArrayManager.createRecordArray(typeClass);

        typeMap.findAllCache = array;
        return array;
      },

      /**
       This method unloads all records in the store.

       Optionally you can pass a type which unload all records for a given type.

       ```javascript
       store.unloadAll();
       store.unloadAll('post');
       ```

       @method unloadAll
       @param {String} optional modelName
      */
      unloadAll: function(modelName) {
        if (arguments.length === 0) {
          var typeMaps = this.typeMaps;
          var keys = Ember.keys(typeMaps);

          var types = ember$data$lib$system$store$$map(keys, byType);

          ember$data$lib$system$store$$forEach(types, this.unloadAll, this);
        } else {
          var typeClass = this.modelFor(modelName);
          var typeMap = this.typeMapFor(typeClass);
          var records = typeMap.records.slice();
          var record;

          for (var i = 0; i < records.length; i++) {
            record = records[i];
            record.unloadRecord();
            record.destroy(); // maybe within unloadRecord
          }

          typeMap.findAllCache = null;
          typeMap.metadata = Ember.create(null);
        }

        function byType(entry) {
          return typeMaps[entry]['type'];
        }
      },

      /**
        Takes a type and filter function, and returns a live RecordArray that
        remains up to date as new records are loaded into the store or created
        locally.

        The filter function takes a materialized record, and returns true
        if the record should be included in the filter and false if it should
        not.

        Example

        ```javascript
        store.filter('post', function(post) {
          return post.get('unread');
        });
        ```

        The filter function is called once on all records for the type when
        it is created, and then once on each newly loaded or created record.

        If any of a record's properties change, or if it changes state, the
        filter function will be invoked again to determine whether it should
        still be in the array.

        Optionally you can pass a query, which is the equivalent of calling
        [find](#method_find) with that same query, to fetch additional records
        from the server. The results returned by the server could then appear
        in the filter if they match the filter function.

        The query itself is not used to filter records, it's only sent to your
        server for you to be able to do server-side filtering. The filter
        function will be applied on the returned results regardless.

        Example

        ```javascript
        store.filter('post', { unread: true }, function(post) {
          return post.get('unread');
        }).then(function(unreadPosts) {
          unreadPosts.get('length'); // 5
          var unreadPost = unreadPosts.objectAt(0);
          unreadPost.set('unread', false);
          unreadPosts.get('length'); // 4
        });
        ```

        @method filter
        @param {String or subclass of DS.Model} type
        @param {Object} query optional query
        @param {Function} filter
        @return {DS.PromiseArray}
      */
      filter: function(type, query, filter) {
        var promise;
        var length = arguments.length;
        var array;
        var hasQuery = length === 3;

        // allow an optional server query
        if (hasQuery) {
          promise = this.findQuery(type, query);
        } else if (arguments.length === 2) {
          filter = query;
        }

        type = this.modelFor(type);

        if (hasQuery) {
          array = this.recordArrayManager.createFilteredRecordArray(type, filter, query);
        } else {
          array = this.recordArrayManager.createFilteredRecordArray(type, filter);
        }

        promise = promise || ember$data$lib$system$store$$Promise.cast(array);

        return ember$data$lib$system$promise$proxies$$promiseArray(promise.then(function() {
          return array;
        }, null, "DS: Store#filter of " + type));
      },

      /**
        This method returns if a certain record is already loaded
        in the store. Use this function to know beforehand if a find()
        will result in a request or that it will be a cache hit.

         Example

        ```javascript
        store.recordIsLoaded('post', 1); // false
        store.find('post', 1).then(function() {
          store.recordIsLoaded('post', 1); // true
        });
        ```

        @method recordIsLoaded
        @param {String or subclass of DS.Model} type
        @param {string} id
        @return {boolean}
      */
      recordIsLoaded: function(type, id) {
        if (!this.hasRecordForId(type, id)) { return false; }
        return !ember$data$lib$system$store$$get(this.recordForId(type, id), 'isEmpty');
      },

      /**
        This method returns the metadata for a specific type.

        @method metadataFor
        @param {String or subclass of DS.Model} typeName
        @return {object}
      */
      metadataFor: function(typeName) {
        var typeClass = this.modelFor(typeName);
        return this.typeMapFor(typeClass).metadata;
      },

      /**
        This method sets the metadata for a specific type.

        @method setMetadataFor
        @param {String or subclass of DS.Model} typeName
        @param {Object} metadata metadata to set
        @return {object}
      */
      setMetadataFor: function(typeName, metadata) {
        var typeClass = this.modelFor(typeName);
        Ember.merge(this.typeMapFor(typeClass).metadata, metadata);
      },

      // ............
      // . UPDATING .
      // ............

      /**
        If the adapter updates attributes the record will notify
        the store to update its  membership in any filters.
        To avoid thrashing, this method is invoked only once per
        run loop per record.

        @method dataWasUpdated
        @private
        @param {Class} type
        @param {DS.Model} record
      */
      dataWasUpdated: function(type, record) {
        this.recordArrayManager.recordDidChange(record);
      },

      // ..............
      // . PERSISTING .
      // ..............

      /**
        This method is called by `record.save`, and gets passed a
        resolver for the promise that `record.save` returns.

        It schedules saving to happen at the end of the run loop.

        @method scheduleSave
        @private
        @param {DS.Model} record
        @param {Resolver} resolver
      */
      scheduleSave: function(record, resolver) {
        record.adapterWillCommit();
        this._pendingSave.push([record, resolver]);
        ember$data$lib$system$store$$once(this, 'flushPendingSave');
      },

      /**
        This method is called at the end of the run loop, and
        flushes any records passed into `scheduleSave`

        @method flushPendingSave
        @private
      */
      flushPendingSave: function() {
        var pending = this._pendingSave.slice();
        this._pendingSave = [];

        ember$data$lib$system$store$$forEach(pending, function(tuple) {
          var record = tuple[0];
          var resolver = tuple[1];
          var adapter = this.adapterFor(record.constructor);
          var operation;

          if (ember$data$lib$system$store$$get(record, 'currentState.stateName') === 'root.deleted.saved') {
            return resolver.resolve(record);
          } else if (ember$data$lib$system$store$$get(record, 'isNew')) {
            operation = 'createRecord';
          } else if (ember$data$lib$system$store$$get(record, 'isDeleted')) {
            operation = 'deleteRecord';
          } else {
            operation = 'updateRecord';
          }

          resolver.resolve(ember$data$lib$system$store$$_commit(adapter, this, operation, record));
        }, this);
      },

      /**
        This method is called once the promise returned by an
        adapter's `createRecord`, `updateRecord` or `deleteRecord`
        is resolved.

        If the data provides a server-generated ID, it will
        update the record and the store's indexes.

        @method didSaveRecord
        @private
        @param {DS.Model} record the in-flight record
        @param {Object} data optional data (see above)
      */
      didSaveRecord: function(record, data) {
        if (data) {
          // normalize relationship IDs into records
          this._backburner.schedule('normalizeRelationships', this, '_setupRelationships', record, record.constructor, data);
          this.updateId(record, data);
        }

        //We first make sure the primary data has been updated
        //TODO try to move notification to the user to the end of the runloop
        record.adapterDidCommit(data);
      },

      /**
        This method is called once the promise returned by an
        adapter's `createRecord`, `updateRecord` or `deleteRecord`
        is rejected with a `DS.InvalidError`.

        @method recordWasInvalid
        @private
        @param {DS.Model} record
        @param {Object} errors
      */
      recordWasInvalid: function(record, errors) {
        record.adapterDidInvalidate(errors);
      },

      /**
        This method is called once the promise returned by an
        adapter's `createRecord`, `updateRecord` or `deleteRecord`
        is rejected (with anything other than a `DS.InvalidError`).

        @method recordWasError
        @private
        @param {DS.Model} record
      */
      recordWasError: function(record) {
        record.adapterDidError();
      },

      /**
        When an adapter's `createRecord`, `updateRecord` or `deleteRecord`
        resolves with data, this method extracts the ID from the supplied
        data.

        @method updateId
        @private
        @param {DS.Model} record
        @param {Object} data
      */
      updateId: function(record, data) {
        var oldId = ember$data$lib$system$store$$get(record, 'id');
        var id = ember$data$lib$system$store$$coerceId(data.id);

        Ember.assert("An adapter cannot assign a new id to a record that already has an id. " + record + " had id: " + oldId + " and you tried to update it with " + id + ". This likely happened because your server returned data in response to a find or update that had a different id than the one you sent.", oldId === null || id === oldId);

        this.typeMapFor(record.constructor).idToRecord[id] = record;

        ember$data$lib$system$store$$set(record, 'id', id);
      },

      /**
        Returns a map of IDs to client IDs for a given type.

        @method typeMapFor
        @private
        @param {subclass of DS.Model} typeClass
        @return {Object} typeMap
      */
      typeMapFor: function(typeClass) {
        var typeMaps = ember$data$lib$system$store$$get(this, 'typeMaps');
        var guid = Ember.guidFor(typeClass);
        var typeMap = typeMaps[guid];

        if (typeMap) { return typeMap; }

        typeMap = {
          idToRecord: Ember.create(null),
          records: [],
          metadata: Ember.create(null),
          type: typeClass
        };

        typeMaps[guid] = typeMap;

        return typeMap;
      },

      // ................
      // . LOADING DATA .
      // ................

      /**
        This internal method is used by `push`.

        @method _load
        @private
        @param {String or subclass of DS.Model} type
        @param {Object} data
      */
      _load: function(type, data) {
        var id = ember$data$lib$system$store$$coerceId(data.id);
        var record = this.recordForId(type, id);

        record.setupData(data);
        this.recordArrayManager.recordDidChange(record);

        return record;
      },

      /*
        In case someone defined a relationship to a mixin, for example:
        ```
          var Comment = DS.Model.extend({
            owner: belongsTo('commentable'. { polymorphic: true})
          });
          var Commentable = Ember.Mixin.create({
            comments: hasMany('comment')
          });
        ```
        we want to look up a Commentable class which has all the necessary
        relationship metadata. Thus, we look up the mixin and create a mock
        DS.Model, so we can access the relationship CPs of the mixin (`comments`)
        in this case
      */

      _modelForMixin: function(modelName) {
        var normalizedTypeKey = ember$data$lib$system$normalize$model$name$$default(modelName);
        var registry = this.container._registry ? this.container._registry : this.container;
        var mixin = registry.resolve('mixin:' + normalizedTypeKey);
        if (mixin) {
          //Cache the class as a model
          registry.register('model:' + normalizedTypeKey, DS.Model.extend(mixin));
        }
        var factory = this.modelFactoryFor(normalizedTypeKey);
        if (factory) {
          factory.__isMixin = true;
          factory.__mixin = mixin;
        }

        return factory;
      },

      /**
        Returns a model class for a particular key. Used by
        methods that take a type key (like `find`, `createRecord`,
        etc.)

        @method modelFor
        @param {String or subclass of DS.Model} key
        @return {subclass of DS.Model}
      */
      modelFor: function(key) {
        var factory;

        if (typeof key === 'string') {
          factory = this.modelFactoryFor(key);
          if (!factory) {
            //Support looking up mixins as base types for polymorphic relationships
            factory = this._modelForMixin(key);
          }
          if (!factory) {
            throw new Ember.Error("No model was found for '" + key + "'");
          }
          factory.modelName = factory.modelName || ember$data$lib$system$normalize$model$name$$default(key);
        } else {
          // A factory already supplied. Ensure it has a normalized key.
          factory = key;
          if (factory.modelName) {
            factory.modelName = ember$data$lib$system$normalize$model$name$$default(factory.modelName);
          }
        }

        // deprecate typeKey
        if (!('typeKey' in factory)) {
          Ember.defineProperty(factory, 'typeKey', {
            enumerable: true,
            configurable: false,
            get: function() {
              Ember.deprecate('Usage of `typeKey` has been deprecated and will be removed in Ember Data 1.0. It has been replaced by `modelName` on the model class.');
              return Ember.String.camelize(this.modelName);
            },
            set: function() {
              Ember.assert('Setting typeKey is not supported. In addition, typeKey has also been deprecated in favor of modelName. Setting modelName is also not supported.');
            }
          });
        }

        factory.store = this;
        return factory;
      },

      modelFactoryFor: function(key) {
        var normalizedKey = ember$data$lib$system$normalize$model$name$$default(key);
        return this.container.lookupFactory('model:' + normalizedKey);
      },

      /**
        Push some data for a given type into the store.

        This method expects normalized data:

        * The ID is a key named `id` (an ID is mandatory)
        * The names of attributes are the ones you used in
          your model's `DS.attr`s.
        * Your relationships must be:
          * represented as IDs or Arrays of IDs
          * represented as model instances
          * represented as URLs, under the `links` key

        For this model:

        ```js
        App.Person = DS.Model.extend({
          firstName: DS.attr(),
          lastName: DS.attr(),

          children: DS.hasMany('person')
        });
        ```

        To represent the children as IDs:

        ```js
        {
          id: 1,
          firstName: "Tom",
          lastName: "Dale",
          children: [1, 2, 3]
        }
        ```

        To represent the children relationship as a URL:

        ```js
        {
          id: 1,
          firstName: "Tom",
          lastName: "Dale",
          links: {
            children: "/people/1/children"
          }
        }
        ```

        If you're streaming data or implementing an adapter, make sure
        that you have converted the incoming data into this form. The
        store's [normalize](#method_normalize) method is a convenience
        helper for converting a json payload into the form Ember Data
        expects.

        ```js
        store.push('person', store.normalize('person', data));
        ```

        This method can be used both to push in brand new
        records, as well as to update existing records.

        @method push
        @param {String or subclass of DS.Model} modelName
        @param {Object} data
        @return {DS.Model} the record that was created or
          updated.
      */
      push: function(modelName, data) {
        Ember.assert("Expected an object as `data` in a call to `push` for " + modelName + " , but was " + data, Ember.typeOf(data) === 'object');
        Ember.assert("You must include an `id` for " + modelName + " in an object passed to `push`", data.id != null && data.id !== '');

        var type = this.modelFor(modelName);
        var filter = Ember.EnumerableUtils.filter;

        // If Ember.ENV.DS_WARN_ON_UNKNOWN_KEYS is set to true and the payload
        // contains unknown keys, log a warning.
        if (Ember.ENV.DS_WARN_ON_UNKNOWN_KEYS) {
          Ember.warn("The payload for '" + type.modelName + "' contains these unknown keys: " +
            Ember.inspect(filter(Ember.keys(data), function(key) {
              return !(key === 'id' || key === 'links' || ember$data$lib$system$store$$get(type, 'fields').has(key) || key.match(/Type$/));
            })) + ". Make sure they've been defined in your model.",
            filter(Ember.keys(data), function(key) {
              return !(key === 'id' || key === 'links' || ember$data$lib$system$store$$get(type, 'fields').has(key) || key.match(/Type$/));
            }).length === 0
          );
        }

        // Actually load the record into the store.

        this._load(type, data);

        var record = this.recordForId(type, data.id);
        var store = this;

        this._backburner.join(function() {
          store._backburner.schedule('normalizeRelationships', store, '_setupRelationships', record, type, data);
        });

        return record;
      },

      _setupRelationships: function(record, type, data) {
        // If the payload contains relationships that are specified as
        // IDs, normalizeRelationships will convert them into DS.Model instances
        // (possibly unloaded) before we push the payload into the
        // store.

        data = ember$data$lib$system$store$$normalizeRelationships(this, type, data);


        // Now that the pushed record as well as any related records
        // are in the store, create the data structures used to track
        // relationships.
        ember$data$lib$system$store$$setupRelationships(this, record, data);
      },

      /**
        Push some raw data into the store.

        This method can be used both to push in brand new
        records, as well as to update existing records. You
        can push in more than one type of object at once.
        All objects should be in the format expected by the
        serializer.

        ```js
        App.ApplicationSerializer = DS.ActiveModelSerializer;

        var pushData = {
          posts: [
            {id: 1, post_title: "Great post", comment_ids: [2]}
          ],
          comments: [
            {id: 2, comment_body: "Insightful comment"}
          ]
        }

        store.pushPayload(pushData);
        ```

        By default, the data will be deserialized using a default
        serializer (the application serializer if it exists).

        Alternatively, `pushPayload` will accept a model type which
        will determine which serializer will process the payload.
        However, the serializer itself (processing this data via
        `normalizePayload`) will not know which model it is
        deserializing.

        ```js
        App.ApplicationSerializer = DS.ActiveModelSerializer;
        App.PostSerializer = DS.JSONSerializer;
        store.pushPayload('comment', pushData); // Will use the ApplicationSerializer
        store.pushPayload('post', pushData); // Will use the PostSerializer
        ```

        @method pushPayload
        @param {String} type Optionally, a model used to determine which serializer will be used
        @param {Object} payload
      */
      pushPayload: function (type, inputPayload) {
        var serializer;
        var payload;
        if (!inputPayload) {
          payload = type;
          serializer = ember$data$lib$system$store$$defaultSerializer(this.container);
          Ember.assert("You cannot use `store#pushPayload` without a type unless your default serializer defines `pushPayload`", typeof serializer.pushPayload === 'function');
        } else {
          payload = inputPayload;
          serializer = this.serializerFor(type);
        }
        var store = this;
        this._adapterRun(function() {
          serializer.pushPayload(store, payload);
        });
      },

      /**
        `normalize` converts a json payload into the normalized form that
        [push](#method_push) expects.

        Example

        ```js
        socket.on('message', function(message) {
          var modelName = message.model;
          var data = message.data;
          store.push(modelName, store.normalize(modelName, data));
        });
        ```

        @method normalize
        @param {String} type The name of the model type for this payload
        @param {Object} payload
        @return {Object} The normalized payload
      */
      normalize: function (type, payload) {
        var serializer = this.serializerFor(type);
        var model = this.modelFor(type);
        return serializer.normalize(model, payload);
      },

      /**
        @method update
        @param {String} type
        @param {Object} data
        @return {DS.Model} the record that was updated.
        @deprecated Use [push](#method_push) instead
      */
      update: function(type, data) {
        Ember.deprecate('Using store.update() has been deprecated since store.push() now handles partial updates. You should use store.push() instead.');
        return this.push(type, data);
      },

      /**
        If you have an Array of normalized data to push,
        you can call `pushMany` with the Array, and it will
        call `push` repeatedly for you.

        @method pushMany
        @param {String or subclass of DS.Model} type
        @param {Array} datas
        @return {Array}
      */
      pushMany: function(type, datas) {
        var length = datas.length;
        var result = new Array(length);

        for (var i = 0; i < length; i++) {
          result[i] = this.push(type, datas[i]);
        }

        return result;
      },

      /**
        @method metaForType
        @param {String or subclass of DS.Model} typeName
        @param {Object} metadata
        @deprecated Use [setMetadataFor](#method_setMetadataFor) instead
      */
      metaForType: function(typeName, metadata) {
        Ember.deprecate('Using store.metaForType() has been deprecated. Use store.setMetadataFor() to set metadata for a specific type.');
        this.setMetadataFor(typeName, metadata);
      },

      /**
        Build a brand new record for a given type, ID, and
        initial data.

        @method buildRecord
        @private
        @param {subclass of DS.Model} type
        @param {String} id
        @param {Object} data
        @return {DS.Model} record
      */
      buildRecord: function(type, id, data) {
        var typeMap = this.typeMapFor(type);
        var idToRecord = typeMap.idToRecord;

        Ember.assert('The id ' + id + ' has already been used with another record of type ' + type.toString() + '.', !id || !idToRecord[id]);
        Ember.assert("`" + Ember.inspect(type)+ "` does not appear to be an ember-data model", (typeof type._create === 'function') );

        // lookupFactory should really return an object that creates
        // instances with the injections applied
        var record = type._create({
          id: id,
          store: this,
          container: this.container
        });

        if (data) {
          record.setupData(data);
        }

        // if we're creating an item, this process will be done
        // later, once the object has been persisted.
        if (id) {
          idToRecord[id] = record;
        }

        typeMap.records.push(record);

        return record;
      },

      //Called by the state machine to notify the store that the record is ready to be interacted with
      recordWasLoaded: function(record) {
        this.recordArrayManager.recordWasLoaded(record);
      },

      // ...............
      // . DESTRUCTION .
      // ...............

      /**
        @method dematerializeRecord
        @private
        @param {DS.Model} record
        @deprecated Use [unloadRecord](#method_unloadRecord) instead
      */
      dematerializeRecord: function(record) {
        Ember.deprecate('Using store.dematerializeRecord() has been deprecated since it was intended for private use only. You should use store.unloadRecord() instead.');
        this._dematerializeRecord(record);
      },

      /**
        When a record is destroyed, this un-indexes it and
        removes it from any record arrays so it can be GCed.

        @method _dematerializeRecord
        @private
        @param {DS.Model} record
      */
      _dematerializeRecord: function(record) {
        var type = record.constructor;
        var typeMap = this.typeMapFor(type);
        var id = ember$data$lib$system$store$$get(record, 'id');

        record.updateRecordArrays();

        if (id) {
          delete typeMap.idToRecord[id];
        }

        var loc = ember$data$lib$system$store$$indexOf(typeMap.records, record);
        typeMap.records.splice(loc, 1);
      },

      // ......................
      // . PER-TYPE ADAPTERS
      // ......................

      /**
        Returns an instance of the adapter for a given type. For
        example, `adapterFor('person')` will return an instance of
        `App.PersonAdapter`.

        If no `App.PersonAdapter` is found, this method will look
        for an `App.ApplicationAdapter` (the default adapter for
        your entire application).

        If no `App.ApplicationAdapter` is found, it will return
        the value of the `defaultAdapter`.

        @method adapterFor
        @private
        @param {String or subclass of DS.Model} type
        @return DS.Adapter
      */
      adapterFor: function(type) {
        if (type !== 'application') {
          type = this.modelFor(type);
        }

        var adapter = this.lookupAdapter(type.modelName) || this.lookupAdapter('application');

        return adapter || ember$data$lib$system$store$$get(this, 'defaultAdapter');
      },

      _adapterRun: function (fn) {
        return this._backburner.run(fn);
      },

      // ..............................
      // . RECORD CHANGE NOTIFICATION .
      // ..............................

      /**
        Returns an instance of the serializer for a given type. For
        example, `serializerFor('person')` will return an instance of
        `App.PersonSerializer`.

        If no `App.PersonSerializer` is found, this method will look
        for an `App.ApplicationSerializer` (the default serializer for
        your entire application).

        if no `App.ApplicationSerializer` is found, it will attempt
        to get the `defaultSerializer` from the `PersonAdapter`
        (`adapterFor('person')`).

        If a serializer cannot be found on the adapter, it will fall back
        to an instance of `DS.JSONSerializer`.

        @method serializerFor
        @private
        @param {String or subclass of DS.Model} type the record to serialize
        @return {DS.Serializer}
      */
      serializerFor: function(type) {
        if (type !== 'application') {
          type = this.modelFor(type);
        }

        var serializer = this.lookupSerializer(type.modelName) || this.lookupSerializer('application');

        if (!serializer) {
          var adapter = this.adapterFor(type);
          serializer = this.lookupSerializer(ember$data$lib$system$store$$get(adapter, 'defaultSerializer'));
        }

        if (!serializer) {
          serializer = this.lookupSerializer('-default');
        }

        return serializer;
      },

      /**
        Retrieve a particular instance from the
        container cache. If not found, creates it and
        placing it in the cache.

        Enabled a store to manage local instances of
        adapters and serializers.

        @method retrieveManagedInstance
        @private
        @param {String} type the object modelName
        @param {String} type the object name
        @return {Ember.Object}
      */
      retrieveManagedInstance: function(modelName, name) {
        var normalizedTypeKey = ember$data$lib$system$normalize$model$name$$default(modelName);
        var key = normalizedTypeKey + ":" +name;

        if (!this._containerCache[key]) {
          var instance = this.container.lookup(key);

          if (instance) {
            ember$data$lib$system$store$$set(instance, 'store', this);
            this._containerCache[key] = instance;
          }
        }

        return this._containerCache[key];
      },

      lookupAdapter: function(name) {
        return this.retrieveManagedInstance('adapter', name);
      },

      lookupSerializer: function(name) {
        return this.retrieveManagedInstance('serializer', name);
      },

      willDestroy: function() {
        this.recordArrayManager.destroy();

        this.unloadAll();

        for (var cacheKey in this._containerCache) {
          this._containerCache[cacheKey].destroy();
          delete this._containerCache[cacheKey];
        }

        delete this._containerCache;
      }

    });


    function ember$data$lib$system$store$$normalizeRelationships(store, type, data, record) {
      type.eachRelationship(function(key, relationship) {
        var kind = relationship.kind;
        var value = data[key];
        if (kind === 'belongsTo') {
          ember$data$lib$system$store$$deserializeRecordId(store, data, key, relationship, value);
        } else if (kind === 'hasMany') {
          ember$data$lib$system$store$$deserializeRecordIds(store, data, key, relationship, value);
        }
      });

      return data;
    }

    function ember$data$lib$system$store$$deserializeRecordId(store, data, key, relationship, id) {
      if (ember$data$lib$system$store$$isNone(id) || id instanceof ember$data$lib$system$model$$default) {
        return;
      }
      Ember.assert("A " + relationship.parentType + " record was pushed into the store with the value of " + key + " being " + Ember.inspect(id) + ", but " + key + " is a belongsTo relationship so the value must not be an array. You should probably check your data payload or serializer.", !Ember.isArray(id));

      var type;

      if (typeof id === 'number' || typeof id === 'string') {
        type = ember$data$lib$system$store$$typeFor(relationship, key, data);
        data[key] = store.recordForId(type, id);
      } else if (typeof id === 'object') {
        // hasMany polymorphic
        Ember.assert('Ember Data expected a number or string to represent the record(s) in the `' + relationship.key + '` relationship instead it found an object. If this is a polymorphic relationship please specify a `type` key. If this is an embedded relationship please include the `DS.EmbeddedRecordsMixin` and specify the `' + relationship.key +'` property in your serializer\'s attrs object.', id.type);
        data[key] = store.recordForId(id.type, id.id);
      }
    }

    function ember$data$lib$system$store$$typeFor(relationship, key, data) {
      if (relationship.options.polymorphic) {
        return data[key + "Type"];
      } else {
        return relationship.type;
      }
    }

    function ember$data$lib$system$store$$deserializeRecordIds(store, data, key, relationship, ids) {
      if (ember$data$lib$system$store$$isNone(ids)) {
        return;
      }

      Ember.assert("A " + relationship.parentType + " record was pushed into the store with the value of " + key + " being '" + Ember.inspect(ids) + "', but " + key + " is a hasMany relationship so the value must be an array. You should probably check your data payload or serializer.", Ember.isArray(ids));
      for (var i=0, l=ids.length; i<l; i++) {
        ember$data$lib$system$store$$deserializeRecordId(store, ids, i, relationship, ids[i]);
      }
    }

    // Delegation to the adapter and promise management



    function ember$data$lib$system$store$$defaultSerializer(container) {
      return container.lookup('serializer:application') ||
             container.lookup('serializer:-default');
    }

    function ember$data$lib$system$store$$_commit(adapter, store, operation, record) {
      var type = record.constructor;
      var snapshot = record._createSnapshot();
      var promise = adapter[operation](store, type, snapshot);
      var serializer = ember$data$lib$system$store$serializers$$serializerForAdapter(store, adapter, type);
      var label = "DS: Extract and notify about " + operation + " completion of " + record;

      Ember.assert("Your adapter's '" + operation + "' method must return a value, but it returned `undefined", promise !==undefined);

      promise = ember$data$lib$system$store$$Promise.cast(promise, label);
      promise = ember$data$lib$system$store$common$$_guard(promise, ember$data$lib$system$store$common$$_bind(ember$data$lib$system$store$common$$_objectIsAlive, store));
      promise = ember$data$lib$system$store$common$$_guard(promise, ember$data$lib$system$store$common$$_bind(ember$data$lib$system$store$common$$_objectIsAlive, record));

      return promise.then(function(adapterPayload) {
        var payload;

        store._adapterRun(function() {
          if (adapterPayload) {
            payload = serializer.extract(store, type, adapterPayload, ember$data$lib$system$store$$get(record, 'id'), operation);
          }
          store.didSaveRecord(record, payload);
        });

        return record;
      }, function(reason) {
        if (reason instanceof ember$data$lib$system$model$errors$invalid$$default) {
          var errors = serializer.extractErrors(store, type, reason.errors, ember$data$lib$system$store$$get(record, 'id'));
          store.recordWasInvalid(record, errors);
          reason = new ember$data$lib$system$model$errors$invalid$$default(errors);
        } else {
          store.recordWasError(record, reason);
        }

        throw reason;
      }, label);
    }

    function ember$data$lib$system$store$$setupRelationships(store, record, data) {
      var typeClass = record.constructor;

      typeClass.eachRelationship(function(key, descriptor) {
        var kind = descriptor.kind;
        var value = data[key];
        var relationship = record._relationships[key];

        if (data.links && data.links[key]) {
          relationship.updateLink(data.links[key]);
        }

        if (value !== undefined) {
          if (kind === 'belongsTo') {
            relationship.setCanonicalRecord(value);
          } else if (kind === 'hasMany') {
            relationship.updateRecordsFromAdapter(value);
          }
        }
      });
    }

    var ember$data$lib$system$store$$default = ember$data$lib$system$store$$Store;
    function ember$data$lib$initializers$store$$initializeStore(registry, application) {
      Ember.deprecate('Specifying a custom Store for Ember Data on your global namespace as `App.Store` ' +
                      'has been deprecated. Please use `App.ApplicationStore` instead.', !(application && application.Store));

      registry.optionsForType('serializer', { singleton: false });
      registry.optionsForType('adapter', { singleton: false });

      registry.register('store:main', registry.lookupFactory('store:application') || (application && application.Store) || ember$data$lib$system$store$$default);

      // allow older names to be looked up

      var proxy = new ember$data$lib$system$container$proxy$$default(registry);
      proxy.registerDeprecations([
        { deprecated: 'serializer:_default',  valid: 'serializer:-default' },
        { deprecated: 'serializer:_rest',     valid: 'serializer:-rest' },
        { deprecated: 'adapter:_rest',        valid: 'adapter:-rest' }
      ]);

      // new go forward paths
      registry.register('serializer:-default', ember$data$lib$serializers$json$serializer$$default);
      registry.register('serializer:-rest', ember$data$lib$serializers$rest$serializer$$default);
      registry.register('adapter:-rest', ember$data$lib$adapters$rest$adapter$$default);

      // Eagerly generate the store so defaultStore is populated.
      // TODO: Do this in a finisher hook
      var store = registry.lookup('store:main');
      registry.register('service:store', store, { instantiate: false });
    }
    var ember$data$lib$initializers$store$$default = ember$data$lib$initializers$store$$initializeStore;

    var ember$data$lib$transforms$base$$default = Ember.Object.extend({
      /**
        When given a deserialized value from a record attribute this
        method must return the serialized value.

        Example

        ```javascript
        serialize: function(deserialized) {
          return Ember.isEmpty(deserialized) ? null : Number(deserialized);
        }
        ```

        @method serialize
        @param {mixed} deserialized The deserialized value
        @return {mixed} The serialized value
      */
      serialize: null,

      /**
        When given a serialize value from a JSON object this method must
        return the deserialized value for the record attribute.

        Example

        ```javascript
        deserialize: function(serialized) {
          return empty(serialized) ? null : Number(serialized);
        }
        ```

        @method deserialize
        @param {mixed} serialized The serialized value
        @return {mixed} The deserialized value
      */
      deserialize: null
    });

    var ember$data$lib$transforms$number$$empty = Ember.isEmpty;

    function ember$data$lib$transforms$number$$isNumber(value) {
      return value === value && value !== Infinity && value !== -Infinity;
    }

    var ember$data$lib$transforms$number$$default = ember$data$lib$transforms$base$$default.extend({
      deserialize: function(serialized) {
        var transformed;

        if (ember$data$lib$transforms$number$$empty(serialized)) {
          return null;
        } else {
          transformed = Number(serialized);

          return ember$data$lib$transforms$number$$isNumber(transformed) ? transformed : null;
        }
      },

      serialize: function(deserialized) {
        var transformed;

        if (ember$data$lib$transforms$number$$empty(deserialized)) {
          return null;
        } else {
          transformed = Number(deserialized);

          return ember$data$lib$transforms$number$$isNumber(transformed) ? transformed : null;
        }
      }
    });

    // Date.prototype.toISOString shim
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
    var ember$data$lib$transforms$date$$toISOString = Date.prototype.toISOString || function() {
      function pad(number) {
        if ( number < 10 ) {
          return '0' + number;
        }
        return number;
      }

      return this.getUTCFullYear() +
        '-' + pad(this.getUTCMonth() + 1) +
        '-' + pad(this.getUTCDate()) +
        'T' + pad(this.getUTCHours()) +
        ':' + pad(this.getUTCMinutes()) +
        ':' + pad(this.getUTCSeconds()) +
        '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';
    };

    if (Ember.SHIM_ES5) {
      if (!Date.prototype.toISOString) {
        Date.prototype.toISOString = ember$data$lib$transforms$date$$toISOString;
      }
    }

    var ember$data$lib$transforms$date$$default = ember$data$lib$transforms$base$$default.extend({
      deserialize: function(serialized) {
        var type = typeof serialized;

        if (type === "string") {
          return new Date(Ember.Date.parse(serialized));
        } else if (type === "number") {
          return new Date(serialized);
        } else if (serialized === null || serialized === undefined) {
          // if the value is not present in the data,
          // return undefined, not null.
          return serialized;
        } else {
          return null;
        }
      },

      serialize: function(date) {
        if (date instanceof Date) {
          return ember$data$lib$transforms$date$$toISOString.call(date);
        } else {
          return null;
        }
      }
    });

    var ember$data$lib$transforms$string$$none = Ember.isNone;

    var ember$data$lib$transforms$string$$default = ember$data$lib$transforms$base$$default.extend({
      deserialize: function(serialized) {
        return ember$data$lib$transforms$string$$none(serialized) ? null : String(serialized);
      },
      serialize: function(deserialized) {
        return ember$data$lib$transforms$string$$none(deserialized) ? null : String(deserialized);
      }
    });

    var ember$data$lib$transforms$boolean$$default = ember$data$lib$transforms$base$$default.extend({
      deserialize: function(serialized) {
        var type = typeof serialized;

        if (type === "boolean") {
          return serialized;
        } else if (type === "string") {
          return serialized.match(/^true$|^t$|^1$/i) !== null;
        } else if (type === "number") {
          return serialized === 1;
        } else {
          return false;
        }
      },

      serialize: function(deserialized) {
        return Boolean(deserialized);
      }
    });

    function ember$data$lib$initializers$transforms$$initializeTransforms(registry) {
      registry.register('transform:boolean', ember$data$lib$transforms$boolean$$default);
      registry.register('transform:date', ember$data$lib$transforms$date$$default);
      registry.register('transform:number', ember$data$lib$transforms$number$$default);
      registry.register('transform:string', ember$data$lib$transforms$string$$default);
    }
    var ember$data$lib$initializers$transforms$$default = ember$data$lib$initializers$transforms$$initializeTransforms;
    function ember$data$lib$initializers$store$injections$$initializeStoreInjections(registry) {
      registry.injection('controller', 'store', 'store:main');
      registry.injection('route', 'store', 'store:main');
      registry.injection('data-adapter', 'store', 'store:main');
    }
    var ember$data$lib$initializers$store$injections$$default = ember$data$lib$initializers$store$injections$$initializeStoreInjections;
    var ember$data$lib$system$debug$debug$adapter$$get = Ember.get;
    var ember$data$lib$system$debug$debug$adapter$$capitalize = Ember.String.capitalize;
    var ember$data$lib$system$debug$debug$adapter$$underscore = Ember.String.underscore;

    var ember$data$lib$system$debug$debug$adapter$$default = Ember.DataAdapter.extend({
      getFilters: function() {
        return [
          { name: 'isNew', desc: 'New' },
          { name: 'isModified', desc: 'Modified' },
          { name: 'isClean', desc: 'Clean' }
        ];
      },

      detect: function(typeClass) {
        return typeClass !== ember$data$lib$system$model$$default && ember$data$lib$system$model$$default.detect(typeClass);
      },

      columnsForType: function(typeClass) {
        var columns = [{
          name: 'id',
          desc: 'Id'
        }];
        var count = 0;
        var self = this;
        ember$data$lib$system$debug$debug$adapter$$get(typeClass, 'attributes').forEach(function(meta, name) {
          if (count++ > self.attributeLimit) { return false; }
          var desc = ember$data$lib$system$debug$debug$adapter$$capitalize(ember$data$lib$system$debug$debug$adapter$$underscore(name).replace('_', ' '));
          columns.push({ name: name, desc: desc });
        });
        return columns;
      },

      getRecords: function(modelName) {
        return this.get('store').all(modelName);
      },

      getRecordColumnValues: function(record) {
        var self = this;
        var count = 0;
        var columnValues = { id: ember$data$lib$system$debug$debug$adapter$$get(record, 'id') };

        record.eachAttribute(function(key) {
          if (count++ > self.attributeLimit) {
            return false;
          }
          var value = ember$data$lib$system$debug$debug$adapter$$get(record, key);
          columnValues[key] = value;
        });
        return columnValues;
      },

      getRecordKeywords: function(record) {
        var keywords = [];
        var keys = Ember.A(['id']);
        record.eachAttribute(function(key) {
          keys.push(key);
        });
        keys.forEach(function(key) {
          keywords.push(ember$data$lib$system$debug$debug$adapter$$get(record, key));
        });
        return keywords;
      },

      getRecordFilterValues: function(record) {
        return {
          isNew: record.get('isNew'),
          isModified: record.get('isDirty') && !record.get('isNew'),
          isClean: !record.get('isDirty')
        };
      },

      getRecordColor: function(record) {
        var color = 'black';
        if (record.get('isNew')) {
          color = 'green';
        } else if (record.get('isDirty')) {
          color = 'blue';
        }
        return color;
      },

      observeRecord: function(record, recordUpdated) {
        var releaseMethods = Ember.A();
        var self = this;
        var keysToObserve = Ember.A(['id', 'isNew', 'isDirty']);

        record.eachAttribute(function(key) {
          keysToObserve.push(key);
        });

        keysToObserve.forEach(function(key) {
          var handler = function() {
            recordUpdated(self.wrapRecord(record));
          };
          Ember.addObserver(record, key, handler);
          releaseMethods.push(function() {
            Ember.removeObserver(record, key, handler);
          });
        });

        var release = function() {
          releaseMethods.forEach(function(fn) { fn(); } );
        };

        return release;
      }

    });

    function ember$data$lib$initializers$data$adapter$$initializeDebugAdapter(registry) {
      registry.register('data-adapter:main', ember$data$lib$system$debug$debug$adapter$$default);
    }
    var ember$data$lib$initializers$data$adapter$$default = ember$data$lib$initializers$data$adapter$$initializeDebugAdapter;
    function ember$data$lib$setup$container$$setupContainer(container, application) {
      // application is not a required argument. This ensures
      // testing setups can setup a container without booting an
      // entire ember application.

      ember$data$lib$initializers$data$adapter$$default(container, application);
      ember$data$lib$initializers$transforms$$default(container, application);
      ember$data$lib$initializers$store$injections$$default(container, application);
      ember$data$lib$initializers$store$$default(container, application);
      activemodel$adapter$lib$setup$container$$default(container, application);
    }
    var ember$data$lib$setup$container$$default = ember$data$lib$setup$container$$setupContainer;

    var ember$data$lib$ember$initializer$$K = Ember.K;

    /**
      @module ember-data
    */

    /*

      This code initializes Ember-Data onto an Ember application.

      If an Ember.js developer defines a subclass of DS.Store on their application,
      as `App.ApplicationStore` (or via a module system that resolves to `store:application`)
      this code will automatically instantiate it and make it available on the
      router.

      Additionally, after an application's controllers have been injected, they will
      each have the store made available to them.

      For example, imagine an Ember.js application with the following classes:

      App.ApplicationStore = DS.Store.extend({
        adapter: 'custom'
      });

      App.PostsController = Ember.ArrayController.extend({
        // ...
      });

      When the application is initialized, `App.ApplicationStore` will automatically be
      instantiated, and the instance of `App.PostsController` will have its `store`
      property set to that instance.

      Note that this code will only be run if the `ember-application` package is
      loaded. If Ember Data is being used in an environment other than a
      typical application (e.g., node.js where only `ember-runtime` is available),
      this code will be ignored.
    */

    Ember.onLoad('Ember.Application', function(Application) {

      Application.initializer({
        name:       "ember-data",
        initialize: ember$data$lib$setup$container$$default
      });

      // Deprecated initializers to satisfy old code that depended on them

      Application.initializer({
        name:       "store",
        after:      "ember-data",
        initialize: ember$data$lib$ember$initializer$$K
      });

      Application.initializer({
        name:       "activeModelAdapter",
        before:     "store",
        initialize: ember$data$lib$ember$initializer$$K
      });

      Application.initializer({
        name:       "transforms",
        before:     "store",
        initialize: ember$data$lib$ember$initializer$$K
      });

      Application.initializer({
        name:       "data-adapter",
        before:     "store",
        initialize: ember$data$lib$ember$initializer$$K
      });

      Application.initializer({
        name:       "injectStore",
        before:     "store",
        initialize: ember$data$lib$ember$initializer$$K
      });
    });
    Ember.Date = Ember.Date || {};

    var origParse = Date.parse;
    var numericKeys = [1, 4, 5, 6, 7, 10, 11];

    /**
      @method parse
      @param {Date} date
      @return {Number} timestamp
    */
    Ember.Date.parse = function (date) {
      var timestamp, struct;
      var minutesOffset = 0;

      // ES5 §15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
      // before falling back to any implementation-specific date parsing, so that’s what we do, even if native
      // implementations could be faster
      //              1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
      if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(date))) {
        // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
        for (var i = 0, k; (k = numericKeys[i]); ++i) {
          struct[k] = +struct[k] || 0;
        }

        // allow undefined days and months
        struct[2] = (+struct[2] || 1) - 1;
        struct[3] = +struct[3] || 1;

        if (struct[8] !== 'Z' && struct[9] !== undefined) {
          minutesOffset = struct[10] * 60 + struct[11];

          if (struct[9] === '+') {
            minutesOffset = 0 - minutesOffset;
          }
        }

        timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
      } else {
        timestamp = origParse ? origParse(date) : NaN;
      }

      return timestamp;
    };

    if (Ember.EXTEND_PROTOTYPES === true || Ember.EXTEND_PROTOTYPES.Date) {
      Date.parse = Ember.Date.parse;
    }

    ember$data$lib$system$model$$default.reopen({

      /**
        Provides info about the model for debugging purposes
        by grouping the properties into more semantic groups.

        Meant to be used by debugging tools such as the Chrome Ember Extension.

        - Groups all attributes in "Attributes" group.
        - Groups all belongsTo relationships in "Belongs To" group.
        - Groups all hasMany relationships in "Has Many" group.
        - Groups all flags in "Flags" group.
        - Flags relationship CPs as expensive properties.

        @method _debugInfo
        @for DS.Model
        @private
      */
      _debugInfo: function() {
        var attributes = ['id'];
        var relationships = { belongsTo: [], hasMany: [] };
        var expensiveProperties = [];

        this.eachAttribute(function(name, meta) {
          attributes.push(name);
        }, this);

        this.eachRelationship(function(name, relationship) {
          relationships[relationship.kind].push(name);
          expensiveProperties.push(name);
        });

        var groups = [
          {
            name: 'Attributes',
            properties: attributes,
            expand: true
          },
          {
            name: 'Belongs To',
            properties: relationships.belongsTo,
            expand: true
          },
          {
            name: 'Has Many',
            properties: relationships.hasMany,
            expand: true
          },
          {
            name: 'Flags',
            properties: ['isLoaded', 'isDirty', 'isSaving', 'isDeleted', 'isError', 'isNew', 'isValid']
          }
        ];

        return {
          propertyInfo: {
            // include all other mixins / properties (not just the grouped ones)
            includeOtherProperties: true,
            groups: groups,
            // don't pre-calculate unless cached
            expensiveProperties: expensiveProperties
          }
        };
      }
    });

    var ember$data$lib$system$debug$debug$info$$default = ember$data$lib$system$model$$default;
    var ember$data$lib$system$debug$$default = ember$data$lib$system$debug$debug$adapter$$default;
    var ember$data$lib$serializers$embedded$records$mixin$$get = Ember.get;
    var ember$data$lib$serializers$embedded$records$mixin$$forEach = Ember.EnumerableUtils.forEach;
    var ember$data$lib$serializers$embedded$records$mixin$$camelize = Ember.String.camelize;

    /**
      ## Using Embedded Records

      `DS.EmbeddedRecordsMixin` supports serializing embedded records.

      To set up embedded records, include the mixin when extending a serializer
      then define and configure embedded (model) relationships.

      Below is an example of a per-type serializer ('post' type).

      ```js
      App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
        attrs: {
          author: { embedded: 'always' },
          comments: { serialize: 'ids' }
        }
      });
      ```
      Note that this use of `{ embedded: 'always' }` is unrelated to
      the `{ embedded: 'always' }` that is defined as an option on `DS.attr` as part of
      defining a model while working with the ActiveModelSerializer.  Nevertheless,
      using `{ embedded: 'always' }` as an option to DS.attr is not a valid way to setup
      embedded records.

      The `attrs` option for a resource `{ embedded: 'always' }` is shorthand for:

      ```js
      {
        serialize: 'records',
        deserialize: 'records'
      }
      ```

      ### Configuring Attrs

      A resource's `attrs` option may be set to use `ids`, `records` or false for the
      `serialize`  and `deserialize` settings.

      The `attrs` property can be set on the ApplicationSerializer or a per-type
      serializer.

      In the case where embedded JSON is expected while extracting a payload (reading)
      the setting is `deserialize: 'records'`, there is no need to use `ids` when
      extracting as that is the default behavior without this mixin if you are using
      the vanilla EmbeddedRecordsMixin. Likewise, to embed JSON in the payload while
      serializing `serialize: 'records'` is the setting to use. There is an option of
      not embedding JSON in the serialized payload by using `serialize: 'ids'`. If you
      do not want the relationship sent at all, you can use `serialize: false`.


      ### EmbeddedRecordsMixin defaults
      If you do not overwrite `attrs` for a specific relationship, the `EmbeddedRecordsMixin`
      will behave in the following way:

      BelongsTo: `{ serialize: 'id', deserialize: 'id' }`
      HasMany:   `{ serialize: false, deserialize: 'ids' }`

      ### Model Relationships

      Embedded records must have a model defined to be extracted and serialized. Note that
      when defining any relationships on your model such as `belongsTo` and `hasMany`, you
      should not both specify `async:true` and also indicate through the serializer's
      `attrs` attribute that the related model should be embedded for deserialization.
      If a model is declared embedded for deserialization (`embedded: 'always'`,
      `deserialize: 'record'` or `deserialize: 'records'`), then do not use `async:true`.

      To successfully extract and serialize embedded records the model relationships
      must be setup correcty See the
      [defining relationships](/guides/models/defining-models/#toc_defining-relationships)
      section of the **Defining Models** guide page.

      Records without an `id` property are not considered embedded records, model
      instances must have an `id` property to be used with Ember Data.

      ### Example JSON payloads, Models and Serializers

      **When customizing a serializer it is important to grok what the customizations
      are. Please read the docs for the methods this mixin provides, in case you need
      to modify it to fit your specific needs.**

      For example review the docs for each method of this mixin:
      * [normalize](/api/data/classes/DS.EmbeddedRecordsMixin.html#method_normalize)
      * [serializeBelongsTo](/api/data/classes/DS.EmbeddedRecordsMixin.html#method_serializeBelongsTo)
      * [serializeHasMany](/api/data/classes/DS.EmbeddedRecordsMixin.html#method_serializeHasMany)

      @class EmbeddedRecordsMixin
      @namespace DS
    */
    var ember$data$lib$serializers$embedded$records$mixin$$EmbeddedRecordsMixin = Ember.Mixin.create({

      /**
        Normalize the record and recursively normalize/extract all the embedded records
        while pushing them into the store as they are encountered

        A payload with an attr configured for embedded records needs to be extracted:

        ```js
        {
          "post": {
            "id": "1"
            "title": "Rails is omakase",
            "comments": [{
              "id": "1",
              "body": "Rails is unagi"
            }, {
              "id": "2",
              "body": "Omakase O_o"
            }]
          }
        }
        ```
       @method normalize
       @param {subclass of DS.Model} typeClass
       @param {Object} hash to be normalized
       @param {String} key the hash has been referenced by
       @return {Object} the normalized hash
      **/
      normalize: function(typeClass, hash, prop) {
        var normalizedHash = this._super(typeClass, hash, prop);
        return ember$data$lib$serializers$embedded$records$mixin$$extractEmbeddedRecords(this, this.store, typeClass, normalizedHash);
      },

      keyForRelationship: function(key, typeClass, method) {
        if ((method === 'serialize' && this.hasSerializeRecordsOption(key)) ||
            (method === 'deserialize' && this.hasDeserializeRecordsOption(key))) {
          return this.keyForAttribute(key, method);
        } else {
          return this._super(key, typeClass, method) || key;
        }
      },

      /**
        Serialize `belongsTo` relationship when it is configured as an embedded object.

        This example of an author model belongs to a post model:

        ```js
        Post = DS.Model.extend({
          title:    DS.attr('string'),
          body:     DS.attr('string'),
          author:   DS.belongsTo('author')
        });

        Author = DS.Model.extend({
          name:     DS.attr('string'),
          post:     DS.belongsTo('post')
        });
        ```

        Use a custom (type) serializer for the post model to configure embedded author

        ```js
        App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
          attrs: {
            author: {embedded: 'always'}
          }
        })
        ```

        A payload with an attribute configured for embedded records can serialize
        the records together under the root attribute's payload:

        ```js
        {
          "post": {
            "id": "1"
            "title": "Rails is omakase",
            "author": {
              "id": "2"
              "name": "dhh"
            }
          }
        }
        ```

        @method serializeBelongsTo
        @param {DS.Snapshot} snapshot
        @param {Object} json
        @param {Object} relationship
      */
      serializeBelongsTo: function(snapshot, json, relationship) {
        var attr = relationship.key;
        if (this.noSerializeOptionSpecified(attr)) {
          this._super(snapshot, json, relationship);
          return;
        }
        var includeIds = this.hasSerializeIdsOption(attr);
        var includeRecords = this.hasSerializeRecordsOption(attr);
        var embeddedSnapshot = snapshot.belongsTo(attr);
        var key;
        if (includeIds) {
          key = this.keyForRelationship(attr, relationship.kind, 'serialize');
          if (!embeddedSnapshot) {
            json[key] = null;
          } else {
            json[key] = embeddedSnapshot.id;
          }
        } else if (includeRecords) {
          key = this.keyForAttribute(attr, 'serialize');
          if (!embeddedSnapshot) {
            json[key] = null;
          } else {
            json[key] = embeddedSnapshot.record.serialize({ includeId: true });
            this.removeEmbeddedForeignKey(snapshot, embeddedSnapshot, relationship, json[key]);
          }
        }
      },

      /**
        Serialize `hasMany` relationship when it is configured as embedded objects.

        This example of a post model has many comments:

        ```js
        Post = DS.Model.extend({
          title:    DS.attr('string'),
          body:     DS.attr('string'),
          comments: DS.hasMany('comment')
        });

        Comment = DS.Model.extend({
          body:     DS.attr('string'),
          post:     DS.belongsTo('post')
        });
        ```

        Use a custom (type) serializer for the post model to configure embedded comments

        ```js
        App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
          attrs: {
            comments: {embedded: 'always'}
          }
        })
        ```

        A payload with an attribute configured for embedded records can serialize
        the records together under the root attribute's payload:

        ```js
        {
          "post": {
            "id": "1"
            "title": "Rails is omakase",
            "body": "I want this for my ORM, I want that for my template language..."
            "comments": [{
              "id": "1",
              "body": "Rails is unagi"
            }, {
              "id": "2",
              "body": "Omakase O_o"
            }]
          }
        }
        ```

        The attrs options object can use more specific instruction for extracting and
        serializing. When serializing, an option to embed `ids` or `records` can be set.
        When extracting the only option is `records`.

        So `{embedded: 'always'}` is shorthand for:
        `{serialize: 'records', deserialize: 'records'}`

        To embed the `ids` for a related object (using a hasMany relationship):

        ```js
        App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
          attrs: {
            comments: {serialize: 'ids', deserialize: 'records'}
          }
        })
        ```

        ```js
        {
          "post": {
            "id": "1"
            "title": "Rails is omakase",
            "body": "I want this for my ORM, I want that for my template language..."
            "comments": ["1", "2"]
          }
        }
        ```

        @method serializeHasMany
        @param {DS.Snapshot} snapshot
        @param {Object} json
        @param {Object} relationship
      */
      serializeHasMany: function(snapshot, json, relationship) {
        var attr = relationship.key;
        if (this.noSerializeOptionSpecified(attr)) {
          this._super(snapshot, json, relationship);
          return;
        }
        var includeIds = this.hasSerializeIdsOption(attr);
        var includeRecords = this.hasSerializeRecordsOption(attr);
        var key;
        if (includeIds) {
          key = this.keyForRelationship(attr, relationship.kind, 'serialize');
          json[key] = snapshot.hasMany(attr, { ids: true });
        } else if (includeRecords) {
          key = this.keyForAttribute(attr, 'serialize');
          json[key] = snapshot.hasMany(attr).map(function(embeddedSnapshot) {
            var embeddedJson = embeddedSnapshot.record.serialize({ includeId: true });
            this.removeEmbeddedForeignKey(snapshot, embeddedSnapshot, relationship, embeddedJson);
            return embeddedJson;
          }, this);
        }
      },

      /**
        When serializing an embedded record, modify the property (in the json payload)
        that refers to the parent record (foreign key for relationship).

        Serializing a `belongsTo` relationship removes the property that refers to the
        parent record

        Serializing a `hasMany` relationship does not remove the property that refers to
        the parent record.

        @method removeEmbeddedForeignKey
        @param {DS.Snapshot} snapshot
        @param {DS.Snapshot} embeddedSnapshot
        @param {Object} relationship
        @param {Object} json
      */
      removeEmbeddedForeignKey: function (snapshot, embeddedSnapshot, relationship, json) {
        if (relationship.kind === 'hasMany') {
          return;
        } else if (relationship.kind === 'belongsTo') {
          var parentRecord = snapshot.type.inverseFor(relationship.key);
          if (parentRecord) {
            var name = parentRecord.name;
            var embeddedSerializer = this.store.serializerFor(embeddedSnapshot.type);
            var parentKey = embeddedSerializer.keyForRelationship(name, parentRecord.kind, 'deserialize');
            if (parentKey) {
              delete json[parentKey];
            }
          }
        }
      },

      // checks config for attrs option to embedded (always) - serialize and deserialize
      hasEmbeddedAlwaysOption: function (attr) {
        var option = this.attrsOption(attr);
        return option && option.embedded === 'always';
      },

      // checks config for attrs option to serialize ids
      hasSerializeRecordsOption: function(attr) {
        var alwaysEmbed = this.hasEmbeddedAlwaysOption(attr);
        var option = this.attrsOption(attr);
        return alwaysEmbed || (option && (option.serialize === 'records'));
      },

      // checks config for attrs option to serialize records
      hasSerializeIdsOption: function(attr) {
        var option = this.attrsOption(attr);
        return option && (option.serialize === 'ids' || option.serialize === 'id');
      },

      // checks config for attrs option to serialize records
      noSerializeOptionSpecified: function(attr) {
        var option = this.attrsOption(attr);
        return !(option && (option.serialize || option.embedded));
      },

      // checks config for attrs option to deserialize records
      // a defined option object for a resource is treated the same as
      // `deserialize: 'records'`
      hasDeserializeRecordsOption: function(attr) {
        var alwaysEmbed = this.hasEmbeddedAlwaysOption(attr);
        var option = this.attrsOption(attr);
        return alwaysEmbed || (option && option.deserialize === 'records');
      },

      attrsOption: function(attr) {
        var attrs = this.get('attrs');
        return attrs && (attrs[ember$data$lib$serializers$embedded$records$mixin$$camelize(attr)] || attrs[attr]);
      }
    });

    // chooses a relationship kind to branch which function is used to update payload
    // does not change payload if attr is not embedded
    function ember$data$lib$serializers$embedded$records$mixin$$extractEmbeddedRecords(serializer, store, typeClass, partial) {

      typeClass.eachRelationship(function(key, relationship) {
        if (serializer.hasDeserializeRecordsOption(key)) {
          var embeddedTypeClass = store.modelFor(relationship.type.modelName);
          if (relationship.kind === "hasMany") {
            if (relationship.options.polymorphic) {
              ember$data$lib$serializers$embedded$records$mixin$$extractEmbeddedHasManyPolymorphic(store, key, partial);
            } else {
              ember$data$lib$serializers$embedded$records$mixin$$extractEmbeddedHasMany(store, key, embeddedTypeClass, partial);
            }
          }
          if (relationship.kind === "belongsTo") {
            if (relationship.options.polymorphic) {
              ember$data$lib$serializers$embedded$records$mixin$$extractEmbeddedBelongsToPolymorphic(store, key, partial);
            } else {
              ember$data$lib$serializers$embedded$records$mixin$$extractEmbeddedBelongsTo(store, key, embeddedTypeClass, partial);
            }
          }
        }
      });

      return partial;
    }

    // handles embedding for `hasMany` relationship
    function ember$data$lib$serializers$embedded$records$mixin$$extractEmbeddedHasMany(store, key, embeddedTypeClass, hash) {
      if (!hash[key]) {
        return hash;
      }

      var ids = [];

      var embeddedSerializer = store.serializerFor(embeddedTypeClass.modelName);
      ember$data$lib$serializers$embedded$records$mixin$$forEach(hash[key], function(data) {
        var embeddedRecord = embeddedSerializer.normalize(embeddedTypeClass, data, null);
        store.push(embeddedTypeClass, embeddedRecord);
        ids.push(embeddedRecord.id);
      });

      hash[key] = ids;
      return hash;
    }

    function ember$data$lib$serializers$embedded$records$mixin$$extractEmbeddedHasManyPolymorphic(store, key, hash) {
      if (!hash[key]) {
        return hash;
      }

      var ids = [];

      ember$data$lib$serializers$embedded$records$mixin$$forEach(hash[key], function(data) {
        var modelName = data.type;
        var embeddedSerializer = store.serializerFor(modelName);
        var embeddedTypeClass = store.modelFor(modelName);
        var primaryKey = ember$data$lib$serializers$embedded$records$mixin$$get(embeddedSerializer, 'primaryKey');

        var embeddedRecord = embeddedSerializer.normalize(embeddedTypeClass, data, null);
        store.push(embeddedTypeClass, embeddedRecord);
        ids.push({ id: embeddedRecord[primaryKey], type: modelName });
      });

      hash[key] = ids;
      return hash;
    }

    function ember$data$lib$serializers$embedded$records$mixin$$extractEmbeddedBelongsTo(store, key, embeddedTypeClass, hash) {
      if (!hash[key]) {
        return hash;
      }

      var embeddedSerializer = store.serializerFor(embeddedTypeClass.modelName);
      var embeddedRecord = embeddedSerializer.normalize(embeddedTypeClass, hash[key], null);
      store.push(embeddedTypeClass, embeddedRecord);

      hash[key] = embeddedRecord.id;
      //TODO Need to add a reference to the parent later so relationship works between both `belongsTo` records
      return hash;
    }

    function ember$data$lib$serializers$embedded$records$mixin$$extractEmbeddedBelongsToPolymorphic(store, key, hash) {
      if (!hash[key]) {
        return hash;
      }

      var data = hash[key];
      var modelName = data.type;
      var embeddedSerializer = store.serializerFor(modelName);
      var embeddedTypeClass = store.modelFor(modelName);
      var primaryKey = ember$data$lib$serializers$embedded$records$mixin$$get(embeddedSerializer, 'primaryKey');

      var embeddedRecord = embeddedSerializer.normalize(embeddedTypeClass, data, null);
      store.push(embeddedTypeClass, embeddedRecord);

      hash[key] = embeddedRecord[primaryKey];
      hash[key + 'Type'] = modelName;
      return hash;
    }

    var ember$data$lib$serializers$embedded$records$mixin$$default = ember$data$lib$serializers$embedded$records$mixin$$EmbeddedRecordsMixin;

    /**
      `DS.belongsTo` is used to define One-To-One and One-To-Many
      relationships on a [DS.Model](/api/data/classes/DS.Model.html).


      `DS.belongsTo` takes an optional hash as a second parameter, currently
      supported options are:

      - `async`: A boolean value used to explicitly declare this to be an async relationship.
      - `inverse`: A string used to identify the inverse property on a
        related model in a One-To-Many relationship. See [Explicit Inverses](#toc_explicit-inverses)

      #### One-To-One
      To declare a one-to-one relationship between two models, use
      `DS.belongsTo`:

      ```javascript
      App.User = DS.Model.extend({
        profile: DS.belongsTo('profile')
      });

      App.Profile = DS.Model.extend({
        user: DS.belongsTo('user')
      });
      ```

      #### One-To-Many
      To declare a one-to-many relationship between two models, use
      `DS.belongsTo` in combination with `DS.hasMany`, like this:

      ```javascript
      App.Post = DS.Model.extend({
        comments: DS.hasMany('comment')
      });

      App.Comment = DS.Model.extend({
        post: DS.belongsTo('post')
      });
      ```

      You can avoid passing a string as the first parameter. In that case Ember Data
      will infer the type from the key name.

      ```javascript
      App.Comment = DS.Model.extend({
        post: DS.belongsTo()
      });
      ```

      will lookup for a Post type.

      @namespace
      @method belongsTo
      @for DS
      @param {String} modelName (optional) type of the relationship
      @param {Object} options (optional) a hash of options
      @return {Ember.computed} relationship
    */
    function ember$data$lib$system$relationships$belongs$to$$belongsTo(modelName, options) {
      var opts, userEnteredModelName;
      if (typeof modelName === 'object') {
        opts = modelName;
        userEnteredModelName = undefined;
      } else {
        opts = options;
        userEnteredModelName = modelName;
      }

      if (typeof userEnteredModelName === 'string') {
        userEnteredModelName = ember$data$lib$system$normalize$model$name$$default(userEnteredModelName);
      }

      Ember.assert("The first argument to DS.belongsTo must be a string representing a model type key, not an instance of " + Ember.inspect(userEnteredModelName) + ". E.g., to define a relation to the Person model, use DS.belongsTo('person')", typeof userEnteredModelName === 'string' || typeof userEnteredModelName === 'undefined');

      opts = opts || {};

      var meta = {
        type: userEnteredModelName,
        isRelationship: true,
        options: opts,
        kind: 'belongsTo',
        key: null
      };

      return ember$data$lib$utils$computed$polyfill$$default({
        get: function(key) {
          return this._relationships[key].getRecord();
        },
        set: function(key, value) {
          if (value === undefined) {
            value = null;
          }
          if (value && value.then) {
            this._relationships[key].setRecordPromise(value);
          } else {
            this._relationships[key].setRecord(value);
          }

          return this._relationships[key].getRecord();
        }
      }).meta(meta);
    }

    /*
      These observers observe all `belongsTo` relationships on the record. See
      `relationships/ext` to see how these observers get their dependencies.
    */
    ember$data$lib$system$model$$default.reopen({
      notifyBelongsToChanged: function(key) {
        this.notifyPropertyChange(key);
      }
    });

    var ember$data$lib$system$relationships$belongs$to$$default = ember$data$lib$system$relationships$belongs$to$$belongsTo;

    /**
      `DS.hasMany` is used to define One-To-Many and Many-To-Many
      relationships on a [DS.Model](/api/data/classes/DS.Model.html).

      `DS.hasMany` takes an optional hash as a second parameter, currently
      supported options are:

      - `async`: A boolean value used to explicitly declare this to be an async relationship.
      - `inverse`: A string used to identify the inverse property on a related model.

      #### One-To-Many
      To declare a one-to-many relationship between two models, use
      `DS.belongsTo` in combination with `DS.hasMany`, like this:

      ```javascript
      App.Post = DS.Model.extend({
        comments: DS.hasMany('comment')
      });

      App.Comment = DS.Model.extend({
        post: DS.belongsTo('post')
      });
      ```

      #### Many-To-Many
      To declare a many-to-many relationship between two models, use
      `DS.hasMany`:

      ```javascript
      App.Post = DS.Model.extend({
        tags: DS.hasMany('tag')
      });

      App.Tag = DS.Model.extend({
        posts: DS.hasMany('post')
      });
      ```

      You can avoid passing a string as the first parameter. In that case Ember Data
      will infer the type from the singularized key name.

      ```javascript
      App.Post = DS.Model.extend({
        tags: DS.hasMany()
      });
      ```

      will lookup for a Tag type.

      #### Explicit Inverses

      Ember Data will do its best to discover which relationships map to
      one another. In the one-to-many code above, for example, Ember Data
      can figure out that changing the `comments` relationship should update
      the `post` relationship on the inverse because post is the only
      relationship to that model.

      However, sometimes you may have multiple `belongsTo`/`hasManys` for the
      same type. You can specify which property on the related model is
      the inverse using `DS.hasMany`'s `inverse` option:

      ```javascript
      var belongsTo = DS.belongsTo,
          hasMany = DS.hasMany;

      App.Comment = DS.Model.extend({
        onePost: belongsTo('post'),
        twoPost: belongsTo('post'),
        redPost: belongsTo('post'),
        bluePost: belongsTo('post')
      });

      App.Post = DS.Model.extend({
        comments: hasMany('comment', {
          inverse: 'redPost'
        })
      });
      ```

      You can also specify an inverse on a `belongsTo`, which works how
      you'd expect.

      @namespace
      @method hasMany
      @for DS
      @param {String} type (optional) type of the relationship
      @param {Object} options (optional) a hash of options
      @return {Ember.computed} relationship
    */
    function ember$data$lib$system$relationships$has$many$$hasMany(type, options) {
      if (typeof type === 'object') {
        options = type;
        type = undefined;
      }

      Ember.assert("The first argument to DS.hasMany must be a string representing a model type key, not an instance of " + Ember.inspect(type) + ". E.g., to define a relation to the Comment model, use DS.hasMany('comment')", typeof type === 'string' || typeof type === 'undefined');

      options = options || {};

      if (typeof type === 'string') {
        type = ember$data$lib$system$normalize$model$name$$default(type);
      }

      // Metadata about relationships is stored on the meta of
      // the relationship. This is used for introspection and
      // serialization. Note that `key` is populated lazily
      // the first time the CP is called.
      var meta = {
        type: type,
        isRelationship: true,
        options: options,
        kind: 'hasMany',
        key: null
      };

      return ember$data$lib$utils$computed$polyfill$$default({
        get: function(key) {
          var relationship = this._relationships[key];
          return relationship.getRecords();
        },
        set: function(key, records) {
          var relationship = this._relationships[key];
          relationship.clear();
          relationship.addRecords(records);
          return relationship.getRecords();
        }
      }).meta(meta);
    }

    ember$data$lib$system$model$$default.reopen({
      notifyHasManyAdded: function(key) {
        //We need to notifyPropertyChange in the adding case because we need to make sure
        //we fetch the newly added record in case it is unloaded
        //TODO(Igor): Consider whether we could do this only if the record state is unloaded

        //Goes away once hasMany is double promisified
        this.notifyPropertyChange(key);
      }
    });


    var ember$data$lib$system$relationships$has$many$$default = ember$data$lib$system$relationships$has$many$$hasMany;
    function ember$data$lib$system$relationship$meta$$typeForRelationshipMeta(store, meta) {
      var modelName, typeClass;

      modelName = meta.type || meta.key;
      if (typeof modelName === 'string') {
        if (meta.kind === 'hasMany') {
          modelName = ember$inflector$lib$lib$system$string$$singularize(modelName);
        }
        typeClass = store.modelFor(modelName);
      } else {
        typeClass = meta.type;
      }

      return typeClass;
    }

    function ember$data$lib$system$relationship$meta$$relationshipFromMeta(store, meta) {
      return {
        key:  meta.key,
        kind: meta.kind,
        type: ember$data$lib$system$relationship$meta$$typeForRelationshipMeta(store, meta),
        options:    meta.options,
        parentType: meta.parentType,
        isRelationship: true
      };
    }

    var ember$data$lib$system$relationships$ext$$get = Ember.get;
    var ember$data$lib$system$relationships$ext$$filter = Ember.ArrayPolyfills.filter;

    var ember$data$lib$system$relationships$ext$$relationshipsDescriptor = Ember.computed(function() {
      if (Ember.testing === true && ember$data$lib$system$relationships$ext$$relationshipsDescriptor._cacheable === true) {
        ember$data$lib$system$relationships$ext$$relationshipsDescriptor._cacheable = false;
      }

      var map = new ember$data$lib$system$map$$MapWithDefault({
        defaultValue: function() { return []; }
      });

      // Loop through each computed property on the class
      this.eachComputedProperty(function(name, meta) {
        // If the computed property is a relationship, add
        // it to the map.
        if (meta.isRelationship) {
          meta.key = name;
          var relationshipsForType = map.get(ember$data$lib$system$relationship$meta$$typeForRelationshipMeta(this.store, meta));

          relationshipsForType.push({
            name: name,
            kind: meta.kind
          });
        }
      });

      return map;
    }).readOnly();

    var ember$data$lib$system$relationships$ext$$relatedTypesDescriptor = Ember.computed(function() {
      if (Ember.testing === true && ember$data$lib$system$relationships$ext$$relatedTypesDescriptor._cacheable === true) {
        ember$data$lib$system$relationships$ext$$relatedTypesDescriptor._cacheable = false;
      }

      var modelName;
      var types = Ember.A();

      // Loop through each computed property on the class,
      // and create an array of the unique types involved
      // in relationships
      this.eachComputedProperty(function(name, meta) {
        if (meta.isRelationship) {
          meta.key = name;
          modelName = ember$data$lib$system$relationship$meta$$typeForRelationshipMeta(this.store, meta);

          Ember.assert("You specified a hasMany (" + meta.type + ") on " + meta.parentType + " but " + meta.type + " was not found.", modelName);

          if (!types.contains(modelName)) {
            Ember.assert("Trying to sideload " + name + " on " + this.toString() + " but the type doesn't exist.", !!modelName);
            types.push(modelName);
          }
        }
      });

      return types;
    }).readOnly();

    var ember$data$lib$system$relationships$ext$$relationshipsByNameDescriptor = Ember.computed(function() {
      if (Ember.testing === true && ember$data$lib$system$relationships$ext$$relationshipsByNameDescriptor._cacheable === true) {
        ember$data$lib$system$relationships$ext$$relationshipsByNameDescriptor._cacheable = false;
      }

      var map = ember$data$lib$system$map$$Map.create();

      this.eachComputedProperty(function(name, meta) {
        if (meta.isRelationship) {
          meta.key = name;
          var relationship = ember$data$lib$system$relationship$meta$$relationshipFromMeta(this.store, meta);
          relationship.type = ember$data$lib$system$relationship$meta$$typeForRelationshipMeta(this.store, meta);
          map.set(name, relationship);
        }
      });

      return map;
    }).readOnly();

    /**
      @module ember-data
    */

    /*
      This file defines several extensions to the base `DS.Model` class that
      add support for one-to-many relationships.
    */

    /**
      @class Model
      @namespace DS
    */
    ember$data$lib$system$model$$default.reopen({

      /**
        This Ember.js hook allows an object to be notified when a property
        is defined.

        In this case, we use it to be notified when an Ember Data user defines a
        belongs-to relationship. In that case, we need to set up observers for
        each one, allowing us to track relationship changes and automatically
        reflect changes in the inverse has-many array.

        This hook passes the class being set up, as well as the key and value
        being defined. So, for example, when the user does this:

        ```javascript
        DS.Model.extend({
          parent: DS.belongsTo('user')
        });
        ```

        This hook would be called with "parent" as the key and the computed
        property returned by `DS.belongsTo` as the value.

        @method didDefineProperty
        @param {Object} proto
        @param {String} key
        @param {Ember.ComputedProperty} value
      */
      didDefineProperty: function(proto, key, value) {
        // Check if the value being set is a computed property.
        if (value instanceof Ember.ComputedProperty) {

          // If it is, get the metadata for the relationship. This is
          // populated by the `DS.belongsTo` helper when it is creating
          // the computed property.
          var meta = value.meta();

          meta.parentType = proto.constructor;
        }
      }
    });

    /*
      These DS.Model extensions add class methods that provide relationship
      introspection abilities about relationships.

      A note about the computed properties contained here:

      **These properties are effectively sealed once called for the first time.**
      To avoid repeatedly doing expensive iteration over a model's fields, these
      values are computed once and then cached for the remainder of the runtime of
      your application.

      If your application needs to modify a class after its initial definition
      (for example, using `reopen()` to add additional attributes), make sure you
      do it before using your model with the store, which uses these properties
      extensively.
    */

    ember$data$lib$system$model$$default.reopenClass({

      /**
        For a given relationship name, returns the model type of the relationship.

        For example, if you define a model like this:

       ```javascript
        App.Post = DS.Model.extend({
          comments: DS.hasMany('comment')
        });
       ```

        Calling `App.Post.typeForRelationship('comments')` will return `App.Comment`.

        @method typeForRelationship
        @static
        @param {String} name the name of the relationship
        @return {subclass of DS.Model} the type of the relationship, or undefined
      */
      typeForRelationship: function(name) {
        var relationship = ember$data$lib$system$relationships$ext$$get(this, 'relationshipsByName').get(name);
        return relationship && relationship.type;
      },

      inverseMap: Ember.computed(function() {
        return Ember.create(null);
      }),

      /**
        Find the relationship which is the inverse of the one asked for.

        For example, if you define models like this:

       ```javascript
          App.Post = DS.Model.extend({
            comments: DS.hasMany('message')
          });

          App.Message = DS.Model.extend({
            owner: DS.belongsTo('post')
          });
        ```

        App.Post.inverseFor('comments') -> {type: App.Message, name:'owner', kind:'belongsTo'}
        App.Message.inverseFor('owner') -> {type: App.Post, name:'comments', kind:'hasMany'}

        @method inverseFor
        @static
        @param {String} name the name of the relationship
        @return {Object} the inverse relationship, or null
      */
      inverseFor: function(name) {
        var inverseMap = ember$data$lib$system$relationships$ext$$get(this, 'inverseMap');
        if (inverseMap[name]) {
          return inverseMap[name];
        } else {
          var inverse = this._findInverseFor(name);
          inverseMap[name] = inverse;
          return inverse;
        }
      },

      //Calculate the inverse, ignoring the cache
      _findInverseFor: function(name) {

        var inverseType = this.typeForRelationship(name);
        if (!inverseType) {
          return null;
        }

        var propertyMeta = this.metaForProperty(name);
        //If inverse is manually specified to be null, like  `comments: DS.hasMany('message', {inverse: null})`
        var options = propertyMeta.options;
        if (options.inverse === null) { return null; }

        var inverseName, inverseKind, inverse;

        Ember.warn("Detected a reflexive relationship by the name of '" + name + "' without an inverse option. Look at http://emberjs.com/guides/models/defining-models/#toc_reflexive-relation for how to explicitly specify inverses.", options.inverse || propertyMeta.type !== propertyMeta.parentType.modelName);

        //If inverse is specified manually, return the inverse
        if (options.inverse) {
          inverseName = options.inverse;
          inverse = Ember.get(inverseType, 'relationshipsByName').get(inverseName);

          Ember.assert("We found no inverse relationships by the name of '" + inverseName + "' on the '" + inverseType.modelName +
            "' model. This is most likely due to a missing attribute on your model definition.", !Ember.isNone(inverse));

          inverseKind = inverse.kind;
        } else {
          //No inverse was specified manually, we need to use a heuristic to guess one
          var possibleRelationships = findPossibleInverses(this, inverseType);

          if (possibleRelationships.length === 0) { return null; }

          var filteredRelationships = ember$data$lib$system$relationships$ext$$filter.call(possibleRelationships, function(possibleRelationship) {
            var optionsForRelationship = inverseType.metaForProperty(possibleRelationship.name).options;
            return name === optionsForRelationship.inverse;
          });

          Ember.assert("You defined the '" + name + "' relationship on " + this + ", but you defined the inverse relationships of type " +
            inverseType.toString() + " multiple times. Look at http://emberjs.com/guides/models/defining-models/#toc_explicit-inverses for how to explicitly specify inverses",
            filteredRelationships.length < 2);

          if (filteredRelationships.length === 1 ) {
            possibleRelationships = filteredRelationships;
          }

          Ember.assert("You defined the '" + name + "' relationship on " + this + ", but multiple possible inverse relationships of type " +
            this + " were found on " + inverseType + ". Look at http://emberjs.com/guides/models/defining-models/#toc_explicit-inverses for how to explicitly specify inverses",
            possibleRelationships.length === 1);

          inverseName = possibleRelationships[0].name;
          inverseKind = possibleRelationships[0].kind;
        }

        function findPossibleInverses(type, inverseType, relationshipsSoFar) {
          var possibleRelationships = relationshipsSoFar || [];

          var relationshipMap = ember$data$lib$system$relationships$ext$$get(inverseType, 'relationships');
          if (!relationshipMap) { return; }

          var relationships = relationshipMap.get(type);

          relationships = ember$data$lib$system$relationships$ext$$filter.call(relationships, function(relationship) {
            var optionsForRelationship = inverseType.metaForProperty(relationship.name).options;

            if (!optionsForRelationship.inverse) {
              return true;
            }

            return name === optionsForRelationship.inverse;
          });

          if (relationships) {
            possibleRelationships.push.apply(possibleRelationships, relationships);
          }

          //Recurse to support polymorphism
          if (type.superclass) {
            findPossibleInverses(type.superclass, inverseType, possibleRelationships);
          }

          return possibleRelationships;
        }

        return {
          type: inverseType,
          name: inverseName,
          kind: inverseKind
        };
      },

      /**
        The model's relationships as a map, keyed on the type of the
        relationship. The value of each entry is an array containing a descriptor
        for each relationship with that type, describing the name of the relationship
        as well as the type.

        For example, given the following model definition:

        ```javascript
        App.Blog = DS.Model.extend({
          users: DS.hasMany('user'),
          owner: DS.belongsTo('user'),
          posts: DS.hasMany('post')
        });
        ```

        This computed property would return a map describing these
        relationships, like this:

        ```javascript
        var relationships = Ember.get(App.Blog, 'relationships');
        relationships.get(App.User);
        //=> [ { name: 'users', kind: 'hasMany' },
        //     { name: 'owner', kind: 'belongsTo' } ]
        relationships.get(App.Post);
        //=> [ { name: 'posts', kind: 'hasMany' } ]
        ```

        @property relationships
        @static
        @type Ember.Map
        @readOnly
      */

      relationships: ember$data$lib$system$relationships$ext$$relationshipsDescriptor,

      /**
        A hash containing lists of the model's relationships, grouped
        by the relationship kind. For example, given a model with this
        definition:

        ```javascript
        App.Blog = DS.Model.extend({
          users: DS.hasMany('user'),
          owner: DS.belongsTo('user'),

          posts: DS.hasMany('post')
        });
        ```

        This property would contain the following:

        ```javascript
        var relationshipNames = Ember.get(App.Blog, 'relationshipNames');
        relationshipNames.hasMany;
        //=> ['users', 'posts']
        relationshipNames.belongsTo;
        //=> ['owner']
        ```

        @property relationshipNames
        @static
        @type Object
        @readOnly
      */
      relationshipNames: Ember.computed(function() {
        var names = {
          hasMany: [],
          belongsTo: []
        };

        this.eachComputedProperty(function(name, meta) {
          if (meta.isRelationship) {
            names[meta.kind].push(name);
          }
        });

        return names;
      }),

      /**
        An array of types directly related to a model. Each type will be
        included once, regardless of the number of relationships it has with
        the model.

        For example, given a model with this definition:

        ```javascript
        App.Blog = DS.Model.extend({
          users: DS.hasMany('user'),
          owner: DS.belongsTo('user'),

          posts: DS.hasMany('post')
        });
        ```

        This property would contain the following:

        ```javascript
        var relatedTypes = Ember.get(App.Blog, 'relatedTypes');
        //=> [ App.User, App.Post ]
        ```

        @property relatedTypes
        @static
        @type Ember.Array
        @readOnly
      */
      relatedTypes: ember$data$lib$system$relationships$ext$$relatedTypesDescriptor,

      /**
        A map whose keys are the relationships of a model and whose values are
        relationship descriptors.

        For example, given a model with this
        definition:

        ```javascript
        App.Blog = DS.Model.extend({
          users: DS.hasMany('user'),
          owner: DS.belongsTo('user'),

          posts: DS.hasMany('post')
        });
        ```

        This property would contain the following:

        ```javascript
        var relationshipsByName = Ember.get(App.Blog, 'relationshipsByName');
        relationshipsByName.get('users');
        //=> { key: 'users', kind: 'hasMany', type: App.User }
        relationshipsByName.get('owner');
        //=> { key: 'owner', kind: 'belongsTo', type: App.User }
        ```

        @property relationshipsByName
        @static
        @type Ember.Map
        @readOnly
      */
      relationshipsByName: ember$data$lib$system$relationships$ext$$relationshipsByNameDescriptor,

      /**
        A map whose keys are the fields of the model and whose values are strings
        describing the kind of the field. A model's fields are the union of all of its
        attributes and relationships.

        For example:

        ```javascript

        App.Blog = DS.Model.extend({
          users: DS.hasMany('user'),
          owner: DS.belongsTo('user'),

          posts: DS.hasMany('post'),

          title: DS.attr('string')
        });

        var fields = Ember.get(App.Blog, 'fields');
        fields.forEach(function(kind, field) {
          console.log(field, kind);
        });

        // prints:
        // users, hasMany
        // owner, belongsTo
        // posts, hasMany
        // title, attribute
        ```

        @property fields
        @static
        @type Ember.Map
        @readOnly
      */
      fields: Ember.computed(function() {
        var map = ember$data$lib$system$map$$Map.create();

        this.eachComputedProperty(function(name, meta) {
          if (meta.isRelationship) {
            map.set(name, meta.kind);
          } else if (meta.isAttribute) {
            map.set(name, 'attribute');
          }
        });

        return map;
      }).readOnly(),

      /**
        Given a callback, iterates over each of the relationships in the model,
        invoking the callback with the name of each relationship and its relationship
        descriptor.

        @method eachRelationship
        @static
        @param {Function} callback the callback to invoke
        @param {any} binding the value to which the callback's `this` should be bound
      */
      eachRelationship: function(callback, binding) {
        ember$data$lib$system$relationships$ext$$get(this, 'relationshipsByName').forEach(function(relationship, name) {
          callback.call(binding, name, relationship);
        });
      },

      /**
        Given a callback, iterates over each of the types related to a model,
        invoking the callback with the related type's class. Each type will be
        returned just once, regardless of how many different relationships it has
        with a model.

        @method eachRelatedType
        @static
        @param {Function} callback the callback to invoke
        @param {any} binding the value to which the callback's `this` should be bound
      */
      eachRelatedType: function(callback, binding) {
        ember$data$lib$system$relationships$ext$$get(this, 'relatedTypes').forEach(function(type) {
          callback.call(binding, type);
        });
      },

      determineRelationshipType: function(knownSide) {
        var knownKey = knownSide.key;
        var knownKind = knownSide.kind;
        var inverse = this.inverseFor(knownKey);
        var key, otherKind;

        if (!inverse) {
          return knownKind === 'belongsTo' ? 'oneToNone' : 'manyToNone';
        }

        key = inverse.name;
        otherKind = inverse.kind;

        if (otherKind === 'belongsTo') {
          return knownKind === 'belongsTo' ? 'oneToOne' : 'manyToOne';
        } else {
          return knownKind === 'belongsTo' ? 'oneToMany' : 'manyToMany';
        }
      }

    });

    ember$data$lib$system$model$$default.reopen({
      /**
        Given a callback, iterates over each of the relationships in the model,
        invoking the callback with the name of each relationship and its relationship
        descriptor.


        The callback method you provide should have the following signature (all
        parameters are optional):

        ```javascript
        function(name, descriptor);
        ```

        - `name` the name of the current property in the iteration
        - `descriptor` the meta object that describes this relationship

        The relationship descriptor argument is an object with the following properties.

       - **key** <span class="type">String</span> the name of this relationship on the Model
       - **kind** <span class="type">String</span> "hasMany" or "belongsTo"
       - **options** <span class="type">Object</span> the original options hash passed when the relationship was declared
       - **parentType** <span class="type">DS.Model</span> the type of the Model that owns this relationship
       - **type** <span class="type">DS.Model</span> the type of the related Model

        Note that in addition to a callback, you can also pass an optional target
        object that will be set as `this` on the context.

        Example

        ```javascript
        App.ApplicationSerializer = DS.JSONSerializer.extend({
          serialize: function(record, options) {
            var json = {};

            record.eachRelationship(function(name, descriptor) {
              if (descriptor.kind === 'hasMany') {
                var serializedHasManyName = name.toUpperCase() + '_IDS';
                json[name.toUpperCase()] = record.get(name).mapBy('id');
              }
            });

            return json;
          }
        });
        ```

        @method eachRelationship
        @param {Function} callback the callback to invoke
        @param {any} binding the value to which the callback's `this` should be bound
      */
      eachRelationship: function(callback, binding) {
        this.constructor.eachRelationship(callback, binding);
      },

      relationshipFor: function(name) {
        return ember$data$lib$system$relationships$ext$$get(this.constructor, 'relationshipsByName').get(name);
      },

      inverseFor: function(key) {
        return this.constructor.inverseFor(key);
      }

    });
    Ember.RSVP.Promise.cast = Ember.RSVP.Promise.cast || Ember.RSVP.resolve;

    Ember.runInDebug(function() {
      if (Ember.VERSION.match(/^1\.[0-7]\./)) {
        throw new Ember.Error("Ember Data requires at least Ember 1.8.0, but you have " +
                              Ember.VERSION +
                              ". Please upgrade your version of Ember, then upgrade Ember Data");
      }
    });

    ember$data$lib$core$$default.Store         = ember$data$lib$system$store$$Store;
    ember$data$lib$core$$default.PromiseArray  = ember$data$lib$system$promise$proxies$$PromiseArray;
    ember$data$lib$core$$default.PromiseObject = ember$data$lib$system$promise$proxies$$PromiseObject;

    ember$data$lib$core$$default.PromiseManyArray = ember$data$lib$system$promise$proxies$$PromiseManyArray;

    ember$data$lib$core$$default.Model     = ember$data$lib$system$model$$default;
    ember$data$lib$core$$default.RootState = ember$data$lib$system$model$states$$default;
    ember$data$lib$core$$default.attr      = ember$data$lib$system$model$attributes$$default;
    ember$data$lib$core$$default.Errors    = ember$data$lib$system$model$errors$$default;

    ember$data$lib$core$$default.Snapshot = ember$data$lib$system$snapshot$$default;

    ember$data$lib$core$$default.Adapter      = ember$data$lib$system$adapter$$Adapter;
    ember$data$lib$core$$default.InvalidError = ember$data$lib$system$model$errors$invalid$$default;

    ember$data$lib$core$$default.Serializer = ember$data$lib$system$serializer$$default;

    ember$data$lib$core$$default.DebugAdapter = ember$data$lib$system$debug$$default;

    ember$data$lib$core$$default.RecordArray                 = ember$data$lib$system$record$arrays$record$array$$default;
    ember$data$lib$core$$default.FilteredRecordArray         = ember$data$lib$system$record$arrays$filtered$record$array$$default;
    ember$data$lib$core$$default.AdapterPopulatedRecordArray = ember$data$lib$system$record$arrays$adapter$populated$record$array$$default;
    ember$data$lib$core$$default.ManyArray                   = ember$data$lib$system$many$array$$default;

    ember$data$lib$core$$default.RecordArrayManager = ember$data$lib$system$record$array$manager$$default;

    ember$data$lib$core$$default.RESTAdapter    = ember$data$lib$adapters$rest$adapter$$default;
    ember$data$lib$core$$default.BuildURLMixin  = ember$data$lib$adapters$build$url$mixin$$default;
    ember$data$lib$core$$default.FixtureAdapter = ember$data$lib$adapters$fixture$adapter$$default;

    ember$data$lib$core$$default.RESTSerializer = ember$data$lib$serializers$rest$serializer$$default;
    ember$data$lib$core$$default.JSONSerializer = ember$data$lib$serializers$json$serializer$$default;

    ember$data$lib$core$$default.Transform       = ember$data$lib$transforms$base$$default;
    ember$data$lib$core$$default.DateTransform   = ember$data$lib$transforms$date$$default;
    ember$data$lib$core$$default.StringTransform = ember$data$lib$transforms$string$$default;
    ember$data$lib$core$$default.NumberTransform = ember$data$lib$transforms$number$$default;
    ember$data$lib$core$$default.BooleanTransform = ember$data$lib$transforms$boolean$$default;

    ember$data$lib$core$$default.ActiveModelAdapter    = activemodel$adapter$lib$system$active$model$adapter$$default;
    ember$data$lib$core$$default.ActiveModelSerializer = activemodel$adapter$lib$system$active$model$serializer$$default;
    ember$data$lib$core$$default.EmbeddedRecordsMixin  = ember$data$lib$serializers$embedded$records$mixin$$default;

    ember$data$lib$core$$default.belongsTo = ember$data$lib$system$relationships$belongs$to$$default;
    ember$data$lib$core$$default.hasMany   = ember$data$lib$system$relationships$has$many$$default;

    ember$data$lib$core$$default.Relationship  = ember$data$lib$system$relationships$state$relationship$$default;

    ember$data$lib$core$$default.ContainerProxy = ember$data$lib$system$container$proxy$$default;

    ember$data$lib$core$$default._setupContainer = ember$data$lib$setup$container$$default;

    Ember.defineProperty(ember$data$lib$core$$default, 'normalizeModelName', {
      enumerable: true,
      writable: false,
      configurable: false,
      value: ember$data$lib$system$normalize$model$name$$default
    });

    Ember.lookup.DS = ember$data$lib$core$$default;

    var ember$data$lib$main$$default = ember$data$lib$core$$default;
}).call(this);

//# sourceMappingURL=ember-data.js.map