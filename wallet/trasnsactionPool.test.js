const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', () => {
    let tp, wallet, transaction;

    beforeEach(() => {
        tp = new TransactionPool(); 
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, 'r4nd-4ddr355', 30);
        tp.updateOrAddTransaction(transaction);
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
});