/**
 * @module Graph/layout
 * @description
 * Offers a series of methods that adjust layout settings.
 */
/**
 * @typedef {Object} Link
 * @property {string} source - the node id of the source in the link.
 * @property {string} target - the node id of the target in the link.
 * @memberof Graph/layout
 */
/**
 * @typedef {Object} Node
 * @property {string} id - the id of the node.
 * @property {string} [color=] - color of the node (optional).
 * @property {string} [fontColor=] - node text label font color (optional).
 * @property {string} [size=] - size of the node (optional).
 * @property {string} [symbolType=] - symbol type of the node (optional).
 * @property {string} [svg=] - custom svg for node (optional).
 * @memberof Graph/layout
 */

//import CONST from "./graph.const";
//import DEFAULT_CONFIG from "./graph.config";
//import ERRORS from "../../err";

/**
 * Helper to create alternative layout functions
 * @param {string} layoutOption WEAKTREE or default
 * @returns {function} tick layout function
 */
function layoutCallbackHelper(layoutOption) {
    switch (layoutOption) {
        case "WEAKTREE":
            return function(nodes, links, source, target, alpha) {
                var k = 6 * alpha;

                if (nodes.size > 0) {
                    nodes[source].y -= k;
                    nodes[target].y += k;
                }

                return nodes, links;
            };
        default:
            /* eslint no-unused-vars: ["error", { "args": "none" }] */
            return function(nodes, links, source, target, alpha) {
                return nodes, links;
            };
    }
}

export { layoutCallbackHelper };
