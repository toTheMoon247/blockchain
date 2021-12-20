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

	// to review
	it('inputs the balance of the wallet', () => {
		expect(transaction.input.amount).toEqual(wallet.balance);
	});

	// to review
	it('validates a valid transaction', () => {
		expect(Transaction.verifyTransaction(transaction)).toBe(true);
	});

	// to review
	it('not validating a valid transaction', () => {
		// corrupt the amount
		transaction.outputs[0].amount = 50000;
		expect(Transaction.verifyTransaction(transaction)).toBe(false);
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

	describe('updating a transaction', () => {
		let nextAmount, nextRecipient;
		
		beforeEach(() => {
			nextAmount = 20;
			nextRecipient = "n3xt-addr3ss";
			transaction = transaction.update(wallet, nextRecipient, nextAmount);
		});

		it('subtract the next amount from the sender output', () => {
			const senderOutput = transaction.outputs.find(output => output.address === wallet.publicKey);
			expect(senderOutput.amount).toEqual(wallet.balance - amount - nextAmount);
		});

		it('outputs an amount for the next recipient', () => {
			const nextRecipientOutput = transaction.outputs.find(output => output.address === nextRecipient);
			expect(nextRecipientOutput.amount).toEqual(nextAmount);
		});
	});

	describe("creating a reward transaction", () => {
		beforeEach(() => {
			transaction = Transaction.rewardTransaction(wallet, Wallet.blockChainWallet());
		});

		it(`rewards the miner's wallet`, () => {
			// 25 is the mining reward
			expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(25);
		});
	});
});
