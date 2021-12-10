const ChainUtil = require('../chain-util');

class Wallet {
	constructor() {
		this.balance = 500; // TODO: change to INITIAL_BALANCE and export to config
		
		// creating a key pair based on Elliptic Cryptography secp256K1 algorithm
		this.keyPair = ChainUtil.genKeyPair();
		
		this.publicKey = this.keyPair.getPublic().encode('hex');
	}

	toString() {
		return `Wallet:
			publicKey: ${this.publicKey.toString()}
			balance: ${this.balance}`;
	}
}

module.exports = Wallet;