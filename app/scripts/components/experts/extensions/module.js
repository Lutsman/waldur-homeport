import registerSidebarExtension from './sidebar';
import registerTableExtension from './user-organizations';
import registerAppstoreCategory from './appstore-category';
import workspaceSelector from './workspace-selector.html';
import customerWorkspace from './customer-workspace.html';

function registerExtensionPoint(extensionPointService, features) {
  if (features.isVisible('experts')) {
    extensionPointService.register('project-dashboard-button', '<expert-request-button/>');
    extensionPointService.register('organization-dashboard-button', '<expert-request-button/>');
    extensionPointService.register('organization-selector', workspaceSelector);
    extensionPointService.register('organization-dashboard-button', customerWorkspace);
  }
}

export default module => {
  module.run(registerSidebarExtension);
  module.run(registerExtensionPoint);
  module.run(registerTableExtension);
  module.run(registerAppstoreCategory);
};
