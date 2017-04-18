import template from './project-policies.html';

const projectPolicies = {
  template: template,
  bindings: {
    project: '<'
  },
  controller: class ProjectPoliciesController {
    constructor(
      ENV,
      projectsService,
      certificationsService,
      ncUtilsFlash,
      customersService,
      $rootScope,
      $q) {
      this.ENV = ENV;
      this.projectsService = projectsService;
      this.certificationsService = certificationsService;
      this.ncUtilsFlash = ncUtilsFlash;
      this.customersService = customersService;
      this.$rootScope = $rootScope;
      this.$q = $q;
    }

    $onInit() {
      this.currency = this.ENV.currency;
      this.canManage = false;
      this.projectCertifications = angular.copy(this.project.certifications);
      this.certificationsList = this.project.certifications.map(x => x.name).join(', ');

      this.estimate = angular.copy(this.project.price_estimate);
      this.isHardLimit = this.checkIsHardLimit(this.estimate);

      this.loading = true;
      this.$q.all([
        this.certificationsService.getAll().then(certifications => {
          this.certifications = certifications;
        }),

        this.customersService.isOwnerOrStaff().then(canManage => {
          this.canManage = canManage;
        })
      ]).finally(() => this.loading = false);
    }

    updatePolicies() {
      let promises = [];

      if (this.project.price_estimate.threshold !== this.estimate.threshold) {
        promises.push(this.projectsService.setThreshold(this.project.url, this.estimate.threshold));
      }

      if (this.isHardLimit !== this.checkIsHardLimit(this.project.price_estimate)) {
        const limit = this.isHardLimit && this.estimate.threshold || 0;
        promises.push(this.projectsService.setLimit(this.project.url, limit));
      }

      promises.push(this.updateCertifications());
      return this.$q.all(promises).then(() => {
        this.ncUtilsFlash.success(gettext('Project policies have been updated.'));
      });
    }

    updateCertifications() {
      function mapItems(items) {
        return items.map(item => ({url: item.url}));
      }
      const oldItems = mapItems(this.project.certifications);
      const newItems = mapItems(this.projectCertifications);
      if (angular.equals(oldItems, newItems)) {
        return this.$q.resolve();
      } else {
        return this.projectsService.updateCertifications(this.project.url, newItems).then(() => {
          this.projectsService.clearAllCacheForCurrentEndpoint();
          this.$rootScope.$broadcast('refreshProjectList');
        });
      }
    }

    checkIsHardLimit(estimate) {
      return estimate.limit > 0 && estimate.limit == estimate.threshold;
    }

    isOverThreshold() {
      return this.estimate.threshold > 0 && this.estimate.total >= this.estimate.threshold;
    }
  }
};

export default projectPolicies;
