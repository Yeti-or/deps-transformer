var helpers = require('cst-helpers');

module.exports = function(opts) {

return function(tree) {

tree.selectNodesByType('StringLiteral').forEach(lit => {
	if (lit.value === 'i-bem') {
		var prop = lit.parentElement;
		var obj = prop.parentElement;

		obj.properties.forEach(prop => {
			if (prop.key.name === 'elems' || prop.key.name === 'elem') {
			   // elem: 'dom' -> elem: ['dom']
			   if (prop.value.type === 'StringLiteral') {
				   var newArr = new types.ArrayExpression([
					   new Token('Punctuator', '['),
					   prop.value.cloneElement(),
					   new Token('Punctuator', ']')
				   ]);

				   prop.replaceChild(newArr, prop.value);
			   }
			   if (prop.value.type === 'ArrayExpression') {
				   for (var i = 0; i < prop.value.elements.length; i++) {
					   var el = prop.value.elements[i];
					   if (el.type === 'StringLiteral' && el.value === 'html') {
						   //removeElementFromArray(el, prop.value);
						   helpers.removeElementFromArray(prop.value, el);
					   }
				   }
				   if (prop.value.elements.length === 0) {
					   if (prop.key.name === 'elems') {
						   // { block: 'i-bem', elems: [] } => { block: 'i-bem'}
						   //removeElementFromObject(prop, obj);
						   helpers.removePropertyFromObject(obj, prop);
					   } else {
						   // { block: 'i-bem', elem: [] } => { block: 'i-bem'}
						   var hasMods = obj.properties.some((prop) => prop.key.name === 'mods');
						   if (hasMods) {
							   //removeElementFromObject(prop, obj);  
							   helpers.removePropertyFromObject(obj, prop);
						   } else {
							   // mustDeps is always array
							   var deps = obj.parentElement;
							   if (deps.type === 'ArrayExpression') {
								   // TODO: reWrite recursive
								   //removeElementFromArray(obj, deps);
								   helpers.removeElementFromArray(deps, obj);
								   if (deps.elements.length === 0) {
									   var propOfDep = deps.parentElement;
									   var depsObj = propOfDep.parentElement;
									   //removeElementFromObject(propOfDep, depsObj);
									   helpers.removePropertyFromObject(depsObj, propOfDep);
									   if (depsObj.properties.length === 0) {
										   var arr = depsObj.parentElement;
										   //removeElementFromArray(depsObj, arr);
										   helpers.removeElementFromArray(arr, depsObj);
									   }
								   }
							   }
						   }
					   }
				   }
			   }
		   }
		});
	}

});

};

};
