
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
			'alphabet': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
			'unaltered': [' ', '.']
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

		return this.substitution(text, {
			'from': opts.alphabet.split(''),
			'to': lookupTable.split(''),
			'unaltered': opts.unaltered
		});
	},
	substitution: function(text, options){
		var opts = extend({}, {
			'from': ['A','B', 'C'],
			'to': ['1', '2', '3'],
			'unaltered': [' ', '.']
		}, options);

		if (opts.from.length !== opts.to.length){
			throw "Lookup table is malformed";
		}

		var result = '';

		for(var i = 0 ; i < text.length ; i++){
			var char = text[i];

			//keep spaces or other punctuation characters
			if (opts.unaltered.indexOf(char) > -1){
				result += char;
				continue;
			}

			var index = opts.from.indexOf(char);
			if (index === -1) throw "character not supported " + char;
			result += opts.to[index];
		}

		return result;
	},
	customFunction: function(text, options){
		var opts = extend({}, {
			"transform": function(char){return char;},
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

			result += opts.transform(char);
		}

		return result;
	}
};

var optsRot5 =  {
	'alphabet': '0123456789',
	'rotation': 5
};
var optsRot13 = {
	'alphabet': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	'rotation': 13
};

var optsRot18 = {
	'alphabet': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890',
	'rotation': 18
};

//ROT47
var optsRot47 = {
	'alphabet': '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~',
	'rotation': 47
};

//Caesar cipher, shift of 3, means +23
var optsCaesar = {
	'alphabet': 'abcdefghijklmnopqrstuvwxyz',
	'rotation': 23
};

console.log(monoalphabetic.shift("07", optsRot5));
console.log(monoalphabetic.shift("ROT THIRTEEN", optsRot13));
console.log(monoalphabetic.shift("ROT18", optsRot18));
console.log(monoalphabetic.shift("ROT47", optsRot47));
console.log(monoalphabetic.shift("caesar", optsCaesar));

//Atbash with latin alphabet
var optsAtbash = {
	'from': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
	'to': 'ZYXWVUTSRQPONMLKJIHGFEDCBA'.split('')
};

console.log(monoalphabetic.substitution('NLMVB', optsAtbash));


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

console.log(monoalphabetic.customFunction('AFFINECIPHER', optsAffineEncrypt));
console.log(monoalphabetic.customFunction('IHHWVCSWFRCP', optsAffineDecrypt));
