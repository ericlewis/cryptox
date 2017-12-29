'use strict';

const moment = require('moment');
const fetch = require('node-fetch');
const util = require('./util'); //custom functions

function coincap(options) {
	let self = this;
	self['options'] = options;

	self.getRate = function(options, callback) {
		self.getTicker(options, function(err, ticker) {
			let rate, data;
			rate = {
				timestamp: util.timestampNow(),
				error: '',
				data: [],
			};
			if (err) {
				rate.error = err;
				return callback(err, rate);
			}
			rate.timestamp = ticker.timestamp;
			data = {
				pair: ticker.data[0].pair,
				rate: ticker.data[0].last,
			};
			rate.data.push(data);
			callback(err, rate);
		});
	};

	self.getTicker = function(options, callback) {
		fetch(`http://coincap.io/page/${options.pair.replace('_USD', '')}`)
			.then(result => {
				let ticker = {
					timestamp: util.timestampNow(),
					error: '',
					data: [],
				};

				let data = {
					pair: options.pair,
					last: coin.price_usd,
				};
				ticker.data.push(data);
				callback(null, ticker);
			})
			.catch(err => {
				let ticker = {
					timestamp: util.timestampNow(),
					error: 'not found',
					data: [],
				};

				ticker.data.push(data);
				callback(ticker.error, ticker);
			});
	};
}

coincap.prototype.properties = {
	name: 'CoinCap', // Proper name of the exchange/provider
	slug: 'coincap', // slug name of the exchange. Needs to be the same as the .js filename
	methods: {
		implemented: ['getRate'],
		notSupported: [
			'getFee',
			'getLendBook',
			'getTicker',
			'getOrderBook',
			'getTrades',
			'getBalance',
		],
	},
	instruments: [
		// all allowed currency/asset combinatinos (pairs) that form a market
		{
			pair: 'BTC_USD',
		},
	],
	publicAPI: {
		supported: true, // is public API (not requireing user authentication) supported by this exchange?
		requires: [], // required parameters
	},
	privateAPI: {
		supported: false, // is public API (requireing user authentication) supported by this exchange?
		requires: [],
	},
	marketOrder: false, // does it support market orders?
	infinityOrder: false, // does it supports infinity orders?
	monitorError: '', //if not able to monitor this exchange, please set it to an URL explaining the problem
	tradeError: '', //if not able to trade at this exchange, please set it to an URL explaining the problem
};

module.exports = coincap;
