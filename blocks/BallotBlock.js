import { Block } from './Block';

export class VoterBlock extends Block {
  constructor() {
    this.type = 'BALLOT',
    super(arguments);
  }
}