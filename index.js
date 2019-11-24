const {ExtendedKey, MnemonicPassPhrase, Wallet} = require("nem2-hd-wallets")
const { TransferTransaction, NetworkType, NetworkCurrencyMosaic, Mosaic,
  MosaicId, PlainMessage, EncryptedMessage, Deadline, Address, UInt64 } = require("nem2-sdk");

const mnemonic = new MnemonicPassPhrase('alcohol woman abuse must during monitor noble actual mixed trade anger aisle');

const bip32Seed = mnemonic.toSeed();

const bip32Node = ExtendedKey.createFromSeed(buf2hex(bip32Seed));

console.log(bip32Node.getPublicKey())

const wallet = new Wallet(bip32Node.derivePath("m/44'/43'/0'"))

const account = wallet.getAccount();

const tx = {
  "meta": {
      "height": "137265",
      "hash": "8729BE2004B61CFFCEC2B7264DAF48A0F7E952258269C176BB678C385366E373",
      "merkleComponentHash": "8729BE2004B61CFFCEC2B7264DAF48A0F7E952258269C176BB678C385366E373",
      "index": 0,
      "id": "5DBD6D959898F174923B8512"
  },
  "transaction": {
      "signature": "4F747D8F0302A2AA44B47304878E10041733ACAA7ACC5281320867CA94969DFA7C28FD09BC323E28C69017C06C3FFA4513E4C5913FDF8DBF5FD0547CEAF92100",
      "signerPublicKey": "90BA6CA2244CEA2E1826F3D93A22DA11284924814C4D63F43CD81FD28D228BE3",
      "version": 36865,
      "type": 16724,
      "maxFee": "2000000312220",
      "deadline": "113248176649",
      "recipientAddress": "9010AAF5CEB0A1B21D01624FF3C746329F7A1B559F1C4D969F",
      "message": {
          "type": 0,
          "payload": ""
      },
      "mosaics": [
          {
              "id": "308F144790CD7BC4",
              "amount": "1000000000"
          }
      ]
  }
}

// const deadline = Deadline.create();
// const recipient = Address.createFromRawAddress("TALICE2GMA34CXHD7XLJQ536NM5UNKQHTORNNT2J");
// const mosaics = [NetworkCurrencyMosaic.createRelative(10)];
// const message = PlainMessage.create("This is a transfer");
// const networkType = NetworkType.MAIN_NET
// const maxFee = UInt64.fromUint(100)

const deadline = Deadline.createFromDTO(tx.transaction.deadline)
const recipient = Address.createFromEncoded(tx.transaction.recipientAddress);
const mosaics = [new Mosaic(new MosaicId(tx.transaction.mosaics[0].id), UInt64.fromNumericString(tx.transaction.mosaics[0].amount))];
const message = PlainMessage.create(tx.transaction.message.payload);
const networkType = NetworkType.MIJIN_TEST
const maxFee = UInt64.fromUint(20000)

const transaction = TransferTransaction.create(deadline, recipient, mosaics, message, networkType, maxFee);
// const transaction = new TransferTransaction(networkType, tx.transaction.version, deadline, maxFee, recipient, mosaics, message, null, );

console.log(JSON.stringify(transaction, null, 2))
console.log(transaction.serialize())

const generationHash = "9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7"

const signedTransaction = account.sign(transaction, generationHash);

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

