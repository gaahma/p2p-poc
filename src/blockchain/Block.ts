import { SHA256 } from 'crypto-js';
import { now } from '../utils';
// import bcrypt from 'bcrypt';

export interface IBlock {
  timestamp?: number,
  precedingHash?: string,
  data?: any,
  hash?: string,
  difficulty?: number,
  nonce?: number
}

export class Block implements IBlock {
  public nonce: number;
  public difficulty: number;
  public timestamp: number;
  public data: any;
  public precedingHash: string;
  public hash: string;
  constructor ({ timestamp, data, precedingHash, hash, difficulty, nonce }: IBlock ) {
    this.nonce = nonce || 0;
    this.difficulty = difficulty || 4;
    this.timestamp = timestamp || now();
    this.data = data || '';
    this.precedingHash = precedingHash || ''
    this.hash = hash || this.createBlockHash();
  }

  computeHash () {
    return SHA256(this.toString()).toString();
  }

  toString () {
    return '' + this.precedingHash + this.timestamp + JSON.stringify(this.data) + this.nonce;
  }

  createBlockHash (): string {
    let hash: string = ''
    console.log(`Current hash difficulty: ${this.difficulty}`);
    process.stdout.write('Creating block...')
    const zeros = new Array(this.difficulty + 1).join('0');
    const begin = now();
    while (!hash.startsWith(zeros)) {
      if (this.nonce % 100000 === 0) {
        process.stdout.write('.'); // let our human know we're still working
      }
      this.nonce++;
      hash = this.computeHash();
    
    }
    const end = now();
    if (this.verifyHash(hash)) {
      console.log(`\nBlock created in ${(end - begin)/1000}s`);
      console.log(`Hash: ${hash}`);
      console.log(`Self verified: true`);
      return hash;
    }
    throw new Error('Unable to create valid block');
  }

  verifyHash (hash?: string) {
    return this.computeHash() === (hash || this.hash);
  }
}