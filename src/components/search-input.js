
let componentHtml = document.createElement('template');
componentHtml.innerHTML = `
  <input type="text" id="search-input">
  <ul id="search-results">
  </ul>

`

export class SearchInput extends HTMLElement {
  constructor() {
    super();
    this.shadowRootRef = this.attachShadow({mode: 'open'});
    this.shadowRootRef.appendChild(componentHtml.content.cloneNode(true));

    this._listItems;
  }

  connectedCallback() {
    let inputEl = this.shadowRootRef.querySelector('input');
    inputEl.addEventListener('change', (e) => {
      console.log("On change ", e.target.value);
      this.dispatchEvent(new CustomEvent('item-selected', {
        detail: {
          value: e.target.value
        },
        bubbles: true
      }));
    });

    inputEl.addEventListener('keyup', (e) => {
      console.log("On keyup", e.target.value);
      this.dispatchEvent(new CustomEvent('value-input', {
        detail: {
          value: e.target.value
        },
        bubbles: false
      }));
    });
  }

  get listItems() {
    return this._listItems;
  }

  set listItems(items) {
    this._listItems = items;
    this.render();
  }

  renderListItems() {
    return this._listItems.map(item => {
      return `<li>${item}</li>`
    }).join('');
  }

  render() {
    this.shadowRootRef.querySelector('ul')
      .innerHTML = `${this.renderListItems()}`;
  }
}