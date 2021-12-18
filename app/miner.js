const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");

class Miner {
	constructor(blockchain, transactionPool, wallet, p2pServer) {
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		this.p2pServer = p2pServer;
	}

	mine() {
		// grabs transaction from the pool
		const validTransactions = this.transactionPool.validTransactions();
		
		// place reward for the miner
		const reward = Transaction.rewardTransaction(this.wallet, Wallet.blockChainWallet());
		validTransactions.push(reward);
		
		// create a block from the valid transactions
		const block = this.blockchain.addBlock(validTransactions);

		// sync the chain with the new block of transactions
		this.p2pServer.syncChains();
		
		// clear the relevant transactions from the transaction pool 
		this.transactionPool.clear();

		// broadcast other miners to clear the transactions from their pool
		this.p2pServer.broadcastClearTransaction();

		return block;
	}
}

module.exports = Miner;