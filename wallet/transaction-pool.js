const Transaction = require('../wallet/transaction');

class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);
        if (transactionWithId) {
            const index = this.transactions.indexOf(transactionWithId);
            this.transactions[index] = transaction; 
        } else {
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address) {
        return this.transactions.find(t => t.input.address === address);
    }

    // to review
    // this function returns transactions that meet the following criterias:
    // (1) its total output amount matches the original balance specified in the input amount
    // (2) the signature was validated
    validTransactions() {

        const validTransactions = this.transactions.filter(transaction => {
            const outputTotal = transaction.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0);
            
            if (transaction.input.amount !== outputTotal ) {
                console.log(`invalid transaction from ${transaction.input.address}.`);
                return;
            }
    
            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`invalid signarure from ${transaction.input.address}.`);
                return;
            }
    
            return transaction;
        });

        return validTransactions;
    }

    clear() {
        this.transactions = [];
    }
}

module.exports = TransactionPool;