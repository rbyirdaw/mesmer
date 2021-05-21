
export class AlertElement extends HTMLElement {
  constructor() {
    super();

    this._alertType = this.getAttribute('alert-type');
    this._alertText = this.getAttribute('alert-text');
    this.render();
  }

  static get observedAttributes() {
    return ['enabled', 'alert-type', 'alert-text'];
  }

  set enabled(val) {
    if (val) {
      this.setAttribute('enabled', '');
    } else {
      this.removeAttribute('enabled');
    }
  }

  set alertType(val) {
    this.setAttribute('alert-type', val);
  }

  set alertText(val) {
    this.setAttribute('alert-text', val);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const initialLoad = (name === 'enabled' && this.hasAttribute('enabled'));
    switch (name) {
      case 'enabled':
        break;
      case 'alert-type':
        this._alertType = newValue;
        !initialLoad && this.updateAlertClass(newValue);
        break;
      case 'alert-text':
        this._alertText = newValue;
        !initialLoad && this.updateAlertText(newValue);
    }

    this.render();
    if (initialLoad) {
      this.querySelector('button').addEventListener('click', (e) => {
        this.onAlertCloseClick();    
      })
    }

  }
  
  getAlertClass(alertType) {
    switch (alertType) {
      case 'warning':
        return 'alert-warning';       
      case 'error':
        return 'alert-danger';
      case 'info':
      default:
        return 'alert-info';
    }
  }

  updateAlertClass(alertClass) {
    const alertEl = this.querySelector('div.alert');
    alertEl && (alertEl.className = `alert ${alertClass}`);
  }

  updateAlertText(alertText) {
    const alertEl = this.querySelector('div.alert');
    alertEl && (alertEl.innerText = alertText);
  }

  onAlertCloseClick() {
    this.enabled = false;
  }

  render() {
    this.innerHTML = this.hasAttribute('enabled') ? `
      <style>
        alert-element {
          position: absolute;
          width: 100%;
        }
        button {
          float: right;
        }
      </style>
      <div class="alert ${this.getAlertClass(this._alertType) || 'alert-info'}" role="alert">
        ${this._alertText}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    ` : ``;    
  }
}