import app from "app.js";
import type { Server } from "http";
import colors from "colors";
import config from "config/index.js";


let server: Server | undefined;

async function main (){
    server = app.listen(Number(config.port),config.ip,  ()=>{
        console.log(
            colors.italic.green.bold(`Server is running on http://${config.ip}:${config.port}`)
        );
    })
}


main().catch((err)=>{
    console.error("Error starting server:", err);
    process.exit(1);
})

process.on("unhandledRejection", err =>{
    console.error("Unhandled rejection:", err);
    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
})


process.on("uncaughtException", err=>{
    console.error("Uncaught exception:", err);
    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
})