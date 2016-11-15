QUnit.notifications = function(options) {
  "use strict";

  options         = options         || {};
  options.icons   = options.icons   || {};
  options.timeout = options.timeout || 4000;
  options.titles  = options.titles  || { passed: "Passed!", failed: "Failed!" };
  options.bodies  = options.bodies  || {
    passed: "{{passed}} of {{total}} passed",
    failed: "{{passed}} passed. {{failed}} failed."
  };

  var renderBody = function(body, details) {
    [ "passed", "failed", "total", "runtime" ].forEach(function(type) {
      body = body.replace("{{" + type + "}}", details[ type ]);
    });

    return body;
  };

  function generateQueryString(params) {
    var key,
      querystring = "?";

    params = QUnit.extend(QUnit.extend({}, QUnit.urlParams), params);

    for (key in params) {
      if (params.hasOwnProperty(key)) {
        if (params[ key ] === undefined) {
          continue;
        }
        querystring += encodeURIComponent(key);
        if (params[ key ] !== true) {
          querystring += "=" + encodeURIComponent(params[ key ]);
        }
        querystring += "&";
      }
    }
    return location.protocol + "//" + location.host +
      location.pathname + querystring.slice(0, -1);
  }

  if (window.Notification) {
    QUnit.done(function(details) {
      var title,
          _options = {},
          notification;

      if (window.Notification && QUnit.urlParams.notifications) {
        if (details.failed === 0) {
          title = options.titles.passed;
          _options.body = renderBody(options.bodies.passed, details);

          if (options.icons.passed) {
            _options.icon = options.icons.passed;
          }
        } else {
          title = options.titles.failed;
          _options.body = renderBody(options.bodies.failed, details);

          if (options.icons.failed) {
            _options.icon = options.icons.failed;
          }
        }

        notification = new window.Notification(title, _options);

        setTimeout(function() {
          notification.close();
        }, options.timeout);
      }
    });

    QUnit.begin(function() {
      var toolbar      = document.getElementById( "qunit-testrunner-toolbar" ),
          notification = document.createElement( "input" ),
          label        = document.createElement("label");

      notification.type = "checkbox";
      notification.id   = "qunit-notifications";

      if (QUnit.urlParams.notifications) {
        notification.checked = true;
      }

      notification.addEventListener("click", function(event) {
        if (event.target.checked) {
          window.Notification.requestPermission(function() {
            window.location = generateQueryString({ notifications: true });
          });
        } else {
          window.location = generateQueryString({ notifications: undefined });
        }
      }, false);
      toolbar.appendChild(notification);

      label.innerHTML = "Notifications";
      label.setAttribute( "for", "qunit-notifications" );
      label.setAttribute( "title", "Show notifications." );
      toolbar.appendChild(label);
    });
  }
};
