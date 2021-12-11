//uuidV1 is now a function that generates id based on timestamps
const uuid = require('uuid');
// EC for Elliptic Cryptography. EC is a class 
const EC = require('elliptic').ec;
// 'secp256K1' is the same algorithm that used by bitcoin. ec now is an instance of EC 
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');


class ChainUtil {
	static genKeyPair() {
		return ec.genKeyPair();
	}

	static id() {
		// return "12345";
		return uuid.v1();
	}

	static hash(data) {
		return SHA256(JSON.stringify(data)).toString();
	}

	// To review
	static verifySignature(publicKey, signature, dataHash) {
		publicKey = ec.keyFromPublic(publicKey, 'hex');
		const isValidSignature = publicKey.verify(dataHash, signature);
		return isValidSignature; 
	}
}

module.exports = ChainUtil;