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
  data: function(elem, name, val) {
    var i,
      selector;
    if (arguments.length === 3) {
      selector = $(elem);
      if (typeof val === "undefined") {
        return JSON.parse(selector[0].getAttribute(name));
      } else {
        for (i = 0; i < this.length; i++) {
          selector[0].setAttribute(name, JSON.stringify(val));
        }
      }
    } else {
      if (typeof elem.nodeType !== "undefined") {
        selector = $(elem);
        return JSON.parse(selector[0].getAttribute(name));
      } else {
        val = name;
        name = elem;
        if (typeof val === "undefined") {
          JSON.parse(this[0].getAttribute(name));
        } else {
          for (i = 0; i < this.length; i++) {
            this[i].setAttribute(name, JSON.stringify(val));
          }
        }
      }
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
        for (i = 0; i < this.length; i++) {
          this[i].innerHTML = arguments[0];
        }
      }
    }
  }
});
