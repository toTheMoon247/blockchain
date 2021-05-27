const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
	let bc;

	beforeEach( () => {
		bc = new Blockchain();
	});

	it('start with genesis block first', () => {
		expect(bc.chain[0]).toEqual(Block.genesis());
	});

	it('add a new block test', () => {
		const data = 'testData';
		bc.addBlock(data);

		expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
	});
});