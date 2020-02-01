const { ExtendedKey, MnemonicPassPhrase, Wallet, Network, MACType } = require("nem2-hd-wallets")
const { MosaicNonce, MosaicFlags, MosaicDefinitionTransaction, MosaicId, MosaicNonceDto, NetworkType, NetworkCurrencyMosaic, PlainMessage, Deadline, Address, UInt64 } = require("nem2-sdk");

const mnemonic = new MnemonicPassPhrase('alcohol woman abuse must during monitor noble actual mixed trade anger aisle');
console.log(buf2hex(mnemonic.toSeed()))
const ed25519Node = ExtendedKey.createFromSeed(mnemonic.toSeed().toString('hex'), Network.CATAPULT_PUBLIC, MACType.HMAC)
const wallet = new Wallet(ed25519Node)
const masterAccount = wallet.getAccount()
const childAccount = wallet.getChildAccount('m/44\'/43\'/0\'/0\'/0\'', NetworkType.TEST_NET);
console.log(`NETWORK ${childAccount.networkType}`)
console.log(`PUBLIC ${childAccount.publicKey}`)
console.log(`PRIVATE ${childAccount.privateKey}`)
console.log(`ACC ${JSON.stringify(childAccount.publicAccount)}`)

const deadline = Deadline.createFromDTO("113728610090");
const networkType = NetworkType.TEST_NET

// const transaction = TransferTransaction.create(deadline, recipient, mosaics, message, networkType, maxFee);

const nonce = new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8]));
const id = MosaicId.createFromNonce(nonce, childAccount.publicAccount)
console.log({ id })
console.log({ id: id.toHex() })

// const buffer = new ArrayBuffer(4);
// const dataView = new DataView(buffer);
// dataView.setUint32(0, 3095715558, true);
// console.log(buf2hex(buffer))

// const uint32Array = new Uint32Array(id.toDTO());
// const idArray = new Uint8Array(uint32Array.buffer);
// console.log(buf2hex(idArray))

const transaction = MosaicDefinitionTransaction.create(
  deadline,
  nonce,
  id,
  MosaicFlags.create(true, true, true),
  100,
  UInt64.fromUint(123),
  networkType,
  UInt64.fromUint(100));

// console.log(JSON.stringify(transaction, null, 2))
// console.log(transaction.serialize())

console.log(JSON.stringify(transaction, null, 2))

const generationHash = "9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7"

const signedTransaction = childAccount.sign(transaction, generationHash);

console.log(JSON.stringify(signedTransaction, null, 2))

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