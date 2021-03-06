import template from './user-details.html';
import { PRIVATE_USER_TABS, PUBLIC_USER_TABS } from './constants';

export default function userDetails() {
  return {
    restrict: 'E',
    template: template,
    controller: UserDetailsController,
  };
}

// @ngInject
function UserDetailsController($scope, $state, $stateParams, usersService,
  stateUtilsService, currentStateService, WorkspaceService) {

  function getDashboardTab(user) {
    const prevWorkspace = stateUtilsService.getPrevWorkspace();
    if (prevWorkspace === 'project') {
      return {
        label: gettext('Back to project'),
        icon: 'fa-arrow-left',
        action: stateUtilsService.goBack
      };
    } else if (prevWorkspace === 'organization' &&
      (currentStateService.getOwnerOrStaff() || user.is_support)) {
      return {
        label: gettext('Back to organization'),
        icon: 'fa-arrow-left',
        action: stateUtilsService.goBack
      };
    }
  }

  function updateSidebar() {
    WorkspaceService.setWorkspace({
      hasCustomer: true,
      workspace: 'user',
    });
    usersService.getCurrentUser().then(function(user) {
      let dashboardTab = getDashboardTab(user);
      if (angular.isUndefined($stateParams.uuid) || $stateParams.uuid === user.uuid) {
        if (dashboardTab) {
          $scope.items = [dashboardTab].concat(PRIVATE_USER_TABS);
        } else {
          $scope.items = PRIVATE_USER_TABS;
        }
        $scope.isPrivate = true;
        $scope.currentUser = user;
        $scope.context = {user: user};
      } else {
        usersService.$get($stateParams.uuid).then(function(user) {
          if (dashboardTab) {
            $scope.items = [dashboardTab].concat(PUBLIC_USER_TABS);
          } else {
            $scope.items = PUBLIC_USER_TABS;
          }
          $scope.currentUser = user;
          $scope.isPrivate = false;
          $scope.context = {user: user};
        }).catch(function(response) {
          if (response.status === 404) {
            $state.go('errorPage.notFound');
          }
        });
      }
    });
  }
  $scope.$on('hasCustomer', updateSidebar);
  // $scope.$on('ownerOrStaff', updateSidebar);
  updateSidebar();
}
