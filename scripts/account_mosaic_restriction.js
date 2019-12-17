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

const mosaicId = new MosaicId("9adf3b117a3c10ca");

const transaction = AccountRestrictionTransaction
    .createMosaicRestrictionModificationTransaction(
        deadline,
        AccountRestrictionFlags.BlockMosaic,
        [mosaicId],
        [],
        networkType);

const generationHash = "9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7"
const signedTransaction = childAccount.sign(transaction, generationHash);

console.log('AccountMosaicRestrictionTransaction', transaction)
console.log('AccountMosaicRestrictionTransaction serialized', transaction.serialize())
console.log('AccountMosaicRestrictionTransaction signed', signedTransaction)
console.log("AccountMosaicRestrictionTransaction (stringify)", JSON.stringify(transaction, null, 2))
