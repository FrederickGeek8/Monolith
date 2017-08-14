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
        if (elem.nodeType === 3) {
          // This is hacky but it is assumed that you run .empty beforehand
          this[i].appendChild(elem);
        } else {
          this[i].insertAdjacentElement(value, elem);
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

  },
  empty: function() {
    for (var i = 0; i < this.length; i++) {
      while (this[i].firstChild) {
        this[i].removeChild(this[i].firstChild);
      }
    }

    return this;
  },
  getText: function(node) {
    var ret = "";

    for (var i = 0; i < node.length; i++) {
      if (node[i].nodeType === 3 || node[i].nodeType === 4) {
        ret += node[i].nodeValue;
      } else if (node[i].nodeType !== 8) {
        ret += this.getText(node[i].childNodes);
      }
    }

    return ret;
  },
  text: function(text) {
    if (text !== undefined) {
      this.empty().append(document.createTextNode(text));
    }

    return this.getText(this);
  }
});
