import BaseFormatter from "./base.js";

let actions = {
  added: "added",
  deleted: "deleted",
  movedestination: "move dest",
  moved: "moved",
  unchanged: "unchanged",
  error: "error",
  textDiffLine: "text changed"
};

function parseInteger(value) {
  if (value === "") return NaN;
  const number = Number(value);
  return Number.isInteger(number) ? number : NaN;
}
function isInteger(value) {
  const result = parseInteger(value);
  return !isNaN(result);
}

class ConsoleFormatter extends BaseFormatter {
  constructor() {
    super();
    this.includeMoveDestinations = false;
  }

  prepareContext(context) {
    super.prepareContext(context);
    context.index = [];
    context.indent = function(levels) {
      this.indentLevel =
        (this.indentLevel || 0) + (typeof levels === "undefined" ? 1 : levels);
      this.indentPad = new Array(this.indentLevel + 1).join("  ");
      this.outLine();
    };
    context.outLine = function() {
      this.buffer.push(`\n${this.indentPad || ""}`);
    };
    context.out = function(...args) {
      for (let i = 0, l = args.length; i < l; i++) {
        let lines = args[i].split("\n");
        let text = lines.join(`\n${this.indentPad || ""}`);
        this.buffer.push(text);
      }
    };
    context.setIndex = function(index) {
      this.index = index;
    };
  }

  typeFormattterErrorFormatter(context, err) {
    //context.pushColor(colors.error);
    context.out(`[ERROR]${err}`);
    //context.popColor();
  }

  formatValue(context, value) {
    context.out(JSON.stringify(value, null, 2));
  }

  formatTextDiffString(context, value) {
    let lines = this.parseTextDiff(value);
    //console.log("lines", lines);
    context.indent();
    for (let i = 0, l = lines.length; i < l; i++) {
      let line = lines[i];
      //context.pushColor(colors.textDiffLine);
      context.out(`${line.location.line},${line.location.chr} `);
      //context.popColor();2
      let pieces = line.pieces;
      for (
        let pieceIndex = 0, piecesLength = pieces.length;
        pieceIndex < piecesLength;
        pieceIndex++
      ) {
        let piece = pieces[pieceIndex];
        //context.pushColor(colors[piece.type]);
        context.out(piece.text);
        //context.popColor();
      }
      if (i < l - 1) {
        context.outLine();
      }
    }
    context.indent(-1);
  }

  rootBegin(context, type, nodeType) {
    //context.pushColor(colors[type]);
    //console.log("rootBegin ", type, nodeType);
    if (type === "node") {
      context.out(nodeType === "array" ? "[" : "{");
      context.indent();
    }
  }

  rootEnd(context, type, nodeType) {
    if (type === "node") {
      context.indent(-1);
      context.out(nodeType === "array" ? "]" : "}");
    }
  }

  nodeBegin(context, key, leftKey, type, nodeType) {
    //context.pushColor(colors[type]);
    let index = "";
    if (!isInteger(leftKey)) {
      context.setIndex(null);
      context.out(`${leftKey}: `);
    } else {
      context.setIndex(leftKey * 1);
    }

    if (nodeType === "object" && context.index) {
      index = `\n  "index": ${context.index},`;
    }

    if (type === "node") {
      context.out(nodeType === "array" ? "[" : "{" + index);
      context.indent();
    }
    /*if (type === "added" && !nodeType) {
      console.log("added", index)
      context.out(index)
    }*/
  }

  nodeEnd(context, key, leftKey, type, nodeType, isLast) {
    if (type === "node") {
      context.indent(-1);
      context.out(nodeType === "array" ? "]," : `}${isLast ? "" : ","}`);
    }
    if (!isLast) {
      context.outLine();
    }
    //context.popColor();
  }

  /* jshint camelcase: false */
  /* eslint-disable camelcase */

  format_unchanged(context, delta, left) {
    if (typeof left === "undefined") {
      return;
    }
    console.log("unchanged", delta);
    this.formatValue(context, left);
  }

  format_movedestination(context, delta, left) {
    if (typeof left === "undefined") {
      return;
    }
    this.formatValue(context, left);
  }

  format_node(context, delta, left) {
    // recurse
    this.formatDeltaChildren(context, delta, left);
  }

  format_added(context, delta, a) {
    // console.log("added1", delta, context, a, delta[0] === "object");
    if (typeof delta[0] === "object") {
      delta[0].action = "added";
      if (context.index) {
        delta[0].index = context.index;
      }
    }
    this.formatValue(context, delta[0]);
    context.out(",");
  }

  format_modified(context, delta) {
    //context.pushColor(colors.deleted);
    //console.log(delta);

    //context.out(`{
    //  "action": "modified",
    //  "old": `);

    const modifiedObj = {
      action: "modified",
      old: delta[0],
      new: delta[1]
    };
    this.formatValue(context, modifiedObj);
    context.out(",");
    //context.popColor();
    //context.out(`,
    //  "new": `);
    //context.pushColor(colors.added);
    //this.formatValue(context, delta[1]);
    //context.out(`
    //},`);
  }

  format_deleted(context, delta) {
    //delta[0].action = "deleted";
    this.formatValue(context, delta[0]);
  }

  format_moved(context, delta) {
    //console.log("moved", delta);
    context.out(`==> ${delta[1]}`);
  }

  format_textdiff(context, delta) {
    // console.log("text", delta);
    this.formatTextDiffString(context, delta[0]);
  }

  format(delta, left) {
    let context = {};
    this.prepareContext(context);
    this.recurse(context, delta, left);
    //return eval(context.buffer.join(""));
    return context.buffer.join("");
  }
}

/* eslint-enable camelcase */

/* jshint camelcase: true */

export default ConsoleFormatter;

let defaultInstance;

export const format = (delta, left) => {
  if (!defaultInstance) {
    defaultInstance = new ConsoleFormatter();
  }
  //console.log("result", pepe);
  return defaultInstance.format(delta, left);
};

export function log(delta, left) {
  console.log(format(delta, left));
}
