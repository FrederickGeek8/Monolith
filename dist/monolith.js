(function(window, undefined) {
  var document = window.document;
  var Monolith = (function() {
    var Monolith = function(selector) {
      return new Monolith.fn.init(selector);
    };

    Monolith.fn = Monolith.prototype = {
      init: function(selector) {
        var base = this;
        // Handle undefined, null or empty selectors
        if (!selector) {

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
          selected.forEach(function(value, key){
            base[key] = value;
          });
          return this;
        }
      },
      on: function() {
        for (var el, i = 0; i < this.length; i++) {
          el = this[i];
          el.addEventListener.apply(el, arguments);
        }
        return this;
      },
      click: function() {
        this.on('click', arguments[0]);
        return this;
      }
    };

    Monolith.fn.init.prototype = Monolith.fn;

    Monolith.extend = Monolith.fn.extend = function() {
      var functionality = arguments[0];
      if (typeof functionality === "object") {
        for (var key in functionality) {
          this[key] = functionality[key];
        }
      }
      return this;
    };

    return (window.$ = window.Monolith = Monolith);
  })();

})(window);
