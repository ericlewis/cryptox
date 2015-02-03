"use strict";

var moment = require("moment");
var BITSTAMP = require('bitstamp');

var util = require("./util"); //custom functions

function Bitstamp (options) {
    var bitstampPublic, bitstampPrivate;
    var self = this;
    self[options] = options;

    bitstampPublic = new BITSTAMP();
    if (typeof options["key"] === "string" && typeof options["secret"] === "string" && typeof options.username === "string") {
        bitstampPrivate = new BITSTAMP(options.key, options.secret, options.username);
    } else {
        bitstampPrivate = bitstampPublic;
    }

    self.getTicker = function (options, callback) {
        // https://www.bitstamp.net/api/ticker/
        var ticker, data;
        bitstampPublic.ticker(function(err, bitstampTicker) {
            if (err) {
                ticker = {
                    timestamp: util.timestampNow(),
                    error: err.message,
                    data: []
                }
            } else {
                ticker = {
                    timestamp: util.timestamp(bitstampTicker.timestamp),
                    error: "",
                    data: []
                };
                data = {
                    pair: self.properties.markets[0].pair,
                    last: parseFloat(bitstampTicker.last),
                    bid: parseFloat(bitstampTicker.bid),
                    ask: parseFloat(bitstampTicker.ask),
                    volume: parseFloat(bitstampTicker.volume),
                    high: parseFloat(bitstampTicker.high),
                    low: parseFloat(bitstampTicker.low),
                    vwap: parseFloat(bitstampTicker.vwap)
                };
                ticker.data.push(data);
            }
            callback(err, ticker);
        })
    }

    self.getOrderBook = function (options, callback) {
        var orderBook, data;
        bitstampPublic.order_book(function (err, bitstampOrderBook) {
            https://www.bitstamp.net/api/order_book/
            var price, volume, order;
            if (err) {
                orderBook = {
                    timestamp: util.timestampNow(),
                    error: err.message,
                    data: []
                }
            } else {
                orderBook = {
                    timestamp: util.timestamp(bitstampOrderBook.timestamp),
                    error: "",
                    data: []
                };
                data = {
                    pair: self.properties.markets[0].pair,
                    asks: [],
                    bids: []
                };
                orderBook.data.push(data);
                bitstampOrderBook.asks.forEach(function (element, index, asks) {
                    price = parseFloat(asks[index][0]);
                    volume = parseFloat(asks[index][1]);
                    order = new Array(price, volume);
                    orderBook.data[0].asks.push(order);
                });
                bitstampOrderBook.bids.forEach(function (element, index, asks) {
                    price = parseFloat(asks[index][0]);
                    volume = parseFloat(asks[index][1]);
                    order = new Array(price, volume);
                    orderBook.data[0].bids.push(order);
                });
            }
            callback(err, orderBook);
        });
    }

    self.getTrades = function (options, callback) {
        var trades;
        var err = new Error("Method not implemented")
        trades = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, trades);
    }

    self.getFee = function (options, callback) {
        var fee;
        var err = new Error("Method not implemented")
        fee = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, fee);
    }

    self.getTransactions = function (options, callback) {
        var transactions;
        var err = new Error("Method not implemented")
        transactions = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, transactions);
    }

    self.getBalance = function (options, callback) {
        var balance;
        var err = new Error("Method not implemented")
        balance = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, balance);
    }

    self.getOpenOrders = function (options, callback) {
        var openOrders;
        var err = new Error("Method not implemented")
        openOrders = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, openOrders);
    }

    self.postSellOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented")
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, orderResult);
    }

    self.postBuyOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented")
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, orderResult);
    }

    self.cancelOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented")
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, orderResult);
    }
}

Bitstamp.prototype.properties = {
    name: "Bitstamp",              // Proper name of the exchange/provider
    slug: "bitstamp",               // slug name of the exchange. Needs to be the same as the .js filename
    markets: [                  // all allowed currency/asset combinatinos (pairs) that form a market
        {
            pair: "USDBTC"
        }
    ],
    publicAPI: {
        supported: true,            // is public API (not requireing user authentication) supported by this exchange?
        requires: []                // required parameters
    },
    privateAPI: {
        supported: true,            // is public API (requireing user authentication) supported by this exchange?
        requires: ["key", "secret", "username"]
    },
    marketOrder: false,             // does it support market orders?
    infinityOrder: false,           // does it supports infinity orders?
                                    // (which means that it will accept orders bigger then the current balance and order at the full balance instead)
    monitorError: "",               //if not able to monitor this exchange, please set it to an URL explaining the problem
    tradeError: "",                  //if not able to trade at this exchange, please set it to an URL explaining the problem
}

module.exports = Bitstamp;