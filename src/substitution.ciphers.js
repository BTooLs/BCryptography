if (typeof(require) !== 'undefined') {
    var extend = require('node.extend');
}

var substitution = {
    /**
     * Basic substitution rotation algorithm.
     * Can be used for Caesar cypher, ROT13, ROT5 etc.
     * @param text
     * @param options
     * @returns string The ciphered text.
     */
    shift                 : function (text, options) {
        "use strict";
        var opts = extend({}, {
            'rotation': 13,
            'alphabet': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        }, options);

        if (opts.rotation >= opts.alphabet.length) {
            throw "Not yet supported";
        }
        var lookupTable = '';

        for (var index = 0 ; index < opts.alphabet.length ; index++) {

            var rotatedIndex = index + opts.rotation;
            if (rotatedIndex >= opts.alphabet.length) {
                rotatedIndex = rotatedIndex - opts.alphabet.length;
            }

            lookupTable += opts.alphabet[rotatedIndex];
        }

        return this.lookupTable(text, extend({}, {
            'from': opts.alphabet.split(''),
            'to'  : lookupTable.split('')
        }, opts));
    },
    lookupTable           : function (text, options) {
        "use strict";
        var opts = extend({}, {
            'from'          : ['A', 'B', 'C'],
            'to'            : ['1', '2', '3'],
            'checkLowercase': false
        }, options);

        if (opts.from.length !== opts.to.length) {
            throw "Lookup table is malformed";
        }

        var result = '';

        for (var i = 0 ; i < text.length ; i++) {
            var char = text[i];

            var isLowercase = (char === char.toLowerCase());
            if (opts.checkLowercase) {
                char = char.toUpperCase();
            }
            var index = opts.from.indexOf(char);
            if (index === -1) {
                result += char;
            } else {
                if (isLowercase && opts.checkLowercase) {
                    result += opts.to[index].toLowerCase();
                }
                else {
                    result += opts.to[index];
                }
            }
        }

        return result;
    },
    customFunction        : function (text, options) {
        "use strict";
        var opts = extend({}, {
            alphabet          : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            discardNonAlphabet: true,
            transform         : function (char, index, opts, text) {
                return char;
            },
            preProcess        : function (text) {
                return text;
            },
            postProcess       : function (text) {
                return text;
            }
        }, options);

        var result = '';

        if (typeof(opts.transform) !== 'function') {
            throw "Transform must be a function.";
        }

        text = opts.preProcess(text);

        for (var i = 0 ; i < text.length ; i++) {
            var char = text[i];

            //keep spaces or other punctuation characters
            if (opts.discardNonAlphabet && opts.alphabet.indexOf(char) === -1) {
                result += char;
                continue;
            }

            result += opts.transform(char, i, opts, text);
        }
        result = opts.postProcess(result);

        return result;
    },
    shiftOptions          : {
        'rot5'         : {
            'alphabet': '0123456789',
            'rotation': 5
        },
        'rot13'        : {
            'alphabet'      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'rotation'      : 13,
            'checkLowercase': true
        },
        'rot47'        : {
            'alphabet': '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~',
            'rotation': 47
        },
        //Caesar cipher
        'caesarEncrypt': {
            'alphabet'      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'rotation'      : 3,
            'checkLowercase': true
        },
        'caesarDecrypt': {
            'alphabet'      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'rotation'      : 23,
            'checkLowercase': true
        }
    },
    substitutionOptions   : {
        //Atbash with latin alphabet
        'atbash'        : {
            'from'          : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            'to'            : 'ZYXWVUTSRQPONMLKJIHGFEDCBA'.split(''),
            'checkLowercase': true
        },
        //keyword cipher with "KRYPTOS" as the keyword
        'keywordEncrypt': {
            'from'          : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            'to'            : 'KRYPTOSABCDEFGHIJLMNQUVWXZ'.split(''),
            'checkLowercase': true
        },
        'keywordDecrypt': {
            'from'          : 'KRYPTOSABCDEFGHIJLMNQUVWXZ'.split(''),
            'to'            : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            'checkLowercase': true
        }
    },
    customFunctionsOptions: {
        //Affine a substitution cipher, but with a mathematical function
        //http://en.wikipedia.org/wiki/Affine_cipher
        affineEncrypt : {
            //a or alfa
            key             : 5,//1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, or 25
            keyInverse      : 21,//modular multiplicative inverse of Key modulo Size
            //b or beta
            shiftMagnitudine: 8,
            size            : 26, //alphabet size, affineKey and affineSize must be coprime
            alphabet        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            transform       : function (latinCharacter, index, opts, text) {
                "use strict";
                if (opts.alphabet.indexOf(latinCharacter) === -1) {
                    return latinCharacter;
                }

                var isLowercase = (latinCharacter === latinCharacter.toLowerCase());
                var asciiOffset = (isLowercase ? 97 : 65);
                var x = (latinCharacter.charCodeAt(0) - asciiOffset);
                //x must be 0-25 because size is 26
                var asciiResult = ((opts.key * x) + opts.shiftMagnitudine) % opts.size;
                return String.fromCharCode(asciiResult + asciiOffset);
            }
        },
        affineDecrypt : {
            key             : 5,//1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, or 25
            keyInverse      : 21,//modular multiplicative inverse of Key modulo Size
            shiftMagnitudine: 8,
            size            : 26, //alphabet size, affineKey and affineSize must be coprime
            alphabet        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            transform       : function (latinCharacter, index, opts, text) {
                "use strict";
                if (opts.alphabet.indexOf(latinCharacter) === -1) {
                    return latinCharacter;
                }

                var isLowercase = (latinCharacter === latinCharacter.toLowerCase());
                var asciiOffset = (isLowercase ? 97 : 65);
                var y = (latinCharacter.charCodeAt(0) - asciiOffset);
                var tmp = (opts.keyInverse * (y - opts.shiftMagnitudine));
                //because modulo in javascript doesn't play well with negative numbers
                //http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving
                var asciiResult = ((tmp % opts.size) + opts.size) % opts.size;
                return String.fromCharCode(asciiResult + asciiOffset);
            }
        },
        //bacon code (is an encoder not a cipher) version 2 (different codes for I&J and U&V
        'baconEncrypt': {
            alphabet          : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            encoding          : [
                'AAAAA', 'AAAAB', 'AAABA', 'AAABB', 'AABAA', 'AABAB', 'AABBA', 'AABBB', 'ABAAA',
                'ABAAB', 'ABABA', 'ABABB', 'ABBAA', 'ABBAB', 'ABBBA', 'ABBBB', 'BAAAA', 'BAAAB',
                'BAABA', 'BAABB', 'BABAA', 'BABAB', 'BABBA', 'BABBB', 'BBAAA', 'BBAAB' ],
            discardNonAlphabet: false,
            transform         : function (latinCharacter, index, opts, text) {
                "use strict";
                latinCharacter = latinCharacter.toUpperCase();
                var indexOf = opts.alphabet.indexOf(latinCharacter);
                if (indexOf === -1) {
                    return '';
                } else {
                    return opts.encoding[indexOf];
                }
            }
        },
        'baconDecrypt': {
            alphabet          : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            encoding          : [
                'AAAAA', 'AAAAB', 'AAABA', 'AAABB', 'AABAA', 'AABAB', 'AABBA', 'AABBB', 'ABAAA',
                'ABAAB', 'ABABA', 'ABABB', 'ABBAA', 'ABBAB', 'ABBBA', 'ABBBB', 'BAAAA', 'BAAAB',
                'BAABA', 'BAABB', 'BABAA', 'BABAB', 'BABBA', 'BABBB', 'BBAAA', 'BBAAB'],
            discardNonAlphabet: false,
            transform         : function (latinCharacter, index, opts, text) {
                "use strict";
                index++;
                if (index % 5 === 0 && index > 1) {
                    var block = text.substr(index - 5, 5);
                    return opts.alphabet[ opts.encoding.indexOf(block)];
                } else {
                    return '';
                }
            },
            preProcess        : function (text) {
                "use strict";
                //current limitation of the implementation, we need only the alphabet
                return text.toUpperCase().replace(/[^A-Z]+/g, '');
            }
        }
    }
};
if (typeof(module) !== 'undefined') {
    module.exports = substitution;
}


