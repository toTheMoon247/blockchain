const Transaction = require('./transaction');
const Wallet = require('./index');
const { newTransaction } = require('./transaction');

describe('Transaction', () => {
	let trnasaction, wallet, recipient, amount;

	beforeEach(() => {
		wallet = new Wallet();
		amount = 50;
		recipient = 'r3c1p13nt';
		transaction = Transaction.newTransaction(wallet, recipient, amount);
	});

	// we check that the transaction for the sender wallet equals to the expected amount
	it('out the `amount` subtracted from the wallet ballance', () => {
		expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
			.toEqual(wallet.balance - amount);
	});

	it('out the `amount` added to the recipient wallet', () => {
		expect(transaction.outputs.find(output => output.address === recipient).amount)
			.toEqual(amount);
	});

	describe('trying to execute transaction with insufficient funds', () => {
		beforeEach(() => {
			amount = 50000;
			transaction = Transaction.newTransaction(wallet, recipient, amount);
		});

		it('should not execute the transaction', () => {
			expect(transaction).toEqual(undefined);
		})
	});
});