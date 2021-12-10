const debug = require('debug')('debug');
const Wallet = require('./wallet');
const wallet = new Wallet();

debug(wallet.toString());