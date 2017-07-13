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
