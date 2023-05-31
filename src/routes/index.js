
const moive = require('./moive')
const upload = require('./upload')
const room = require('./room')
const showTime = require('./showTime')
const auth=require('./auth')
const ticket = require('./ticket')
const combo= require('./combo')
const user= require('./user')
const payPal = require('./payPal')
const news  = require('./new')
const discount = require('./discount')
const vote = require('./vote')
const priceTicket = require('./priceTicket')
const statistical= require('./statistical')

function route(app){
    app.use('/api/upload', upload);
    app.use('/api/moive', moive);
    app.use('/api/room', room);
    app.use('/api/show-time', showTime);
    app.use('/api/auth', auth);
    app.use('/api/ticket',ticket);
    app.use('/api/combo', combo);
    app.use('/api/user', user);
    app.use('/api/paypal', payPal);
    app.use('/api/new', news);
    app.use('/api/discount', discount);
    app.use('/api/vote', vote);
    app.use('/api/price-ticket', priceTicket);
    app.use('/api/statistical', statistical);

}

module.exports =route;