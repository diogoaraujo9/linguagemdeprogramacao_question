(function () {
    'use strict';

    angular
        .module('app')
        .factory('QuestionService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Remove = Remove;

        return service;

        function GetAll() {
            return $http.get('/api/questions/getAll').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/questions/' + _id).then(handleSuccess, handleError);
        }

        function Create(question) {
            return $http.post('/api/questions/register', question).then(handleSuccess, handleError);
        }

        function Remove(question) {
            return $http.delete('/api/questions/remove/' + question.userId + "/" + question._id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
