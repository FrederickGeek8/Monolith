Monolith.extend({
  each: function(obj, callback) {
    var key;
    if (typeof obj === "object") {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          callback.call(obj[key], key, obj[key]);
        }
      }
    } else {
      for (key = 0; key < obj.length; key++) {
        callback.call(obj[key], key, obj[key]);
      }
    }
  }
});
