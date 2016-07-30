var chai = require('chai');
var expect = chai.expect;

var cst = require('cst');

var transform = require('../..')();

var parser = new cst.Parser();
var remove = transform.remove({block: 'i-bem', elem: 'html'});

var processDep = function(from, to) {
    var tree = parser.parse(from);
    remove(tree);
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

        it('string', () => {
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

        it('[]', () => {
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

        it('string', () => {
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
                shouldDeps: {
                    block: 'i-bem', elems: ['html']
                }
            });`;

            var transformedDepFile =
            `({
                shouldDeps: {
                    block: 'i-bem'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

        it('noDeps', () => {
            var depFile =
            `({
                noDeps: {
                    block: 'i-bem', elems: ['html']
                }
            });`;

            var transformedDepFile =
            `({
                noDeps: {
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

        it('not suchWowDeps', () => {
            var depFile =
            `({
                suchWowDeps: {
                    block: 'i-bem', elems: ['html']
                }
            });`;

            var transformedDepFile =
            `({
                suchWowDeps: {
                    block: 'i-bem', elems: ['html']
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

        it('from comment', () => {
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

        it('block \'i-bem\' without __html', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem'
                },
                shouldDeps: [
                    {block: 'i-bem', elem: 'i18n'},
                    {block: 'i-bem', elems: 'i18n'}
                ]
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem'
                },
                shouldDeps: [
                    {block: 'i-bem', elem: 'i18n'},
                    {block: 'i-bem', elems: 'i18n'}
                ]
            });`;

            processDep(depFile, transformedDepFile);
        });

        it('str: block \'i-bem\' without __html', () => {
            var depFile =
            `({
                mustDeps: [
                    'i-bem'
                ]
            });`;

            var transformedDepFile =
            `({
                mustDeps: [
                    'i-bem'
                ]
            });`;

            processDep(depFile, transformedDepFile);
        });

        it('from elems without block', () => {
            var depFile =
            `({
                mustDeps: {
                    elems: 'html'
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    elems: 'html'
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

        it('from elem without block', () => {
            var depFile =
            `({
                mustDeps: {
                    elem: 'html'
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    elem: 'html'
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

        it('[]', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: ['html'], mods: {type: 'link'}
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem', mods: {type: 'link'}
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

        it('string', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elems: 'html', mods: {type: 'link'}
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem', mods: {type: 'link'}
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

        it('[]', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: ['html'], mods: {type: 'link'}
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem', mods: {type: 'link'}
                }
            });`;

            processDep(depFile, transformedDepFile);
        });

        it('string', () => {
            var depFile =
            `({
                mustDeps: {
                    block: 'i-bem', elem: 'html', mods: {type: 'link'}
                }
            });`;

            var transformedDepFile =
            `({
                mustDeps: {
                    block: 'i-bem', mods: {type: 'link'}
                }
            });`;

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

    it('should remove several tenoroks', () => {
        var depFile =
        `([{
            mustDeps: [
                {block: 'i-bem', elems: ['dom', 'html']},
                {block: 'i-bem', elem: ['html']}
            ],
            shouldDeps: {
                block: 'i-bem', elems: ['html']
            }
        }, {
            tech: 'bemhtml',
            shouldDeps: {
                block: 'i-bem', elems: ['html']
            }
        }]);`;

        var transformedDepFile =
        `([{
            mustDeps: [
                {block: 'i-bem', elems: ['dom']}
            ],
            shouldDeps: {
                block: 'i-bem'
            }
        }, {
            tech: 'bemhtml',
            shouldDeps: {
                block: 'i-bem'
            }
        }]);`;

        processDep(depFile, transformedDepFile);
    });

});
