// view.js — the d3 layer. In this d3-first design the data-join IS the
// architecture:
//
//   • structural change (add / delete / connect / recolour / rename / clear)
//     -> update(), which runs the enter/update/exit joins.
//   • dragging mutates the bound datum (d.x/d.y) and moves only that node plus
//     its edges — no full re-render per pointer-move.
//   • selection lives on a single reference and is reflected with .classed();
//     toggling it needs no join at all.
//
// d3 is a global (UMD <script> before this module), so we use `d3.*` directly.

import { graph } from "./graph.js";
import * as ui from "./ui.js";

var edgesG = d3.select("#edges");
var nodesG = d3.select("#nodes");
var board  = document.getElementById("board");

var selected = null;      // the selected node object, or null
var connectFrom = null;   // node we're drawing an edge from, or null
var moved = false, sx = 0, sy = 0;   // drag bookkeeping (click vs drag)

function catClass(c) { return c ? " ps-cat-" + c : ""; }
function edgeKey(d) { return d.ed.a + "-" + d.ed.b; }

// Resolve each edge to its endpoint node objects; drop dangling edges. The
// wrappers reference the live node objects, so reading d.a.x later sees moves.
function edgeData() {
  return graph.edges.map(function (ed) {
    var a = graph.byId(ed.a), b = graph.byId(ed.b);
    return a && b ? { ed: ed, a: a, b: b } : null;
  }).filter(Boolean);
}

// ---- drag: mutate the datum, update locally ----
var drag = d3.drag()
  .subject(function (event, d) { return { x: d.x, y: d.y }; })
  .on("start", function (event) { moved = false; sx = event.x; sy = event.y; })
  .on("drag", function (event, d) {
    if (Math.abs(event.x - sx) + Math.abs(event.y - sy) > 3) moved = true;
    if (!moved) return;
    d.x = event.x; d.y = event.y;
    d3.select(this).attr("transform", "translate(" + d.x + "," + d.y + ")");
    redrawEdges();
  })
  .on("end", function (event, d) { if (!moved) nodeClicked(d); });

// ---- structural join: call after anything that adds/removes/relabels ----
export function update() {
  var ed = edgeData();

  edgesG.selectAll("line.ps-edge").data(ed, edgeKey).join("line").attr("class", "ps-edge");
  edgesG.selectAll("text.ps-weight").data(ed.filter(function (d) { return d.ed.w != null; }), edgeKey)
    .join("text").attr("class", "ps-weight").text(function (d) { return d.ed.w; });

  nodesG.selectAll("g.node-g").data(graph.nodes, function (d) { return d.id; })
    .join(function (enter) {
      var g = enter.append("g").attr("class", "node-g");
      g.append("circle").attr("r", 24);
      g.append("text").attr("class", "ps-node-label");
      g.call(drag);
      g.on("dblclick", function (event, d) { event.stopPropagation(); promptRename(d); });
      return g;
    })
    .each(function (d) {
      var g = d3.select(this);
      g.select("circle").attr("class", "ps-node" + catClass(d.cat)).classed("ps-node--selected", d === selected);
      g.select("text.ps-node-label").text(d.label);
    });

  redrawPositions();
}

function redrawPositions() {
  nodesG.selectAll("g.node-g").attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
  redrawEdges();
}
function redrawEdges() {
  edgesG.selectAll("line.ps-edge")
    .attr("x1", function (d) { return d.a.x; }).attr("y1", function (d) { return d.a.y; })
    .attr("x2", function (d) { return d.b.x; }).attr("y2", function (d) { return d.b.y; });
  edgesG.selectAll("text.ps-weight")
    .attr("x", function (d) { return (d.a.x + d.b.x) / 2; })
    .attr("y", function (d) { return (d.a.y + d.b.y) / 2; });
}

// ---- selection (visual only — just re-toggle the class, no join) ----
export function select(d) {
  selected = d || null;
  nodesG.selectAll("g.node-g").select("circle").classed("ps-node--selected", function (n) { return n === selected; });
}
export function getSelected() { return selected; }

// ---- connect mode ----
export function startConnect(d) { connectFrom = d; board.classList.add("is-connecting"); ui.setConnecting(true); }
export function cancelConnect() { connectFrom = null; board.classList.remove("is-connecting"); ui.setConnecting(false); }

function nodeClicked(d) {
  if (connectFrom && connectFrom !== d) {
    graph.addEdge(connectFrom.id, d.id); cancelConnect(); update();
  } else {
    select(d === selected ? null : d);
  }
}

// ---- structural operations (own selection/connect side-effects, then redraw) ----
export function addNodeAt(x, y) { var n = graph.addNode(x, y); selected = n; update(); }
export function deleteNode(d) {
  if (connectFrom === d) cancelConnect();
  if (selected === d) selected = null;
  graph.deleteNode(d.id); update();
}
export function recolor(d, cat) { graph.recolor(d.id, cat); update(); }
export function clear() { selected = null; cancelConnect(); graph.clear(); update(); }
export function promptRename(d) {
  var v = window.prompt("Node label", d.label);
  if (v != null) { v = v.trim(); if (v) { graph.renameNode(d.id, v); update(); } }
}

export function init() { update(); }
