// This script looks for all your MW units staked and send them mining or raiding if they are available
// In order to work, that script needs: a Wax account, its private key and some MW units
// Author: mann000 <t.me/mann0000>, tips appreciated (dsnqy.wam) 

const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');// development only
const fetch = require('node-fetch'); //node only
const { TextDecoder, TextEncoder } = require('util'); //node only

const privateKeys = ["XXXXX"]; // <- put your key here
const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc("https://wax.greymass.com", { fetch }); //required to read blockchain state
const api = new Api({
	rpc,
	signatureProvider,
	textDecoder: new TextDecoder(),
	textEncoder: new TextEncoder(),
}); //required to submit transactions

var request = require('request');

// Request loading all staked units
const payload = {"json":true,"code":"metalwargame","scope":"metalwargame","table":"units","lower_bound":"nfttreasury2","upper_bound":"nfttreasury2","index_position":2,"key_type":"i64","limit":10000,"reverse":true,"show_payer":false};

var units = [];// offensive units ID go here
var miners = [];// hamster go there 

request.post({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://intapi.wax.cryptolions.io/v1/chain/get_table_rows',
  body:    JSON.stringify(payload)
}, function(error, response, body){
var data = JSON.parse(body);

for(item in data.rows){// Filtering all units
	console.log(data.rows[item].asset_id,data.rows[item].name, Number(data.rows[item].next_availability) * 1000, Date.now());
	
	if(data.rows[item].name == "Hamster" && Number(data.rows[item].next_availability) * 1000 < Date.now()){
		miners.push(data.rows[item].asset_id);
	}; 
	if(data.rows[item].name != "Hamster" && Number(data.rows[item].next_availability) * 1000 < Date.now()){
		units.push(data.rows[item].asset_id);
	};
}

console.log(units, miners);

for(unit in units){
	var now = Date.now();
var nonce = String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10));
var sign = String(now) + nonce;// the signature is current date (Unix timestamp format + a nonce)


(async () => {// Make the raid transaction
	await api.transact({
		actions: [{
			account: 'metalwargame',
			name: 'pveraid2',
			authorization: [{
				actor: 'yourAccount', //replace the string accordingly with your Wax account
				permission: 'active',
			}],
			data: {
				asset_id: units[unit],
				asset_owner: 'yourAccount', //replace the string accordingly with your Wax account
				signing_value: sign
			}
		}]
	}, {
		blocksBehind: 3,
		expireSeconds: 120,
	});
})().catch(err => {
	console.log(err.json.error.details[0].message);
	
});
};
for(unit in miners){// Make the mine transaction
	var now = Date.now();
var nonce = String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10)) + String(Math.floor(Math.random() * 10));
var sign = String(now) + nonce;


(async () => {
	await api.transact({
		actions: [{
			account: 'metalwargame',
			name: 'pvemine2',
			authorization: [{
				actor: 'yourAccount', //replace the string accordingly with your Wax account
				permission: 'active',
			}],
			data: {
				asset_id: miners[unit],
				asset_owner: 'yourAccount', //replace the string accordingly with your Wax account
				signing_value: sign
			}
		}]
	}, {
		blocksBehind: 3,
		expireSeconds: 120,
	});
})().catch(err => {
	console.log(err.json.error.details[0].message);
});
};

});