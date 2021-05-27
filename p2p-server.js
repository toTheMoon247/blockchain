
const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];


class P2pServer {
	construction(blockchain) {
		this.blockchain = blockchain;
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
	}

}

module.exports = P2pServer;