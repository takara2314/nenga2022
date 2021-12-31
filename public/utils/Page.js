class Page {
  constructor(tag) {
    this.element = document.createElement(tag);
    this.ref = {};
  }

  register(contents) {
    this._createDom(this.element, contents);
  }

  _createDom(parent, contents) {
    for (let item of contents) {
      const element = document.createElement(item.tag);

      if (item.id !== undefined) {
        element.id = item.id;
        this.ref[item.id] = element;
      }
      if (item.className !== undefined) {
        element.classList.add(item.className);
      }

      if (item.type !== undefined) {
        element.type = item.type;
      }

      if (item.content !== undefined) {
        element.innerHTML = item.content;
      }
      if (item.contents !== undefined) {
        this._createDom(element, item.contents);
      }

      if (item.onClick !== undefined) {
        element.addEventListener('click', item.onClick);
      }

      parent.appendChild(element);
    }
  }

  mount() {
    document.body.appendChild(this.element);
  }

  unmount() {
    this.element.remove();
  }
}
