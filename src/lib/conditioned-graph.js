import Graph from "./graph.js";

/**
 * @class ConditionedGraph
 * A class implementing conditioned graphs.
 * */
export default class ConditionedGraph extends Graph {
    /**
     * @function preCondition
     * */
    preCondition() {
        return true;
    }
    /**
     * @function postCondition
     * */
    postCondition() {
        return true;
    }
    /**
     * @function addLink
     * @param {any} source - The source node
     * @param {any} target - The target node
     * @param {any} meta_data - The meta data of the link
     * @return {boolean} - Whether the object has been added to the graph.
     * The link is only added if the condition is satisfied.
     * */
    addLink(source, target, meta_data) {
        if (!this.preCondition(source, target)) return false;
        const added = super.addLink(source, target, meta_data);
        if (added && !this.postCondition(source, target))
            if (this.removeLink(source, target)) return false;
            else throw Error("Added node could not be removed; condition is no longer guaranteed");
        return added;
    }
}