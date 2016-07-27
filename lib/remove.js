var helpers = require('cst-helpers');

module.exports = function remove(tenorok) {

// TODO: move to cst-helpers
function arrayIndexOfElementValue(arr, val) {
    var index = -1;
    for (var i = 0; i < arr.elements.length; i++) {
        var el = arr.elements[i];
        if (el.value === val) {
            index = i;
            break;
        }
    }
    return index;
}

return function(tree) {

var rBlock = tenorok.block;
// TODO: remove elem from current block
var rElem = tenorok.elem;

// TODO: remove mods
// var rModName = tenorok.modName;
// var rModVal = tenorok.modVal;

function isBlock() {
    return !rElem && rBlock;
}

function isElem() {
    return rElem;
}

tree.selectNodesByType('ObjectExpression').forEach(function(obj) {
    [
        helpers.getPropFromObject(obj, 'mustDeps'),
        helpers.getPropFromObject(obj, 'shouldDeps'),
        helpers.getPropFromObject(obj, 'noDeps')
    ].forEach(function(depProp) {
        if (!depProp) { return; }
        if (depProp.value.type === 'ArrayExpression') {
            var arr = depProp.value;
            arr.elements.forEach(function(dep) {
                processDep(dep);
            });
        } else {
            processDep(depProp.value);
        }
    });

    function processDep(dep) {
        if (dep.type === 'StringLiteral') {
            processDepStr(dep);
        } else if (dep.type === 'ObjectExpression') {
            processDepObj(dep);
        } else {
            throw new Error('dep could be Obj or String, not: ' + dep.type);
        }
    }

    function processDepStr(depStr) {
        // Dep as string represents only Block
        if (isBlock() && depStr.value === rBlock) {
            removeEmpty(depStr);
        }
    }

    function processDepObj(depObj) {

        var blockProp = helpers.getPropFromObject(depObj, 'block');
        if (!blockProp || blockProp.value.value !== rBlock) { return; }

        var elemsProp;
        var elemProp;

        if (isBlock()) {
            if ((elemsProp = helpers.getPropFromObject(depObj, 'elems'))) {
                helpers.updatePropKeyFromObject(depObj, 'elems', 'elem');
                helpers.removePropertyFromObjectByKeyName(depObj, 'mods');
            } else {
                helpers.removePropertyFromObjectByKeyName(depObj, 'block');
                removeEmpty(depObj);
            }
        }

        if (isElem()) {
            if ((elemsProp = helpers.getPropFromObject(depObj, 'elems'))) {
                removeElementPropFromDepObj(depObj, elemsProp);
            }

            if ((elemProp = helpers.getPropFromObject(depObj, 'elem'))) {
                removeElementPropFromDepObj(depObj, elemProp);
                if (!elemProp.parentElement && !helpers.getPropFromObject(depObj, 'mods')) {
                    removeEmpty(depObj);
                }
            }
        }
    }

});

function removeElementPropFromDepObj(obj, prop) {
    // TODO: elem: [{elem}] / elem: {elem}
    if (prop.value.type === 'StringLiteral') {
        if (prop.value.value === rElem) {
            helpers.removePropertyFromObject(obj, prop);
        }
    }
    if (prop.value.type === 'ArrayExpression') {
        var arr = prop.value;
        var index = arrayIndexOfElementValue(arr, rElem);
        if (index !== -1) {
            helpers.removeElementFromArray(arr, arr.elements[index]);
            if (!arr.elements.length) {
                helpers.removePropertyFromObject(obj, prop);
            }
        }
    }
}

function removeEmpty(el) {
    var next = el.parentElement;
    if (next.type === 'ArrayExpression') {
        helpers.removeElementFromArray(next, el);
        next.elements.length === 0 && removeEmpty(next);
    }
    if (next.type === 'ObjectExpression') {
        helpers.removePropertyFromObject(next, el);
        helpers.removePropertyFromObjectByKeyName(next, 'tech');
        next.properties.length === 0 && removeEmpty(next);
    }
    if (next.type === 'ObjectProperty') {
        removeEmpty(next);
    }
}

};

};
