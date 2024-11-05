import {createLogger , format , log, transports} from "winston";
import dotenv from"dotenv";
dotenv.config();


const logger = createLogger({
    level:"info",
    format:format.combine(
        format.timestamp(),
        format.json(),
        format.prettyPrint()
    ),
    transports:[
        new transports.File({filename:"/logs/error.log",level:"error"}),
        new transports.File({filename:"/logs/combined.log"}),
        new transports.File({filename:'/logs/custom.log',level:'warn'}),
        new transports.File({filename:'/logs/access.log',level:'info'})
    ],

});

if(process.env.NODE_ENV !== "production"){
    logger.addnew (new transports.Console({
        format:format.combine(
            format.timestamp({format:'YY:MM:DD HH:mm:ss'}),
            format.colorize(),
            format.label('my app')
        )
    }))
}

module.exports = logger;