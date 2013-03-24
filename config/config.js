module.exports = {
  // disable database
  database: false,
  /*
    if you use database
    {
      user: 'postgres',
      password: '',
      host: 'localhost',
      database: 'simple-chat_development',
      pool: 8
    },
  */
  websocket:{
    port: 8081,
    maxPackageSize: 10*1024*1024
  }
}
