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
      var base = this;
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
          var i = 0;
          tempDiv.childNodes.forEach(function(value, key) {
            if (value.nodeType === 1) {
              base[i] = value.cloneNode(true);
              i++;
            }
          });

          this.context = document;
          this.length = i;
          return this;
        } else {
          this.context = document;
          var selected = document.querySelectorAll(selector);
          this.length = selected.length;
          selected.forEach(function(value, key) {
            base[key] = value;
          });
          return this;
        }
      }

      if (selector.selector !== undefined) {
        this.selector = selector.selector;
        this.context = selector.context;
      }
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
