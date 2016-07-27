var chai = require('chai');
var expect = chai.expect;

var cst = require('cst');

var parser = new cst.Parser();

var transform = require('../..')();
var remove = transform.remove({block: 'i-bem'});

var processDep = function(from, to) {
    var tree = parser.parse(from);
    remove(tree);
    expect(tree.getSourceCode()).to.eql(to);
};

describe('remove block:', () => {

    describe('basic', () => {
        it('only block:', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem'
                }
            });`;

            var transformedDepFile = `({});`;

            processDep(depFile, transformedDepFile);
        });

        it('exact block:', () => {
            var depFile =
            `({
                mustDeps: [
                    {block: 'i-bem'},
                    {block: 'i-ua'},
                    {block: 'i-bem'}
                ]
            });`;

            var transformedDepFile =
            `({
                mustDeps: [
                    {block: 'i-ua'}
                ]
            });`;

            processDep(depFile, transformedDepFile);
        });

        it('should remove several tenoroks', () => {
            var depFile =
            `([{
                mustDeps: [
                    {block: 'i-bem', elems: ['dom', 'html']},
                    {block: 'i-bem', elem: ['html']}
                ],
                shouldDeps: {
                    block: 'i-bem', elem: ['html']
                }
            }, {
                tech: 'bemhtml',
                shouldDeps: {
                    block: 'i-bem', elem: ['html']
                }
            }]);`;

            var transformedDepFile =
            `([{
                mustDeps: [
                    {block: 'i-bem', elem: ['dom', 'html']}
                ]
            }]);`;

            processDep(depFile, transformedDepFile);
        });
    });

    describe('mustDeps/shouldDeps', () => {

        it('mustDeps', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem'
                }
            });`;

            var transformedDepFile =
            `({});`;

            processDep(depFile, transformedDepFile);
        });

        it('shouldDeps', () => {
            var depFile =
            `({
                shouldDeps: {
                    block: 'i-bem'
                }
            });`;

            var transformedDepFile =
            `({});`;

            processDep(depFile, transformedDepFile);
        });

        it('noDeps', () => {
            var depFile =
            `({
                noDeps: {
                    block: 'i-bem'
                }
            });`;

            var transformedDepFile =
            `({});`;

            processDep(depFile, transformedDepFile);
        });

        it('depsByTech', () => {
            var depFile =
            `({
                tech: 'tmpl-spec.js',
                mustDeps: {
                    tech: 'bemhtml', block: 'i-bem'
                }
            });`;

            var transformedDepFile =
            `({});`;

            processDep(depFile, transformedDepFile);
        });

        it('not suchWowDeps', () => {
            var depFile =
            `({
                suchWowDeps: {
                    block: 'i-bem'
                }
            });`;

            var transformedDepFile =
            `({
                suchWowDeps: {
                    block: 'i-bem'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });
    });

    describe('[] / {} / str', () => {
        it('{}', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem'
                }
            });`;

            var transformedDepFile =
            `({});`;

            processDep(depFile, transformedDepFile);
        });

        it('[]', () => {
            var depFile =
            `({
                mustDeps: [
                    {block: 'i-bem'}
                ]
            });`;

            var transformedDepFile =
            `({});`;

            processDep(depFile, transformedDepFile);
        });

        it('str', () => {
            var depFile =
            `({
                mustDeps: 'i-bem'
            });`;

            var transformedDepFile =
            `({});`;

            processDep(depFile, transformedDepFile);
        });

        it('[str]', () => {
            var depFile =
            `({
                mustDeps: [
                    'i-bem'
                ]
            });`;

            var transformedDepFile =
            `({});`;

            processDep(depFile, transformedDepFile);
        });

        it('[str, {}]', () => {
            var depFile =
            `({
                mustDeps: [
                    'i-bem',
                    {block: 'i-bem'}
                ]
            });`;

            var transformedDepFile =
            `({});`;

            processDep(depFile, transformedDepFile);

            depFile =
            `({
                mustDeps: [
                    'i-bem',
                    {block: 'i-ua'}
                ]
            });`;

            transformedDepFile =
            `({
                mustDeps: [
                    {block: 'i-ua'}
                ]
            });`;

            processDep(depFile, transformedDepFile);
        });
    });

    describe('from deps with elem:', () => {

        it('elem', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: 'html'
                },
                shouldDeps: {
                    block: 'i-ua'
                }
            });`;

            var transformedDepFile =
            `({
                shouldDeps: {
                    block: 'i-ua'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

        it('elems', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: 'html'
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: 'html'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

    });

    describe('don\'t remove', () => {

        it('if block name is in elem', () => {
            var depFile =
            `({
                mustDeps: [
                    { block: 'html', elems: ['i-bem'] },
                    { block: 'html', elem: 'i-bem' }
                ]
            });`;

            var transformedDepFile =
            `({
                mustDeps: [
                    { block: 'html', elems: ['i-bem'] },
                    { block: 'html', elem: 'i-bem' }
                ]
            });`;

            processDep(depFile, transformedDepFile);
        });

    });

    describe('with mods', () => {

        it('mods', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', mods: {type: 'link'}
                }
            });`;

            var transformedDepFile =
            `({});`;

            processDep(depFile, transformedDepFile);

        });

        it('and elems', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: ['dom', 'html'], mods: {type: 'link'}
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: ['dom', 'html']
                }
            });`;

            processDep(depFile, transformedDepFile);

        });

        it('and elem', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: ['dom', 'html'], mods: {type: 'link'}
                }
            });`;

            var transformedDepFile =
            `({});`;

            processDep(depFile, transformedDepFile);

        });

    });

    describe('remove empty deps', () => {
        it('should remove empty {} dep', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: ['html']
                }
            });`;

            var transformedDepFile =
            `({});`;

            processDep(depFile, transformedDepFile);

        });

        it('should remove empty [] dep', () => {
            var depFile =
            `({
                mustDeps: [
                    {block: 'i-bem', elem: ['html']}
                ]
            });`;

            var transformedDepFile =
            `({});`;

            processDep(depFile, transformedDepFile);

        });

        it('should remove empty [] with tech', () => {
            var depFile =
            `({
                tech: 'tmpl-spec.js',
                mustDeps: [
                    {block: 'i-bem', elem: ['html'], tech: 'bemhtml'}
                ]
            });`;

            var transformedDepFile =
            `({});`;

            processDep(depFile, transformedDepFile);

        });

        it('should remove empty [] dep in empty []', () => {
            var depFile =
            `([{
                mustDeps: [
                    {block: 'i-bem', elem: ['html']}
                ]
            }]);`;

            var transformedDepFile =
            `([]);`;

            processDep(depFile, transformedDepFile);

        });

        it('should not remove dep with other tenoroks', () => {
            var depFile =
            `({
                mustDeps: [
                    {block: 'i-bem', elem: ['html']},
                    {block: 'i-ua'}
                ]
            });`;

            var transformedDepFile =
            `({
                mustDeps: [
                    {block: 'i-ua'}
                ]
            });`;

            processDep(depFile, transformedDepFile);

        });

        it('should not remove other dep', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: ['html'],
                },
                shouldDeps: 'i-ua'
            });`;

            var transformedDepFile =
            `({
                shouldDeps: 'i-ua'
            });`;

            processDep(depFile, transformedDepFile);

        });

    });

    describe('many', () => {
    });

});
