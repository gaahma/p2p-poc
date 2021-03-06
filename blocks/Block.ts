import { SHA256 } from 'crypto-js';
import bcrypt from 'bcrypt';

export interface IBlock {
  index?: number,
  timestamp?: string,
  precedingHash?: string,
  data?: any,
  hash?: string,
  difficulty?: '00' | '000' | '0000' | '00000'
  nonce?: number
}

export class Block implements IBlock {
  public nonce: number;
  public difficulty: '00' | '000' | '0000' | '00000';
  public index: number;
  public timestamp: string;
  public data: any;
  public precedingHash: string;
  public hash: string;
  constructor ({ index, timestamp, data, precedingHash, hash, difficulty, nonce }: IBlock ) {
    this.nonce = nonce || 0;
    this.difficulty = difficulty || '0000';
    this.index = index || 0;
    this.timestamp = timestamp || new Date().toUTCString();
    this.data = data || '';
    this.precedingHash = precedingHash || '0'
    this.hash = hash || this.performWork();
  }

  computeHash () {
    bcrypt.hash
    return SHA256(this.pack()).toString();
  }

  pack () {
    return this.index + (this.precedingHash || '') + this.timestamp + JSON.stringify(this.data) + (this.nonce || '');
  }

  performWork (): string {
    const begin = (new Date).getTime();
    let proofOfWork: string = ''
    console.log(`Current hash difficulty: ${this.difficulty.length}`);
    console.log('Signing block...')
    while (!proofOfWork.startsWith(this.difficulty)) {
      this.nonce++;
      proofOfWork = this.computeHash();
      
      if (this.nonce % 100000 === 0) {
        console.log('.'); // let our human know we're still working
      }
    }
    const end = (new Date).getTime();
    console.log(`Block created in ${(end - begin)/1000} s`)
    console.log(`Proof of work signature: ${proofOfWork}`)
    return proofOfWork;
  }

  async verifySignature () {
    // SHA256.
  }
}