var config = require('config.json');
var mongodb = require('mongodb');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('questions');

var service = {};

//service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.getAll = getAll;
service.remove = remove;
//service.delete = _delete;

module.exports = service;

function getById(_id) {
    var deferred = Q.defer();

    db.questions.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll(_userId) {
    var deferred = Q.defer();
    var query = {
        userId: _userId
    }

    db.questions.find(query).toArray(function (err, questions) {

        if (err) deferred.reject(err.name + ': ' + err.message);

        if (questions) {
            // return user (without hashed password)
            deferred.resolve(questions, 'hash');
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(questionParams) {
    var deferred = Q.defer();

    db.questions.insert(
        questionParams,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve(doc.insertedIds[0].toString());
        });

    return deferred.promise;
}

function remove(_question) {
    var deferred = Q.defer();
    var query = {
        userId: _question.userId,
        _id: new mongodb.ObjectID(_question._id)
    }

    db.questions.deleteOne(query, function (err, question) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (question) {
            // return user (without hashed password)
            deferred.resolve(question, 'hash');
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}
