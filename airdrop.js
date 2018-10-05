Eos = require('eosjs');
// config = require('./config.json');
// irdroplist = require('./airdroplist.json')

baseConfig = {
  keyProvider: [], // WIF string or array of keys..
  httpEndpoint: 'http://dev.bluchain.tech:8888',
  expireInSeconds: 60,
  broadcast: false,
  debug: false,
  sign: true,
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f', // 32 byte (64 char) hex string
};

eos = Eos(baseConfig);

async function run() {

  var accounts =  requestJson('airdroplist').accounts;
  var config =  requestJson('config');
  console.log(config);
  console.log(accounts);

  var j;

  for (j = 0; j < config.length; j++) {

    reloadInstance(config[j].privateKey);
    await airdrop(config[j], accounts);
  }
}

async function airdrop(conf, acct) {
  var i;

  console.log('starting airdrop')
  //document.write('starting airdrop')

  for (i = 0; i < acct.length; i++) {
    let info = await eos.getAccount(acct[i]);

    if (info.account_name) {

      let balanceToken = await eos.getCurrencyBalance('eosio.token', info.account_name, 'SYS')

      var balance = balanceToken[0].slice(0, balanceToken[0].length - 4);
      var value = balance * conf.ratio;
      var quantity = value.toFixed(conf.decimals) + ' ' + conf.symbol

      await transfer(conf.transferAccount, info.account_name, quantity.toString(), conf.memo);

      clearInstance();

      console.log(quantity + ' dropped to ' + info.account_name);
    }

  }

  console.log('airdrop finished')
}

async function transfer(from, to, quatity, memo) {
  await this.eos.transaction('eosio.token', token => {
    token.transfer(from, to, quatity, memo);
  });
}

async function requestJson(url) {
  var requestURL = 'http://localhost:3004/' + url;
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'text'; // now we're getting a string!
  request.send();

  request.onload = function () {
    var urlText = request.response; // get the string from the response
    var urlJson = JSON.parse(urlText); // convert it to an object
    console.log(urlJson);
    return urlJson;
  }
}

function reloadInstance(privkey) {
  baseConfig.keyProvider = [privkey];
  eos = Eos(baseConfig);
};

function clearInstance() {
  baseConfig.keyProvider = ['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'];
  eos = Eos(baseConfig);
}


run();
