// Config.js is a file to configure the Application1.js
// Although it is not used extensively, It configures the Database related items

module.exports = {  
    port: process.env.PORT || 9000,
  db: {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    database: 'graduate',
    user: 'root',
    password: 'password',
    port: 3306
  }
};
