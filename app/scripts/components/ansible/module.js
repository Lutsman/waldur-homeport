import ansibleRoutes from './routes';
import AnsiblePlaybooksService from './ansible-playbook-service';
import AnsibleJobsService from './ansible-jobs-service';
import ansibleJobState from './ansible-job-state';
import ansibleJobsList from './ansible-jobs-list';
import ansibleJobCreate from './ansible-job-create';
import ansibleJobDetails from './ansible-job-details';
import ansibleJobResourcesList from './ansible-job-resources';
import ansibleJobSummary from './ansible-job-summary';
import registerAppstoreCategory from './appstore-category';
import registerSidebarExtension from './sidebar';

export default module => {
  module.config(ansibleRoutes);
  module.service('AnsiblePlaybooksService', AnsiblePlaybooksService);
  module.service('AnsibleJobsService', AnsibleJobsService);
  module.component('ansibleJobState', ansibleJobState);
  module.component('ansibleJobsList', ansibleJobsList);
  module.component('ansibleJobCreate', ansibleJobCreate);
  module.component('ansibleJobDetails', ansibleJobDetails);
  module.component('ansibleJobResourcesList', ansibleJobResourcesList);
  module.component('ansibleJobSummary', ansibleJobSummary);
  module.run(registerAppstoreCategory);
  module.run(registerSidebarExtension);
};
