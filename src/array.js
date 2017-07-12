Monolith.extend({
  each: function(obj, callback) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        callback.call(obj[key], key, obj[key]);
      }
    }
  }
});
