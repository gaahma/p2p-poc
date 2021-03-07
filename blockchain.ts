import { Block, IBlock } from './src/blockchain';
import { writeToLedger } from './src/ledger';

const genesisBlock: IBlock = { data: { message: 'Hello world!' }, difficulty: 5 };

const first = new Block(genesisBlock);
writeToLedger(first);
// console.log(JSON.stringify(first, null, 2));
