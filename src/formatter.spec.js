import jsonFormatter from "./jsonFormatter";
let jsondiffpatch = require("jsondiffpatch");
let options = {
    propertyFilter: function(name, context) {
        return !["linkedMedia", "imageSize", "sizes", "uploadedMedia"].includes(name);
        }
}

test("expect already have property should ignored", () => {
    const left = {
        data: {
            yaEstaba: "string testing"
        }
    };

    const right = {
        data: {
            yaEstaba: "string testing"
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
    //console.log("expectedResult",jsonResult)
    expect(jsonResult).toEqual({});
});

test.skip("expect added property to be added in diff", () => {
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
    //console.log("expectedResult",jsonResult)
    expect(jsonResult.data.unStringAdded).toBeDefined();
    expect(jsonResult.data).toEqual(expectedResult);
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
    let jsonResult = new jsonFormatter().format(delta).data;
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

test("expect 'modified' object has action and new value", () => {
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
                    hola: "nesting1"
                }
            }
        }
    };

    const delta = jsondiffpatch.diff(left, right);
    let jsonResult = new jsonFormatter().format(delta).data;
    expect(jsonResult).toEqual({
            objModified: {
                objectPepe: {
                    hola: {
                        action: "modified",
                        old: "nesting",
                        new: "nesting1"
                    }
                }
            }
    });
});

test("expect modified only first layer and ignore ignored properties in options", () => {
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
    //options ignore "linkedMedia", "imageSize", "sizes", "uploadedMedia" properties
    const delta = jsondiffpatch.create(options).diff(left, right);
    let jsonResult = new jsonFormatter().format(delta).data;
    let expectedResult = {
        items: [
            {
                "title": {
                    "action": "modified",
                    "new": "pepito",
                    "old": "",
                },
                "content": {
                    "action": "modified",
                    "new": "<p><strong>loco </strong></p><p><br></p>",
                    "old": "",
                },
            }
        ]
    };
    expect(jsonResult).toEqual(expectedResult);
});

test("should display changes in human friendly way", () => {
    const left = {
        data: {
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
            items: [
                {
                    title: "pepito",
                    content: "<p><strong>loco </strong></p><p><br></p>",
                    linkedMedia: [],
                    uuid: 5668,
                }
            ]
        }
    };
    //options ignore "linkedMedia", "imageSize", "sizes", "uploadedMedia" properties
    const delta = jsondiffpatch.create(options).diff(left, right);
    let jsonResult = new jsonFormatter().format(delta).data;
    let expectedResult = {
        items: [
            {
                "title": {
                    "action": "modified",
                    "new": "pepito",
                    "old": "",
                },
                "content": {
                    "action": "modified",
                    "new": "<p><strong>loco </strong></p><p><br></p>",
                    "old": "",
                },
            }
        ]
    };
    expect(jsonResult).toEqual(expectedResult);
    expect(jsonResult.humanly()).toEqual([
        "Layer 0 modified:"
    ]);
    

});
