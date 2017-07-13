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
