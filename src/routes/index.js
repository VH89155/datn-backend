
const moive = require('./moive')
const upload = require('./upload')
const room = require('./room')
const showTime = require('./showTime')
const auth=require('./auth')
const ticket = require('./ticket')
const combo= require('./combo')
const user= require('./user')

function route(app){
    app.use('/api/upload', upload);
    app.use('/api/moive', moive);
    app.use('/api/room', room);
    app.use('/api/show-time', showTime);
    app.use('/api/auth', auth);
    app.use('/api/ticket',ticket);
    app.use('/api/combo', combo);
    app.use('/api/user', user);

}

module.exports =route;