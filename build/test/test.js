define([ "exports", "../graph" ], function(exports, _graph) {
    "use strict";
    var _interopRequire = function(obj) {
        return obj && obj.__esModule ? obj["default"] :obj;
    };
    var graphjs = _interopRequire(_graph);
    window.graphjs = graphjs;
    console.log("graphjs loaded");
    console.log("length: " + length);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;
    try {
        for (var _iterator = [ "Graph", "AcyclicGraph", "Tree" ][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _name = _step.value;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;
            try {
                for (var _iterator2 = edge_array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var edges = _step2.value;
                    var graph = new graphjs[_name]();
                    var dgraph = new graphjs[_name](true);
                    applyModel(graph, edges, _name, edges.density);
                    applyModel(dgraph, edges, _name, edges.density);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                        _iterator2["return"]();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    function applyModel(graph, edges, name, densitiy) {
        console.log("\n" + name + " | " + graph.directed + " | " + densitiy);
        console.time("init");
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;
        try {
            for (var _iterator3 = nodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var node = _step3.value;
                graph.addNode(node);
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                    _iterator3["return"]();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;
        try {
            for (var _iterator4 = edges[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var edge = _step4.value;
                graph.addEdge(edge[0], edge[1]);
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
                    _iterator4["return"]();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }
        console.timeEnd("init");
        console.time("Cycle check");
        console.log("Cycle: " + graph.hasCycle());
        console.timeEnd("Cycle check");
        console.time("Edges check");
        console.log("Edges: " + graph.edges.length);
        console.timeEnd("Edges check");
    }
    console.time("preparation");
    var length = 20;
    var nodes = [];
    var edge_array = [];
    var densities = [ 0, .01, .5, 1, 10 ];
    for (var i = 0; i < length; ++i) {
        nodes.push(i);
    }
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;
    try {
        for (var _iterator3 = densities[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var density = _step3.value;
            var edges = [];
            for (var i = 0; i < Math.pow(length, 2) * density; ++i) {
                edges.push([ Math.floor(Math.random() * length), Math.floor(Math.random() * length) ]);
            }
            edges.density = density;
            edge_array.push(edges);
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                _iterator3["return"]();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }
    var static_edges = function() {
        var _static_edges = [];
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;
        try {
            for (var _iterator4 = nodes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var node = _step4.value;
                _static_edges.push([ Math.floor(Math.abs(Math.sin(node)) * (length - 1)), Math.floor(Math.abs(Math.cos(node)) * (length - 1)) ]);
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
                    _iterator4["return"]();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }
        return _static_edges;
    }();
    static_edges.density = 1;
    edge_array.push(static_edges);
    console.timeEnd("preparation");
});