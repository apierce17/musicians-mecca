const Sequelize = require('sequelize');
const db = require('../config/database');
const bcrypt = require('bcrypt');

const User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
},
username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
},
password: {
    type: Sequelize.STRING,
    allowNull: false
},
inputfirstname: {
    type: Sequelize.STRING,
    allowNull: false
},
inputlastname: {
    type: Sequelize.STRING,
    allowNull: false
},
email: {
    type: Sequelize.STRING,
    allowNull: false
},
role: {
    type: Sequelize.STRING,
    allowNull: false
},
style: {
    type: Sequelize.STRING,
    allowNull: false
},
instrument: {
    type: Sequelize.STRING,
    allowNull: false
},
createdAt: {
    type: Sequelize.DATE,
    allowNull: false
},
updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
}
});

User.beforeCreate((user, options) => {
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);
});

User.prototype.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};


User.sync().then(() => {
  console.log('table created')
})
.catch(error => console.log('This error occured', error));

module.exports = User;
