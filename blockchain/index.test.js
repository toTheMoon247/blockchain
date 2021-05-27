const Blockchain = require('./index');
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

	it('validates that new valid chain is replaced', () => {
		another_bc.addBlock('newData');
		bc.replaceChain(another_bc.chain);

		expect(bc.chain).toEqual(another_bc.chain);
	});

	it('validate that new chain is not replaced if its shorter or equal', () => {
		// we will add block, to make sure bc is longer than another_bc
		bc.addBlock('newData');
		bc.replaceChain(another_bc.chain);

		expect(bc.chain).not.toEqual(another_bc.chain);
	});
});