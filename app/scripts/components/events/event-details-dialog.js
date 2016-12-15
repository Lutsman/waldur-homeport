import template from './event-details-dialog.html';

export default function eventDetailsDialog() {
  return {
    restrict: 'E',
    template: template,
    controller: EventDetailsDialogController,
    controllerAs: '$ctrl',
    scope: {},
    bindToController: {
      dismiss: '&',
      resolve: '='
    }
  }
}

// @ngInject
function EventDetailsDialogController($scope) {
  this.event = this.resolve.event;
  $scope.$on('$stateChangeSuccess', function() {
    $scope.$close();
  });
}
