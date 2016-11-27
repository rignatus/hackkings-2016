

client.messages
  .create({
    to: '+15558675309',
    from: '+15017250604',
    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
  })
  .then((message) => console.log(message.sid));