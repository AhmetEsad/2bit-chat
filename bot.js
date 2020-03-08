const bitchat = require('./index');
const client = new bitchat.client();

var prefix = '!';

client.on('ready', function () {
    client.login('username', 'password');
    client.switchToChannel('general');
});

client.on('message', function (msg) {
    if(msg.content == prefix + 'hello') {
        client.send('Hi, ' + msg.author.username + '!');
    }
});

client.on('announcement', function(msg) {
    console.log('> ' + msg);
});

client.on('disconnect', function() {
    console.log('Disconnected');
    process.exit();
});
