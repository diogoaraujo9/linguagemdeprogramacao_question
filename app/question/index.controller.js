(function () {
    'use strict';

    angular
        .module('app')
        .controller('Question.IndexController', Controller);

    function Controller(QuestionService, FlashService, UserService) {
        var vm = this;

        vm.user = null;
        vm.question = null;
        vm.questionsList = [];
        vm.saveQuestion = saveQuestion;
        vm.removeQuestion = removeQuestion;
      
        initController();

        function initController() {
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                getAllQuestions();
            });
        }  

        function getAllQuestions(){
            QuestionService.GetAll()
                .then(function (resp) {
                    vm.questionsList = resp;
                })
        }

        function saveQuestion() {
            let question = {
                question: vm.question,
                userId: vm.user._id
            }
            QuestionService.Create(question)
                .then(function (_newId) {
                    let createdQuestion = {
                        _id: _newId,
                        question: question.question,
                        userId: question.userId
                    };
                    vm.questionsList.push(createdQuestion);
                    FlashService.Success('Question created');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function removeQuestion(question) {
            let questionToBeRemoved = {
                _id: question._id,
                userId: question.userId
            }
            QuestionService.Remove(questionToBeRemoved)
                .then(function () {
                    vm.questionsList = vm.questionsList.filter(x => x._id != questionToBeRemoved._id);
                    FlashService.Success('Question removed');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();