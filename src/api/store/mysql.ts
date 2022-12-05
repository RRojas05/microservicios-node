import mysql from 'mysql'
import config from '../../config'


class MySql{

  public conection =()=>{

    const dbConfig={
      host: config.mysql.host,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
    }

    console.log(`db config: ${JSON.stringify(dbConfig)}`)

    let conection = mysql.createConnection(dbConfig)

    conection.connect((err)=>{

      if(err){
        console.log(`[db err] ${err}`)
        setTimeout(this.conection, 2000)
      }else{
        console.log('DB connect ->')
      }
    })

    conection.on('err', err=>{
      if(err.code==='PROTOCOL_CONNECTION_LOST'){
        console.log('-> PROTOCOL_CONNECTION_LOST')
        this.conection()
      }else{
        throw err
      }
    })
  }
}

export const mySql= new MySql()
