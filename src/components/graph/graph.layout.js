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
    const buffer = 10;

    if (position.isNaN) return buffer;

    if (isX) {
        return Math.max(buffer, Math.min(config["width"] - buffer, position));
    } else {
        return Math.max(buffer, Math.min(config["height"] - buffer, position));
    }
}

/**
 * Helper to place nodes according to degree of connections
 * @param {number} degree - node connection degree
 * @param {boolean} isX - boolean to check if comparing width (true) or height (false)
 * @param {Object} config - same as {@link #graphrenderer|config in renderGraph}
 * @returns {number} - coordinate
 */
function degreeNodePositioner(degree, isX, config) {
    degree = degree == undefined ? config.d3["maxDegrees"] : Math.min(config.d3["maxDegrees"], degree) - 1;

    if (isX) {
        return (degree * config["width"]) / config.d3["maxDegrees"];
    } else {
        return (degree * config["height"]) / config.d3["maxDegrees"];
    }
}

/**
 * Helper to create alternative layout functions
 * @param {string} layoutOptionInput WEAKTREE, STRONGTREE, WEAKFLOW, STRONGFLOW or default
 * @returns {function} tick layout function
 */
function layoutCallbackHelper(layoutOptionInput) {
    // First check if defined, if not set to default
    if (!layoutOptionInput) {
        layoutOptionInput = "default";
    }
    // Check what type of variable we have
    let layoutOption;

    if (layoutOptionInput.constructor === Array) {
        layoutOption = layoutOptionInput[0];
    } else if (layoutOptionInput.constructor === Function) {
        return layoutOptionInput;
    } else {
        layoutOption = layoutOptionInput;
    }

    switch (layoutOption) {
        case "WEAKTREE":
            return function(nodes, links, source, target, link, config, alpha) {
                var k = alpha;

                if (nodes[source] != undefined && nodes[target] != undefined) {
                    nodes[source].y = safeNodePositioner(nodes[source].y - k, false, config);
                    nodes[target].y = safeNodePositioner(nodes[target].y + k, false, config);

                    //make sure these don't wiggle out of the box
                    nodes[source].x = safeNodePositioner(nodes[source].x, true, config);
                    nodes[target].x = safeNodePositioner(nodes[target].x, true, config);
                }

                return nodes, links;
            };
        case "STRONGTREE":
            return function(nodes, links, source, target, link, config, alpha) {
                var k = alpha;

                if (nodes[source] != undefined && nodes[target] != undefined) {
                    nodes[source].y = safeNodePositioner(
                        degreeNodePositioner(nodes[source].degree, false, config) - k,
                        true,
                        config
                    );

                    nodes[source].x = safeNodePositioner(nodes[source].x, true, config);

                    nodes[target].y = safeNodePositioner(
                        degreeNodePositioner(nodes[target].degree, false, config) + k,
                        true,
                        config
                    );
                    nodes[target].x = safeNodePositioner(nodes[target].x, true, config);
                }

                return nodes, links;
            };
        case "WEAKFLOW":
            return function(nodes, links, source, target, link, config, alpha) {
                var k = alpha;

                if (nodes[source] != undefined && nodes[target] != undefined) {
                    nodes[source].x = safeNodePositioner(nodes[source].x - k, true, config);
                    nodes[target].x = safeNodePositioner(nodes[target].x + k, true, config);

                    //make sure these don't wiggle out of the box
                    nodes[source].y = safeNodePositioner(nodes[source].y, false, config);
                    nodes[target].y = safeNodePositioner(nodes[target].y, false, config);
                }

                return nodes, links;
            };
        case "STRONGFLOW":
            return function(nodes, links, source, target, link, config, alpha) {
                var k = alpha;

                if (nodes[source] != undefined && nodes[target] != undefined) {
                    nodes[source].x = safeNodePositioner(
                        degreeNodePositioner(nodes[source].degree, true, config) - k,
                        true,
                        config
                    );
                    nodes[target].x = safeNodePositioner(
                        degreeNodePositioner(nodes[target].degree, true, config) + k,
                        true,
                        config
                    );
                    //make sure these don't wiggle out of the box
                    nodes[source].y = safeNodePositioner(nodes[source].y, false, config);
                    nodes[target].y = safeNodePositioner(nodes[target].y, false, config);
                }

                return nodes, links;
            };
        default:
            /* eslint no-unused-vars: ["error", { "args": "none" }] */
            return function(nodes, links, source, target, link, config, alpha) {
                //make sure these don't wiggle out of the box
                nodes[source].x = safeNodePositioner(nodes[source].x, true, config);
                nodes[target].x = safeNodePositioner(nodes[target].x, true, config);

                //make sure these don't wiggle out of the box
                nodes[source].y = safeNodePositioner(nodes[source].y, false, config);
                nodes[target].y = safeNodePositioner(nodes[target].y, false, config);

                return nodes, links;
            };
    }
}

export { layoutCallbackHelper, degreeNodePositioner, safeNodePositioner };
