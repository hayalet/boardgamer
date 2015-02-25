var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    email: String,
    hash_password: String,
    salt: String,
    createdAt: { type: Date, default: Date.now },
    games: Array,
    role: {
        bitMask: Number,
        title: String
    }
});

UserSchema
    .virtual('user_info')
    .get(function() {
       return { 'role': this.role, 'email': this.email, 'username': this.username, 'games': this.games};
    });

UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hash_password = this.encryptPassword(password)
    })
    .get(function() { return this._password });

UserSchema.methods = {

    encryptPassword: function(password) {
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    },

    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    authenticate: function(password) {
        return this.encryptPassword(password) === this.hash_password;
    }
};

mongoose.model('User', UserSchema);