"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
    }
    else {
        debug('Connection successful to: ' + mongodbURL);
    }
});
;
exports.UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_admin: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    verifycode: { type: mongoose_1.Schema.Types.Mixed },
    activities_fans: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Activity' }],
    activities_subs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Activity' }]
});
exports.UserSchema.pre('save', (next) => {
    let user = this;
    if (!user.isModified('password'))
        return next();
    exports.UserSchema.methods.encryptPassword(user.password, (hash) => {
        user.password = hash;
        next();
    });
});
exports.UserSchema.methods.encryptPassword = (password, cb) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err)
            return cb(err);
        bcrypt.hash(password, salt, (err, hash) => {
            if (err)
                return cb(err);
            cb(hash);
        });
    });
};
exports.UserSchema.methods.comparePassword = (password, cb) => {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err)
            return cb(err);
        cb(isMatch);
    });
};
exports.UserSchema.methods.verifyCode = (code, cb) => {
    if (this.verifycode) {
        if (this.verifycode.verifycode == code) {
            cb(1);
        }
        else {
            cb(2);
        }
    }
    else {
        cb(0);
    }
};
exports.UserModel = mongoose.model("User", exports.UserSchema);
;
exports.ActivitySchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    thumbnail_pic: [{ type: String }],
    description: { type: String },
    abstract: { type: String },
    author: { type: String },
    created: { type: Date, default: Date.now },
    user_fans: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    user_subs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }]
});
exports.ActivityModel = mongoose.model("Activity", exports.ActivitySchema);
