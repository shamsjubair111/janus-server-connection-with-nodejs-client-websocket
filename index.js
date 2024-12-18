const fs = require('fs');
const WebSocket = require('ws');

// Path to the self-signed certificate
const cert = fs.readFileSync('/etc/nginx/ssl/janus.crt');

const janusUrl = 'wss://192.168.96.252/';  // Use your server's domain/IP

// WebSocket headers with 'Sec-WebSocket-Protocol' added
const headers = {
  'Sec-WebSocket-Protocol': 'janus-protocol', // Request the 'janus-protocol' subprotocol
};

// Create a WebSocket client with the certificate and custom headers
const ws = new WebSocket(janusUrl, ['janus-protocol'], {  // Request the subprotocol explicitly
  ca: cert,  // Add the self-signed certificate to the list of trusted certificates
  headers: headers, // Add custom headers
});

console.log(cert.toString());

// Handle the connection open event
ws.on('open', () => {
  console.log('Connected to Janus server!');

  const message = {
    janus: 'ping',
    transaction: '123456',
  };
  console.log(message)
  ws.send(JSON.stringify(message));
});

// Handle incoming messages from the Janus server
ws.on('message', (data) => {
  console.log('Received message from Janus server:', data?.toString('utf8'));
});

// Handle WebSocket errors
ws.on('error', (err) => {
  console.error('Error occurred:', err);
});

// Handle WebSocket connection close event
ws.on('close', () => {
  console.log('Disconnected from Janus server');
});
