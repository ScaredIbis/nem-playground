const { ExtendedKey, MnemonicPassPhrase, Wallet, Network, MACType } = require("nem2-hd-wallets")
const { NetworkType, EncryptedMessage, PublicAccount} = require("nem2-sdk");

const mnemonic = new MnemonicPassPhrase('alcohol woman abuse must during monitor noble actual mixed trade anger aisle');
// const mnemonic = new MnemonicPassPhrase('core verify kingdom stool finish until coffee you town lady develop album dirt dish security dice suspect access asset annual battle bleak share attack');
const ed25519Node = ExtendedKey.createFromSeed(mnemonic.toSeed().toString('hex'), Network.CATAPULT_PUBLIC, MACType.HMAC)
const wallet = new Wallet(ed25519Node)
const childAccount = wallet.getChildAccount('m/44\'/43\'/0\'/0\'/0\'', NetworkType.TEST_NET);
console.log(`NETWORK ${childAccount.networkType}`)
console.log(`PUBLIC ${childAccount.publicKey}`)
console.log(`PRIVATE ${childAccount.privateKey}`)
console.log(`ACC ${JSON.stringify(childAccount.publicAccount)}`)

const recipientPublicKey = "596FEAB15D98BFD75F1743E9DC8A36474A3D0C06AE78ED134C231336C38A6297";
const recipientPublicAccount = PublicAccount.createFromPublicKey(recipientPublicKey, NetworkType.TEST_NET);

const _message = EncryptedMessage.create("Encrypted by nem2-sdk", recipientPublicAccount, childAccount.privateKey, NetworkType.TEST_NET);

// const message = EncryptedMessage.createFromPayload("1AFABD13380D74D58B6D50E2AA3248C3E5B73D2250E613407CA6F0C9A3E6B22D61A64CFA730FADA77FC741B9EFF5BCD447065021B09C7866CFAE5E6A88E00818")
// const message = EncryptedMessage.createFromPayload("80C1D0BEDFC6A1FFB2E6A91869965CB6B46C511383307546069C813EAD43C449285142CA67020BDB9A1C02FB31C3F99D75DE866DFA43963305F834CF45F9F80C")
const message = EncryptedMessage.createFromPayload(_message.payload)
// console.log("ENCRYPTED MSG", message)
console.log("DECRYPTED", EncryptedMessage.decrypt(message, childAccount.privateKey, recipientPublicAccount, NetworkType.TEST_NET))

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
