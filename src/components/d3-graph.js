import * as d3 from 'd3';

const componentHtml = document.createElement('template');
componentHtml.innerHTML = `
  <style>
    .links line {
      stroke: #aaa;
    }
    .nodes circle {
      pointer-events: all;
      stroke: none;
      stroke-width: 40px;
    }
  </style>
  <div id='d3-graph-container'></div>
`;

export class D3Graph extends HTMLElement {
  constructor() {
    super();

    this.shadowRootRef = this.attachShadow({mode: 'open'});
    this.shadowRootRef.appendChild(componentHtml.content.cloneNode(true));
    this.svg;
    this.width = 960;
    this.height = 600;
    this.node;
    this.link;
    this._nodes;
    this._links;
    this.simulation;
  }

  connectedCallback() {
    this.shadowRootRef.querySelector('#d3-graph-container')
      .innerHTML = `<svg width=${this.width} height=${this.height}></svg>`;

    this._nodes = [
      {"id": "A"},
      {"id": "B"},
      {"id": "C"}
    ];

    this._links = [
      {"source": 0, "target": 1},
      {"source": 1, "target": 2} 
    ];

    if (d3) {
      this.svg = d3.select(this.shadowRootRef.querySelector('svg'));
      this.simulation = d3.forceSimulation();
      this.createNodeElements();
      this.createLinkElements();
      this.setSimulationNodes();
      this.setSimulationLinks();
    }
  }

  set nodes(nodeList) {
    this._nodes = nodeList;
  }


  set links(linkList) {
    this._links = linkList;
  }

  createNodeElements() {
    const n = this._nodes;
    this.node = this.svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(n)
      .enter().append('circle')
        .attr('r', 2.5)
        .call(d3.drag()
          .on("start", this.dragstarted.bind(this))
          .on("drag", this.dragged.bind(this))
          .on("end", this.dragended.bind(this)))
  }

  createLinkElements() {
    this.link = this.svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this._links)
      .enter().append('line');
  }

  setSimulationNodes() {
    this.simulation
      .nodes(this._nodes)
      .on('tick', this.ticked.bind(this));    
  }

  setSimulationLinks() {
    this.simulation
      .force('link', d3.forceLink().links(this._links))
      .force('charge', d3.forceManyBody().strength(-20))
      .force('center', d3.forceCenter(this.width/2, this.height/2));
  }

  ticked() {
    try {
      this.link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

      this.node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    } catch (ex) {
      console.log("Exception in ticked: ", ex);
    }

  }

  dragstarted(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}
