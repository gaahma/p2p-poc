import { SHA256 } from 'crypto-js';

export interface IBlock {
  index: number,
  timestamp: string,
  precedingHash: string,
  data: any,
  hash: string,
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
  constructor ({ index, timestamp, data, precedingHash, hash, difficulty }: IBlock) {
    this.nonce = 0;
    this.difficulty = difficulty || '00';
    this.index = index;
    this.timestamp = timestamp || new Date().toUTCString();
    this.data = data;
    this.precedingHash = precedingHash || '0'
    this.hash = hash || this.performWork();
  }

  initHash () {
    return SHA256(this.index + this.timestamp + JSON.stringify(this.data)).toString();
  }
  computeHash () {
    return SHA256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  // now () {
  //   return new Date().toUTCString();
  // }

  performWork (): string {
    const begin = (new Date).getTime();
    let proofOfWork: string = ''
    console.log(`Current hash difficulty: ${this.difficulty.length}`);
    console.log('Signing block...')
    while (!proofOfWork.startsWith(this.difficulty)) {
      proofOfWork = this.computeHash();
      this.nonce++;
      if (this.nonce % 1000 === 0) {
        console.log('still working...');
      }
    }
    const end = (new Date).getTime();
    console.log({ begin, end, diff: end - begin })
    console.log(`Block created in ${end - begin} ms`)
    console.log(`Proof of work signature: ${proofOfWork}`)
    return proofOfWork;
  }
}