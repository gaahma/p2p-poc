import fs from 'fs';
import { IBlock } from '../blockchain';

export const writeToLedger = (block: IBlock) => {
  fs.writeFileSync(`./src/ledger/ledger.json`, JSON.stringify(block, null, 2));
};

// export const deleteFromLedger = (fn) => {
//   fs.unlinkSync()
// }