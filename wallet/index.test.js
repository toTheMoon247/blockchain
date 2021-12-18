const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain')


describe('Wallet', () => {
    let wallet, tp, bc;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Blockchain();
    });

    describe('is creating a transaction', () => {
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 50;
            recipient = 'r4ad0m-4ddr355';
            transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
        });

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, bc, tp);
            });

            it('doubles the `sendAmount` subtracted from the wallet balance', () => {
                const outputDesignatedForTheSender = transaction.outputs.find(output => output.address === wallet.publicKey);
                expect(outputDesignatedForTheSender.amount).toEqual(wallet.balance - sendAmount * 2);
            });

            it('clones the `sendAmount` output for the recipient', () => {
                const outputsDesignatedForTheRecipient = transaction.outputs.filter(output => output.address === recipient);
                const recipientAmounts = outputsDesignatedForTheRecipient.map(output => output.amount);
                expect(recipientAmounts).toEqual([sendAmount, sendAmount]);
            });
        });
    });
});