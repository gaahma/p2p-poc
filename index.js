const crypto = require('crypto')
const Swarm = require('discovery-swarm')
const defaults = require('dat-swarm-defaults')
const getPort = require('get-port')
const readline = require('readline')

/**
 * Here we will save our TCP peer connections
 * using the peer id as key: { peer_id: TCP_Connection }
 */
const peers = {}
// Counter for connections, used for identify connections
// let connSeq = 0

// Peer Identity, a random hash for identify your peer
const myUserName = process.argv[2] || 'Unknown user'
const myId = crypto.randomBytes(32)
// console.log('Your identity: ' + myId.toString('hex'))

// reference to redline interface
let rl
/**
 * Function for safely call console.log with readline interface active
 */
function log () {
  if (rl) {
    rl.clearLine()    
    rl.close()
    rl = undefined
  }
  for (let i = 0, len = arguments.length; i < len; i++) {
    console.log(arguments[i])
  }
  askUser()
}

/*
* Function to get text input from user and send it to other peers
*/
const askUser = async () => {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question('Send message: ', message => {
    const data = JSON.stringify({ userName: myUserName, message });

    if (Object.keys(peers).length) {
      for (let id in peers) {
        peers[id].conn.write(data)
      }
    } else {
      log(`No peers to receive message: ${message}`)
    }

    rl.close()
    rl = undefined
    askUser()
  });
}

// Default DNS and DHT servers
// This servers are used for peer discovery and establishing connection
const config = defaults({
  id: myId,
})
const sw = Swarm(config);


(async () => {
  // Choose a random unused port for listening TCP peer connections
  const port = await getPort()

  sw.listen(port)
  // console.log('Listening to port: ' + port)

  // I'd really like to understand what hapens when this channel is joined
  sw.join('4401c223907732c197395e0669722183da5109508999cbe38279a04737bed728')

  sw.on('connection', (conn, info) => {
    const peerId = info.id.toString('hex')

    // Keep alive TCP connection with peer
    if (info.initiator) {
      try {
        // these connections all close, idk what the value is of this...
        conn.setKeepAlive(true, 2000)
      } catch (exception) {
        log('exception', exception)
      }
    }

    conn.on('data', (json) => {

      const { userName, message } = JSON.parse(json);
      log(`${userName}: ${message}`)
    });

    conn.on('close', () => {
      log(`closing connection with peer: ${peerId}`);
      // delete peers[peerId];
    });

    // Save the connection
    // if (!peers[peerId]) {
    peers[peerId] = { conn };
    // }
    // peers[peerId].conn = conn
  });

  // Read user message from command line
  askUser(); 

})();

