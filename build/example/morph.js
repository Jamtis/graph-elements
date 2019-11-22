"use strict";

import Graph from "https://rawgit.com/mhelvens/graph.js/master/dist/graph.es6.js";
import workerize from "https://rawgit.com/Jamtis/workerize/patch-1/src/index.js";
import requestAnimationFunction from "//cdn.jsdelivr.net/npm/requestanimationfunction/requestAnimationFunction.js"; // import workerize from "https://cdn.jsdelivr.net/npm/workerize@0.1.7/dist/workerize.m.js";

const worker = workerize(`import Graph from "https://rawgit.com/mhelvens/graph.js/master/dist/graph.es6.js";
self.Graph = Graph;
const graph = new Graph();
self.graph = graph;
export function getGraphString() {
  return graph.toJSON();
} // -----------------------------------------------------------------------------------------

const costs = {
  node: 1e-2,
  edge: 3e-1,
  sustainNode: 1e-3,
  sustainEdge: 1e-1,
  gain: 50
};
self.costs = costs;
const thresholds = {
  node: 1e-6,
  edge: 1e-20
};

class MorphNode {
  constructor(energy) {
    this.energy = energy;
    this.output = .5;
    this.output = Math.random() * (1 - costs.node) + costs.node;
  }

}

const source_node = new MorphNode(1);
source_node.output = 1;
graph.addNewVertex(0, source_node);
import requestAnimationFunction from "//cdn.jsdelivr.net/npm/requestanimationfunction/requestAnimationFunction.js";
const iterate = requestAnimationFunction(_iterate);

(async () => {
  try {
    await iterate(0);
  } catch (error) {
    console.error(error);
  }
})();

async function _iterate(i) {
  // console.log("iteration", i);
  for (let i = 0; i < 1e1; ++i) {
    source_node.energy += costs.gain;
    flowEnergy();
    morphNetwork();
  } // measure


  {
    let sum = 0;
    const edges = [...graph.edges()];

    for (const [,, link] of edges) {
      sum += (link.flow_coefficient - link.target.energy / link.source.energy) ** 2;
    }

    if (sum) {// console.log("energy misfit", (sum ** .5) / edges.length);
    }
  }
  {
    const vertices = [...graph.vertices()];
    let sum = 0;

    for (const [key, node] of vertices) {
      sum += node.energy;
    }

    const average = sum / vertices.length; // console.log("energy mean", average);
  } // send();

  if (i < 50) {
    setTimeout(async () => {
      await await iterate(i + 1);
    }, 200);
  }
}

function flowEnergy() {
  // ensure links
  const links = new Set();

  for (const [,, link] of graph.edges()) {
    link.flow_coefficient = link.target.output / link.source.output;
    links.add(link);
  }

  let progressing = true;

  for (var i = 0; i < 1e3 && progressing; ++i) {
    for (const link of links) {
      const sum = link.source.energy + link.target.energy;
      link.target.energy = sum / (1 + 1 / link.flow_coefficient);
      link.source.energy = sum / (1 + link.flow_coefficient);
    }

    progressing = false;

    for (const link of links) {
      // console.log("diff", Math.abs(link.flow_coefficient - link.target.value.energy / link.source.value.energy));
      if (!progressing && Math.abs(link.flow_coefficient - link.target.energy / link.source.energy) > 1e-4) {
        progressing = true;
      }

      link.flow_coefficient = link.target.energy / link.source.energy;
    } // console.log(links);

  } // console.log("steps", i);


  if (progressing) {
    console.log("progress incomplete", i);
  }
}

function morphNetwork() {
  stripNetwork();
  {
    let added;
    const vertices = [...graph.vertices()];

    for (const [key, node] of vertices) {
      for (const [target_key, target_node] of vertices) {
        if (key != target_key) {
          if (Math.random() < thresholds.edge) {
            if (!graph.hasEdge(key, target_key)) {
              // console.log("create bond", key, target_key);
              graph.spanEdge(key, target_key, {
                source: node,
                target: target_node
              });
              node.energy -= costs.edge;
              added = true;
            }
          }
        }
      }

      node.energy -= graph.degree(key) * costs.sustainEdge + costs.sustainNode;
    }

    for (const [key, node] of vertices) {
      const n = (node.energy - node.output) / costs.node;

      for (let i = 0; i < n; ++i) {
        if (Math.random() < thresholds.node) {
          let new_key = 0;

          while (graph.hasVertex(new_key)) {
            ++new_key;
          } // console.log("create cell", new_key, key);


          const new_node = new MorphNode(costs.node);
          new_node.parent = key;
          graph.addNewVertex(new_key, new_node);
          graph.spanEdge(key, new_key, {
            source: node,
            target: new_node
          });
          node.energy -= costs.node;
          added = true;
        }
      }
    }

    if (added) {// console.log("added");
    }
  }
  stripNetwork();
}

function stripNetwork() {
  let stripped;

  for (const [key, node] of graph.vertices()) {
    // console.log("morph", key);
    if (key != 0) {
      if (node.energy <= 0) {
        graph.destroyExistingVertex(key); // console.log("cell death", key);

        stripped = true;
      }
    }
  }

  if (stripped) {// console.log("stripped");
  }
}`, {
  type: "module"
});

(async () => {
  await customElements.whenDefined("graph-display");
  const graphDisplay = document.querySelector("graph-display");
  window.graphDisplay = graphDisplay;
  setTimeout(() => {
    graphDisplay.querySelector("graph-d3-force").stop();
  }, 1e4);
  const d3force = await graphDisplay.addonPromises["graph-d3-force"];
  d3force.configuration.alpha = 1e-1;
  d3force.configuration.alphaMin = 1e-2;
  d3force.configuration.alphaTarget = 1e-2;
  d3force.configuration.alphaDecay = 5e-3;
  d3force.configuration.velocityDecay = 1e-2;
  d3force.configuration.charge.strength = -1e2;
  d3force.configuration.charge.distanceMax = 1e5;
  d3force.configuration.link.distance = 1e0; // d3force.configuration.link.strength(20);

  d3force.configuration = d3force.configuration;
  let first = true;
  let last_graph_string;
  const receive_graph = requestAnimationFunction(async () => {
    const graph_string = await worker.getGraphString(); // console.log("got graph string", graph_string.length);

    if (last_graph_string != graph_string) {
      const graph = Graph.fromJSON(graph_string);

      if (graphDisplay.graph) {
        const existing_graph = graphDisplay.graph;

        for (const [key, vertex] of graph.vertices()) {
          if (existing_graph.hasVertex(key)) {
            const existing_vertex = existing_graph.vertexValue(key);
            graph.setVertex(key, existing_vertex);
            existing_vertex.value.energy = vertex.energy;
          } else {
            if ("parent" in vertex) {
              if (existing_graph.hasVertex(vertex.parent)) {
                const parent = existing_graph.vertexValue(vertex.parent);
                vertex.x = parent.x;
                vertex.y = parent.y;
              }
            }
          }
        }
      }

      graphDisplay.graph = graph; // set description

      for (const [key, node] of graph.vertices()) {
        node.radius = Math.log2(node.value.energy * 10 + 1);
        node.description = `energy: ${node.value.energy}
output: ${node.value.output}
outdegree: ${graph.outDegree(key)}
indegree: ${graph.inDegree(key)}`;
      }
    }

    last_graph_string = graph_string;

    if (first) {
      first = false;
      d3force.start();
    }
  }); // loop for graph changes

  for (let i = 0; i < 100; ++i) {
    const receive_promise = await receive_graph();
    await receive_promise;
  }
})();