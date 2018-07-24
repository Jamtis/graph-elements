import requestAnimationFunction from "https://rawgit.com/Jamtis/7ea0bb0d2d5c43968c4a/raw/7fb050585c4cb20e5e64a5ebf4639dc698aa6f02/requestAnimationFunction.js";
import require from "../../helper/require.js";
const default_configuration = {
    link: {
        distance: 300,
        strength: 0.02
    },
    charge: {
        strength: -40
    },
    gravitation: {
        strength: 100
    }
};
const worker_string = `<!-- inject: ../../../build/elements/graph-d3-force/d3-force-worker.inject.js -->`;
// web worker same origin policy requires host to support OPTIONS CORS
export class GraphD3Force extends GraphAddon {
    constructor() {
        super();
        let _configuration = this.configuration;
        delete this.configuration;
        // define own properties
        Object.defineProperties(this, {
            worker: {
                // value: new Worker(worker_data)
                value: new Worker("data:application/javascript," + encodeURIComponent(worker_string)),
                enumerable: true
            },
            configuration: {
                set (configuration) {
                    this.__worker.postMessage({
                        configuration
                    });
                    _configuration = configuration;
                },
                get() {
                    return _configuration;
                },
                enumerable: true
            }
        });
        const on_worker_message = requestAnimationFunction(async ({data}) => {
            try {
                console.log("receive force update");
                const buffer_array = new Float32Array(data.buffer);
                await this.__applyGraphUpdate(buffer_array);
            } catch (error) {
                console.error(error);
            }
        });
        this.worker.addEventListener("message", on_worker_message);
        this.configuration = _configuration;
        // initiate worker with preassigned graph
    }
    hosted() {
        return this.sendGraphToWorker();
    }
    async sendGraphToWorker() {
        console.log("");
        const host = await this.host;
        const nodes = [...host.nodes.values()].map(({x, y}, index) => ({x, y, index}));
        const links = [...host.links].map(({source, target}) => ({
            source: _nodes.indexOf(source), // index for d3
            target: _nodes.indexOf(target) // index for d3
        }));
        // 32 bit * 2 * N
        const buffer = new ArrayBuffer(nodes.length * 4 * 2);
        const buffer_array = new Float32Array(buffer);
        for (let i = 0; i < nodes.length; ++i) {
            const node = nodes[i];
            buffer_array[i * 2] = node.x;
            buffer_array[i * 2 + 1] = node.y;
        }
        this.worker.postMessage({
            graph: {
                nodes,
                links
            },
            buffer
        });
    }
    async __applyGraphUpdate(buffer_array) {
        console.log(buffer_array);
        const host = await this.host;
        const vertices = [...host.graph.vertices()];
        for (let i = 0; i < vertices.length; ++i) {
            const node = vertices[i][1];
            const x = this.__bufferArray[i * 2];
            const y = this.__bufferArray[i * 2 + 1];
            node.x = x;
            node.y = y;
        }
        this.dispatchEvent(new Event("graph-update", {
            composed: true
        }));
    }
};
(async () => {
    try {
        // ensure requirements
        await require(["d3"]);
        await customElements.whenDefined("graph-display");
        customElements.define("graph-d3-force", GraphD3Force);
    } catch (error) {
        console.error(error);
    }
})();