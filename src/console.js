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

function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
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
        context.index = null;
        context.parent = null;
        context.objResult = null;
        context.parentProperty = null;
        context.setIndex = function(index) {
            this.index = index;
        };
        context.setParent = function(parent) {
            this.parent = parent;
        };
    }

    typeFormattterErrorFormatter(context, err) {
        // context.out(`[ERROR]${err}`);
    }

    formatValue(context, value) {
        // context.out(JSON.stringify(value, null, 2));
    }

    formatTextDiffString(context, value) {
        let lines = this.parseTextDiff(value);
        //console.log("lines", lines);
        for (let i = 0, l = lines.length; i < l; i++) {
            let line = lines[i];
            // context.out(`${line.location.line},${line.location.chr} `);
            let pieces = line.pieces;
            for (
                let pieceIndex = 0, piecesLength = pieces.length;
                pieceIndex < piecesLength;
                pieceIndex++
            ) {
                let piece = pieces[pieceIndex];
                // context.out(piece.text);
            }
        }
    }

    rootBegin(context, type, nodeType) {
        //console.log("rootBegin ", type, nodeType);
        if (type === "node") {
            context.objResult = nodeType === "array" ? [] : {};
            context.setParent(context.objResult);
            // context.out(nodeType === "array" ? "[" : "{");
        }
    }

    rootEnd(context, type, nodeType) {
        if (type === "node") {
            // context.out(nodeType === "array" ? "]" : "}");
        }
    }

    nodeBegin(context, key, leftKey, type, nodeType) {
        console.log(
            "aca",
            leftKey,
            context.parent,
            context.parentProperty,
            context.parent[context.parentProperty]
        );
        const parentArr = context.parent[context.parentProperty];

        if (!isInteger(leftKey)) {
            
            if (!nodeType && Array.isArray(parentArr)) {
                context.parent = parentArr[context.index];
                context.parentProperty = leftKey;
            }
            context.setIndex(null);
        } else {
            context.setIndex(leftKey * 1);
            let newObj = { index: context.index };
            if (Array.isArray(parentArr)) {
                parentArr.push(newObj);
                context.setIndex(parentArr.indexOf(newObj));
            }
        }

        console.log("nodeBegin", key, leftKey, type, nodeType, context.index);
        
        if (nodeType === "array") {
            context.parentProperty = leftKey;
            context.parent[leftKey] = [];
        } else {
            context.parentProperty = leftKey;
        }
    }

    nodeEnd(context, key, leftKey, type, nodeType, isLast) {
        if (type === "node") {
            // context.out(nodeType === "array" ? "]," : `}${isLast ? "" : ","}`);
        }
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
        //console.log("added1", context.parentProperty, context.parent, context.parent[context.parentProperty], delta[0]);
        if (typeof delta[0] === "object") {
            delta[0].action = "added";
            if (context.index) {
                delta[0].index = context.index;
            }
            context.parent[context.parentProperty] = delta[0];
        } else {
            context.parent[context.parentProperty] = {
                action: "added",
                value: delta[0]
            };
        }

        //this.formatValue(context, delta[0]);
        // context.out(",");
    }

    format_modified(context, delta) {
        console.log(
            "parent",
            context.index,
            context.parent,
            context.parentProperty,
            context.parent[context.parentProperty],
            delta
        );

        if (isObject(context.parent)) {
            Object.assign(context.parent, {
                action: "modified",
                old: delta[0],
                new: delta[1]
            });
        }
    }

    format_deleted(context, delta) {
        //delta[0].action = "deleted";
        this.formatValue(context, delta[0]);
    }

    format_moved(context, delta) {
        //console.log("moved", delta);
        // context.out(`==> ${delta[1]}`);
    }

    format_textdiff(context, delta) {
        console.log("text", delta);
        this.formatTextDiffString(context, delta[0]);
    }

    format(delta, left) {
        let context = {};
        this.prepareContext(context);
        this.recurse(context, delta, left);
        //return eval(context.buffer.join(""));
        //console.log("context.resu", context)
        return context.objResult;
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
