// main.js — entry point. Seeds the sample graph and starts the modules.
// Loaded as <script type="module">, so it runs after the DOM is parsed.
//
// Flow (d3-first):  interaction -> graph mutation + view.update() (the join).
// view.js owns all d3; graph.js is the plain, testable model.

import { graph } from "./graph.js";
import * as view from "./view.js";
import * as interactions from "./interactions.js";
import * as menu from "./menu.js";
import * as ui from "./ui.js";

// Sample graph. fx/fy are fractions of the board, turned into pixels on load.
var sample = [
  { id: 1, label: "A", cat: 0, fx: 0.28, fy: 0.34 },
  { id: 2, label: "B", cat: 6, fx: 0.46, fy: 0.20 },
  { id: 3, label: "C", cat: 0, fx: 0.66, fy: 0.30 },
  { id: 4, label: "D", cat: 2, fx: 0.30, fy: 0.66 },
  { id: 5, label: "E", cat: 0, fx: 0.50, fy: 0.50 },
  { id: 6, label: "F", cat: 5, fx: 0.70, fy: 0.60 },
  { id: 7, label: "G", cat: 3, fx: 0.50, fy: 0.82 }
];
var sampleEdges = [
  { a: 1, b: 2, w: 4 }, { a: 2, b: 3, w: 3 }, { a: 1, b: 5, w: 2 },
  { a: 3, b: 6, w: null }, { a: 5, b: 4, w: 6 }, { a: 5, b: 6, w: null },
  { a: 5, b: 7, w: 2 }, { a: 4, b: 7, w: null }, { a: 6, b: 7, w: 1 }
];

function init() {
  var r = document.getElementById("board").getBoundingClientRect();
  var nodes = sample.map(function (s) {
    return { id: s.id, label: s.label, cat: s.cat, x: s.fx * r.width, y: s.fy * r.height };
  });
  graph.load(nodes, sampleEdges.slice(), 8);

  ui.init();
  menu.init();
  interactions.init();
  view.init();                     // first render (the join)
  view.select(graph.byId(5));      // start with E selected, as before
}

requestAnimationFrame(init);
