const bitchat = require('./index');
const client = new bitchat.client();

var prefix = '!';

client.on('ready', function () {
    client.login('username', 'password').then(function (msg) { console.log(msg) }).catch((response) => { console.log(response) });
    client.switchToChannel('general'); // no promises for this function, sorry :(
});

client.on('message', async function (msg) {
    console.log(msg.author.badges.map(b => b.emoji).join(' ') + ' ' + msg.author.username + ': ' + msg.content);
    if (msg.content === prefix + 'hello') {
        var myMessage = await client.send('Hi, ' + msg.author.username + '!');
        console.log(myMessage.id);
    }
});

client.on('system', function (msg) { });

client.on('announcement', function (msg) {
    console.log('> ' + msg);
});

client.on('disconnect', function () {
    console.log('Disconnected');
    process.exit();
});
