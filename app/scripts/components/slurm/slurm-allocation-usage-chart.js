import { loadChartjs } from './utils';

export default function slurmAllocationUsageChart() {
  return {
    restrict: 'E',
    scope: {
      items: '=',
    },
    template: `<loading-spinner ng-show="loading"/><div style="width: 100%" ng-show="!loading"><canvas/></div>`,
    link: function(scope, element) {
      // @ngInject
      scope.loading = true;
      loadChartjs().then(Chart => {
        scope.loading = false;
        const ctx = element[0].querySelector('canvas').getContext('2d');
        const options = {
          type: 'bar',
          data: scope.items,
          options: {
            responsive: true,
            tooltips: {
              mode: 'index',
              intersect: false
            },
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                stacked: true,
              }],
              yAxes: [{
                stacked: true
              }]
            }
          }
        };
        new Chart(ctx, options);
        scope.$digest();
      });
    }
  };
}
