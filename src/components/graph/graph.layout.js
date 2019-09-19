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
 * @param {number} transform - the panAndZoom scale value
 * @returns {number} - safe coordinate
 */
function safeNodePositioner(position, isX, config, transform) {
    const buffer = 50;

    if (isNaN(position)) return buffer;

    if (isX) {
        return Math.max(buffer / transform, Math.min((config["width"] - buffer) / transform, position));
    } else {
        return Math.max(buffer / transform, Math.min((config["height"] - buffer) / transform, position));
    }
}

/**
 * Helper to place nodes according to degree of connections
 * @param {number} degree - node connection degree
 * @param {boolean} isX - boolean to check if comparing width (true) or height (false)
 * @param {Object} config - same as {@link #graphrenderer|config in renderGraph}
 * @param {number} transform - the panAndZoom scale value
 * @returns {number} - coordinate
 */
function degreeNodePositioner(degree, isX, config, transform) {
    const buffer = 50;

    degree = degree == undefined ? config.d3["maxDegrees"] : Math.min(config.d3["maxDegrees"], degree) - 1;

    if (isX) {
        return (degree * ((config["width"] - buffer) / transform)) / config.d3["maxDegrees"];
    } else {
        return (degree * ((config["height"] - buffer) / transform)) / config.d3["maxDegrees"];
    }
}

/**
 *
 * @param {list} nodes list of all nodes
 * @param {map} nodeLookupIdx node.id to index lookup
 * @param {string} id node.id you want returned
 * @returns {*} the node or undefined
 */
function getNode(nodes, nodeLookupIdx, id) {
    return nodes[nodeLookupIdx[id]];
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
            return function(nodes, nodeLookupIdx, links, source, target, link, config, transform, nodeDragged, alpha) {
                var k = alpha;
                var nsource = getNode(nodes, nodeLookupIdx, source);
                var ntarget = getNode(nodes, nodeLookupIdx, target);

                if (nsource != undefined && ntarget != undefined) {
                    nsource.y = safeNodePositioner(nsource.y - k, false, config, transform);
                    ntarget.y = safeNodePositioner(ntarget.y + k, false, config, transform);

                    //make sure these don't wiggle out of the box
                    nsource.x = safeNodePositioner(nsource.x, true, config, transform);
                    ntarget.x = safeNodePositioner(ntarget.x, true, config, transform);
                }

                return nodes, links;
            };
        case "STRONGTREE":
            return function(nodes, nodeLookupIdx, links, source, target, link, config, transform, nodeDragged, alpha) {
                var k = alpha;
                var nsource = getNode(nodes, nodeLookupIdx, source);
                var ntarget = getNode(nodes, nodeLookupIdx, target);

                if (nsource != undefined && ntarget != undefined) {
                    if (nodeDragged) {
                        nsource.y = safeNodePositioner(nsource.y, false, config, transform);
                        ntarget.y = safeNodePositioner(ntarget.y, false, config, transform);
                    } else {
                        nsource.y = safeNodePositioner(
                            degreeNodePositioner(nsource.degree, false, config, transform) - k,
                            true,
                            config,
                            transform
                        );
                        ntarget.y = safeNodePositioner(
                            degreeNodePositioner(ntarget.degree, false, config, transform) + k,
                            true,
                            config,
                            transform
                        );
                    }

                    nsource.x = safeNodePositioner(nsource.x, true, config, transform);

                    ntarget.x = safeNodePositioner(ntarget.x, true, config, transform);
                }

                return nodes, links;
            };
        case "WEAKFLOW":
            return function(nodes, nodeLookupIdx, links, source, target, link, config, transform, nodeDragged, alpha) {
                var k = alpha;
                var nsource = getNode(nodes, nodeLookupIdx, source);
                var ntarget = getNode(nodes, nodeLookupIdx, target);

                if (nsource != undefined && ntarget != undefined) {
                    nsource.x = safeNodePositioner(nsource.x - k, true, config, transform);
                    ntarget.x = safeNodePositioner(ntarget.x + k, true, config, transform);

                    //make sure these don't wiggle out of the box
                    nsource.y = safeNodePositioner(nsource.y, false, config, transform);
                    ntarget.y = safeNodePositioner(ntarget.y, false, config, transform);
                }

                return nodes, links;
            };
        case "STRONGFLOW":
            return function(nodes, nodeLookupIdx, links, source, target, link, config, transform, nodeDragged, alpha) {
                var k = alpha;
                var nsource = getNode(nodes, nodeLookupIdx, source);
                var ntarget = getNode(nodes, nodeLookupIdx, target);

                if (nsource != undefined && ntarget != undefined) {
                    if (nodeDragged) {
                        nsource.x = safeNodePositioner(nsource.x, true, config, transform);
                        ntarget.x = safeNodePositioner(ntarget.x, true, config, transform);
                    } else {
                        nsource.x = safeNodePositioner(
                            degreeNodePositioner(nsource.degree, true, config, transform) - k,
                            true,
                            config,
                            transform
                        );
                        ntarget.x = safeNodePositioner(
                            degreeNodePositioner(ntarget.degree, true, config, transform) + k,
                            true,
                            config,
                            transform
                        );
                    }

                    //make sure these don't wiggle out of the box
                    nsource.y = safeNodePositioner(nsource.y, false, config, transform);
                    ntarget.y = safeNodePositioner(ntarget.y, false, config, transform);
                }

                return nodes, links;
            };
        default:
            /* eslint no-unused-vars: ["error", { "args": "none" }] */
            return function(nodes, nodeLookupIdx, links, source, target, link, config, transform, nodeDragged, alpha) {
                var nsource = getNode(nodes, nodeLookupIdx, source);
                var ntarget = getNode(nodes, nodeLookupIdx, target);

                //make sure these don't wiggle out of the box
                nsource.x = safeNodePositioner(nsource.x, true, config, transform);
                ntarget.x = safeNodePositioner(ntarget.x, true, config, transform);

                //make sure these don't wiggle out of the box
                nsource.y = safeNodePositioner(nsource.y, false, config, transform);
                ntarget.y = safeNodePositioner(ntarget.y, false, config, transform);

                return nodes, links;
            };
    }
}

export { layoutCallbackHelper, degreeNodePositioner, safeNodePositioner };
