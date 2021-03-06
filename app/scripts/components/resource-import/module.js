import resourceImportDialog from './resource-import-dialog';
import assignPackageDialog from '../openstack/openstack-tenant/openstack-tenant-assign-package-dialog';
import importVirtualMachinesList from './import-virtual-machines-list';
import importVirtualCloudsList from './import-virtual-clouds-list';
import registerImportInstanceTableAction from './register-import-instance-table-action';
import registerImportVPCTableAction from './register-import-vpc-table-action';
import ImportUtils from './utils';
import importResourcesService from './import-resources-service';
import ImportResourcesEndpointRegistry from './import-resources-endpoint-registry';

export default module => {
  module.component('resourceImportDialog', resourceImportDialog);
  module.component('assignPackageDialog', assignPackageDialog);
  module.component('importVirtualMachinesList', importVirtualMachinesList);
  module.component('importVirtualCloudsList', importVirtualCloudsList);
  module.run(registerImportInstanceTableAction);
  module.run(registerImportVPCTableAction);
  module.service('ImportUtils', ImportUtils);
  module.service('importResourcesService', importResourcesService);
  module.service('ImportResourcesEndpointRegistry', ImportResourcesEndpointRegistry);
};
