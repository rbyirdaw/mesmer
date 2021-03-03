import * as d3 from 'd3';

const componentHtml = document.createElement('template');
componentHtml.innerHTML = `
  <style>
    .link-group line {
      stroke: #aaa;
    }
    .node-group circle {
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
    this.clearNodes();

    this._nodes = nodeList;  
    this.joinNodes();

    this.addNodeText();

    //update view
    this.render();
  }


  set links(linkList) {
    this.clearLinks();

    this._links = linkList;    
    this.joinLinks();

    this.render();      
  }

  updateGraph(nodesLinks) {
    // nodesLinks = {nodes: [{},{},...], links: [{},{},...]}

    this.clearNodes();
    this.clearLinks();
    
    const {nodes, links} = nodesLinks;
    this._nodes = nodes;
    this._links = links;

    this.joinNodes();
    this.joinLinks();

    this.render();
  }

  clearNodes() {
    this._nodes = [];
    this.joinNodes();
  }

  clearLinks() {
    this._links = [];
    this.joinLinks();
  }

  createNodeElements() {
    this.node = this.svg.select("g")      
        .selectAll('.node-group');    
  }

  createLinkElements() {
    this.link = this.svg.select("g")
      .selectAll('.link-group');
  }

  joinNodes() {
    this.node = this.node
      .data(this._nodes, d => d.id)
      .join(enter => enter.append("g")
        .attr("class", "node-group")        
      );
    
    this.node
      .append("circle")
        .attr("r", 8)
        .attr("fill","aqua")
        .call(d3.drag()
          .on("start", this.dragstarted.bind(this))
          .on("drag", this.dragged.bind(this))
          .on("end", this.dragended.bind(this))); 
  }

  joinLinks() {
    this.link = this.link
      .data(this._links, d => [d.source, d.target])
      .join(enter => enter.append("g")
        .attr("class", "link-group")        
      );
      
    this.link
      .append("line");
  }

  addNodeText() {
    this.node
      .append("text")
        .attr("text-anchor", "middle")
        .text(d => d.id);
  }

  ticked() {
    try {
      this.link && this.link
        .selectAll('line')
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      this.node
        .selectAll('circle')
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

      this.node
        .selectAll('text')
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });        

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
