import * as markerHelper from "../../src/components/marker/marker.helper";

describe("Marker Helper", () => {
    describe("#getMarkerId", () => {
        describe("when marker is highlighted", () => {
            test("and size is 'S'mall", () => {
                const color = "red";
                const markerId = markerHelper.getMarkerId(0.5, color, { maxZoom: 20 });

                expect(markerId).toEqual("marker-small-red");
            });
        });

        describe("when marker is not highlighted", () => {
            let color;

            beforeAll(() => {
                color = "gray";
            });

            test("and size is 'M'edium", () => {
                const markerId = markerHelper.getMarkerId(2, color, { maxZoom: 8 });

                expect(markerId).toEqual("marker-medium-gray");
            });

            test("and size is 'L'arge", () => {
                const markerId = markerHelper.getMarkerId(4, color, { maxZoom: 8 });

                expect(markerId).toEqual("marker-large-gray");
            });
        });
    });
});
