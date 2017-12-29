'use strict';

let moment = require('moment');
let CoinMarketCap = require('node-coinmarketcap');
let coinmarketcap = new CoinMarketCap();
let util = require('./util'); //custom functions

function cmc(options) {
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
				rate.error = err.message;
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
		coinmarketcap.get(
			options.pair
				.replace('BTC_USD', 'bitcoin')
				.replace('LTC_USD', 'litecoin')
				.replace('XRP_USD', 'ripple')
				.replace('ETH_USD', 'ethereum'),
			coin => {
				let ticker = {
					timestamp: util.timestampNow(),
					error: '',
					data: [],
				};

				if (!coin) {
					ticker.error = 'not found';
					return callback(ticker.error, ticker);
				}

				let data = {
					pair: options.pair,
					last: coin.price_usd,
				};
				ticker.data.push(data);
				callback(null, ticker);
			},
		);
	};
}

cmc.prototype.properties = {
	name: 'CoinMarketCap', // Proper name of the exchange/provider
	slug: 'coinmarketcap', // slug name of the exchange. Needs to be the same as the .js filename
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

module.exports = cmc;
