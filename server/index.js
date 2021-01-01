const {ApolloServer, gql} = require('apollo-server');
const mysql = require('mysql2');
const con = mysql.createConnection({
  //Connection variable
  host: 'localhost',
  user: 'root',
  password: '<ENTER-MYSQL-PWD>',
  database: 'NewzLPuser', //Create DataBase if not present
});
con.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected!');
});
const typeDefs = require('./schema');
function queryUsingID(uid) {
  return new Promise(function (resolve, reject) {
    con.query(
      `SELECT * FROM userDetails WHERE userID=${uid};`,
      (error, result) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(result[0]);
        }
      },
    );
  });
}
function changeDPusingID(uid, newRoute) {
  return new Promise(function (resolve, reject) {
    con.query(
      `UPDATE userDetails SET dpRoute='${newRoute}' WHERE userID=${uid};`,
      (error, result) => {
        if (error) {
          return reject(error);
        } else {
          return resolve('Success');
        }
      },
    );
  });
}
const resolvers = {
  Query: {
    getUserByID: async (parent, args) => {
      let ReturnedRow = await queryUsingID(args.userID);
      return ReturnedRow;
    },
  },
  Mutation: {
    changeDP: async (parent, args) => {
      let ReturnedString = await changeDPusingID(args.userID, args.dpRoute);
      if (ReturnedString === 'Success') {
        let ReturnedRowAM = await queryUsingID(args.userID);
        return ReturnedRowAM;
      }
    },
  },
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`);
});
