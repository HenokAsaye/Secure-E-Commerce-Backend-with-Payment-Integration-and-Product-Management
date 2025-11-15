import {createLogger , format ,  transports} from "winston";
import path from "path";
import dotenv from"dotenv";
dotenv.config();


 export const logger = createLogger({
    level:"info",
    format:format.combine(
        format.colorize(),
        format.timestamp({format:'YY:MM:DD HH:mm:ss'}),
        format.json(),
        format.prettyPrint()
    ),
    transports:[
        new transports.File({filename:path.resolve("/logs/error.log"),level:"error"}),
        new transports.File({filename:path.resolve("/logs/combined.log")}),
        new transports.File({filename:path.resolve('/logs/custom.log'),level:'warn'}),
        new transports.File({filename:path.resolve('/logs/access.log'),level:'info'})
    ],

});

if(process.env.NODE_ENV !== "production"){
    logger.add(new transports.Console({
        format:format.combine(
            format.timestamp({format:'YY:MM:DD HH:mm:ss'}),
            format.colorize(),
        )
    }))
}


