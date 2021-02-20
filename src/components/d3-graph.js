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
    this.width = this.getAttribute('width');
    this.height = this.getAttribute('height');
    this.node;
    this.link;
    this._nodes = [];
    this._links = [];
    this.simulation;
  }

  connectedCallback() {
    this.shadowRootRef.querySelector('#d3-graph-container')
      .innerHTML = `<svg width=${this.getAttribute('width')} height=${this.getAttribute('height')}></svg>`;

    this._nodes = [
      {id: "A"},
      {id: "B"},
      {id: "C"}
    ];


    this._links = [
      {"source": 0, "target": 1},
      {"source": 1, "target": 2} 
    ];

    if (d3) {
      this.svg = d3.select(this.shadowRootRef.querySelector('svg'));
      this.svg.append("g")
        .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

      this.simulation = d3.forceSimulation(this._nodes)
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("link", d3.forceLink(this._links).distance(50))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .alphaTarget(1)
        .on("tick", this.ticked.bind(this));
      
      this.createNodeElements();
      this.createLinkElements();
      this.joinNodes();
      this.joinLinks();

      this.render();
    }
  }

  set nodes(nodeList) {
    this._nodes = nodeList;  
    this.joinNodes();

    //clear links?
    this._links = [];
    this.joinLinks();

    //update view
    this.render();
  }


  set links(linkList) {
    this._links = linkList;    
    this.joinLinks();
    this.render();      
  }

  updateGraph(nodesLinks) {
    // nodesLinks = {nodes: [{},{},...], links: [{},{},...]}
    const {nodes, links} = nodesLinks;
    this._nodes = nodes;
    this._links = links;

    this.joinNodes();
    this.joinLinks();

    this.render();
  }

  createNodeElements() {
    this.node = this.svg.select("g")
      .append('g')
        .attr('class', 'nodes')
        .selectAll('circle');
  }

  createLinkElements() {
    this.link = this.svg.select("g")
      .append('g')
        .attr('class', 'links')
        .selectAll('line');
  }

  joinNodes() {
    this.node = this.node
      .data(this._nodes, d => d.id)
      .join(enter => enter.append("circle")
        .attr("r", 8)
        .attr("fill","aqua")
        .call(d3.drag()
          .on("start", this.dragstarted.bind(this))
          .on("drag", this.dragged.bind(this))
          .on("end", this.dragended.bind(this)))        
        );    
  }

  joinLinks() {
    this.link = this.link
      .data(this._links, d => [d.source, d.target])
      .join("line");    
  }

  ticked() {
    try {
      this.link && this.link
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

  render() {
    this.simulation.nodes(this._nodes);
    this.simulation.force("link").links(this._links);
  }
}
