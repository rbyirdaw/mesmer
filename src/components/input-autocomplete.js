//An input autocomplete web component

let componentHtml = document.createElement('template');
componentHtml.innerHTML = `
  <input list="list-items">
  <datalist id="list-items">
  </datalist>
`;

export class InputAutocomplete extends HTMLElement {
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
      });
    inputEl.addEventListener('keydown', (e) => {
      console.log("On keydown", e.target.value);
    });
  }

  get listItems() {
    return this._listItems;
  }

  set listItems(items) {
    this._listItems = items;
    this.render();
  }

  renderItemOptions() {
    return this._listItems.map(item => {
      return `<option>${item}</option>`
    }).join('');
  }

  render() {
    this.shadowRootRef.querySelector('datalist')
      .innerHTML = `${this.renderItemOptions()}`
  }

}
