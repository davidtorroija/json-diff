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
      unObjectAdded: {objectPepe: {hola: "nesting"}},
      stringYaEstaba: "string Modified"
    }
  };

const delta = jsondiffpatch.diff(left, right);

test('adds 1 + 2 to equal 3', () => {
    expect(delta).toBe(3);
  });