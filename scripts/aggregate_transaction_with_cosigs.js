const { ExtendedKey, MnemonicPassPhrase, Wallet, Network, MACType } = require("nem2-hd-wallets")
const { Mosaic, 
        MosaicNonce, 
        MosaicFlags, 
        TransferTransaction, 
        MosaicId, 
        NetworkType, 
        PlainMessage, 
        Deadline, 
        UInt64,
        AggregateTransaction,
        AggregateTransactionCosignature,
        PublicAccount,
        Account,
        CosignatureTransaction,
        MosaicDefinitionTransaction} = require("nem2-sdk");

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


//
// Now add cosignatures
//

const networkGenerationHash = "9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7";
const cosig = CosignatureTransaction.signTransactionPayload(aliceAccount, aggregateTransaction.serialize(), networkGenerationHash);
const cosig2 = CosignatureTransaction.signTransactionPayload(childAccount, aggregateTransaction.serialize(), networkGenerationHash);
console.log('CosignatureTransaction 1', cosig);
console.log('CosignatureTransaction 2', cosig2);

aggregateCosig = new AggregateTransactionCosignature(cosig.signature, aliceAccount)
aggregateCosig2 = new AggregateTransactionCosignature(cosig2.signature, childAccount)
console.log('AggregateTransactionCosignature 1', aggregateCosig)
console.log('AggregateTransactionCosignature 2', aggregateCosig2)

const aggregateTransaction2 = AggregateTransaction.createBonded(Deadline.createFromDTO("113728610090"),
  [aliceToTicketDistributorTx.toAggregate(aliceAccount.publicAccount),
      mosaicTransaction.toAggregate(ticketDistributorPublicAccount)],
  NetworkType.TEST_NET, [aggregateCosig, aggregateCosig2], UInt64.fromUint(100));

const signedTransaction2 = childAccount.sign(aggregateTransaction2, networkGenerationHash);

console.log('aggregateTransaction2', aggregateTransaction2)
console.log('aggregateTransaction2 serialized', aggregateTransaction2.serialize())
console.log('aggregateTransaction2 signed', signedTransaction2)
console.log("aggregateTransaction2 (stringify)", JSON.stringify(aggregateTransaction, null, 2))
