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

test('expect added property to be added in diff', () => {
    const left = {
        data: {
        }
      };
      
      const right = {
        data: {
          unStringAdded: "string testing",
        }
      };
    
    const delta = jsondiffpatch.diff(left, right);
    let jsonResult = new jsonFormatter().format(delta);
    expect(jsonResult).toBe({ unStringAdded: {}});
});