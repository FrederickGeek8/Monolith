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
