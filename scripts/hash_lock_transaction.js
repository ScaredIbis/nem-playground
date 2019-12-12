const { ExtendedKey, MnemonicPassPhrase, Wallet, Network, MACType } = require("nem2-hd-wallets")
const { Mosaic,
        MosaicNonce,
        MosaicFlags,
        TransferTransaction,
        MosaicId,
        MosaicNonceDto,
        NetworkType,
        NetworkCurrencyMosaic,
        PlainMessage,
        Deadline,
        Address,
        UInt64,
        MosaicAliasTransaction,
        HashLockTransaction,
        AggregateTransaction,
        AliasAction,
        AggregateTransactionCosignature,
        PublicAccount,
        CosignatureSignedTransaction,
        Account,
        CosignatureTransaction,
        TransactionHttp,
        MosaicDefinitionTransaction,
        Listener,
        NamespaceId } = require("nem2-sdk");

// Wallet setup
const mnemonic = new MnemonicPassPhrase('alcohol woman abuse must during monitor noble actual mixed trade anger aisle');
const ed25519Node = ExtendedKey.createFromSeed(mnemonic.toSeed().toString('hex'), Network.CATAPULT_PUBLIC, MACType.HMAC)
const wallet = new Wallet(ed25519Node)
const masterAccount = wallet.getAccount()
const childAccount = wallet.getChildAccount('m/44\'/43\'/0\'', NetworkType.TEST_NET);
console.log(`NETWORK ${childAccount.networkType}`)
console.log(`PUBLIC ${childAccount.publicKey}`)
console.log(`PRIVATE ${childAccount.privateKey}`)
console.log(`ACC ${JSON.stringify(childAccount.publicAccount)}`)

const deadline = Deadline.createFromDTO("113728610090");

const alicePrivateKey = "A3AA0DD3E945CD9F6930E6AAAD715D2B12546970BED23F3808BA66A2CCA81078";
const aliceAccount = Account.createFromPrivateKey(alicePrivateKey, NetworkType.TEST_NET);

const ticketDistributorPublicKey = "596FEAB15D98BFD75F1743E9DC8A36474A3D0C06AE78ED134C231336C38A6297";
const ticketDistributorPublicAccount = PublicAccount.createFromPublicKey(ticketDistributorPublicKey, NetworkType.TEST_NET);

const nonce = new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8]));
const id = MosaicId.createFromNonce(nonce, ticketDistributorPublicAccount)
const aliceToTicketDistributorTx = TransferTransaction.create(
  deadline,
  ticketDistributorPublicAccount.address,
  [new Mosaic(new MosaicId('9adf3b117a3c10ca'), UInt64.fromUint(100))],
  PlainMessage.create('send 100 cat.currency to distributor'),
  NetworkType.TEST_NET);

const mosaicTransaction = MosaicDefinitionTransaction.create(
    deadline,
    nonce,
    id,
    MosaicFlags.create(true, true, true),
    100,
    UInt64.fromUint(123),
    NetworkType.TEST_NET,
    UInt64.fromUint(100)
);

const aggregateTransaction = AggregateTransaction.createBonded(Deadline.createFromDTO("113728610090"),
  [aliceToTicketDistributorTx.toAggregate(aliceAccount.publicAccount),
      mosaicTransaction.toAggregate(ticketDistributorPublicAccount)],
  NetworkType.TEST_NET, [], UInt64.fromUint(100));

const networkGenerationHash = "9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7";
const aggregateSignedTransaction = childAccount.sign(aggregateTransaction, networkGenerationHash);

hash_lock_deadline = Deadline.createFromDTO("113728610090");
mosaic_for_hash_lock = NetworkCurrencyMosaic.createRelative(10)
const hashLockTransaction = HashLockTransaction.create(
  hash_lock_deadline,
  mosaic_for_hash_lock,
  UInt64.fromUint(480),
  aggregateSignedTransaction,
  NetworkType.TEST_NET);

const signedHashLockTransaction = childAccount.sign(hashLockTransaction, networkGenerationHash);

// console.log('hashLockTransaction', JSON.stringify(hashLockTransaction.toJSON(), null, 2))
console.log('hashLockTransaction', hashLockTransaction.mosaic.id.toHex())
console.log('hashLockTransaction serialized', hashLockTransaction.serialize())
console.log('hashLockTransaction signed', signedHashLockTransaction)

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