const debug = require('debug')('info');
const ChainUtil = require('../chain-util');

class Transaction {
	constructor() {
		this.id = ChainUtil.id();
		this.input = null;
		this.outputs = [];
	}

	static newTransaction(senderWallet, recipient, amount) {
		const transaction = new this();
		debug("transaction object is: ", transaction);

		// check that there is enough balance in the wallet
		if (amount > senderWallet.balance) {
			console.log(`Can not send ${amount}. Insufficent balance in the wallet`);
			return;
		}

		// create outputs for the transaction object
		transaction.outputs.push(...[
			{
				amount: senderWallet.balance - amount,
				address: senderWallet.publicKey
			},
			{
				amount: amount,
				address: recipient
			}
		]);

		return transaction;
	}
}

module.exports = Transaction;