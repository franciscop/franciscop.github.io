if (typeof customElements === 'undefined') {
  alert('Ooops, please enable CustomElements (part of "webcomponents") for this demo to work');
}


const unique = (value, index, self) => self.indexOf(value) === index;

const registered = [];
const onload = cb => registered.push(cb);

const onready = fn => {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

const getAttributes = el => {
  const attrs = {};
  for (var att, i = 0, atts = el.attributes, n = atts.length; i < n; i++){
    attrs[atts[i].nodeName] = atts[i].nodeValue;
  }
  return attrs;
};

const addSlots = (root, attrs) => {
  for (let key in attrs) {
    const slot = document.createElement('span');
    slot.setAttribute('slot', key);
    slot.innerHTML = attrs[key];
    root.appendChild(slot);
  }
};

// Define custome elements
const define = name => {
  customElements.define(name, class extends HTMLElement {
    constructor() {
      super();
      const data = getAttributes(this);
      addSlots(this, data);
      var template = document.getElementById(name);
      const attrs = getAttributes(template);
      const tpl = template.content.cloneNode(true);
      for (let key in data) {
        [...tpl.querySelectorAll(`[slot-${key}]`)].forEach(el => {
          el.setAttribute(key, data[key]);
          el.removeAttribute(`slot-${key}`);
        });
      }
      const before = registered.length;
      if (!this.attachShadow) {
        alert('Ooops, please enable shadowDom (part of "webcomponents") for this demo to work');
      }
      this.attachShadow({ mode: 'open' }).appendChild(tpl);
      if (before.length !== registered.length) {
        this.template = this.shadowRoot;
        registered.slice(before).forEach(cb => cb.call(this, {
          ...attrs,
          ...data,
          element: this,
          template: this.shadowRoot
        }));
      }
    }
  });
};

// Only the custom elements
const custom = name => /^[a-z].+\-.+[a-z]$/.test(name);

[...document.querySelectorAll('*')].map(el => el.nodeName.toLowerCase()).filter(custom).filter(unique).forEach(define);

window.self = fn => {
  console.log('Nothing to show :(');
};
