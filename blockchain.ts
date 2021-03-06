import { Block, IBlock } from './blocks';

const now = new Date().toUTCString()
const data = {
  message: 'hello world!'
};

const genesisBlockData: IBlock = {
  index: 0,
  data: { message: 'Hello world!' },
  timestamp: new Date().toUTCString(),
  precedingHash: '',
  hash: ''

}

const first = new Block(genesisBlockData);
(async () => {
  const valid = await first.verifySignature();
  console.log(`Valid hash: ${valid}`)
})();