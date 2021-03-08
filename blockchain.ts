import { Block, IBlock } from './src/blockchain';
import { writeToLedger } from './src/ledger';

const genesisBlock: IBlock = { data: { message: 'Hello world!' }, difficulty: 4 };

const first = new Block(genesisBlock);
writeToLedger(first);