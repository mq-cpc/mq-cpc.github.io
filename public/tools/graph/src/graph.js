// graph.js — the graph as plain data: nodes, edges, and structural operations.
// PURE: no DOM, no d3. View concerns (which node is selected, connect mode,
// pixel rendering) live in view.js. This file holds the model and the logic
// worth testing (labels, edge dedupe, delete cascade) — see test/graph.test.js.
//
// Nodes { id, label, cat, x, y }; edges { a, b, w }.  cat 0 = plain, 1..6 = colour.
//
// The arrays are mutated in place (never reassigned) so that whoever binds to
// them — d3's data-join in particular — always sees the same array identity.

export function createGraph() {
  var nodes = [], edges = [], nextId = 1;

  function byId(id) {
    for (var i = 0; i < nodes.length; i++) if (nodes[i].id === id) return nodes[i];
    return null;
  }
  function newLabel() {
    for (var i = 0; i < 26; i++) {
      var ch = String.fromCharCode(65 + i);
      if (!nodes.some(function (n) { return n.label === ch; })) return ch;
    }
    return "N" + nextId;
  }

  return {
    nodes: nodes,
    edges: edges,
    get nextId() { return nextId; },
    byId: byId,

    load: function (newNodes, newEdges, startId) {
      nodes.length = 0; for (var i = 0; i < newNodes.length; i++) nodes.push(newNodes[i]);
      edges.length = 0; for (var j = 0; j < newEdges.length; j++) edges.push(newEdges[j]);
      nextId = startId;
    },
    addNode: function (x, y) {
      var n = { id: nextId++, label: newLabel(), cat: 0, x: x, y: y };
      nodes.push(n);
      return n;
    },
    addEdge: function (a, b) {
      if (a === b) return;
      var exists = edges.some(function (e) {
        return (e.a === a && e.b === b) || (e.a === b && e.b === a);
      });
      if (!exists) edges.push({ a: a, b: b, w: null });
    },
    deleteNode: function (id) {
      var i = nodes.findIndex(function (n) { return n.id === id; });
      if (i >= 0) nodes.splice(i, 1);
      for (var j = edges.length - 1; j >= 0; j--) {
        if (edges[j].a === id || edges[j].b === id) edges.splice(j, 1);
      }
    },
    recolor: function (id, cat) { var n = byId(id); if (n) n.cat = cat; },
    renameNode: function (id, label) { var n = byId(id); if (n && label) n.label = label; },
    clear: function () { nodes.length = 0; edges.length = 0; }
  };
}

// The app shares one graph; tests make throwaway ones with createGraph().
export var graph = createGraph();
