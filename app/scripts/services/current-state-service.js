'use strict';

(function() {
  angular.module('ncsaas')
    .service('currentStateService', ['$q', '$window', 'ENV', 'ncUtils', '$rootScope', currentStateService]);

  /**
   * This service contains values of objects, that affect current displayed data.
   * Notice: CurrentStateService can not make any backend calls. It stores only selected on user-side objects.
   */
  function currentStateService($q, $window, ENV, ncUtils, $rootScope) {
    /*jshint validthis: true */
    var vm = this;
    vm.getCustomer = getCustomer;
    vm.setCustomer = setCustomer;
    vm.reloadCurrentCustomer = reloadCurrentCustomer;
    vm.isCustomerDefined = false;

    vm.getProject = getProject;
    vm.setProject = setProject;
    vm.handleSelectedProjects = handleSelectedProjects;
    vm.removeLastSelectedProject = removeLastSelectedProject;
    vm.getCustomerUuid = getCustomerUuid;
    vm.getProjectUuid = getProjectUuid;
    vm.isQuotaExceeded = isQuotaExceeded;

    vm.getHasCustomer = getHasCustomer;
    vm.setHasCustomer = setHasCustomer;

    // private variables:
    var customer = null;
    var project = null;
    var hasCustomer = undefined;

    function getHasCustomer() {
      return hasCustomer;
    }

    function setHasCustomer(value) {
      hasCustomer = value;
      $rootScope.$broadcast('hasCustomer', value);
    }

    function getCustomer() {
      return customer;
    }

    function getCustomerUuid() {
      return $window.localStorage[ENV.currentCustomerUuidStorageKey];
    }

    function getProjectUuid() {
      return $window.localStorage[ENV.currentProjectUuidStorageKey];
    }

    function getProject() {
      var deferred = $q.defer();
      if (project) {
        deferred.resolve(project)
      } else {
        deferred.reject();
      }
      return deferred.promise;
    }

    function setCustomer(newCustomer) {
      vm.isCustomerDefined = true;
      customer = $q.when(newCustomer);
      customer.then(function(response) {
        if (response) {
          $window.localStorage[ENV.currentCustomerUuidStorageKey] = response.uuid;
          vm.setHasCustomer(true);
        }
      });
    }

    function isQuotaExceeded(entity) {
      return vm.getCustomer().then(function(response) {
        response.quotas = response.quotas || [];
        return ncUtils.isCustomerQuotaReached(response, entity);
      });
    }

    function reloadCurrentCustomer(callback) {
      vm = this;
      vm.getCustomer().then(function(customer) {
        customer && customer.$get().then(function(customer) {
          vm.setCustomer(customer);
          callback(customer);
        });
      });
    }

    function setProject(newProject) {
      $window.localStorage.removeItem(ENV.currentProjectUuidStorageKey);
      if (newProject) {
        project = $q.when(newProject);
        project.then(function(response) {
          if (response) {
            $window.localStorage[ENV.currentProjectUuidStorageKey] = response.uuid;
          }
        });
      } else {
        project = undefined;
      }
    }

    function handleSelectedProjects(currentCustomer, projectUuid) {
      var selectedProjects = $window.localStorage['selectedProjects'] == undefined
          ? "{}"
          : $window.localStorage['selectedProjects'];
      selectedProjects = JSON.parse(selectedProjects);
      if (projectUuid && projectUuid.customer_uuid == currentCustomer) {
        selectedProjects[currentCustomer] = projectUuid.uuid;
        $window.localStorage.setItem('selectedProjects', JSON.stringify(selectedProjects));
      } else {
        for (var key in selectedProjects) {
          if (key == currentCustomer) {
            return selectedProjects[key];
          }
        }
      }
      return null;
    }

    function setProjects(selectedProjects, currentCustomer, projectUuid) {
      selectedProjects[currentCustomer] = projectUuid;
      $window.localStorage.setItem('selectedProjects', JSON.stringify(selectedProjects));
    }

    function removeLastSelectedProject(projectUuid) {
      if ($window.localStorage['selectedProjects']) {
        var projects = JSON.parse($window.localStorage['selectedProjects']);
        for (var customer in projects) {
          if (projects[customer] === projectUuid) {
            setProjects(projects, customer, undefined);
          }
        }
      }
    }
  }

})();
