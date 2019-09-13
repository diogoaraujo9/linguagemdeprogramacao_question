var config = require('config.json');
var express = require('express');
var router = express.Router();
var questionService = require('services/question.service');

// routes
router.post('/register', registerQuestion);
router.get('/getAll', getAll);
router.delete('/remove/:userId/:questionId', removeQuestion)

module.exports = router;

function registerQuestion(req, res) {
    questionService.create(req.body)
        .then(function (_newId) {
            res.status(200).send(_newId);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    questionService.getAll(req.session.userId)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function removeQuestion(req, res) {
    let remove = {
        _id: req.params.questionId,
        userId: req.params.userId
    }
    questionService.remove(remove)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}