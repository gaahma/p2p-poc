import fs from 'fs';
import { IBlock } from '../blockchain';

export const writeToLedger = (block: IBlock) => {
  fs.writeFileSync(`./${block.hash}.json`, JSON.stringify(block, null, 2));
}