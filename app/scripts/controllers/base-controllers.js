'use strict';
// This file contains controllers of base pages attributes: header, footer, body, common menu and so on

(function() {
  angular.module('ncsaas')
    .controller('HeaderController', ['currentStateService', 'customersService', HeaderController]);

  function HeaderController(currentStateService, customersService) {
    var vm = this;

    vm.customers = [];
    vm.initCustomersList = initCustomersList;
    vm.user = currentStateService.getUser();
    vm.customer = currentStateService.getCustomer();
    vm.setCurrentCustomer = currentStateService.setCustomer;

    function initCustomersList() {
      vm.customers = customersService.getCustomersList();
    }

  }

})();