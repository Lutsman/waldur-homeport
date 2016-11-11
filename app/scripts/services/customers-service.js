'use strict';

(function() {
  angular.module('ncsaas')
    .service('customersService', [
      'baseServiceClass', '$state', '$q', '$http', 'ENV', 'currentStateService', 'usersService', customersService]);

  function customersService(baseServiceClass, $state, $q, $http, ENV, currentStateService, usersService) {
    var ServiceClass = baseServiceClass.extend({
      filterByCustomer: false,
      countryChoices: [],

      init:function() {
        this._super();
        this.endpoint = '/customers/';
      },
      getPersonalOrFirstCustomer: function(username) {
        var deferred = $q.defer();
        /*jshint camelcase: false */
        this.getList().then(
          function(customers) {
            for(var i = 0; i < customers.length; i++) {
              if (customers[i].name === username) {
                deferred.resolve(customers[i]);
              }
            }
            if (customers.length !== 0) {
              currentStateService.setHasCustomer(true);
              deferred.resolve(customers[0]);
            } else {
              $state.go('profile.details');
              currentStateService.setHasCustomer(false);
              deferred.reject();
            }
          }
        );

        return deferred.promise;
      },
      getBalanceHistory: function(uuid) {
        var query = {UUID: uuid, operation: 'balance_history'};
        return this.getList(query);
      },
      getCounters: function(query) {
        var query = angular.extend({operation: 'counters'}, query);
        return this.getFactory(false).get(query).$promise;
      },
      getTopMenuList: function () {
        var deferred = $q.defer();

        this.pageSize = ENV.topMenuCustomersCount;
        this.cacheTime = ENV.topMenuCustomersCacheTime;
        this.getList().then(function(response) {
          deferred.resolve(response);
        });
        // reset pageSize
        this.pageSize = ENV.pageSize;

        return deferred.promise;
      },
      isOwnerOrStaff: function() {
        var vm = this;
        return $q.all([
          currentStateService.getCustomer(),
          usersService.getCurrentUser()
        ]).then(function(result) {
          return vm.checkCustomerUser.apply(null, result);
        });
      },
      checkCustomerUser: function(customer, user) {
        if (user.is_staff) {
          return true;
        }
        for (var i = 0; i < customer.owners.length; i++) {
          if (user.uuid === customer.owners[i].uuid) {
            return true;
          }
        }
        return false;
      },
      loadCountries: function() {
        var vm = this;
        if (vm.countryChoices.length != 0) {
          return $q.when(vm.countryChoices);
        } else {
          return $http({
            method: 'OPTIONS',
            url: ENV.apiEndpoint + 'api/customers/'
          }).then(function(response) {
            vm.countryChoices = response.data.actions.POST.country.choices;
            return vm.countryChoices;
          });
        }
      }
    });
    return new ServiceClass();
  }

})();
