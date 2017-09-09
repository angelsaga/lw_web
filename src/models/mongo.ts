import { Document, Schema, Model } from 'mongoose';
import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";

let debug = require('debug')('mongo');
let config = require('../../bin/config');
let db_user = config.db_user;
let db_passwd = config.db_passwd;
let db_port = config.db_port;
let db_name = config.db_name;
let db_url = config.db_url;
let SALT_WORK_FACTOR = 10;

let mongodbURL = 'mongodb://' + db_user + ':' + db_passwd + '@' +
	db_url + ':' + db_port + '/' + db_name;
let mongodbOptions = {};

mongoose.connect(mongodbURL, mongodbOptions, (err) => {
	if (err) {
		debug('Connection refused to ' + mongodbURL);
		debug(err);
	} else {
		debug('Connection successful to: ' + mongodbURL);
	}
});

/////////////////////////////////////////////////////////////////////////////////////////////////
//User schema
export interface IUserModel extends mongoose.Document {
	username: String;
	password: String;
	is_admin: Boolean;
	created: Date;
	verifycode: Schema.Types.Mixed;
	activities_fans: Schema.Types.ObjectId[];
	activities_subs: Schema.Types.ObjectId[];
	encryptPassword(password, cb);
	comparePassword(password, cb);
	verifyCode(code, cb);
};

export const UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	is_admin: { type: Boolean, default: false },
	created: { type: Date, default: Date.now },
	verifycode: { type: Schema.Types.Mixed },
	activities_fans: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
	activities_subs: [{ type: Schema.Types.ObjectId, ref: 'Activity' }]
});

UserSchema.pre('save', function(next){
	let user = this;
	if (!user.isModified('password')) return next();
	UserSchema.methods.encryptPassword(user.password,
		(hash) => {
			user.password = hash;
			next();
		});
});

UserSchema.methods.encryptPassword = function(password, cb) {
	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
		if (err) return cb(err);
		bcrypt.hash(password, salt, (err, hash) => {
			if (err) return cb(err);
			cb(hash);
		});
	});
};

//Password verification
UserSchema.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, (err, isMatch) => {
		if (err) return cb(err);
		cb(isMatch);
	});
};

//Password verification
UserSchema.methods.verifyCode = function(code, cb) {
	if (this['verifycode']) {
		if (this['verifycode']['verifycode'] == code) {
			cb(1);
		} else {
			cb(2);
		}
	} else {
		cb(0);
	}
};

export const UserModel: Model<IUserModel>
	= mongoose.model<IUserModel>("User", UserSchema);



/////////////////////////////////////////////////////////////////////////////////////////////////
//Activity schema
export interface IActivityModel extends mongoose.Document {
	title: String;
	thumbnail_pic: String[];
	description: String;
	abstract: String;
	author: String;
	created: Date;
	user_fans: Schema.Types.ObjectId[];
	user_subs: Schema.Types.ObjectId[];
 };

export const ActivitySchema = new mongoose.Schema({
	title: { type: String, required: true, unique: true },
	thumbnail_pic: [{ type: String }],
	description: { type: String },
	abstract: { type: String },
	author: { type: String },
	created: { type: Date, default: Date.now },
	user_fans: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	user_subs: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export const ActivityModel: Model<IActivityModel>
	= mongoose.model<IActivityModel>("Activity", ActivitySchema);


