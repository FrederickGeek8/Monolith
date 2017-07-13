var document = window.document;
var Monolith = (function() {
  var Monolith = function(selector) {
      return new Monolith.fn.init(selector);
    },
    readyBound = false,
    readyList = [],
    readyFired = false,
    htmlRegex = /^<([a-z]+)([^<]+)*(?:>(.*)<\/([a-z]+)>|\s+\/>)$/;

  Monolith.fn = Monolith.prototype = {
    init: function(selector) {
      var i,
        key;
      // Handle undefined, null or empty selectors
      if (!selector) {
        return this;
      }

      if (selector.nodeType) {
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
        var htmlTest = htmlRegex.exec(selector);
        if (htmlTest) {
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = selector;
          i = 0;
          for (key in tempDiv.childNodes) {
            if (tempDiv.childNodes[key].nodeType === 1) {
              this[i] = tempDiv.childNodes[key].cloneNode(true);
              i++;
            }
          }

          this.selector = selector;
          this.context = document;
          this.length = i;
          return this;
        } else {
          this.context = document;
          var selected = document.querySelectorAll(selector);
          this.selector = selector;
          this.length = selected.length;

          for (key in selected) {
            this[key] = selected[key];
          }
          return this;
        }
      }

      if (selector.selector !== undefined) {
        this.selector = selector.selector;
        this.context = selector.context;
        this.length = selector.length;

        for (i = 0; i < selector.length; i++) {
          this[i] = selector[i];
        }
      }

      return this;
    },
    isReady: false,
    monolith: "0.0.1",
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
    click: function(callback) {
      this.on('click', callback);
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
    var target = arguments[0] || {},
      i = 1,
      deep = false;

    if (typeof target === "boolean") {
      i = 2;
      deep = target;
      target = arguments[1] || {};
    }

    if (arguments.length === 1) {
      target = this;
      i--;
    }

    for (; i < arguments.length; i++) {
      var obj = arguments[i];

      if (!obj) {
        continue;
      }

      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (deep && typeof obj[key] === 'object') {
            target[key] = Monolith.extend(target[key], obj[key]);
          } else {
            if (target == this) {
              // for some reason I cannot remove this function
              // please fix!
              Monolith.fn[key] = obj[key];
            }
            target[key] = obj[key];
          }
        }
      }
    }

    return target;
  };

  return (window.$ = window.Monolith = Monolith);
})();
