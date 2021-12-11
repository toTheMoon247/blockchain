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
}

module.exports = TransactionPool;