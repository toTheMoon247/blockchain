const ChainUtil = require('../chain-util');

class Block {
	constructor(timestamp, lastHash, hash, data) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
	}

	toString() {
		return `Block 
		timestamp: ${this.timestamp} 
		lastHash: ${this.lastHash.substring(0, 10)}
		hash: ${this.hash.substring(0, 10)}
		data: ${this.data}`;
	}

	static genesis() {
		return new this('genesis time', '----', 'fir57-h45h', []);
	}

	static mineBlock(lastBlock, data) {
		const timestamp = Date.now();
		const lastHash = lastBlock.hash;
		const hash = Block.hash(timestamp, lastHash, data);

		return new this(timestamp, lastHash, hash, data);
	}

	static hash(timestamp, lastHash, data) {
		return ChainUtil.hash(`${timestamp}${lastHash}${data}`).toString();
	}

	// blockHash recieves a block, extract its components and return the hash that they should generates.
	static blockHash(block) {
		const { timestamp, lastHash, data } = block;
		return Block.hash(timestamp, lastHash, data);
	}
}

module.exports = Block;