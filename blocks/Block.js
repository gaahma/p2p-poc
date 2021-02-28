import { SHA256 } from 'crypto-js';

export class Block {
  constructor ({ index, timestamp, data, precedingHash, hash }) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.precedingHash = precedingHash || this.initHash();
    this.hash = hash || this.computeHash();
   }

   initHash () {
      return SHA256(this.index + this.timestamp + JSON.stringify(this.data)).toString();
   }
   computeHash () {
      return SHA256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data)).toString();
   }
}