import template from './action-dialog.html';

// TODO: Convert directive to Angular 1.5 component
export default function actionDialog() {
  return {
    restrict: 'E',
    template: template,
    controller: ActionDialogController
  };
}

// @ngInject
function ActionDialogController(
  $scope, $q, $http, $state, resourcesService, actionUtilsService,
  ActionResourceLoader, ncUtils, DEFAULT_FIELD_OPTIONS) {
  angular.extend($scope, {
    init: function () {
      $scope.errors = {};
      $scope.form = {};
      $scope.loading = true;
      ActionResourceLoader.getSelectList($scope.action.fields).then(function() {
        angular.forEach($scope.action.fields, function(field, name) {
          if (field.init) {
            field.init(field, $scope.resource, $scope.form, $scope.action);
          }
          if (field.default_value) {
            $scope.form[name] = field.default_value;
          }
          if (field.resource_default_value || $scope.action.name === 'update') {
            $scope.form[name] = $scope.resource[name];
          }
          if (field.modelParser) {
            $scope.form[name] = field.modelParser(field, $scope.form[name]);
          }
          if (field.type === 'multiselect') {
            $scope.form[name] = ActionResourceLoader.formatChoices(field, $scope.form[name]);
          }
          if ($scope.action.name === 'edit') {
            $scope.form[name] = $scope.resource[name];
            if (field.type === 'datetime' && $scope.resource[name]) {
              $scope.form[name] = new Date($scope.resource[name]);
            }
          }
          if (DEFAULT_FIELD_OPTIONS[field.type]) {
            field.options = DEFAULT_FIELD_OPTIONS[field.type];
          }
        });
        if ($scope.action.order) {
          $scope.fields = $scope.action.order.reduce((result, name) => {
            result[name] = $scope.action.fields[name];
            return result;
          }, {});
        } else {
          $scope.fields = $scope.action.fields;
        }
      }).finally(function() {
        $scope.loading = false;
      });
    },
    submitActive: function() {
      return $scope.ActionForm.$dirty || $scope.action.method === 'DELETE';
    },
    submitForm: function () {
      if ($scope.ActionForm.$invalid) {
        return $q.reject();
      }
      var fields = $scope.action.fields;
      if (!$scope.action.url) {
        $scope.action.url = $scope.resource.url + $scope.action.name + '/';
      }
      var form = {};
      if ($scope.action.serializer) {
        form = $scope.action.serializer($scope.form);
      } else {
        for (var name in fields) {
          if ($scope.form[name] != null) {
            var field = fields[name];
            var serializer = field.serializer || angular.identity;
            form[name] = serializer($scope.form[name], field);
          }
        }
      }

      var promise;
      var url;
      if ($scope.action.method === 'DELETE') {
        url = $scope.action.url + '?' + ncUtils.toKeyValue($scope.form);
        promise = $http.delete(url);
      } else if ($scope.action.method === 'PUT') {
        url = $scope.resource.url;
        promise = $http.put(url, form);
      } else {
        promise = $http.post($scope.action.url, form);
      }

      return promise.then(function(response) {
        $scope.errors = {};
        actionUtilsService.handleActionSuccess($scope.action);

        if (response.status === 201 && $scope.action.followRedirect) {
          const resource = response.data;
          return $state.go('resources.details', {
            resource_type: resource.resource_type,
            uuid: resource.uuid,
          });
        }

        $scope.controller.reInitResource($scope.resource);
        $scope.$close();
      }, function(response) {
        $scope.errors = response.data;
      });
    },
    cancel: function() {
      $scope.$dismiss();
    }
  });
  $scope.init();
}
