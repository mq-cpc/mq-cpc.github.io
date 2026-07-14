// interactions.js — board-level input (empty canvas) and keyboard shortcuts.
// A thin adapter: it translates events into view operations. Node dragging and
// node clicks are handled by the drag behavior inside view.js.

import * as view from "./view.js";
import * as menu from "./menu.js";
import * as ui from "./ui.js";

var board = document.getElementById("board");
var lastPos = { x: 0, y: 0 };

function pointer(e) {
  var r = board.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}
function onNode(e) { return e.target.closest && e.target.closest(".node-g"); }

export function init() {
  board.addEventListener("pointerdown", function (e) {
    if (e.button !== 0) return;
    if (onNode(e)) return;              // node drag handles its own gesture
    view.select(null);
    view.cancelConnect();
  });
  board.addEventListener("pointermove", function (e) { lastPos = pointer(e); });
  board.addEventListener("dblclick", function (e) {
    if (onNode(e)) return;             // node dblclick renames instead
    var p = pointer(e); view.addNodeAt(p.x, p.y);
  });
  board.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    var g = onNode(e);
    if (g) menu.openNode(d3.select(g).datum(), e.clientX, e.clientY);
    else { var p = pointer(e); menu.openCanvas(p.x, p.y, e.clientX, e.clientY); }
  });

  window.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;   // let browser shortcuts through
    var k = e.key, sel = view.getSelected();
    if (k === "Escape") { view.cancelConnect(); view.select(null); menu.close(); ui.closeHelp(); return; }
    if (k === "?") { ui.toggleHelp(); return; }
    if (k === "n" || k === "N") { view.addNodeAt(lastPos.x, lastPos.y); return; }
    if (sel) {
      if (k === "Backspace" || k === "Delete") { e.preventDefault(); view.deleteNode(sel); return; }
      if (k === "c" || k === "C") { view.startConnect(sel); return; }
      if (k === "r" || k === "R") { view.promptRename(sel); return; }
    }
  });
}
