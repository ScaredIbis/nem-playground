const {
    Account,
    NetworkType,
} = require("nem2-sdk");

const account = Account.generateNewAccount(NetworkType.TEST_NET);

console.log('account', account);