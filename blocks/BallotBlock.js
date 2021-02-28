import { Block } from './Block';

export class BallotBlock extends Block {
  constructor() {
    this.type = 'BALLOT',
    super(arguments);
  }
}