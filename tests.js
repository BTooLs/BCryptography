var extend = require('node.extend');
var test = require('kludjs');
mono = require('./src/monoalphabetic.ciphers.js');

test('Mono shift rot5', function(){
	ok(mono.shift("007", mono.shiftOptions.rot5) == '552', 'Encrypt');
	ok(mono.shift("ABC-abc", mono.shiftOptions.rot5) == 'ABC-abc', 'unaltered');
	ok(mono.shift(mono.shift("007Aa", mono.shiftOptions.rot5), mono.shiftOptions.rot5) == '007Aa', 'encrypt/decrypt');
});

test('Mono shift rot13', function(){
	ok(mono.shift("ROTthirteen", mono.shiftOptions.rot13) == 'EBGguvegrra', 'Encrypt');
	ok(mono.shift("007-&", mono.shiftOptions.rot13) == '007-&', 'unaltered');
	ok(mono.shift(mono.shift("ROTthirteen007", mono.shiftOptions.rot13), mono.shiftOptions.rot13) == 'ROTthirteen007', 'encrypt/decrypt');
});

test('Mono shift rot18', function(){
	var rot18 = function(what){
		return mono.shift(mono.shift(what, mono.shiftOptions.rot5), mono.shiftOptions.rot13);
	};

	ok(rot18("ROTeightTEEN") == 'EBGrvtugGRRA', 'Encrypt letters');
	ok(rot18("077AndL3tters") == '522NaqY8ggref', 'Encrypt mixed');
	ok(rot18("()-&") == '()-&', 'unaltered');
	ok(rot18(rot18("ROTthirteen007")) == 'ROTthirteen007', 'encrypt/decrypt');
});


test('Mono shift rot47', function(){
	ok(mono.shift("Rot47", mono.shiftOptions.rot47) == '#@Ecf', 'Encrypt mixed');
	ok(mono.shift("!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~", mono.shiftOptions.rot47) == 'PQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNO', 'Encrypt ALL ASCII except space');
	ok(mono.shift(mono.shift("Unaltered text 01", mono.shiftOptions.rot47), mono.shiftOptions.rot47) == 'Unaltered text 01', 'encrypt/decrypt');
});

test('Mono shift caesar', function(){
	ok(mono.shift("Ale Caesar", mono.shiftOptions.caesarEncrypt) == 'Doh Fdhvdu', 'Encrypt');
	ok(mono.shift("Doh Fdhvdu", mono.shiftOptions.caesarDecrypt) == 'Ale Caesar', 'Decrypt');
	ok(mono.shift("00 7.", mono.shiftOptions.caesarEncrypt) == '00 7.', 'unaltered');
	ok(mono.shift(mono.shift("007AaZz", mono.shiftOptions.caesarEncrypt), mono.shiftOptions.caesarDecrypt) == '007AaZz', 'encrypt/decrypt');
});

//
//console.log(mono.substitution('NLMVB', mono.substitutionOptions.atbash));
//console.log(mono.substitution('DGHVETPSTBMIHVTL', mono.substitutionOptions.keyword));

