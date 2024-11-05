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
        new transports.File({filename:"../logs/error.log",level:"error"}),
        new transports.File({filename:"../logs/combined.log"})
    ],

});

if(process.env.NODE_ENV !== "production"){
    logger.addnew (new transports.Console({
        format:format.simple()
    }))
}

module.exports = logger;