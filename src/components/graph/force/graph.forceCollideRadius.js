import CONST from "../graph.const";

/**
 * Helper function to make a function out of a constant
 * @param {Object} x the constant
 * @returns {function(): *} function that returns x
 */
function constant(x) {
    return function() {
        return x;
    };
}

/**
 * Helper function to set collide radius based on the node properties and values
 * @returns {function():*} calculate radius function pointer
 */
export function forceCollideRadius() {
    var configNodeSize,
        configNodeWidth,
        configNodeHeight,
        nodeSize,
        nodeDiagHalf,
        padding = 1.5;

    /**
     * helper function to calculate the length of the diagonal of a rectangle
     * @param {number} width width of rect
     * @param {number} height height of rect
     * @returns {*} the diagonal length
     */
    function diagLength(width, height) {
        return isNaN(width) || isNaN(height) ? undefined : Math.sqrt(width * width + height * height);
    }

    /**
     * get the radius for the given object
     * @param {Object} d node object
     * @returns {*|number} function to calculate the radius to collide with
     */
    function radius(d) {
        var r =
            (d.width && d.height && diagLength(d.width / 10, d.height / 10) / 2.0) ||
            d.size / 10.0 / 2 ||
            nodeDiagHalf ||
            nodeSize ||
            CONST.RADIUS_COLLIDE;

        return r + padding;
    }

    /**
     * calculate values so we don't have to do it later
     * @returns {*} nothing
     */
    function initialize() {
        nodeSize = configNodeSize && !isNaN(configNodeSize()) && configNodeSize() / 10.0 / 2.0;
        nodeDiagHalf =
            configNodeWidth && configNodeHeight && diagLength(configNodeWidth() / 10, configNodeHeight() / 10) / 2.0;
    }

    radius.initialize = function(
        _ // eslint-disable-line no-unused-vars
    ) {
        initialize();
    };

    radius.configNodeSize = function(_) {
        return arguments.length
            ? ((configNodeSize = typeof _ === "function" ? _ : constant(+_)), initialize(), radius)
            : configNodeSize;
    };

    radius.configNodeWidth = function(_) {
        return arguments.length
            ? ((configNodeWidth = typeof _ === "function" ? _ : constant(+_)), initialize(), radius)
            : configNodeWidth;
    };

    radius.configNodeHeight = function(_) {
        return arguments.length
            ? ((configNodeHeight = typeof _ === "function" ? _ : constant(+_)), initialize(), radius)
            : configNodeHeight;
    };

    return radius;
}
