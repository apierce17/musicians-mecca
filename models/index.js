var Sequelize = require('sequelize'), sequelize = null
const http = require('http')

// checks if env is Heroku, if so, sets sequelize to utilize the database hosted on heroku
if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres'
  })
}


// at the bottom of your script, this sets your server to listen for requests, after sequelize has been synced.
// so if you already have your server listening for requests, maybe delete that code. I think, IDK i just copied this
// off of documentation
// db.  is assuming you already set sequelize on db
db.sequelize.sync().then(function() {
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
});

  