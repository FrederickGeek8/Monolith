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
          this[i].insertAdjacentElement(value, elem[j]);
        }
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
