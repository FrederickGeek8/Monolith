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
