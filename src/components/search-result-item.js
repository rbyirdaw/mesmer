const componentHtml = document.createElement('template');
componentHtml.innerHTML = `
  <li></li>
`;

export class SearchResultItem extends HTMLLIElement {
  constructor() {
    super();
    //this.shadowRootRef = this.attachShadow({mode: 'open'});
    //this.shadowRootRef.appendChild(componentHtml.content.cloneNode(true));
    //this.appendChild(componentHtml.content.cloneNode(true));
    this._text;
  }

  connectedCallback() {
    this.addEventListener('click', (e) => {
        console.log("li clicked");
        this.dispatchEvent(new CustomEvent('item-clicked', {
          detail: {
            value: e.target._text
          },
          bubbles: true
        }))
      })
  }

  static get observedAttributes() {
    return ['text'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {

    if (name === 'text') {
      this._text = newValue;
    }
    this.render();
  }

  render() {
    this.innerHTML = this._text;
  }
}