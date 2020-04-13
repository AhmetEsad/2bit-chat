const Websocket=require('ws'),events=require('events');function isJSON(str){try{JSON.parse(str);}catch(e){return false;}return true;}module.exports={client: class extends events.EventEmitter {constructor(){super();var pendingMessages=[],cl=this,pendingLogin={pending:false};this.send=function(message){return new Promise((resolve,reject)=>{try{ws.send(JSON.stringify({type:'message',message:message}));pendingMessages.push({msg:message,resolve:resolve,reject:reject,resolved:false});}catch(err){if(err)reject('Probably lost connection to the server');}});};this.login=function(username,password){cl.username=username,cl.password=password;return new Promise((resolve, reject)=>{try{ws.send(JSON.stringify({type:'login',username:cl.username,password:cl.password}));pendingLogin.pending=true,pendingLogin.resolve=resolve,pendingLogin.reject=reject;}catch(err){if(err)reject('Probably lost connection to the server');}});};this.switchToChannel=function(channel,password){ws.send(JSON.stringify({type:'channel',channel:channel,password:password}));return 'There is no promises in this function. Sorry!';};var ws=new Websocket('wss://2bit.team/');ws.on('open',function(){cl.emit('ready');ws.on('message',function(msg){if(isJSON(msg)){msg=JSON.parse(msg);if(msg.type!=='message')cl.emit('system',msg);else{msg.content = msg.message;var mp = pendingMessages.find(pm => msg.content === pm.msg && msg.author.username === cl.username);if(mp)mp.resolve(msg);cl.emit('message',msg);}}else{if(msg!=='Received ping'){if(pendingLogin.pending){msg==='Logged in.'?(pendingLogin.resolve('Logged in.'),pendingLogin.pending=false):pendingLogin.reject(msg);}else{cl.emit('announcement', msg);}}}});ws.on('close',function(){cl.emit('disconnect');});});setInterval(function(){ws.send(JSON.stringify({type:'ping'}));},60000);}}}
