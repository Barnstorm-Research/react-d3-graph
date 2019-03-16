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
 * Helper to prevent nodes being placed outside svg window
 * @param {number} position - new coordinate for node
 * @param {boolean} isX - boolean to check if comparing width (true) or height (false)
 * @param {Object} config - same as {@link #graphrenderer|config in renderGraph}
 * @returns {number} - safe coordinate
 */
function safeNodePositioner(position, isX, config) {
    if (isX) {
        if (position > config["width"] - 10) {
            return config["width"] - 20;
        } else if (position < 10) {
            return 20;
        } else {
            return position;
        }
    } else {
        if (position > config["height"] - 10) {
            return config["height"] - 20;
        } else if (position < 10) {
            return 20;
        } else {
            return position;
        }
    }
}

/**
 * Helper to create alternative layout functions
 * @param {string} layoutOption WEAKTREE or default
 * @returns {function} tick layout function
 */
function layoutCallbackHelper(layoutOption) {
    switch (layoutOption) {
        case "WEAKTREE":
            return function(nodes, links, source, target, config, alpha) {
                var k = alpha;

                if (nodes[source] != undefined && nodes[target] != undefined) {
                    nodes[source].y = safeNodePositioner(nodes[source].y - k, false, config);
                    nodes[target].y = safeNodePositioner(nodes[target].y + k, false, config);
                }

                return nodes, links;
            };
        case "WEAKFLOW":
            return function(nodes, links, source, target, config, alpha) {
                var k = alpha;

                if (nodes[source] != undefined && nodes[target] != undefined) {
                    nodes[source].x = safeNodePositioner(nodes[source].x - k, true, config);
                    nodes[target].x = safeNodePositioner(nodes[target].x + k, true, config);
                }

                return nodes, links;
            };
        default:
            /* eslint no-unused-vars: ["error", { "args": "none" }] */
            return function(nodes, links, source, target, config, alpha) {
                return nodes, links;
            };
    }
}

export { layoutCallbackHelper };
