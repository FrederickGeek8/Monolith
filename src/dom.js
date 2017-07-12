$.each({
  before: 'beforebegin',
  after: 'afterend',
  prepend: 'afterbegin',
  append: 'afterend'
}, function(key, value) {
  console.log(key);
  Monolith.fn[key] = function(elem) {
    var i;

    if (typeof elem === "string") {
      for (i = 0; i < this.length; i++) {
        this[i].insertAdjacentHTML(value, elem);
      }
    } else if (typeof elem.monolith === "string") {
      for (i = 0; i < this.length; i++) {
        for (var j = 0; j < elem.length; j++) {
          this[i].insertAdjacentHTML(value, elem[j].outerHTML);
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
  console.log(key);
  Monolith.fn[key] = function(elem) {
    Monolith(elem)[value](this);

    return this;
  };
});
