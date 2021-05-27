const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
	let bc;

	beforeEach( () => {
		bc = new Blockchain();
		another_bc = new Blockchain();
	});

	it('start with genesis block first', () => {
		expect(bc.chain[0]).toEqual(Block.genesis());
	});

	it('add a new block test', () => {
		const data = 'testData';
		bc.addBlock(data);

		expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
	});

	it('validates a valid chain', () => {
		another_bc.addBlock('testData');

		expect(bc.isValidChain(another_bc.chain)).toBe(true);
	});

	it('validates a chain with a corrupt genesis block', () => {
		another_bc.chain[0].data = 'corrupted data';

		expect(bc.isValidChain(another_bc.chain)).toBe(false);
	});

	it('validates a chain with a corrupt block', () => {
		another_bc.addBlock('testData');
		another_bc.chain[1].data = 'corrupted data';

		expect(bc.isValidChain(another_bc.chain)).toBe(false);
	});
});