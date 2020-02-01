const { ExtendedKey, MnemonicPassPhrase, Wallet, Network, MACType } = require("nem2-hd-wallets")
const { Mosaic, MultisigAccountModificationTransaction, MosaicId, NetworkType,
  PlainMessage, Deadline, Address, UInt64, PublicAccount } = require("nem2-sdk");

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

const alicePublicKey = "596FEAB15D98BFD75F1743E9DC8A36474A3D0C06AE78ED134C231336C38A6297";
const alicePublicAccount = PublicAccount.createFromPublicKey(alicePublicKey, NetworkType.TEST_NET);

const deadline = Deadline.createFromDTO("113248176649");
const networkType = NetworkType.TEST_NET

// const transaction = TransferTransaction.create(deadline, recipient, mosaics, message, networkType, maxFee);

const transaction = MultisigAccountModificationTransaction.create(
  deadline,
  -1,
  -1,
  [],
  [alicePublicAccount],
  NetworkType.TEST_NET,
  UInt64.fromUint(100)
);

// console.log(JSON.stringify(transaction, null, 2))
console.log(transaction.serialize())

console.log(JSON.stringify(transaction, null, 2))

const generationHash = "9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7"

const signedTransaction = childAccount.sign(transaction, generationHash);

console.log("SIGNED", JSON.stringify(signedTransaction, null, 2))

// const txFromPayload = TransferTransaction.createFromPayload("B1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001985441204E000000000000090A1E5E1A000000981DE81282D81E19B06024D86F232947F0EBD8EB30BB3E1C1C01010000000000C47BCD9047148F3000CA9A3B0000000000")
const txFromPayload = MultisigAccountModificationTransaction.createFromPayload(transaction.serialize())

console.log("FROM PAYLOAD", JSON.stringify(txFromPayload, null, 2))

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
