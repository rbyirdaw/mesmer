import { SearchResultItem } from './search-result-item';

let componentHtml = document.createElement('template');
componentHtml.innerHTML = `<input type="text" id="search-input">`;
export class SearchInput extends HTMLElement {
  constructor() {
    super();
    //this.shadowRootRef = this.attachShadow({mode: 'open'});
    //this.shadowRootRef.appendChild(componentHtml.content.cloneNode(true));
    this.appendChild(componentHtml.content);
  }

  connectedCallback() {
    //let inputEl = this.shadowRootRef.querySelector('input');
    let inputEl = this.querySelector('input');
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
        bubbles: true
      }));
    });
  }
  
}