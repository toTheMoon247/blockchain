
const debug = require('debug')('info');
const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];


class P2pServer {
	constructor(blockchain, transactionPool) {
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.sockets = [];
	}

	// this is init() of the network
	listen() {
		const server = new Websocket.Server({ port: P2P_PORT });
		// the callback function will add the socket to p2pServer.sockets.
		server.on('connection', socket => this.connectSocket(socket));

		this.connectToPeers();

		console.log(`info: listening for peer-to-peer connection on ${P2P_PORT}`)

	}

	// peer address will look like ws://localhost:5001
	connectToPeers() {
		peers.forEach(peer => {
			const socket = new Websocket(peer);
			socket.on('open', () => this.connectSocket(socket));
		});
	}

	connectSocket(socket) {
		this.sockets.push(socket);
		console.log('** info: Socket connected...')

		this.messageHandler(socket);
		this.sendChain(socket);
	}

	messageHandler(socket) {
		socket.on('message', message => {
			const data = JSON.parse(message);
			debug("data received = ", data);
			switch(data.type) {
				case 'chain':
					this.blockchain.replaceChain(data.chain);
					break;
				case 'transaction':
					this.transactionPool.updateOrAddTransaction(data.transaction);
					break;
				case 'clear_transactions':
					this.transactionPool.clear();
					break;
			}
		});
	}

	// share and set the agreed chain among all the peers of the network
	syncChains() {
		this.sockets.forEach(socket => this.sendChain(socket));
	}

	// Helper
	sendChain(socket) {
		const packet = {
			type: 'chain',
			chain: this.blockchain.chain
		}
		socket.send(JSON.stringify(packet));
	}

	broadcastTransaction(trasnsaction) {
		this.sockets.forEach(socket => this.sendTransaction(socket, trasnsaction));
	}

	broadcastClearTransaction() {
		this.sockets.forEach(socket => socket.send(JSON.stringify(
			{type: 'clear_transactions'}
		)));
	}
	
	sendTransaction(socket, transaction) {
		const packet = {
			type: 'transaction',
			transaction: transaction
		}
		socket.send(JSON.stringify(packet));
	}

}

module.exports = P2pServer;