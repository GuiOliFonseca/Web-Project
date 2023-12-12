const path = require('path');
const Message = require('./utils/Message');
const morgan = require('morgan');
const express = require('express');
const app = express();
const router = require('./routes/routes');
const helmet = require('helmet');
const monitoringReqByUser = require('./middleware/LimMiter');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cron = require('./utils/Jobs');

//Convert decimal string to float to return
const pg = require('pg');
pg.types.setTypeParser(pg.types.builtins.INT8, (value) => {
    return parseInt(value);
});

pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value) => {
    return parseFloat(value);
});

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) => {
    return parseFloat(value);
});

pg.types.setTypeParser(pg.types.builtins.JSON, (value) => {
    return JSON.parse(value);
});

app.use(cors({origin: true, credentials: true}));
app.use(helmet());
app.use(monitoringReqByUser);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('combined'));
app.use(cookieParser());

if (process.env.STORAGE_TYPE === 'local') {
    app.use(
        '/files',
        express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    )
}

// Raiz usará o o modulo router
app.use('/', router);

//console.clear();
Message.info('\nNão faça alterações no sistema!');

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    allowEIO4: true,
    cors: {
        origin: '*',
        credentials: true,
        transports: ['websocket', 'polling'],
    }
})
const WebSockets = require('./utils/WebSockets.js');

global.io = io.listen(server);
global.io.on('connection', WebSockets.connection);

server.keepAliveTimeout = 61 * 1000;



server.listen(process.env.APP_PORT || 3000, error => {
    Message.release(`\nAPI Versão: ${process.env.APP_VERSION}`)
    Message.success(
        `Servidor rodando na porta: ${process.env.APP_PORT || 3000}  ;^)\n`
    )
    if (error) Message.error('Servidor encerrado! >:^(\n')
})
