import jsonFormatter from "./console.js";
let jsondiffpatch = require("jsondiffpatch");

const left = {
    data: {
        stringYaEstaba: "string"
    }
};

const right = {
    data: {
        unStringAdded: "string testing",
        unObjectAdded: { objectPepe: { hola: "nesting" } },
        stringYaEstaba: "string Modified"
    }
};

const delta = jsondiffpatch.diff(left, right);

test("expect added property to be added in diff", () => {
    const left = {
        data: {}
    };

    const right = {
        data: {
            unStringAdded: "string testing"
        }
    };

    const delta = jsondiffpatch.diff(left, right);
    let jsonResult = new jsonFormatter().format(delta);
    let expectedResult = {
        unStringAdded: {
            action: "added",
            value: "string testing"
        }
    };
    expect(jsonResult.unStringAdded).toBeDefined();
    expect(jsonResult).toEqual(expectedResult);
});

test("expect added object has action and the same object", () => {
    const left = {
        data: {}
    };

    const right = {
        data: {
            unObjectAdded: {
                objectPepe: {
                    hola: "nesting"
                }
            }
        }
    };

    const delta = jsondiffpatch.diff(left, right);
    let jsonResult = new jsonFormatter().format(delta);
    let expectedResult = {
        unObjectAdded: {
            action: "added",
            objectPepe: {
                hola: "nesting"
            }
        }
    };
    expect(jsonResult).toEqual(expectedResult);
});

test.only("expect modified object has action and the same object", () => {
    const left = {
        data: {
            objModified: {
                objectPepe: {
                    hola: "nesting"
                }
            }
        }
    };

    const right = {
        data: {
            objModified: {
                objectPepe: {
                    hola: "nesting"
                }
            }
        }
    };

    const delta = jsondiffpatch.diff(left, right);
    let jsonResult = new jsonFormatter().format(delta);
    expect(jsonResult).toEqual();
});

test.skip("expect empty accordion modified some data in the first layer", () => {
    const left = {
        data: {
            linkedMedia: [],
            intro: { show: false },
            outro: {},
            customData: {},
            items: [
                {
                    title: "",
                    content: "",
                    linkedMedia: [],
                    uuid: 5668
                }
            ]
        }
    };

    const right = {
        data: {
            linkedMedia: [],
            intro: { show: false },
            outro: {},
            customData: {},
            items: [
                {
                    title: "pepito",
                    content: "<p><strong>loco </strong></p><p><br></p>",
                    linkedMedia: [],
                    uuid: 5668,
                    uploadedMedia: {
                        title: [],
                        content: [],
                        feedbackCorrect: [],
                        feedbackHint: [],
                        feedbackIncorrect: []
                    }
                }
            ]
        }
    };

    const delta = jsondiffpatch.create({
        propertyFilter: function(name, context) {
            return !["linkedMedia", "imageSize", "sizes", "uploadedMedia"].includes(name);
          }
    }).diff(left, right);
    let jsonResult = new jsonFormatter().format(delta);
    let expectedResult = {
        unObjectAdded: {
            action: "added",
            objectPepe: {
                hola: "nesting"
            }
        }
    };
    expect(jsonResult).toEqual(expectedResult);
});
