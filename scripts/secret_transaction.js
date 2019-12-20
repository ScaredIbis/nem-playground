const { ExtendedKey, MnemonicPassPhrase, Wallet, Network, MACType } = require("nem2-hd-wallets")
const {
    Account,
    Deadline,
    HashType,
    Mosaic,
    MosaicId,
    NetworkType,
    SecretLockTransaction,
    SecretProofTransaction,
    TransactionHttp,
    UInt64,
} = require('nem2-sdk');
const {sha3_256} = require('js-sha3');
const { randomBytes } = require('crypto');

// Wallet setup
const mnemonic = new MnemonicPassPhrase('alcohol woman abuse must during monitor noble actual mixed trade anger aisle');
const ed25519Node = ExtendedKey.createFromSeed(mnemonic.toSeed().toString('hex'), Network.CATAPULT_PUBLIC, MACType.HMAC)
const wallet = new Wallet(ed25519Node)
const masterAccount = wallet.getAccount()
const childAccount = wallet.getChildAccount('m/44\'/43\'/0\'/0\'/0\'', NetworkType.TEST_NET);
console.log(`NETWORK ${childAccount.networkType}`)
console.log(`PUBLIC ${childAccount.publicKey}`)
console.log(`PRIVATE ${childAccount.privateKey}`)
console.log(`ACC ${JSON.stringify(childAccount.publicAccount)}`)

const alicePublicChainAccount = Account.createFromPrivateKey('7EC9724ECDEFA2A12E85BA71AB1815A0849E30125184A4DCD2D3EA8B3C278A67', NetworkType.TEST_NET);

const bobPrivateChainAccount = Account.createFromPrivateKey('3D347C1E453487F484BC660416E85EA5ABC532D15DFC43F3BDD3AF2792815E35', NetworkType.MIJIN);

const networkGenerationHash = "9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7";
const publicChainGenerationHash = networkGenerationHash;
const privateChainGenerationHash = networkGenerationHash;

// const random = randomBytes(10);
// const proof = random.toString('hex');
// console.log('\n\nProof:', proof);
// const hash = sha3_256.create();
// const secret = hash.update(random).hex().toUpperCase();
// console.log('Secret:', secret);
const proof = "a25fde258f078ddce870";
const secret = "D77E46ED5EC0EA4BD08AA77EEA9F17076F40BC2C2843B1BBB46DAA1D98DBF1B7"

// Custom stuff...
const deadline = Deadline.createFromDTO("113728610090");

const secretLock = SecretLockTransaction.create(
    deadline,
    new Mosaic(new MosaicId('9adf3b117a3c10ca'), UInt64.fromUint(10)),
    UInt64.fromUint(96 * 3600 / 15), // assuming one block every 15 seconds
    HashType.Op_Sha3_256,
    secret,
    bobPrivateChainAccount.address,
    NetworkType.TEST_NET);

const secretLockSigned = childAccount.sign(secretLock, privateChainGenerationHash);
console.log('secretLock un-serialized: ', secretLock)
console.log('secretLock stringified: ', JSON.stringify(secretLock, null, 2))
console.log('secretLock serialized: ', secretLock.serialize())
console.log('secretLock signed: ', secretLockSigned)

const secretProof = SecretProofTransaction.create(
    deadline,
    HashType.Op_Sha3_256,
    secret,
    alicePublicChainAccount.address,
    proof,
    NetworkType.TEST_NET);

const secretProofSigned = childAccount.sign(secretProof, publicChainGenerationHash);
console.log('secretProof un-serialized: ', secretProof)
console.log('secretProof serialized: ', secretProof.serialize())
console.log('secretProof signed: ', secretProofSigned)