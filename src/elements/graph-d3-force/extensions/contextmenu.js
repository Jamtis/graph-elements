"use strict";
import console from "../../../helper/console.js";

import GraphDisplay from "../../graph-display/graph-display.js";
import GraphD3Force from "../../graph-d3-force/graph-d3-force.js";
import GraphContextmenu from "../../graph-contextmenu/graph-contextmenu.js";

import require from "../../../helper/require.js";
import __try from "../../../helper/__try.js";

import "//dev.jspm.io/@polymer/paper-input/paper-input.js";

const style_html = `<style><!-- inject: ./contextmenu.css --></style>`;
const contextmenu_html = `<!-- inject: ./contextmenu.html -->`;

export default
__try(async () => {
    await require(["Hammer"]);
    await GraphDisplay.extend(extend_contextmenu);
})();

async function extend_contextmenu(graph_display) {
    const graph_contextmenu = await graph_display.addonPromises[GraphContextmenu.tagName];
    const graph_d3_force = await graph_display.addonPromises[GraphD3Force.tagName];
    
    graph_contextmenu.insertAdjacentHTML("beforeend", contextmenu_html);
    const contextmenu = graph_contextmenu.canvasMenu;
    graph_d3_force.insertAdjacentHTML("beforeend", style_html);
    const force_container = graph_contextmenu.querySelector("#force.menu-group");
    const start_force = force_container.querySelector("#start-force");
    start_force.hammer = new Hammer(start_force);
    start_force.hammer.on("tap", __try(async event => {
        if (graph_d3_force.state != "running") {
            await graph_contextmenu.hideContextmenu();
        }
        await graph_d3_force.start();
    }));
    const stop_force = force_container.querySelector("#stop-force");
    stop_force.hammer = new Hammer(stop_force);
    stop_force.hammer.on("tap", __try(async event => {
        if (graph_d3_force.state == "running") {
            await graph_contextmenu.hideContextmenu();
        }
        await graph_d3_force.stop();
    }));
    
    const configuration = graph_d3_force.configuration;
    for (const paper_input of force_container.querySelectorAll("#config>paper-input")) {
        const {id} = paper_input;
        const property_chain = id.split("-");
        const target_property = property_chain.pop();
        paper_input.addEventListener("change", async () => {
            try {
                const configuration = graph_d3_force.configuration;
                // console.log("alpha value", alpha_input.value);
                let current_config_object = configuration;
                for (const property of property_chain) {
                    current_config_object = current_config_object[property];
                }
                current_config_object[target_property] = paper_input.value;
                graph_d3_force.configuration = configuration;
                await graph_d3_force.applyConfiguration();
            } catch (error) {
                console.error(error);
            }
        });
    }
    graph_d3_force.addEventListener("configuration-change", () => {
        const configuration = graph_d3_force.configuration;
        for (const paper_input of force_container.querySelectorAll("#config>paper-input")) {
            const {id} = paper_input;
            const property_chain = id.split("-");
            const target_property = property_chain.pop();
            let current_config_object = configuration;
            for (const property of property_chain) {
                current_config_object = current_config_object[property];
            }
            paper_input.value = current_config_object[target_property];
        }
    });
    graph_d3_force.configuration = graph_d3_force.configuration;
    
    graph_d3_force.addEventListener("simulationstart", onsimulationrunning);
    graph_d3_force.addEventListener("simulationstop", onsimulationhalt);
    graph_d3_force.addEventListener("simulationend", onsimulationhalt);
    
    if (graph_d3_force.state == "running") {
        onsimulationrunning();
    } else {
        onsimulationhalt();
    }
    
    await customElements.get("paper-input");
    
    function onsimulationrunning() {
        console.log("");
        graph_contextmenu.classList.toggle("simulation-running", true);
    }
    function onsimulationhalt() {
        console.log("");
        graph_contextmenu.classList.toggle("simulation-running", false);
    }
}