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
let connSeq = 0

// Peer Identity, a random hash for identify your peer
const myId = process.argv[2] || crypto.randomBytes(32)
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
    // Broadcast to peers
    for (let id in peers) {
      peers[id].conn.write(message)
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
  console.log('Listening to port: ' + port)

  // I'd really like to understand what hapens when this channel is joined
  sw.join('4401c223907732c197395e0669722183da5109508999cbe38279a04737bed728')

  sw.on('connection', (conn, info) => {
    // Connection id
    const seq = connSeq

    const peerId = info.id.toString('base64')
    // console.log(conn);
    // log(`Connected #${seq} to peer: ${peerId}`)
    // Keep alive TCP connection with peer
    if (info.initiator) {
      try {
        // these are regularly timing out and disconnecting dispite this
        conn.setKeepAlive(true, 600)
      } catch (exception) {
        log('exception', exception)
      }
    }

    conn.on('data', (data) => {
      log(`${peerId}: ${data.toString()}`)
      // log(
      //   'Received Message from peer ' + peerId,
      //   '----> ' + data.toString()
      // );
    });

    conn.on('close', () => {
      if (peers[peerId].seq === seq) {
        log('Connection closed');
        delete peers[peerId];
      }
    });

    // Save the connection
    if (!peers[peerId]) {
      peers[peerId] = { };
    }
    peers[peerId].conn = conn
    peers[peerId].seq = seq
    
    connSeq++;

  });

  // Read user message from command line
  askUser(); 

})();

