var sub = require('./../src/substitution.ciphers.js');

test('Mono shift rot5', function () {
    ok(sub.shift("007", sub.shiftOptions.rot5) === '552', 'Encrypt');
    ok(sub.shift("ABC-abc", sub.shiftOptions.rot5) === 'ABC-abc', 'unaltered');
    ok(sub.shift(sub.shift("007Aa", sub.shiftOptions.rot5), sub.shiftOptions.rot5) === '007Aa',
       'encrypt/decrypt');
});

test('Mono shift rot13', function () {
    ok(sub.shift("ROTthirteen", sub.shiftOptions.rot13) === 'EBGguvegrra', 'Encrypt');
    ok(sub.shift("007-&", sub.shiftOptions.rot13) === '007-&', 'unaltered');
    ok(sub.shift(sub.shift("ROTthirteen007", sub.shiftOptions.rot13),
                 sub.shiftOptions.rot13) === 'ROTthirteen007', 'encrypt/decrypt');
});

test('Mono shift rot18', function () {
    var rot18 = function (what) {
        return sub.shift(sub.shift(what, sub.shiftOptions.rot5), sub.shiftOptions.rot13);
    };

    ok(rot18("ROTeightTEEN") === 'EBGrvtugGRRA', 'Encrypt letters');
    ok(rot18("077AndL3tters") === '522NaqY8ggref', 'Encrypt mixed');
    ok(rot18("()-&") === '()-&', 'unaltered');
    ok(rot18(rot18("ROTthirteen007")) === 'ROTthirteen007', 'encrypt/decrypt');
});


test('Mono shift rot47', function () {
    ok(sub.shift("Rot47", sub.shiftOptions.rot47) === '#@Ecf', 'Encrypt mixed');
    ok(sub.shift("!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
                 sub.shiftOptions.rot47) === 'PQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNO',
       'Encrypt ALL ASCII except space');
    ok(sub.shift(sub.shift("Unaltered text 01", sub.shiftOptions.rot47),
                 sub.shiftOptions.rot47) === 'Unaltered text 01', 'encrypt/decrypt');
});

test('Mono shift caesar', function () {
    ok(sub.shift("Ale Caesar", sub.shiftOptions.caesarEncrypt) === 'Doh Fdhvdu', 'Encrypt');
    ok(sub.shift("Doh Fdhvdu", sub.shiftOptions.caesarDecrypt) === 'Ale Caesar', 'Decrypt');
    ok(sub.shift("00 7.", sub.shiftOptions.caesarEncrypt) === '00 7.', 'unaltered');
    ok(sub.shift(sub.shift("007AaZz", sub.shiftOptions.caesarEncrypt),
                 sub.shiftOptions.caesarDecrypt) === '007AaZz', 'encrypt/decrypt');
});

//checked with http://rumkin.com/tools/cipher/atbash.php
test('Mono substitution AtBash', function () {
    ok(sub.lookupTable("MONEY", sub.substitutionOptions.atbash) === 'NLMVB', 'Encrypt');
    ok(sub.lookupTable("NLMVB", sub.substitutionOptions.atbash) === 'MONEY', 'Decrypt');
    ok(sub.lookupTable("small caps", sub.substitutionOptions.atbash) === 'hnzoo xzkh', 'Lowercase');
});

//double checked with http://www.braingle.com/brainteasers/codes/keyword.php
test('Mono substitution keyword', function () {
    ok(sub.lookupTable("MONEY", sub.substitutionOptions.keywordEncrypt) === 'FHGTX', 'Encrypt');
    ok(sub.lookupTable("FHGTX", sub.substitutionOptions.keywordDecrypt) === 'MONEY', 'Decrypt');
    ok(sub.shift("00 7.", sub.substitutionOptions.keywordDecrypt) === '00 7.', 'unaltered');
    ok(sub.lookupTable("small caps", sub.substitutionOptions.keywordEncrypt) === 'mfkee ykim', 'Lowercase encrypt');
    ok(sub.lookupTable("mfkee ykim", sub.substitutionOptions.keywordDecrypt) === 'small caps', 'Lowercase decrypt');
});


test('Mono substitution affine', function () {
    ok(sub.customFunction("AFFINECIPHER", sub.customFunctionsOptions.affineEncrypt) === 'IHHWVCSWFRCP', 'Encrypt');
    ok(sub.customFunction("IHHWVCSWFRCP", sub.customFunctionsOptions.affineDecrypt) === 'AFFINECIPHER', 'Decrypt');
    ok(sub.customFunction("affine small.", sub.customFunctionsOptions.affineEncrypt) === 'ihhwvc uqill.',
       'Lowercase encrypt');
    ok(sub.customFunction("ihhwvc uqill.", sub.customFunctionsOptions.affineDecrypt) === 'affine small.',
       'Lowercase decrypt');
});

test('Poly substitution Bacon', function () {
    ok(sub.customFunction("BACON", sub.customFunctionsOptions.baconEncrypt) === 'AAAABAAAAAAAABAABBBAABBAB', 'Encrypt');
    ok(sub.customFunction("AAAABAAAAAAAABAABBBAABBAB", sub.customFunctionsOptions.baconDecrypt) === 'BACON', 'Decrypt');
    ok(sub.customFunction("issmall", sub.customFunctionsOptions.baconEncrypt) === 'ABAAABAABABAABAABBAAAAAAAABABBABABB',
       'Lowercase encrypt');
});





