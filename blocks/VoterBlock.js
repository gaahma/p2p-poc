import { Block } from './Block';

export class VoterBlock extends Block {
  constructor() {
    this.type = 'VOTER',
    super(arguments);
  }
}