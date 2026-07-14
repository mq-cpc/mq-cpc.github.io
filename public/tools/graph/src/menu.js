// menu.js — right-click context menu. Builds buttons that call view operations,
// and closes itself whenever a pointerdown lands outside it (so neither the view
// nor the board has to remember to close it).

import * as view from "./view.js";

var menuEl = document.getElementById("menu");

export function close() { menuEl.hidden = true; }

function clamp(x, y) {
  menuEl.hidden = false;
  var w = menuEl.offsetWidth, h = menuEl.offsetHeight;
  menuEl.style.left = Math.min(x, window.innerWidth - w - 8) + "px";
  menuEl.style.top  = Math.min(y, window.innerHeight - h - 8) + "px";
}
function mkItem(label, key, fn, danger) {
  var b = document.createElement("button");
  if (danger) b.className = "danger";
  b.appendChild(document.createTextNode(label));
  if (key) { var k = document.createElement("kbd"); k.textContent = key; b.appendChild(k); }
  b.addEventListener("click", function () { close(); fn(); });
  return b;
}
function mkSep() { var d = document.createElement("div"); d.className = "sep"; return d; }

// gx,gy = board coordinates (where a node would land); cx,cy = screen coords.
export function openCanvas(gx, gy, cx, cy) {
  menuEl.innerHTML = "";
  menuEl.appendChild(mkItem("Add node here", "N", function () { view.addNodeAt(gx, gy); }));
  menuEl.appendChild(mkSep());
  menuEl.appendChild(mkItem("Clear board", "", function () { view.clear(); }));
  clamp(cx, cy);
}

export function openNode(d, cx, cy) {
  view.select(d);
  menuEl.innerHTML = "";
  menuEl.appendChild(mkItem("Connect to…", "C", function () { view.startConnect(d); }));
  menuEl.appendChild(mkItem("Rename", "R", function () { view.promptRename(d); }));

  var row = document.createElement("div"); row.className = "swatch-row";
  var fills   = ["var(--surface)", "var(--cat-1-fill)", "var(--cat-2-fill)", "var(--cat-3-fill)", "var(--cat-4-fill)", "var(--cat-5-fill)", "var(--cat-6-fill)"];
  var strokes = ["var(--line-strong)", "var(--cat-1)", "var(--cat-2)", "var(--cat-3)", "var(--cat-4)", "var(--cat-5)", "var(--cat-6)"];
  fills.forEach(function (f, i) {
    var s = document.createElement("div"); s.className = "swatch";
    s.style.background = f; s.style.borderColor = strokes[i];
    s.title = i === 0 ? "Plain" : "Category " + i;
    s.addEventListener("click", function () { close(); view.recolor(d, i); });
    row.appendChild(s);
  });
  menuEl.appendChild(row);

  menuEl.appendChild(mkSep());
  menuEl.appendChild(mkItem("Delete", "Del", function () { view.deleteNode(d); }, true));
  clamp(cx, cy);
}

export function init() {
  // Capture phase so this runs before a node's drag-start; a click inside the
  // menu (on a button) is left alone and handled by the button's own listener.
  document.addEventListener("pointerdown", function (e) {
    if (!menuEl.contains(e.target)) close();
  }, true);
}