//one time pad cipher
//http://en.wikipedia.org/wiki/One-time_pad
//based on
//The Beale Cipher
//http://www.cs.utsa.edu/~wagner/laws/pad.html
//can be used for Stream ciphers too
//http://en.wikipedia.org/wiki/Stream_cipher
//Supports keys smaller then the text too

var oneTimeKey = 'XMCKL';
var oneTimeAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
//var oneTimeNumerics = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

var optsOneTimeEncrypt = {
    'transform': function (latinCharacter, index) {
        "use strict";
        var textNumber = oneTimeAlphabet.indexOf(latinCharacter.toUpperCase());
        var indexInKey = index % oneTimeKey.length;//overflow if used in stream ciphers
        var keyNumber = oneTimeAlphabet.indexOf(oneTimeKey.charAt(indexInKey).toUpperCase());

        return oneTimeAlphabet.charAt((textNumber + keyNumber) % oneTimeAlphabet.length);
    }
};
var optsOneTimeDecrypt = {
    'transform': function (latinCharacter, index) {
        "use strict";
        var textNumber = oneTimeAlphabet.indexOf(latinCharacter.toUpperCase());
        var indexInKey = index % oneTimeKey.length;//overflow if used in stream ciphers
        var keyNumber = oneTimeAlphabet.indexOf(oneTimeKey.charAt(indexInKey).toUpperCase());

        return oneTimeAlphabet.charAt((textNumber - keyNumber) % oneTimeAlphabet.length);
    }
};

//console.log(substitution.customFunction('HELLO', optsOneTimeEncrypt));
//console.log(substitution.customFunction('EQNVZ', optsOneTimeDecrypt));




