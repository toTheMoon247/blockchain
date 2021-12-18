const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');

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

	sign(dataHash) {
		const signature = this.keyPair.sign(dataHash);
		return signature;
	}

	createTransaction(recipient, amount, transactionPool) {
		if (amount > this.balance) {
			console.log(`WALLET: Can not create transaction of ${amount}. 
						The currnet balance in the wallet is ${this.balance}.`);
			return;
		}

		// transctionPool.isContains would be a better name
		let transaction = transactionPool.existingTransaction(this.publicKey);

		if (transaction) {
			transaction.update(this, recipient, amount);
		} else {
			transaction = Transaction.newTransaction(this, recipient, amount);
			transactionPool.updateOrAddTransaction(transaction);
		}

		return transaction;
	}

	// to review: note that address is not in the constructor
	static blockChainWallet() {
		const blockChainWallet = new this();
		blockChainWallet.address = 'blockchain-wallet';
		return blockChainWallet;
	}
}

module.exports = Wallet;