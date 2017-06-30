var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var debug = require('debug')('mongo');
var SALT_WORK_FACTOR = 10;
var config = require('../bin/config');
var db_user = config.db_user;
var db_passwd = config.db_passwd;
var db_port = config.db_port;
var db_name = config.db_name;
var db_url = config.db_url;

let mongodbURL = 'mongodb://' + db_user + ':' + db_passwd + '@' + 
								db_url + ':' + db_port + '/' + db_name;
let mongodbOptions = { };

mongoose.connect(mongodbURL, mongodbOptions, function (err, res) {
    if (err) { 
        debug('Connection refused to ' + mongodbURL);
        debug(err);
    } else {
        debug('Connection successful to: ' + mongodbURL);
    }
});

let Schema = mongoose.Schema;

// User schema
let User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_admin: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    verifycode: { type: Schema.Types.Mixed },
    activities_fans : [{ type: Schema.Types.ObjectId, ref: 'Activity' }]
});

User.pre('save', function(next) {
	let user = this;
	  if (!user.isModified('password')) return next();
	  User.methods.encryptPassword(user.password, function(hash){
		  user.password = hash;
		  next();
	  });
});

User.methods.encryptPassword = function(password, cb) {
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
	    if (err) return cb(err);
	    bcrypt.hash(password, salt, function(err, hash) {
	        if (err) return cb(err);
	        cb(hash);
	    });
	  });
};
	
//Password verification
User.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
	    cb(isMatch);
	});
};

//Password verification
User.methods.verifyCode = function(code, cb) {
   if(this.verifycode){
	   if(this.verifycode.verifycode == code){
		   cb(1);
	   }else{
		   cb(2);
	   }
   }else{
	   cb(0);
   }
};

//Define Models
let userModel = mongoose.model('User', User);
/////////////////////////////////////////////////////////////////////////////////////////////////
//Activity schema
let Activity = new Schema({
	title: { type: String, required: true, unique: true },
	thumbnail_pic: [{ type: String }],
	description: { type: String },
	abstract: { type: String },
	author: { type: String },
    created: { type: Date, default: Date.now },
    user_fans : [{ type: Schema.Types.ObjectId, ref: 'User' }],
    user_subs : [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

let activityModel = mongoose.model('Activity', Activity);


// Export Models
exports.userModel = userModel;
exports.activityModel = activityModel;
