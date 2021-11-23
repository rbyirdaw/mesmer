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
    .node-group circle:hover,
    .node-group text:hover {
      cursor: pointer;
    }
    #d3-graph-container {
      border: 4px solid #ccc;
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
    this._nodeText;
    this.link;
    this._linkText;
    this._nodes = [];
    this._links = [];
    this.simulation;

    this.colors;
    this.nodeColor;
    this.nodeRadius = 25;

    this.linkDistance = 150;
    this.linkStrength = -150;
  }

  connectedCallback() {
    this.shadowRootRef.querySelector('#d3-graph-container')
      .innerHTML = `<svg viewbox="${0} ${0} ${this.width} ${this.height}"></svg>`;

    if (d3) {
      this.svg = d3.select(this.shadowRootRef.querySelector('svg'));
      this.svg.append("g")
        .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

      this.simulation = d3.forceSimulation(this._nodes)
        .force("charge", d3.forceManyBody().strength(this.linkStrength))
        .force("link", d3.forceLink(this._links).distance(this.linkDistance))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .alphaTarget(1)
        .on("tick", this.ticked);      

      this.colors = d3.scaleOrdinal(d3.schemePaired);
      this.nodeColor = (d, i) => this.colors(i);

      this.createNodeElements();
      this.createLinkElements();

      this._linkText = (d) => d.source.id + " - " + d.target.id;
      this._nodeText = (d) => d.id;
    }
  }

  disconnectedCallback() {
    console.log("%c D3 graph removed.", "color: white; background-color: salmon");
  }

  set nodes(nodeList) {
    this.clearNodes();

    this._nodes = nodeList;  
    this.joinNodes();

    this.addNodeText();

    //update view
    this.render();
  }

  set nodeText(textFunc) {
    this._nodeText = textFunc;
    this.node
      .selectAll('text')
      .text(this._nodeText);
  }

  set links(linkList) {
    this.clearLinks();

    this._links = linkList;    
    this.joinLinks();

    this.addLinkText();

    this.render();      
  }

  set linkText(textFunc) {
    this._linkText = textFunc;
    this.link
      .selectAll('text')
      .text(this._linkText);
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
        .call(d3.drag()
          .on("start", this.dragStarted)
          .on("drag", this.dragged)
          .on("end", this.dragEnded)) 
      );
    
    this.node
      .append("circle")
        .attr("r", this.nodeRadius)
        .attr("fill", this.nodeColor);
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
        .attr("dy", ".35em")
        .text(this._nodeText);
  }

  addLinkText() {
    this.link
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .text(this._linkText);
  }

  ticked = () => {
    try {
      this.link
        .selectAll('line')
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      this.link
        .selectAll('text')
        .attr("x", function(d) { return (d.source.x + d.target.x)/2; })
        .attr("y", function(d) { return (d.source.y + d.target.y)/2; }); 

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

  dragStarted = (d) => {
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged = (d) => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragEnded = (d) => {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }


  render() {
    this.simulation.nodes(this._nodes);
    this.simulation.force("link").links(this._links);
  }
}
