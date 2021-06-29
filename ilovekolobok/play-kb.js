// This script looks for all available Koloboks, send them to adventure and breed the remaining Kolos. It also stakes automatically prizes on Rplanet
// In order to work, that script needs: a Wax account, its private key, some Koloboks
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

const request = require("request");

const SLOTS = 5;// input here the number of adventure slots you have

// Current time (epoch), we'll need it for cooldown calculation
const now = Math.round(Date.now() / 1000);

// Custom module with basic functions
const { chunks, makeid, shuffleFisherYates } = require('./utils.js');

request(// get all Koloboks assets (Kolo + prizes)
	"https://wax.simplemarket.io/api/v2/market?skip=0&limit=100&authors=ilovekolobok&owner=nfttreasury2&isMyAssets=true&sortOrder=newest",
	function (error, response, body) {
		let holding = JSON.parse(body);

		let koloboks = [];
		let prizes = [];

		// Sort holdings between Koloboks (breeding / adventure) and prizes (staking)
		for (item in holding.items) {
			if (holding.items[item].category == "kolobok") {
				if(holding.items[item].mdata.cd < now && holding.items[item].mdata.health >= 100){// we only take active and living koloboks
					koloboks.push(holding.items[item].assetId);
				}		
			} else if (holding.items[item].category == "prize") {
				prizes.push(holding.items[item].assetId);
			}
		}
		
		shuffleFisherYates(koloboks);// randomize
		
		console.log(prizes);
		console.log(koloboks);
		
				for(i=0; i<SLOTS; i++){// send Kolo to adventures
			adventure = koloboks[i];
			console.log(adventure);
			(async () => {

  await api.transact({
    actions: [{
      account: 'simpleassets',
      name: 'transfer',
      authorization: [{
        actor: 'yourAccount',
        permission: 'active',
      }],
      data: {
		assetids: [adventure],  
        from: 'yourAccount',// replace accordingly with your Wax address
		memo: 'sendto:'+(Math.floor(Math.random() * 3)+2).toString(),//difficulty goes from 0 to 5, the higher the riskier
        to: 'ilovekolobok'
      }
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 120,
	broadcast: true,
	sign: true
  });
})();
		}
		
		for (couple in chunks(koloboks)) {// breed Kolo
			if (chunks(koloboks)[couple].length == 2) {
				//breed
				var name = makeid(7);// random name string
				var parent1 = chunks(koloboks)[couple][0];
				var parent2 = chunks(koloboks)[couple][1];
				console.log(name, parent1, parent2);
				(async () => {
					await api.transact(
						{
							actions: [
								{
									account: "ilovekolobok",
									name: "breed",
									authorization: [
										{
											actor: 'yourAccount',
											permission: "active",
										},
									],
									data: {
										name: name,
										owner: 'yourAccount',
										parent1: parent1,
										parent2: parent2,
									},
								},
							],
						},
						{
							blocksBehind: 3,
							expireSeconds: 240,
							broadcast: true,
							sign: true
						}
					);
				})();
			}
		}
	}
);