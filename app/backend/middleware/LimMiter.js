require('dotenv').config();

const moment = require('moment');

const WINDOW_SIZE_IN_HOURS = 1; // Intervalo de monitoramento em HORAS
const MAX_WINDOW_REQUEST_COUNT = 2000; // Número limite de requisições
const WINDOW_LOG_INTERVAL_IN_HOURS = 1; // Frequência de Gravação de log

class RequestMonitor {
    #reqByUser;
    #maxSize;
    constructor() {
        this.#maxSize = 800;
        this.#reqByUser = new Map();
    }

    getRecord(ip) {
        const userAddress = this.#reqByUser.get(ip);
        if (userAddress) return userAddress;

        return null;
    }

    setRecord(ip, record) {
        if (this.#reqByUser.size === this.#maxSize)
            this.#reqByUser.clear();

        //console.table(this.#reqByUser);
        this.#reqByUser.set(ip, record);
    }
}

const monitor = new RequestMonitor();

function monitoringReqByUser(req, res, next) {
    const recordAccess = monitor.getRecord(req.ip);
    //console.log('REGISTRO ACESSADO ' + recordAccess)

    const now = moment();
    if (!recordAccess) {
        const newRec = [];
        const log = {
            reqTime: now.unix(),
            reqCounter: 1
        };

        newRec.push(log);
        monitor.setRecord(req.ip, JSON.stringify(newRec));

        //console.log(req.ip+' entrou em NOVO REGISTRO!');
        return next();
    } else {
        const rec = JSON.parse(recordAccess);
        const windowStartTime = moment().subtract(WINDOW_SIZE_IN_HOURS, 'hours').unix();

        const requestsWithinWindow = rec.filter(entry => entry.reqTime > windowStartTime);

        const totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
            return accumulator + entry.reqCounter;
        }, 0);

        if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT)
            return res.status(429).send({
                success: false,
                message: `Você excedeu o limite de ${MAX_WINDOW_REQUEST_COUNT} requisições em ${WINDOW_SIZE_IN_HOURS} horas!`
            });

        const lastRequestLog = rec[rec.length - 1];

        const potentialCurrentWindowIntervalStartTimeStamp = now.subtract(WINDOW_LOG_INTERVAL_IN_HOURS, 'hours').unix();

        if (lastRequestLog.reqTime > potentialCurrentWindowIntervalStartTimeStamp) {
            lastRequestLog.reqCounter++;
            rec[rec.length - 1] = lastRequestLog;
        } else {
            rec.push({
                reqTime: now.unix(),
                reqCounter: 1
            });
        }

        monitor.setRecord(req.ip, JSON.stringify(rec));
        return next();
    }
}

module.exports = monitoringReqByUser;
