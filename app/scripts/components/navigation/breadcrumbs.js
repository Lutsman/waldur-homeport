import template from './breadcrumbs.html';

export const breadcrumbs = {
  template,
  bindings: {
    items: '<',
    activeItem: '<'
  },
  controller: class BreadcrumbsController {
    constructor($state) {
      this.$state = $state;
    }

    onClick(item) {
      if (item.action) {
        item.action();
      }
      else if (item.state) {
        this.$state.go(item.state, item.params);
      }
    }
  }
};
