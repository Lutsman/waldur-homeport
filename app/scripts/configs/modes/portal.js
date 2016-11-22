'use strict';

angular.module('ncsaas')
  .constant('MODE', {
    modeName: 'modePortal',
    toBeFeatures: [
      'localSignup',
      'localSignin',
      'password',
      'people',
      'compare',
      'templates',
      'sizing',
      'projectGroups',
      'apps',
      'premiumSupport',
      'notifications',
      'alerts',
      'mainSearch',
      'analytics',
      'turnkey_solutions',
      'security',
      'projectCostDetails',
      'import',
      'openMap'
    ],
    featuresVisible: false,
    appStoreCategories: [
      {
        name: 'Virtual machines',
        type: 'provider',
        icon: 'desktop',
        key: 'vms',
        services: ['Amazon', 'DigitalOcean', 'OpenStackTenant']
      },
      {
        name: 'Private clouds',
        type: 'provider',
        icon: 'cloud',
        key: 'private_clouds',
        services: ['OpenStack']
      },
      {
        name: 'Storages',
        type: 'provider',
        key: 'storages',
        services: ['OpenStackTenant']
      }
    ],
    serviceCategories: [
      {
        name: 'Virtual machines',
        services: ['Amazon', 'DigitalOcean', 'OpenStack'],
      }
    ],
    futureCategories: [
      'support',
      'apps'
    ],
    offeringCategories: [
      {
        label: 'IaaS',
        items: ['private_clouds', 'vms', 'storages', 'support']
      }
    ]
  });
