const { ExtendedKey, MnemonicPassPhrase, Wallet, Network, MACType } = require("nem2-hd-wallets")
const { Mosaic, NetworkType, NamespaceId, NamespaceMetadataTransaction, Deadline, Address, UInt64 } = require("nem2-sdk");

const mnemonic = new MnemonicPassPhrase('alcohol woman abuse must during monitor noble actual mixed trade anger aisle');
// const mnemonic = new MnemonicPassPhrase('core verify kingdom stool finish until coffee you town lady develop album dirt dish security dice suspect access asset annual battle bleak share attack');
console.log(buf2hex(mnemonic.toSeed()))
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

// const transaction = TransferTransaction.create(deadline, recipient, mosaics, message, networkType, maxFee);

const metaDataValue = "A new value"

const transaction = new NamespaceMetadataTransaction(
  networkType,
  1,
  deadline,
  UInt64.fromUint(20000),
  childAccount.publicKey,
  UInt64.fromUint(1),
  new NamespaceId("12345"),
  metaDataValue.length,
  metaDataValue
)

// const transaction = NamespaceRegistrationTransaction.create(
//   deadline,
//   Address.createFromRawAddress("TAO6QEUC3APBTMDAETMG6IZJI7YOXWHLGC5T4HA4"),
//   mosaics,
//   // [],
//   message,
//   networkType,
// );

// console.log(JSON.stringify(transaction, null, 2))
console.log(transaction.serialize())

console.log(JSON.stringify(transaction, null, 2))

const generationHash = "9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7"

const signedTransaction = childAccount.sign(transaction, generationHash);

console.log("SIGNED", JSON.stringify(signedTransaction, null, 2))

// const transferFromPayload = TransferTransaction.createFromPayload("B1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001985441204E000000000000090A1E5E1A000000981DE81282D81E19B06024D86F232947F0EBD8EB30BB3E1C1C01010000000000C47BCD9047148F3000CA9A3B0000000000")
const transferFromPayload = NamespaceMetadataTransaction.createFromPayload(transaction.serialize())

console.log("FROM PAYLOAD", JSON.stringify(transferFromPayload, null, 2))

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

// be000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001985441204e000000000000090a1e5e1a000000981de81282d81e19b06024d86f232947f0ebd8eb30bb3e1c1c010e0000000000c47bcd9047148f3000ca9a3b000000000054657374205472616e73666572
// BE000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001985441204E000000000000090A1E5E1A000000981DE81282D81E19B06024D86F232947F0EBD8EB30BB3E1C1C010E0000000000C47BCD9047148F3000CA9A3B000000000054657374205472616E73666572