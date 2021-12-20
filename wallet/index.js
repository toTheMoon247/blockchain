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

	createTransaction(recipient, amount, blockchain, transactionPool) {
		this.balance = this.calculateBalance(blockchain);

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

	// TODO: refactor me
	calculateBalance(blockchain) {
		// find the last transaction
		// get balance after the last transaction (that was made by this wallet)
		// find all the money that was sent to this wallet, after the last transactions
		// balance = (balance right after the last transaction made by this wallet) + (any coins that were sent since then)
		let balance  = this.balance;
		let transactions = [];

		// TODO: REFACTOR ME. should be blockchain.chain.getTransactions or something similiar
		blockchain.chain.forEach(block => block.data.forEach(transaction => {
			transactions.push(transaction);
		}));

		let startTime = 0;

		// TODO: Refactor me please - this bit should be balance = wallet.getLastSentTransaction.outputs.find ...
		const transactionsSentByThisWallet = transactions.filter(transaction => transaction.input.address === this.publicKey);
		if (transactionsSentByThisWallet.length > 0) {
			const lastTransactionSentByThisWallet = transactionsSentByThisWallet.reduce((prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current);
			const outputAfterLastTransactionMadeByThisWallet = lastTransactionSentByThisWallet.outputs.find(output => output.address === this.publicKey).amount;
			balance = outputAfterLastTransactionMadeByThisWallet;
			startTime = lastTransactionSentByThisWallet.input.timestamp;
		}

		transactions.forEach(transaction => {
			if (transaction.input.timestamp > startTime)
				transaction.outputs.find(output => {
					if (output.address === this.publicKey) {
						balance += output.amount;
					}
				});
		});

		return balance;
	}

	// to review: note that address is not in the constructor
	static blockChainWallet() {
		const blockChainWallet = new this();
		blockChainWallet.address = 'blockchain-wallet';
		return blockChainWallet;
	}
}

module.exports = Wallet;