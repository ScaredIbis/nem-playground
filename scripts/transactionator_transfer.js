const { ExtendedKey, MnemonicPassPhrase, Wallet, Network, MACType } = require("nem2-hd-wallets")
const { Mosaic, TransferTransaction, MosaicId, NetworkType, PlainMessage, Deadline, Address, UInt64, NetworkCurrencyMosaic } = require("nem2-sdk");

const mnemonic = new MnemonicPassPhrase('alcohol woman abuse must during monitor noble actual mixed trade anger aisle');
// const mnemonic = new MnemonicPassPhrase('core verify kingdom stool finish until coffee you town lady develop album dirt dish security dice suspect access asset annual battle bleak share attack');
console.log(buf2hex(mnemonic.toSeed()))
const ed25519Node = ExtendedKey.createFromSeed(mnemonic.toSeed().toString('hex'), Network.CATAPULT_PUBLIC, MACType.HMAC)
const wallet = new Wallet(ed25519Node)
const childAccount = wallet.getChildAccount('m/44\'/43\'/0\'/0\'/0\'', NetworkType.TEST_NET);
console.log(`NETWORK ${childAccount.networkType}`)
console.log(`PUBLIC ${childAccount.publicKey}`)
console.log(`PRIVATE ${childAccount.privateKey}`)
console.log(`ACC ${JSON.stringify(childAccount.publicAccount)}`)

const deadline = Deadline.createFromDTO("113248176649");
const networkType = NetworkType.TEST_NET

// const transaction = TransferTransaction.create(deadline, recipient, mosaics, message, networkType, maxFee);

const networkCurrency = new NetworkCurrencyMosaic(UInt64.fromNumericString("1000000000"))
console.log("NETWORK CURRENCY", networkCurrency);

const mosaics = [networkCurrency];
const message = PlainMessage.create("Test Transfer");

const transaction = TransferTransaction.create(
  deadline,
  Address.createFromRawAddress("TAO6QEUC3APBTMDAETMG6IZJI7YOXWHLGC5T4HA4"),
  mosaics,
  // [],
  message,
  networkType,
  UInt64.fromUint(20000)
);

// console.log(JSON.stringify(transaction, null, 2))
console.log(transaction.serialize())

console.log(JSON.stringify(transaction, null, 2))

const generationHash = "9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7"

const signedTransaction = childAccount.sign(transaction, generationHash);

console.log("SIGNED", JSON.stringify(signedTransaction, null, 2))

// const transferFromPayload = TransferTransaction.createFromPayload("B1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001985441204E000000000000090A1E5E1A000000981DE81282D81E19B06024D86F232947F0EBD8EB30BB3E1C1C01010000000000C47BCD9047148F3000CA9A3B0000000000")
// const transferFromPayload = TransferTransaction.createFromPayload("bc000000000000002ae5f615738c039919317427162c32bf45b94ab77a75c3ea523dee9e163f339004624157b98a4e525ab6307f8fe095efa5e1d780645a04e9054f12921385b30d252d2e9f95c4671eeb0c67c6666890567e35976b32666263cd390fc188ccf3170000000001985441a08601000000000096dfddb70000000098fe015aefdeadf97f7a6a4f0679130f62c04cb16d0aef3eb2010c0000000000f01e40215403af7580969800000000000066726f6d207472657a6f72")

// console.log("FROM PAYLOAD", JSON.stringify(transferFromPayload, null, 2))

function buf2hex(buffer) {
  // buffer is an ArrayBuffer
  // create a byte array (Uint8Array) that we can use to read the array buffer
  const byteArray = new Uint8Array(buffer)

  // for each element, we want to get its two-digit hexadecimal representation
  const hexParts = []
  for (let i = 0; i < byteArray.length; i++) {
    // convert value to hexadecimal
    const hex = byteArray[i].toString(16)

    // pad with zeros to length 2
    const paddedHex = ('00' + hex).slice(-2)

    // push to array
    hexParts.push(paddedHex)
  }

  // join all the hex values of the elements into a single string
  return hexParts.join('')
}
