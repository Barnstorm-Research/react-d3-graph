/**
 * @module Graph/builder
 * @description
 * Offers a series of methods that isolate the way graph elements are built (nodes and links mainly).
 */
import CONST from "./graph.const";

import { buildLinkPathDefinition } from "../link/link.helper";
import { getMarkerId } from "../marker/marker.helper";

/**
 * Get the correct node opacity in order to properly make decisions based on context such as currently highlighted node.
 * @param  {Object} node - the node object for whom we will generate properties.
 * @param  {string} highlightedNode - same as {@link #graphrenderer|highlightedNode in renderGraph}.
 * @param  {Object} highlightedLink - same as {@link #graphrenderer|highlightedLink in renderGraph}.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @returns {number} the opacity value for the given node.
 * @memberof Graph/builder
 */
function _getNodeOpacity(node, highlightedNode, highlightedLink, config) {
    const highlight =
        node.highlighted ||
        node.id === (highlightedLink && highlightedLink.source) ||
        node.id === (highlightedLink && highlightedLink.target);
    const someNodeHighlighted = !!(
        highlightedNode ||
        (highlightedLink && highlightedLink.source && highlightedLink.target)
    );
    let opacity;

    if (someNodeHighlighted && config.highlightDegree === 0) {
        opacity = highlight ? config.node.opacity : config.highlightOpacity;
    } else if (someNodeHighlighted) {
        opacity = highlight ? config.node.opacity : config.highlightOpacity;
    } else {
        opacity = node.opacity || config.node.opacity;
    }

    return opacity;
}

/**
 * Build some Link properties based on given parameters.
 * @param  {Object} link - the link object for which we will generate properties.
 * @param  {Object.<string, Object>} nodes - same as {@link #graphrenderer|nodes in renderGraph}.
 * @param  {Array.<Object>} d3Nodes - d3Nodes list
 * @param  {Object.<string, integer>} nodeLookupIdx - look up map for nodes
 * @param  {Object.<string, Object>} links - same as {@link #graphrenderer|links in renderGraph}.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param  {Function[]} linkCallbacks - same as {@link #graphrenderer|linkCallbacks in renderGraph}.
 * @param  {string} highlightedNode - same as {@link #graphrenderer|highlightedNode in renderGraph}.
 * @param  {Object} highlightedLink - same as {@link #graphrenderer|highlightedLink in renderGraph}.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @param  {boolean} nodeDragged - is repositioning happening because of node being dragged.
 * @param  {number} alpha - the alpha value
 * @returns {Object} returns an object that aggregates all props for creating respective Link component instance.
 * @memberof Graph/builder
 */
function buildLinkProps(
    link,
    nodes,
    d3Nodes,
    nodeLookupIdx,
    links,
    config,
    linkCallbacks,
    highlightedNode,
    highlightedLink,
    transform,
    nodeDragged,
    alpha
) {
    const { source, target } = link;

    if (config.automaticLayoutOn) {
        d3Nodes,
            (links = linkCallbacks["layoutCallback"](
                d3Nodes,
                nodeLookupIdx,
                links,
                source,
                target,
                link,
                config,
                transform,
                nodeDragged,
                alpha
            ));
    }

    const nodeSource = d3Nodes[nodeLookupIdx[source]];
    const nodeTarget = d3Nodes[nodeLookupIdx[target]];

    const x1 = (nodeSource && nodeSource.x) || 0;
    const y1 = (nodeSource && nodeSource.y) || 0;
    const x2 = (nodeTarget && nodeTarget.x) || 0;
    const y2 = (nodeTarget && nodeTarget.y) || 0;

    const d = buildLinkPathDefinition({ source: { x: x1, y: y1 }, target: { x: x2, y: y2 } }, config.link.type);

    let mainNodeParticipates = false;

    switch (config.highlightDegree) {
        case 0:
            break;
        case 2:
            mainNodeParticipates = true;
            break;
        default:
            // 1st degree is the fallback behavior
            mainNodeParticipates = source === highlightedNode || target === highlightedNode;
            break;
    }

    const reasonNode = mainNodeParticipates && nodes[source].highlighted && nodes[target].highlighted;
    const reasonLink =
        source === (highlightedLink && highlightedLink.source) &&
        target === (highlightedLink && highlightedLink.target);
    const highlight = reasonNode || reasonLink;

    let opacity = link.opacity || config.link.opacity;

    if (highlightedNode || (highlightedLink && highlightedLink.source)) {
        opacity = highlight ? config.link.opacity : config.highlightOpacity;
    }

    // let stroke = link.color || config.link.color;
    let stroke = link.selected ? config.link.selectedStrokeColor : link.color || config.link.color;

    if (highlight) {
        stroke = config.link.highlightColor === CONST.KEYWORDS.SAME ? config.link.color : config.link.highlightColor;
    }

    let strokeWidth = (link.strokeWidth || config.link.strokeWidth) * (1 / transform);

    if (config.link.semanticStrokeWidth) {
        const linkValue = links[source][target] || links[target][source] || 1;

        strokeWidth += (linkValue * strokeWidth) / 10;
    }

    const markerId = config.directed ? getMarkerId(transform, stroke, config) : null;

    const t = 1 / transform;

    let fontSize = null;
    let fontColor = null;
    let fontWeight = null;
    let label = null;

    if (config.link.renderLabel) {
        label = link[config.link.labelProperty];
        fontSize = link.fontSize || config.link.fontSize;
        fontColor = link.fontColor || config.link.fontColor;
        fontWeight = highlight ? config.link.highlightFontWeight : config.link.fontWeight;
    }

    var clsName = CONST.LINK_CLASS_NAME;

    if (link.className || config.link.className) {
        clsName += " " + (link.className || config.link.className);
    }

    return {
        markerId,
        d,
        source,
        target,
        strokeWidth,
        stroke,
        label,
        mouseCursor: config.link.mouseCursor,
        fontColor,
        fontSize: fontSize * t,
        fontWeight,
        className: clsName,
        opacity,
        selected: link.selected ? link.selected : false,
        previouslySelected: link.previouslySelected ? link.previouslySelected : false,
        onClickLink: linkCallbacks.onClickLink,
        onRightClickLink: linkCallbacks.onRightClickLink,
        onMouseOverLink: linkCallbacks.onMouseOverLink,
        onMouseOutLink: linkCallbacks.onMouseOutLink,
    };
}

