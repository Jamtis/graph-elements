/*
 * Author: Nicholas-Philip Brandt [nicholas.brandt@mail.de]
 * License: CC BY-SA[https://creativecommons.org/licenses/by-sa/4.0/]
 * */
import { Graph, AcyclicGraph, Tree } from "../graph";
import { IO } from "../extensions/IO";
import { D3SVG } from "../extensions/2d3";
const svg = document.querySelector("svg");
const graph = loadGraph();
const d3svg = new D3SVG(svg, graph, {
    drawing: false,
    size: {
        resizing: false
    }
});
// setting up the layout
const force = d3svg.force;
setTimeout(() => {
    svg.classList.add("resolved");
}, 500);
setTimeout(() => {
    svg.removeChild(svg.querySelector("#load"));
    d3svg.drawing = true;
    d3svg.resizing = true;
    d3svg.resize();
    force.linkStrength = 1;
    force.resume();
}, 1300);
addEventListener("resize", event => {
    d3svg.resize();
});
function loadGraph() {
    try {
        return IO.deserialize(localStorage.getItem("graph"));
    } catch (e) {
        return new Graph;
    }
}
//debugging
window.graph = graph;
window.d3svg = d3svg;
window.Graph = Graph;
window.AcyclicGraph = AcyclicGraph;
window.Tree = Tree;
window.IO = IO;