import React from "react";
import renderer from "react-test-renderer";

import Link from "../../src/components/link/Link";

describe("Link Component", () => {
    let that = {};

    beforeEach(() => {
        that.callbackMock = jest.fn();

        that.link = renderer.create(
            <Link
                id="A#B"
                source="A"
                target="B"
                x1="2"
                y1="2"
                x2="4"
                y2="4"
                opacity="1"
                stroke="red"
                strokeWidth="2"
                onClickLink={that.callbackMock}
            />
        );

        that.tree = that.link.toJSON();
    });

    test("should call callback function when onClick is performed", () => {
        //Change this back when the support for label is added back into Link
        // ALSO un-skip test in link.e2.js "should properly render the label in the link between two nodes"
        //  that.tree.children[0].props.onClick();
        that.tree.props.onClick();
        expect(that.callbackMock).toBeCalled();
    });
});
