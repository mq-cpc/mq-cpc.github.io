// ui.js — non-graph chrome: hint line, help sheet, theme toggle.
// Imports nothing; the view calls setConnecting() when connect mode changes.

var hintEl     = document.querySelector(".hint");
var helpScrim  = document.getElementById("help-scrim");
var helpToggle = document.getElementById("help-toggle");
var themeBtn   = document.getElementById("theme-toggle");
var defaultHint = hintEl.innerHTML;

export function setConnecting(on) {
  hintEl.innerHTML = on ? "<b>Click a target node to connect — Esc to cancel</b>" : defaultHint;
}
export function toggleHelp() { helpScrim.hidden = !helpScrim.hidden; }
export function closeHelp() { helpScrim.hidden = true; }

export function init() {
  helpToggle.addEventListener("click", toggleHelp);
  helpScrim.addEventListener("pointerdown", function (e) { if (e.target === helpScrim) closeHelp(); });

  // Theme toggle — shares the site's key and its pastel/indigo themes so the
  // choice carries between this tool and the rest of the site. A blocking
  // script in <head> has already applied the saved theme before first paint;
  // here we just sync the button icon and wire the toggle.
  var root = document.documentElement, KEY = "mqcp-theme";
  function icon(t) { themeBtn.textContent = t === "indigo" ? "☀" : "☾"; }
  icon(root.getAttribute("data-theme"));
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "indigo" ? "pastel" : "indigo";
    root.setAttribute("data-theme", next); icon(next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
  });
}
