const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const crypto = require('crypto-js');

app.use(bodyParser.urlencoded({ extended: true }));

let users = [];

app.post('/sign-in', (req, res) => {
	const hashCode = crypto.SHA256(req.body.nickname).toString();
	users[hashCode] = req.body.nickname;
	console.log(`User ${ users[hashCode] } was registrated`);
	res.end(users[hashCode]);
});

io.on('connection', socket => {
	let hashCode;

	socket.on('checkAuth', data => {
		if (data in users) {
			hashCode = data;
			console.log(`User ${ users[hashCode] } connected`);
		}
	});

	socket.on('message', data => {
		if (hashCode === data.hashCode && data.hashCode in users) {
			console.log(`${ users[hashCode] }: ${ data.message }`);
		}
	});

	socket.on('disconnect', () => {
		console.log(`User ${ users[hashCode] } disconnected`);
	});
});

http.listen(3000, () => {
	console.log('Listening on 3000');
});
