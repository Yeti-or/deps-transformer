
module.exports = function(opts) {

return function(tree) {

tree.selectNodesByType('StringLiteral').forEach(lit => {
	console.log('literal: ' + lit);
});

};

};
