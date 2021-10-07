
export default class MesmerGraphControls extends HTMLElement {
  
  constructor() {
    super();

    this._maxDistCutoff = 5;
    this._maxResPairGap = 5;

    this.render();
  }

  set maxDistCutoff(value) {
    this._maxDistCutoff = value;
    this.querySelector('#max-distance').setAttribute('max', this._maxDistCutoff);
  }

  set maxResPairGap(value) {
    this._maxResPairGap = value;
    this.querySelector('#min-res-gap').setAttribute('max', this._maxResPairGap);
  }

  connectedCallback() {
    this.createGraphControls();
  }

  createRangeInput = (value, min, max, id, label, onChangeCallback) => {
    const rangeEl = document.createElement('input');
    rangeEl.setAttribute('type', 'range');
    rangeEl.setAttribute('value', value);
    rangeEl.setAttribute('min', min || 0);
    rangeEl.setAttribute('max', max || 1);
    rangeEl.setAttribute('step', 1);
    rangeEl.setAttribute('id', id || "range-id");
  
    rangeEl.addEventListener('change', onChangeCallback);
  
    const rangeValue = document.createElement('span');
    rangeValue.setAttribute('id', id+'-value');
    rangeValue.innerText = value;
  
    const rangeLabel = document.createElement('label');
    rangeLabel.setAttribute('id', id+"-wrapper");
    rangeLabel.innerText = label;
  
    rangeLabel.appendChild(rangeValue);
    rangeLabel.appendChild(rangeEl);
    return rangeLabel;
  
  };
  
  createGraphControls = () => {
    const resMaxDistance = this.createRangeInput(3, 1, this._maxDistCutoff, "max-distance", 
        "Maximum distance (Å): ", this.onMaxDistanceChange);
    
    const minResPairGap = this.createRangeInput(3, 1, this._maxResPairGap, "min-res-gap", 
        "Minimum residue pair gap: ", this.onMinResGapChange);
  
    const controlsWrapper = this.querySelector('#controls-wrapper');
    controlsWrapper.appendChild(resMaxDistance);
    controlsWrapper.appendChild(minResPairGap);
  };
  
  onMaxDistanceChange = (e) => {
    const _distCutoff = e.target.value;
    console.log("Max distance range changed: ", _distCutoff);
    //update value displayed (span is sibling element)
    e.target.previousElementSibling.innerText = _distCutoff;

    this.dispatchEvent(new CustomEvent('max-distance-change', {
      detail: {
        value: _distCutoff
      },
      bubbles: true
    }));
  };
  
  onMinResGapChange = (e) => {
    const _resPairGapMin = e.target.value;
    console.log("Minimum residue gap changed: ", e.target.value);
    //update value displayed (span is sibling element)
    e.target.previousElementSibling.innerText = _resPairGapMin;  
    
    this.dispatchEvent(new CustomEvent('min-res-pair-gap-change', {
      detail: {
        value: _resPairGapMin
      },
      bubbles: true
    }));
  }

  render() {
    this.innerHTML = `
      <div id="controls-wrapper"></div>
    `;
  }
}