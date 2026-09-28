export function createPlaceholderRoad() {
    return {
        type: "PLACEHOLDER_ROAD",

        outer: {
            left: 24,
            top: 24,
            right: 920,
            bottom: 650
        },

        inner: {
            left: 245,
            top: 175,
            right: 700,
            bottom: 500
        },

        startLine: {
            x: 94,
            y: 24,
            width: 40,
            height: 12
        },

        getRoadInfo(x, y) {
            const insideOuter =
            x >= this.outer.left &&
            x <= this.outer.right &&
            y >= this.outer.top &&
            y <= this.outer.bottom;

            const insideInner =
            x > this.inner.left &&
            x < this.inner.right &&
            y > this.inner.top &&
            y < this.inner.bottom;

            const outsideOuter =
            x < this.outer.left ||
            x > this.outer.right ||
            y < this.outer.top ||
            y > this.outer.bottom;

            return {
                onRoad: insideOuter && !insideInner,
                insideInnerHole: insideInner,
                nearOuterBoundary: outsideOuter
            };
        }
    };
}
