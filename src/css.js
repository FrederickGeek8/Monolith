Monolith.extend({
  curCSS: getComputedStyle || currentStyle,
  css: function(prop, value) {
    if (typeof value === "undefined") {
      if (prop === "opacity") {
        var currentVal = this.curCSS(this[0], prop);
        return ((currentVal == "") ? 1 : currentVal);
      } else {
        return this.curCSS(this[0], prop);
      }
    } else {
      for (var i = 0; i < this.length; i++) {
        this[i].style[prop] = value;
      }
    }

    return this;
  },
  width: function(val) {
    this.css('width', val);
  },
  height: function(val) {
    this.css('height', val);
  }
});
