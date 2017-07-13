(function(window, undefined) {

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
  getJSON: function(url, success) {
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
  each: function(obj, callback) {
    var key;
    if (typeof obj === "object") {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          callback.call(obj[key], key, obj[key]);
        }
      }
    } else if (typeof obj === "function") {
      for (key = 0; key < this.length; key++) {
        obj.call(this[key], key, this[key]);
      }
    } else {
      for (key = 0; key < obj.length; key++) {
        callback.call(obj[key], key, obj[key]);
      }
    }
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

Monolith.extend({
  curCSS: function(arg) {
    // to fix Illegal invocation
    return window.getComputedStyle(arg) || window.currentStyle(arg);
  },
  css: function(prop, value) {
    var i;

    if (typeof prop === "object" && typeof value === "undefined") {
      for (var key in prop) {
        for (i = 0; i < this.length; i++) {
          this[i].style[key] = prop[key];
        }
      }
    } else if (typeof value === "undefined") {
      if (prop === "opacity") {
        var currentVal = this.curCSS(this[0])[prop];
        return ((currentVal == "") ? 1 : currentVal);
      } else {
        return this.curCSS(this[0])[prop];
      }
    } else {
      for (i = 0; i < this.length; i++) {
        this[i].style[prop] = value;
      }
    }

    return this;
  },
  width: function(val) {
    if (typeof val === "undefined") {
      if (this[0].offsetWidth !== 0) {
        return this[0].offsetWidth;
      }
    } else if (typeof val === "number") {
      return this.css('width', val + "px");
    } else {
      return this.css('width', val);
    }


  },
  height: function(val) {
    return this.css('height', val);
  }
});

$.each({
  before: 'beforebegin',
  after: 'afterend',
  prepend: 'afterbegin',
  append: 'beforeend'
}, function(key, value) {
  Monolith.fn[key] = function(elem) {
    var i;
    if (typeof elem === "string") {
      for (i = 0; i < this.length; i++) {
        this[i].insertAdjacentHTML(value, elem);
      }
    } else if (typeof elem.monolith === "string") {
      for (i = 0; i < this.length; i++) {
        for (var j = 0; j < elem.length; j++) {
          if (elem[j].nodeName.toLowerCase() == "script") {
            elem[j] = Monolith.rebuild(elem[j]);
          }
          this[i].insertAdjacentElement(value, elem[j]);
        }
      }
    } else if (typeof elem.nodeType !== "undefined") {
      for (i = 0; i < this.length; i++) {
        this[i].insertAdjacentElement(value, elem);
      }
    }

    return this;
  };
});

$.each({
  insertBefore: 'before',
  insertAfter: 'after',
  prependTo: 'prepend',
  appendTo: 'append'
}, function(key, value) {
  Monolith.fn[key] = function(elem) {
    Monolith(elem)[value](this);

    return this;
  };
});

Monolith.extend({
  rebuild: function(elem) {
    var newElem = document.createElement(elem.nodeName);

    if (elem.hasAttributes()) {
      for (var i = 0; i < elem.attributes.length; i++) {
        newElem.setAttribute(elem.attributes[i].name, elem.attributes[i].value);
      }
    }
    var newText = newElem.textContent || newElem.innerText,
      oldText = elem.textContent || elem.innerText;
    newText = oldText;

    return newElem;

  }
});

Monolith.extend({
  fadeIn: function() {
    var tick = function(obj, state) {
      state.opacity += (new Date() - state.last) / 400;
      obj.style.opacity = state.opacity;
      obj.style.filter = 'alpha(opacity=' + (100 * state.opacity) | 0 + ')';

      state.last = +new Date();

      var nexttick = function() {
        tick(obj, state);
      };

      if (state.opacity < 1) {
        if(!(window.requestAnimationFrame && requestAnimationFrame(nexttick))){
          setTimeout(nexttick, 16);
        }
      }
    };

    for (var i = 0; i < this.length; i++) {
      var state = {
        opacity: 0,
        last: +new Date()
      };
      this[i].style.opacity = 0;
      this[i].style.filter = '';


      tick(this[i], state);
    }
    
    return this;
  }
});

})(window);
