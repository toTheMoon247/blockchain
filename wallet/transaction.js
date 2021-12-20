const debug = require('debug')('info');
const ChainUtil = require('../chain-util');

class Transaction {
	constructor() {
		this.id = ChainUtil.id();
		this.input = null;
		this.outputs = [];
	}

	// handle new transaction rather a new output object to an existing transaction by the sender.
	// It updates the output and detailing the resulting amount and add a new output for the new recipient
	// It also generates a new signature for the transaction since the data was changes
	update(senderWallet, recipient, amount) {
		const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
		if (amount > senderOutput.amount) {
			console.log(`Can not send ${amount}. Insufficent balance in the wallet`);
			return;
		}

		senderOutput.amount = senderOutput.amount - amount;
		this.outputs.push({
			amount: amount,
			address: recipient
		})

		Transaction.signTransaction(this, senderWallet);
		return this;
	}

	static transactionWithOutputs(senderWallet, outputs) {
		const transaction = new this();
		transaction.outputs.push(...outputs);
		Transaction.signTransaction(transaction, senderWallet);
		return transaction;
	}

	static newTransaction(senderWallet, recipient, amount) {
		
		// check that there is enough balance in the wallet
		if (amount > senderWallet.balance) {
			console.log(`Can not send ${amount}. Insufficent balance in the wallet`);
			return;
		}

		// create outputs for the transaction object
		const outputs = [
			{
				amount: senderWallet.balance - amount,
				address: senderWallet.publicKey
			},
			{
				amount: amount,
				address: recipient
			}
		];

		return Transaction.transactionWithOutputs(senderWallet, outputs);
	}

	static rewardTransaction(minerWallet, blockchainWallet) {
		// 25 is the mining reward. TODO: export it to config 
		const output = [{ amount: 25, address: minerWallet.publicKey}]; 
		return Transaction.transactionWithOutputs(blockchainWallet,output);
	}

	static signTransaction(transaction, senderWallet) {
		transaction.input = {
			timestamp: Date.now(), // miliseconds since 01 January 1970
			amount: senderWallet.balance,
			address: senderWallet.publicKey,
			signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
		}
	}

	static verifyTransaction(transaction) {
		const publicKey = transaction.input.address;
		const signature = transaction.input.signature;
		const hasedData = ChainUtil.hash(transaction.outputs);

		return ChainUtil.verifySignature(publicKey, signature, hasedData);
	}
}

module.exports = Transaction;