var chai = require('chai');
var expect = chai.expect;

var cst = require('cst');

var parser = new cst.Parser()

var transform = require('.')();

var processDep = function(from, to, comment) {
    var tree = parser.parse(from);
    transform(tree);
    expect(tree.getSourceCode()).to.eql(to);
};

describe('remove i-bem__html:', () => {

    describe('from elems:', () => {

        it('[\'dom\']', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: ['dom', 'html']
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: ['dom']
                }
            });`;

            processDep(depFile, transformedDepFile);

        });

        it('[]', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: ['html']
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

        xit('string', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: 'html'
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

    });

    describe('from elem:', () => {

        it('[\'dom\']', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: ['dom', 'html']
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: ['dom']
                }
            });`;

            processDep(depFile, transformedDepFile);

        });

        xit('[]', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: ['html']
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

        xit('string', () => {
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
                shouldDeps {
                    block: 'i-ua'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

    });

    describe('mustDeps/shouldDeps', () => {

        it('mustDeps', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: ['html']
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

        it('shouldDeps', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: ['html']
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

        it('depsByTech', () => {
            var depFile =
            `({
                tech: 'tmpl-spec.js',
                mustDeps: {
                    tech: 'bemhtml', block: 'i-bem', elems: ['html']
                }
            });`;

            var transformedDepFile =
            `({
                tech: 'tmpl-spec.js',
                mustDeps: {
                    tech: 'bemhtml', block: 'i-bem'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

        it('suchWowDeps', () => {
            var depFile =
            `({
                suchWowDeps: {
                    block: 'i-bem', elems: ['html']
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

    describe('mustDeps: [] / {}', () => {
        it('{}', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: ['html']
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

        it('[]', () => {
            var depFile =
            `({
                mustDeps: [
                    {block: 'i-bem', elems: ['html']}
                ]
            });`;

            var transformedDepFile =
            `({
                mustDeps: [
                    {block: 'i-bem'}
                ]
            });`;

            processDep(depFile, transformedDepFile);
        });
    });

    describe('don\'t remove', () => {

        xit('from comment', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: ['html']
                },
                shouldDeps: {
                    block: 'i-bem', elems: [/*'html'*/]
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem'
                },
                shouldDeps: {
                    block: 'i-bem', elems: [/*'html'*/]
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

        it('from other blocks', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-wow', elems: ['html']
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-wow', elems: ['html']
                }
            });`;

            processDep(depFile, transformedDepFile);
        });
    });

    describe('from elems: with mods', () => {

        it('[\'dom\']', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: ['dom', 'html'], mods: {type: 'link'}
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: ['dom'], mods: {type: 'link'}
                }
            });`;

            processDep(depFile, transformedDepFile);

        });

        xit('[]', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: ['html'], mods: {type: 'link'}
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

        xit('string', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: 'html', mods: {type: 'link'}
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

    });

    describe('from elem with mods:', () => {

        it('[\'dom\']', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: ['dom', 'html'], mods: {type: 'link'}
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: ['dom'], mods: {type: 'link'}
                }
            });`;

            processDep(depFile, transformedDepFile);

        });

        xit('[]', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: ['html']
                },
                shouldDeps: {
                    block: 'i-ua'
                }
            });`;


            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem', mods: {type: 'link'}
                },
                shouldDeps: {
                    block: 'i-ua'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

        xit('string', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: 'html', mods: {type: 'link'}
                },
                shouldDeps: {
                    block: 'i-ua'
                }
            });`;

            var transformedDepFile =
            `({
                shouldDeps {
                    block: 'i-ua'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

    });

    describe('remove empty deps', () => {
        xit('should remove empty {} dep', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: ['html']
                }
            });`;

            var transformedDepFile =
            `('');`;

            processDep(depFile, transformedDepFile);

        });

        xit('should remove empty [] dep', () => {
            var depFile =
            `({
                mustDeps: [
                    block: 'i-bem', elem: ['html']
                ]
            });`;

            var transformedDepFile =
            `('');`;

            processDep(depFile, transformedDepFile);

        });

        xit('should remove empty [] with tech', () => {
            var depFile =
            `({
                tech: 'tmpl-spec.js',
                mustDeps: [
                    block: 'i-bem', elem: ['html'], tech: 'bemhtml'
                ]
            });`;

            var transformedDepFile =
            `('');`;

            processDep(depFile, transformedDepFile);

        });

        xit('should remove empty [] dep in empty []', () => {
            var depFile =
            `([{
                mustDeps: [
                    block: 'i-bem', elem: ['html']
                ]
            }]);`;

            var transformedDepFile =
            `('');`;

            processDep(depFile, transformedDepFile);

        });

        xit('should not remove dep with other tenoroks', () => {
            var depFile =
            `({
                mustDeps: [
                    block: 'i-bem', elem: ['html'],
                    block: 'i-ua'
                ]
            });`;

            var transformedDepFile =
            `({
                mustDeps: [
                    block: 'i-ua'
                ]
            });`;

            processDep(depFile, transformedDepFile);

        });

        xit('should not remove other dep', () => {
            var depFile =
            `({
                mustDeps: [
                    block: 'i-bem', elem: ['html'],
                ],
                shouldDeps: 'i-ua'
            });`;

            var transformedDepFile =
            `({
                mustDeps: [
                    block: 'i-ua'
                ],
                shouldDeps: 'i-ua'
            });`;

            processDep(depFile, transformedDepFile);

        });

    });

    describe('without block', () => {
    });

    describe('with meaningless parts', () => {
    });

});