/**
 * Build some Node properties based on given parameters.
 * @param  {Object} node - the node object for whom we will generate properties.
 * @param  {Object} d3Node - the d3 node object
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param  {Function[]} nodeCallbacks - same as {@link #graphrenderer|nodeCallbacks in renderGraph}.
 * @param  {string} highlightedNode - same as {@link #graphrenderer|highlightedNode in renderGraph}.
 * @param  {Object} highlightedLink - same as {@link #graphrenderer|highlightedLink in renderGraph}.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @returns {Object} returns object that contain Link props ready to be feeded to the Link component.
 * @memberof Graph/builder
 */
function buildNodeProps(node, d3Node, config, nodeCallbacks = {}, highlightedNode, highlightedLink, transform) {
    const highlight =
        node.highlighted ||
        (node.id === (highlightedLink && highlightedLink.source) ||
            node.id === (highlightedLink && highlightedLink.target));
    const opacity = _getNodeOpacity(node, highlightedNode, highlightedLink, config);

    let fill = node.color || config.node.color;

    if (highlight && config.node.highlightColor !== CONST.KEYWORDS.SAME) {
        fill = config.node.highlightColor;
    }

    let stroke = node.selected ? config.node.selectedStrokeColor : node.strokeColor || config.node.strokeColor;

    if (highlight && config.node.highlightStrokeColor !== CONST.KEYWORDS.SAME) {
        stroke = config.node.highlightStrokeColor;
    }

    let label = node[config.node.labelProperty] || node.id;

    if (typeof config.node.labelProperty === "function") {
        label = config.node.labelProperty(node);
    }

    let strokeWidth = node.strokeWidth || config.node.strokeWidth;

    if (highlight && config.node.highlightStrokeWidth !== CONST.KEYWORDS.SAME) {
        strokeWidth = config.node.highlightStrokeWidth;
    }

    const t = 1 / transform;
    // if there is a node config level width and height specified clear out the
    //size if it is set
    const nodeWidth = node.width || config.node.width;
    const nodeHeight = node.height || config.node.height;
    const nodeSize = nodeWidth && nodeHeight ? undefined : node.size || config.node.size;

    const fontSize = highlight ? config.node.highlightFontSize : config.node.fontSize;
    const dx = fontSize * t + nodeSize / 100 + 1.5;
    const svg = node.svg || config.node.svg;
    const fontColor = node.fontColor || config.node.fontColor;

    return {
        ...node,
        className: CONST.NODE_CLASS_NAME,
        cursor: config.node.mouseCursor,
        cx: (d3Node && d3Node.x) || ((node && node.x) || "0"),
        cy: (d3Node && d3Node.y) || ((node && node.y) || "0"),
        fill,
        fontColor,
        fontSize: fontSize * t,
        dx,
        fontWeight: highlight ? config.node.highlightFontWeight : config.node.fontWeight,
        id: node.id,
        label,
        onClickNode: nodeCallbacks.onClickNode,
        onRightClickNode: nodeCallbacks.onRightClickNode,
        onMouseOverNode: nodeCallbacks.onMouseOverNode,
        onMouseOut: nodeCallbacks.onMouseOut,
        opacity,
        renderLabel: config.node.renderLabel,
        size: nodeSize ? nodeSize : undefined,
        width: nodeWidth ? nodeWidth : undefined,
        height: nodeHeight ? nodeHeight : undefined,
        selected: node.selected ? node.selected : false,
        previouslySelected: node.previouslySelected ? node.previouslySelected : false,
        stroke,
        strokeWidth: strokeWidth * t,
        svg,
        type: node.symbolType || config.node.symbolType,
        viewGenerator: node.viewGenerator || config.node.viewGenerator,
        overrideGlobalViewGenerator: !node.viewGenerator && node.svg,
    };
}

export { buildLinkProps, buildNodeProps };
