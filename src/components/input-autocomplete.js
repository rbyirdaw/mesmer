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

    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(componentHtml.content.cloneNode(true));    
  }
}
