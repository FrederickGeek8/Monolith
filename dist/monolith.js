(function(window, undefined) {

var document = window.document;
var Monolith = (function() {
  var Monolith = function(selector) {
      return new Monolith.fn.init(selector);
    },
    readyBound = false,
    readyList = [],
    readyFired = false;

  Monolith.fn = Monolith.prototype = {
    init: function(selector) {
      var base = this;
      // Handle undefined, null or empty selectors
      if (!selector) {
        return this;
      }

      if ( selector.nodeType ) {
  			this.context = this[0] = selector;
  			this.length = 1;
  			return this;
  		}

      if (selector === "body" && document.body) {
        this.context = document;
        this[0] = document.body;
        this.selector = "body";
        this.length = 1;
        return this;
      }

      if (typeof selector === "string") {
        this.context = document;
        var selected = document.querySelectorAll(selector);
        this.length = selected.length;
        selected.forEach(function(value, key) {
          base[key] = value;
        });
        return this;
      }

      if (selector.selector !== undefined) {
  			this.selector = selector.selector;
  			this.context = selector.context;
  		}
    },
    isReady: false,
    on: function() {
      for (var el, i = 0; i < this.length; i++) {
        el = this[i];
        if (window.addEventListener) {
          el.addEventListener.apply(el, arguments);
        } else {
          el.attachEvent.apply(el, arguments);
        }

      }
      return this;
    },
    click: function() {
      this.on('click', arguments[0]);
      return this;
    },
    ready: function(fn) {
      this.bindReady();

      if (this.isReady) {
        fn.call(document, Monolith);
      } else {
        readyList.push(fn);
      }

      return this;
    },
    onReady: function() {
      if (readyBound && !readyFired) {
        readyFired = true;
        for (var key in readyList) {
          readyList[key].call(document, Monolith);
        }
      }
    },
    bindReady: function() {
      if (readyBound) {
        return;
      }

      readyBound = true;

      if (document.readyState === "complete") {
        this.onReady.call(document, Monolith);
        return;
      }

      if (document.attachEvent) {
        document.attachEvent("onreadystatechange", this.onReady);
        window.attachEvent("onload", this.onReady);
      } else {
        document.addEventListener('DOMContentLoaded', this.onReady, false);
        window.addEventListener('load', this.onReady, false);
      }
    }
  };

  Monolith.fn.init.prototype = Monolith.fn;

  Monolith.extend = Monolith.fn.extend = function() {
    var functionality = arguments[0];
    if (typeof functionality === "object") {
      for (var key in functionality) {
        Monolith.prototype[key] = this[key] = functionality[key];
      }
    }
    return this;
  };

  return (window.$ = window.Monolith = Monolith);
})();

Monolith.extend({
  ajaxDefaults: {
    type: 'GET',
    url: location.href,
    context: document,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  ajax: function() {
    var url, settings;
    if (arguments.length === 2) {
      url = arguments[0];
      settings = arguments[1];
    } else if (arguments.length === 1) {
      settings = arguments[1];
      url = settings.url;
    }

    if (typeof settings.type === "undefined") {
      settings.type = this.ajaxDefaults.type;
    }

    if (typeof settings.url === "undefined" && typeof url === "undefined") {
      url = this.ajaxDefaults.url;
    }

    if (typeof settings.context === "undefined") {
      settings.context = this.ajaxDefaults.context;
    }

    if (typeof settings.contentType === "undefined") {
      settings.contentType = this.ajaxDefaults.contentType;
    }

    var request = new XMLHttpRequest();
    request.open(settings.type, url, true);


    if (settings.type == 'GET') {
      request.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status >= 200 && this.status < 400) {
            // Success!
            settings.success.call(settings.context, this.responseText);
          } else {
            settings.error.call(settings.context, this.statusText);
          }
        }
      };
    } else {
      request.setRequestHeader('Content-Type', settings.contentType);
    }

    request.send();
    request = null;
  },
  getJSON: function() {
    var url = arguments[0],
    success = arguments[1];

    Monolith.ajax({
			type: "GET",
			url: url,
			success: function(data){
        success.call(this, JSON.parse(data));
      }
		});
  }
});

Monolith.extend({
  attr: function() {
    if (typeof arguments[0] == "object") {
      for (var key in arguments[0]) {
        for (var i = 0; i < this.length; i++) {
          this[i].setAttribute(key, arguments[0][key]);
        }
      }
    } else {
      return this[0].getAttribute(arguments[0]);
    }

    return this;
  },
  prop: function() {
    var i;
    if (arguments.length == 2) {
      if (typeof arguments[1] == "function") {
        for (i = 0; i < this.length; i++) {
          arguments[1].call(this, i, this[i][arguments[0]]);
        }
      } else {
        for (i = 0; i < this.length; i++) {
          this[i][arguments[0]] = arguments[1];
        }
      }
    } else {
      if (typeof arguments[0] == "object") {
        for (var key in arguments[0]) {
          for (i = 0; i < this.length; i++) {
            this[i][key] = arguments[0][key];
          }
        }
      } else {
        return this[0][arguments[0]];
      }
    }
    return this;
  },
  val: function() {
    var el = this[0],
      nodeName = el.nodeName.toLowerCase(),
      i;
    if (arguments.length == 0) {
      if (nodeName == 'option') {
        return el.text;
      } else if (nodeName == 'select') {
        // Consider case where there are multiple items selected
        var values = [];
        for (i = 0; i < el.options.length; i++) {
          if (el.options[i].selected) {
            values.push(el.options.text);
          }
        }

        return values;
      } else {
        return el.value;
      }

    } else {
      if (typeof arguments[0] == 'function') {
        for (i = 0; i < this.length; i++) {
          arguments[0].call(this, i, this.val($(this[i])));
        }
      } else {
        if (nodeName == 'option') {
          el.text = arguments[0];
        }

        el.value = arguments[0];
      }
    }

    return this;
  },
  html: function() {
    var i;
    if (arguments.length == 0) {
      return this[0].innerHTML;
    } else {
      if (typeof arguments[0] == 'function') {
        for (i = 0; i < this.length; i++) {
          arguments[0].call(this, i, this[i].innerHTML);
        }
      } else {
        for(i = 0; i < this.length; i++) {
          this[i].innerHTML = arguments[0];
        }
      }
    }
  }
});

})(window);
