import dotenv from 'dotenv'
import { Server } from "./server";

dotenv.config()

async function main(){
  const server= new Server()
  await server.listen()
}

main()
// (async ( ) => {

//   const server= new Server()
//   await server.listen()

//   }) ( )
