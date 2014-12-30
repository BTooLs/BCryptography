if (typeof(require) !== 'undefined'){
	var extend = require('node.extend');
}

var monoalphabetic = {
	/**
	 * Basic substitution rotation algorithm.
	 * Can be used for Caesar cypher, ROT13, ROT5 etc.
	 * @param text
	 * @param options
	 * @returns string The ciphered text.
	 */
	shift: function(text, options){
		var opts = extend({}, {
			'rotation': 13,
			'alphabet': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
		}, options);

		if (opts.rotation >= opts.alphabet.length){
			throw "Not yet supported";
		}
		var lookupTable = '';

		for(var index = 0 ; index < opts.alphabet.length ; index++){

			var rotatedIndex = index+opts.rotation;
			if (rotatedIndex >= opts.alphabet.length){
				rotatedIndex = rotatedIndex - opts.alphabet.length;
			}

			lookupTable += opts.alphabet[rotatedIndex];
		}

		return this.substitution(text, extend({}, {
			'from': opts.alphabet.split(''),
			'to': lookupTable.split('')
		}, opts));
	},
	substitution: function(text, options){
		var opts = extend({}, {
			'from': ['A','B', 'C'],
			'to': ['1', '2', '3'],
			'checkLowercase': false
		}, options);

		if (opts.from.length !== opts.to.length){
			throw "Lookup table is malformed";
		}

		var result = '';

		for(var i = 0 ; i < text.length ; i++){
			var char = text[i];

			var isLowercase = (char == char.toLowerCase());
			if (opts.checkLowercase)
				char = char.toUpperCase();
			var index = opts.from.indexOf(char);
			if (index === -1) {
				result += char;
			} else {
				if (isLowercase && opts.checkLowercase)
					result += opts.to[index].toLowerCase();
				else
					result += opts.to[index];
			}
		}

		return result;
	},
	customFunction: function(text, options){
		var opts = extend({}, {
			"transform": function(char, index){return char;},
			'unaltered': [' ', '.']
		}, options);

		var result = '';

		if (typeof(opts.transform) !== 'function'){
			throw "Transform must be a function.";
		}

		for(var i = 0 ; i < text.length ; i++) {
			var char = text[i];

			//keep spaces or other punctuation characters
			if (opts.unaltered.indexOf(char) > -1){
				result += char;
				continue;
			}

			result += opts.transform(char, i);
		}

		return result;
	},
	//sequence of characters based on a single
	generateKeyBasedOnASeed: function(){

	},
	shiftOptions: {
		'rot5': {
			'alphabet': '0123456789',
			'rotation': 5
		},
		'rot13': {
			'alphabet': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			'rotation': 13,
			'checkLowercase': true
		},
		'rot47': {
			'alphabet': '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~',
			'rotation': 47
		},
		//Caesar cipher
		'caesarEncrypt': {
			'alphabet': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			'rotation': 3,
			'checkLowercase': true
		},
		'caesarDecrypt': {
			'alphabet': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			'rotation': 23,
			'checkLowercase': true
		}
	},
	substitutionOptions: {
		//Atbash with latin alphabet
		'atbash': {
			'from': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
			'to': 'ZYXWVUTSRQPONMLKJIHGFEDCBA'.split('')
		},
		//keyword cipher with "KRYPTOS" as the keyword
		'keyword': {
			'from': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
			'to': 'KRYPTOSABCDEFGHIJLMNQUVWXZ'.split('')
		}
	}
};

if (typeof(module) !== 'undefined'){
	module.exports = monoalphabetic;
}

//affine encrypt
var affineKey = 5;//1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, or 25
var affineKeyInverse = 21;//modular multiplicative inverse of Key modulo Size
var affineShiftMagnitudine = 8;
var affineSize = 26; //alphabet size, affineKey and affineSize must be coprime
var optsAffineEncrypt = {
	'transform': function(latinCharacter){
		var x = (latinCharacter.toUpperCase().charCodeAt(0) - 65);
		var asciiResult = ((affineKey * x) + affineShiftMagnitudine) % affineSize;

		return String.fromCharCode(asciiResult + 65)
 	}
};
var optsAffineDecrypt = {
	'transform': function(latinCharacter){
		var y = (latinCharacter.toUpperCase().charCodeAt(0) - 65);
		var tmp = (affineKeyInverse * (y - affineShiftMagnitudine));
		//because modulo in javascript doesn't play well with negative numbers
		//http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving
		var asciiResult = ((tmp % affineSize) + affineSize) % affineSize;
		return String.fromCharCode(asciiResult + 65)
	}
};

//console.log(monoalphabetic.customFunction('AFFINECIPHER', optsAffineEncrypt));
//console.log(monoalphabetic.customFunction('IHHWVCSWFRCP', optsAffineDecrypt));



//one time pad cipher
//http://en.wikipedia.org/wiki/One-time_pad
//based on
//The Beale Cipher
//http://www.cs.utsa.edu/~wagner/laws/pad.html
//can be used for Stream ciphers too
//http://en.wikipedia.org/wiki/Stream_cipher

var oneTimeKey = 'XMCKL';
var oneTimeAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
//var oneTimeNumerics = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

var optsOneTimeEncrypt = {
	'transform': function(latinCharacter, index){
		var textNumber = oneTimeAlphabet.indexOf(latinCharacter.toUpperCase());
		var indexInKey = index % oneTimeKey.length;//overflow if used in stream ciphers
		var keyNumber = oneTimeAlphabet.indexOf(oneTimeKey.charAt(indexInKey).toUpperCase());

		return oneTimeAlphabet.charAt( (textNumber + keyNumber) % oneTimeAlphabet.length);
	}
};
var optsOneTimeDecrypt = {
	'transform': function(latinCharacter, index){
		var textNumber = oneTimeAlphabet.indexOf(latinCharacter.toUpperCase());
		var indexInKey = index % oneTimeKey.length;//overflow if used in stream ciphers
		var keyNumber = oneTimeAlphabet.indexOf(oneTimeKey.charAt(indexInKey).toUpperCase());

		return oneTimeAlphabet.charAt( (textNumber - keyNumber) % oneTimeAlphabet.length);
	}
};

//console.log(monoalphabetic.customFunction('HELLO', optsOneTimeEncrypt));
//console.log(monoalphabetic.customFunction('EQNVZ', optsOneTimeDecrypt));


