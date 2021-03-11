
// var crypto = require("crypto");
import crypto from 'crypto';
import eccrypto from 'eccrypto';
 
const toBuffer = (hexString: string ) => Buffer.from(hexString, 'hex');

// A new random 32-byte private key.
const privateKey = eccrypto.generatePrivate().toString('hex');
const otherKey = eccrypto.generatePrivate().toString('hex');

// Corresponding uncompressed (65-byte) public key.
const publicKey = eccrypto.getPublic(toBuffer(privateKey)).toString('hex');
const otherPublicKey = eccrypto.getPublic(toBuffer(privateKey)).toString('hex');


const str = "message to sign";
// Always hash you message to sign!
const msg1 = crypto.createHash("sha256").update(str).digest();
const msg2 = crypto.createHash('sha256').update('hey').digest();


(async () => {
  const signature = await eccrypto.sign(toBuffer(privateKey), msg1);
  console.log(signature.toString('hex'));
  try {
    const result = await eccrypto.verify(toBuffer(publicKey), msg1, signature);
    // console.log({ result })
    console.log('Signature verified');
  } catch (err) {
    console.error('Invalid signature');
  }
})();