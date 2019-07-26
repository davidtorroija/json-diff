import "./styles.css";
//import { left, right } from "./jsons";
import { left, right } from "./json-ht";
import formatter from "./formatter.js";
import textFormatter from "./text-formatter.js";
import jsonFormatter from "./console.js";
import pepeFormatter from "./console copy.js";
let jsondiffpatch = require("jsondiffpatch");

document.getElementById("app").innerHTML = `
<p><b>David Torroija</b> changes at Jul 24 21:05 hs (GMT -5)</p>	
<div>
  <ul id="list">
  </ul>
</div> 
`;
window.json = left;
const delta = jsondiffpatch
  .create({
    arrays: {
      // default true, detect items moved inside the array (otherwise they will be registered as remove+add)
      detectMove: false,
      // default false, the value of items moved is not included in deltas
      includeValueOnMove: false
    },
    propertyFilter: function(name, context) {
      /*
       this optional function can be specified to ignore object properties (eg. volatile data)
        name: property name, present in either context.left or context.right objects
        context: the diff context (has context.left and context.right objects)
      */
      return !["linkedMedia", "imageSize", "sizes"].includes(name);
    }
  })
  .diff(left.data, right.data);
  import { left2, right2} from "./jsons";

  const delta2 = jsondiffpatch
  .create({
    // arrays: {
    //   // default true, detect items moved inside the array (otherwise they will be registered as remove+add)
    //   detectMove: false,
    //   // default false, the value of items moved is not included in deltas
    //   includeValueOnMove: false
    // },
    propertyFilter: function(name, context) {
      /*
       this optional function can be specified to ignore object properties (eg. volatile data)
        name: property name, present in either context.left or context.right objects
        context: the diff context (has context.left and context.right objects)
      */
      return !["linkedMedia", "imageSize", "sizes"].includes(name);
    }
  })
  .diff(left2, right2);
window.f = formatter;

console.log("xxx12", delta, new pepeFormatter().format(delta2));
const resultArr = new textFormatter(delta).format(delta);
const select = document.getElementById("list");

for (var i = 0; i < resultArr.length; i++) {
  var li = document.createElement("li");
  var span = document.createElement("span");
  span.appendChild(document.createTextNode(i));
  li.appendChild(span);
  var text = document.createTextNode(resultArr[i]);
  li.appendChild(text);
  select.insertBefore(li, select.childNodes[i]);
}
