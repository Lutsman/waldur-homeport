'use strict';

(function() {
  angular.module('ncsaas')
    .service('projectPermissionsService', ['baseServiceClass', 'ncUtils', projectPermissionsService]);

  function projectPermissionsService(baseServiceClass, ncUtils) {
    /*jshint validthis: true */
    var ServiceClass = baseServiceClass.extend({
      init:function() {
        this._super();
        this.endpoint = '/project-permissions/';
        this.filterByCustomer = false;
      },

      deletePermission: function(permission) {
        return this.$delete(this.getPermissionKey(permission));
      },

      getPermissionKey: ncUtils.getUUID
    });
    return new ServiceClass();
  }

})();

(function() {
  angular.module('ncsaas').constant('USERPROJECTROLE', {
    admin: 'admin',
    manager: 'manager'
  });
})();
