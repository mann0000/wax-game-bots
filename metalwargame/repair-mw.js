// This script looks for all your MW units fully damaged and repair them
// In order to work, that script needs: a Wax account, its private key, some MW units fully damaged and MWM
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

// Tables for all units
var hamsters = [];
var elephantors = [];
var wolves = [];
var ants = [];
var skunks = [];
var racoons = [];

request.post({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://intapi.wax.cryptolions.io/v1/chain/get_table_rows',
  body:    JSON.stringify(payload)
}, function(error, response, body){
var data = JSON.parse(body);

for(item in data.rows){
	console.log(data.rows[item].hp);
	
	if(data.rows[item].name == "Hamster" && data.rows[item].hp == 0){
		hamsters.push(data.rows[item].asset_id);
	}; 
	if(data.rows[item].name == "Elephantor" && data.rows[item].hp == 0){
		elephantors.push(data.rows[item].asset_id);
	};
	if(data.rows[item].name == "Wolf" && data.rows[item].hp == 0){
		wolves.push(data.rows[item].asset_id);
	};
	if(data.rows[item].name == "Ant" && data.rows[item].hp == 0){
		ants.push(data.rows[item].asset_id);
	};
	if(data.rows[item].name == "Racoon" && data.rows[item].hp == 0){
		racoons.push(data.rows[item].asset_id);
	};
	if(data.rows[item].name == "Skunk" && data.rows[item].hp == 0){
		skunks.push(data.rows[item].asset_id);
	};
}


for(i in wolves){

(async () => {
	await api.transact({
		actions: [{
			account: 'metalwarmint',
			name: 'transfer',
			authorization: [{
				actor: 'yourAccount', //replace the string accordingly with your Wax account
				permission: 'active',
			}],
			data: {
				from:'yourAccount', //replace the string accordingly with your Wax account
				memo:"repair:"+wolves[i],
				quantity:"125 MWM",
				to:"metalwargame"
			}
		}]
	}, {
		blocksBehind: 3,
		expireSeconds: 120,
	});
})().catch(err => console.log(err));
};

for(i in skunks){

(async () => {
	await api.transact({
		actions: [{
			account: 'metalwarmint',
			name: 'transfer',
			authorization: [{
				actor: 'yourAccount', //replace the string accordingly with your Wax account
				permission: 'active',
			}],
			data: {
				from:'yourAccount', //replace the string accordingly with your Wax account
				memo:"repair:"+skunks[i],
				quantity:"200 MWM",
				to:"metalwargame"
			}
		}]
	}, {
		blocksBehind: 3,
		expireSeconds: 120,
	});
})().catch(err => console.log(err));
};

for(i in racoons){

(async () => {
	await api.transact({
		actions: [{
			account: 'metalwarmint',
			name: 'transfer',
			authorization: [{
				actor: 'yourAccount', //replace the string accordingly with your Wax account
				permission: 'active',
			}],
			data: {
				from:'yourAccount', //replace the string accordingly with your Wax account
				memo:"repair:"+racoons[i],
				quantity:"300 MWM",
				to:"metalwargame"
			}
		}]
	}, {
		blocksBehind: 3,
		expireSeconds: 120,
	});
})().catch(err => console.log(err));
};

for(i in ants){

(async () => {
	await api.transact({
		actions: [{
			account: 'metalwarmint',
			name: 'transfer',
			authorization: [{
				actor: 'yourAccount', //replace the string accordingly with your Wax account
				permission: 'active',
			}],
			data: {
				from:'yourAccount', //replace the string accordingly with your Wax account
				memo:"repair:"+ants[i],
				quantity:"200 MWM",
				to:"metalwargame"
			}
		}]
	}, {
		blocksBehind: 3,
		expireSeconds: 120,
	});
})().catch(err => console.log(err));
};

for(i in elephantors){

(async () => {
	await api.transact({
		actions: [{
			account: 'metalwarmint',
			name: 'transfer',
			authorization: [{
				actor: 'nfttreasury2',
				permission: 'active',
			}],
			data: {
				from:'yourAccount', //replace the string accordingly with your Wax account
				memo:"repair:"+elephantors[i],
				quantity:"450 MWM",
				to:"metalwargame"
			}
		}]
	}, {
		blocksBehind: 3,
		expireSeconds: 120,
	});
})().catch(err => console.log(err));
};

for(i in hamsters){

(async () => {
	await api.transact({
		actions: [{
			account: 'metalwarmint',
			name: 'transfer',
			authorization: [{
				actor: 'yourAccount', //replace the string accordingly with your Wax account
				permission: 'active',
			}],
			data: {
				from:'yourAccount', //replace the string accordingly with your Wax account
				memo:"repair:"+hamsters[i],
				quantity:"400 MWM",
				to:"metalwargame"
			}
		}]
	}, {
		blocksBehind: 3,
		expireSeconds: 120,
	});
})().catch(err => console.log(err));
};



});
