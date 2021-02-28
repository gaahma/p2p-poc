import { SHA256 } from 'crypto-js';

export class Block {
  constructor (index, timestamp, data, precedingHash=null) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.precedingHash = precedingHash;
    this.hash = this.computeHash();    
   }
   computeHash(){
       return SHA256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data)).toString();
   } 
}