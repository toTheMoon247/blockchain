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

    describe('calculating the balance', () => {
        let addBalance, repeatAdd, senderWallet;

        beforeEach(() => {
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;

            for (let i = 0; i < repeatAdd; i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
            }
            bc.addBlock(tp.transactions);
        });

        it('calculates the balance for blockchain transactions matching the recipient', () => {
            expect(wallet.calculateBalance(bc)).toEqual(500 + (addBalance * repeatAdd));
        });

        it('calculate the balalcnce for blockchain transactions matching the sender', () => {
            expect(senderWallet.calculateBalance(bc)).toEqual(500 - (addBalance * repeatAdd));
        });

        describe('and the recipient makes a transaction aftert he got the sender transaction', () => {
            let substractBalance, recipientBalance;

            beforeEach(() => {
                tp.clear();
                substractBalance = 60;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey, substractBalance, bc, tp);
                bc.addBlock(tp.transactions);
            }); 

            describe('and the sender sends another transaction to the recipient', () => {
                beforeEach(() => {
                    tp.clear();
                    senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
                    bc.addBlock(tp.transactions);
                });

                it('calculate the recipient balance only using transactions since its most recent one', () => {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - substractBalance + addBalance);
                });
            });
        });
    });
});