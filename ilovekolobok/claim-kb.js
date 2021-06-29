// This script finishes all adventures and claim NFT 
// In order to work, that script needs: a Wax account, its private key, some finished adventures
// Author: mann000 <t.me/mann0000>, tips appreciated (dsnqy.wam) 

const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const { TextDecoder, TextEncoder } = require('util'); 

const privateKeys = ["XXXXX"]; // <- put your key here
const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc("https://wax.greymass.com", { fetch }); //required to read blockchain state
const api = new Api({
	rpc,
	signatureProvider,
	textDecoder: new TextDecoder(),
	textEncoder: new TextEncoder(),
}); //required to submit transactions

var payload = {"json":true,"code":"simpleassets","scope":"nfttreasury2","table":"sassets","lower_bound":"","upper_bound":"","index_position":1,"key_type":"i64","limit":1000,"reverse":false,"show_payer":false};



var request = require('request');

// Stake all prizes
request.post({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://intapi.wax.cryptolions.io/v1/chain/get_table_rows',
  body:    JSON.stringify(payload)
}, function(error, response, body){
var data = JSON.parse(body);	
  //console.log(data.rows);
  
  for(item in data.rows){
	  if(data.rows[item].category == "prize"){
		  console.log("ok:", data.rows[item].id);
		  
		  (async () => {

  await api.transact({
    actions: [{
      account: 'simpleassets',
      name: 'transfer',
      authorization: [{
        actor: 'yourAccount',// replace accordingly with your Wax address
        permission: 'active',
      }],
      data: {
		assetids: [data.rows[item].id],  
        from: 'yourAccount',
        to: 's.rplanet',
        memo: 'stake'
      }
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 120,
  });
})();
	  }
  }
});

// Claim Koloboks assets
//https://intapi.wax.cryptolions.io/v1/chain/get_table_rows
var payload = {"json":true,"code":"simpleassets","scope":"simpleassets","table":"offers","table_key":"offeredto","lower_bound":"nfttreasury2","upper_bound":"nfttreasury2a","index_position":3,"key_type":"i64","limit":1000,"reverse":false,"show_payer":false};

// Stake all prizes
request.post({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://intapi.wax.cryptolions.io/v1/chain/get_table_rows',
  body:    JSON.stringify(payload)
}, function(error, response, body){
var data = JSON.parse(body);	
  //console.log(data.rows);
  
  for(item in data.rows){

		  console.log("ok:", data.rows[item].assetid);
		  
		 (async () => {

  await api.transact({
    actions: [{
      account: 'simpleassets',
      name: 'claim',
      authorization: [{
        actor: 'yourAccount',
        permission: 'active',
      }],
      data: {
		assetids: [data.rows[item].assetid],  
        claimer: 'yourAccount'
      }
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 120,
  });
})();
	  
  }
});


(async () => {

  await api.transact({
    actions: [{
      account: 'ilovekolobok',
      name: 'closealladv',
      authorization: [{
        actor: 'nfttreasury2',
        permission: 'active',
      }],
      data: {
		owner: 'nfttreasury2'
      }
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 120,
  });
})();