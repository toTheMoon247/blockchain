const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', () => {
    let tp, wallet, transaction, bc;

    beforeEach(() => {
        tp = new TransactionPool(); 
        wallet = new Wallet();
        bc = new Blockchain();
        transaction = wallet.createTransaction('r4nd-4ddr355', 30, bc, tp)
    });

    it('it add a transaction to the pool', () => {
        const transactionInThePool = tp.transactions.find(t => t.id === transaction.id);
        expect(transactionInThePool).toEqual(transaction);
    });

    it('updates a transaction in the pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        
        const newTransaction = transaction.update(wallet, 'n3w-4ddr355', 99);
        tp.updateOrAddTransaction(newTransaction);
        const transactionInThePool = tp.transactions.find(t => t.id === newTransaction.id);

        expect(JSON.stringify(transactionInThePool)).not.toEqual(oldTransaction);
    });

    it('clears transactions', () => {
        tp.clear();
        expect(tp.transactions).toEqual([]);
    });

    describe('mixing valid and corrupt transaction', () => {
        let validTransactions;
        
        beforeEach(() => {
            validTransactions = [...tp.transactions];
            for ( i = 0; i < 6; i++) {
                wallet = new Wallet();
                transaction = wallet.createTransaction('r4nd-adr3$$', 30, bc, tp);
                if ( i % 2 == 0)
                    transaction.input.amount = 99999; // corrupt the transaction
                else
                    validTransactions.push(transaction);
            }
        });

        it('shows a difference between valid and corrupt transaction', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs valid transactions', () => {
            expect(tp.validTransactions()).toEqual(validTransactions);
        });
    });
});