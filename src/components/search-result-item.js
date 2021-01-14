const componentHtml = document.createElement('template');
componentHtml.innerHTML = `
  <li></li>
`;

export class SearchResultItem extends HTMLElement {
  constructor() {
    super();
    //this.shadowRootRef = this.attachShadow({mode: 'open'});
    //this.shadowRootRef.appendChild(componentHtml.content.cloneNode(true));
    this.appendChild(componentHtml.content.cloneNode(true));
    this._text;
  }

  connectedCallback() {
    this.querySelector('li')
      .addEventListener('click', (e) => {
        console.log("li clicked");
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
    this.querySelector('li')
      .innerHTML = this._text;
  }
}