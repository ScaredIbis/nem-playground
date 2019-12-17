const { ExtendedKey, MnemonicPassPhrase, Wallet, Network, MACType } = require("nem2-hd-wallets")
const { Mosaic, NetworkType, Account, MosaicId, AccountRestrictionTransaction, AccountAddressRestrictionTransaction, AccountRestrictionFlags, Deadline, Address, UInt64 } = require("nem2-sdk");

const mnemonic = new MnemonicPassPhrase('alcohol woman abuse must during monitor noble actual mixed trade anger aisle');
const ed25519Node = ExtendedKey.createFromSeed(mnemonic.toSeed().toString('hex'), Network.CATAPULT_PUBLIC, MACType.HMAC)
const wallet = new Wallet(ed25519Node)
const masterAccount = wallet.getAccount()
const childAccount = wallet.getChildAccount('m/44\'/43\'/0\'', NetworkType.TEST_NET);
console.log(`NETWORK ${childAccount.networkType}`)
console.log(`PUBLIC ${childAccount.publicKey}`)
console.log(`PRIVATE ${childAccount.privateKey}`)
console.log(`ACC ${JSON.stringify(childAccount.publicAccount)}`)

const deadline = Deadline.createFromDTO("113248176649");
const networkType = NetworkType.TEST_NET

const alicePrivateKey = "A3AA0DD3E945CD9F6930E6AAAD715D2B12546970BED23F3808BA66A2CCA81078";
const aliceAccount = Account.createFromPrivateKey(alicePrivateKey, networkType);

const blockAddress1 = Address.createFromRawAddress("TBRL2IM33LWRHIDNVMO6M6LPBQ2CUS67KI7XJDCZ");
const blockAddress2 = Address.createFromRawAddress("TAWIV4Y5YACUYEP3BPCGS27ERBPOF34CVZXYYZN7");

const transaction = AccountRestrictionTransaction
    .createAddressRestrictionModificationTransaction(
        deadline,
        AccountRestrictionFlags.AllowIncomingAddress,
        [aliceAccount.address],
        [blockAddress1, blockAddress2],
        networkType);

const generationHash = "9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7"
const signedTransaction = childAccount.sign(transaction, generationHash);

console.log('AccountAddressRestrictionTransaction', transaction)
console.log('AccountAddressRestrictionTransaction serialized', transaction.serialize())
console.log('AccountAddressRestrictionTransaction signed', signedTransaction)
console.log("AccountAddressRestrictionTransaction (stringify)", JSON.stringify(transaction, null, 2))
