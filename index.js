var helpers = require('cst-helpers');

module.exports = function(opts) {

return function(tree) {

var rBlock = 'i-bem';
var rElem = 'html';

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

// TODO: move to cst-helpers
function arrayIndexOfElementValue(arr, val) {
    var index = -1;
    for (var i = 0; i < arr.elements.length; i++) {
        var el = arr.elements[i];
        if (el.type === 'StringLiteral' && el.value === val) {
            index = i;
            break;
        }
    }
    return index;
}

tree.selectNodesByType('StringLiteral').forEach(literal => {
    if (literal.value !== rBlock) { return; }
    if (literal.parentElement.type !== 'ObjectProperty') { return; }
    var obj = literal.parentElement.parentElement;

    function removeElementPropFromDepObj(obj, prop, force) {
        if (!prop) { return; }
        var isSaveToRemoveElem = (force &&
                !helpers.getPropFromObjectByKeyName(obj, 'mods'));

        if (prop.value.type === 'StringLiteral') {
            if (prop.value.value === rElem) {
                helpers.removePropertyFromObject(obj, prop);
                isSaveToRemoveElem && removeEmpty(obj);
            }
        }
        if (prop.value.type === 'ArrayExpression') {
            var arr = prop.value;
            var index = arrayIndexOfElementValue(arr, rElem);
            if (index !== -1) {
                helpers.removeElementFromArray(arr, arr.elements[index]);
                if (!arr.elements.length) {
                    helpers.removePropertyFromObject(obj, prop);
                    isSaveToRemoveElem && removeEmpty(obj);
                }
            }
        }
    }

    var elemsProp = helpers.getPropFromObjectByKeyName(obj, 'elems');
    removeElementPropFromDepObj(obj, elemsProp);

    var elemProp = helpers.getPropFromObjectByKeyName(obj, 'elem');
    removeElementPropFromDepObj(obj, elemProp, true);
});

};

};
