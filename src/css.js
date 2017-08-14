Monolith.extend({
  curCSS: function(elem, prop) {
    // TODO: Fix illegal invocation
    // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
    if (document.documentElement.currentStyle) {
      var ret = elem.currentStyle && elem.currentStyle[prop],
        testpx = /^-?\d+(?:px)?$/i,
        testnum = /^-?\d/;

      if (!testpx.test(ret) && testnum.test(ret)) {
        var left = elem.style.left,
          runtimeLeft = elem.runtimeStyle;

        // Feed in new values to be computed
        elem.runtimeStyle.left = elem.currentStyle;
        elem.style.left = ret || 0;
        ret = style.pixelLeft + "px";

        // Aand revert
        elem.style.left = left;
  			elem.runtimeStyle.left = runtimeLeft;
      }

      return ret === "" ? "auto" : ret;
    }

    return window.getComputedStyle(elem)[prop];
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
        var currentVal = this.curCSS(this[0], prop);
        return ((currentVal == "") ? 1 : currentVal);
      } else {
        return this.curCSS(this[0], prop);
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
      return parseFloat(this.css('width'));
    } else if (typeof val === "number") {
      return this.css('width', val + "px");
    } else {
      return this.css('width', val);
    }
  },
  height: function(val) {
    if (typeof val === "undefined") {
      return parseFloat(this.css('height'));
    } else if (typeof val === "number") {
      return this.css('height', val + "px");
    } else {
      return this.css('height', val);
    }
  }
});
