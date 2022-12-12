// import {db} from '../store/mysql'

// class Connection{

//   public getConnection = async (query: string) => {
//     console.log('-> initDB');
//     db.connect()
//       .then((connection: any) => {
//         console.log(`-> DB connected ${connection}`);
//         db.query(connection, query)
//           .then((response) => {
//             console.log(`-> query response ${JSON.stringify(response)}`);
//             console.log(`-> query response ${typeof response}`);
//             console.log(`-> query response ${response.length}`);

//             return response
//           })
//           .catch((err) => {
//             console.log(`-> query error ${err}`);
//           })
//           .finally(()=>{
//             console.log(`DB connection close`)
//             connection.end()
//           });
//       })
//       .catch((err) => {
//         console.log(`-> DB error ${err}`);
//       });
//   };
// }

// export const
