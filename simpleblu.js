Eos = require('eosjs');
config = require('./config.json');
airdroplist = require('./airdroplist.json')

baseConfig = {
  keyProvider: config.privateKey, // WIF string or array of keys..
  httpEndpoint: 'http://dev.bluchain.tech:8888',
  expireInSeconds: 60,
  broadcast: false,
  debug: false,
  sign: true,
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f', // 32 byte (64 char) hex string
};

eos = Eos(baseConfig);

async function run() {

  const account = 'test1';
  const balances = [];
  var j;
  
  for (j = 0; j < config.length; j++) {

    let balanceToken = await eos.getCurrencyBalance('eosio.token', account, config[j].symbol);
    balances.push(balanceToken[0]);
    
  }

  console.log(balances);

  }
  
  async function transfer(from, to, quatity, memo) {
    await this.eos.transaction(config.tokenAccount, token => {
      token.transfer(from, to, quatity, memo);
    });
  }
  
  run();
  