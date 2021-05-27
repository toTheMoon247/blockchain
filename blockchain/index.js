const Block =  require('./block');

class Blockchain {
	constructor(){
		this.chain = [Block.genesis()];
	}

	addBlock(data) {
		const lastBlock = this.chain[this.chain.length - 1];
		const block = Block.mineBlock(lastBlock, data);
		this.chain.push(block);

		return block;
	}

	getChain() {
		return this.chain;
	}

	isValidChain(chain) {
		if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
			return false;

		for (let i = 1; i < chain.length; i++) {
			const currentBlock = chain[i];
			const lastBlock = chain[i - 1];
			if (currentBlock.lastHash !== lastBlock.hash || currentBlock.hash !== Block.blockHash(currentBlock))
				return false;
		}

		return true;
	}

	replaceChain(newChain) {
		if (newChain.length <= this.chain.length) {
			console.log('** Error: The new chain need to be longer than the current chain...');
			return;
		}

		if (! this.isValidChain(newChain)) {
			console.log('** Error: The new chain is not valid...');
			return;	
		}

		console.log('The new chain is valid. Replacing blockchain with the new chain...');
		this.chain = newChain;

	}
}

module.exports = Blockchain;