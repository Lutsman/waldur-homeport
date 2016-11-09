import template from './list.html';

export default function issueList() {
  return {
    restrict: 'E',
    template: template,
    controller: IssueListController,
    controllerAs: 'IssueList'
  };
}

// @ngInject
function IssueListController(
  baseControllerListClass,
  issuesService,
  issueCommentsService,
  $rootScope,
  ENTITYLISTFIELDTYPES,
  ncUtils) {
  var controllerScope = this;
  var controllerClass = baseControllerListClass.extend({
    issueComments: {},
    expandableCommentsKey: 'comments',

    init:function() {
      this.service = issuesService;
      this.controllerScope = controllerScope;
      this._super();
      this.searchFieldName = 'search';
      this.entityOptions = {
        entityData: {
          createLink: 'support.create',
          createLinkText: 'Create ticket',
          noDataText: 'No tickets yet.',
          noMatchesText: 'No tickets found matching filter.',
          hideActionButtons: false,
          hideTableHead: true,
          actionButtonsType: 'refresh',
          expandable: true
        },
        list: [
          {
            type: ENTITYLISTFIELDTYPES.statusCircle,
            className: 'statusCircle support',
            propertyName: 'resolution',
            showForMobile: true
          },
          {
            className: 'avatar',
            avatarArraySrc: [
              'assignee',
              'emailAddress'
            ],
            showForMobile: false,
            type: ENTITYLISTFIELDTYPES.avatarPictureField
          },
          {
            propertyName: 'summary',
            className: 'name support',
            subtitle: ENTITYLISTFIELDTYPES.subtitle,
            showForMobile: ENTITYLISTFIELDTYPES.showForMobile,
            type: ENTITYLISTFIELDTYPES.name
          }
        ]
      };
      this.expandableOptions = [
        {
          isList: false,
          addItemBlock: false,
          headBlock: 'description',
          hasAnswerForm: true,
          answersBlock: true,
          listKey: 'issueComments',
          modelId: 'uuid',
          viewType: 'support',
          minipaginationData:
          {
            pageChange: this.getCommentsForIssue.bind(this),
            pageEntityName: this.expandableCommentsKey
          }
        }
      ];
    },
    showMore: function(issue) {
      if (!this.issueComments[issue.uuid]) {
        this.getCommentsForIssue(issue.uuid);
      }
    },
    getCommentsForIssue: function(uuid, page) {
      ncUtils.blockElement('comments_' + uuid, this._getCommentsForIssue(uuid, page));
    },
    _getCommentsForIssue: function(uuid, page) {
      var vm = this;
      vm.issueComments[uuid] = {data:null};
      page = page || 1;
      issueCommentsService.page = page;
      issueCommentsService.pageSize = 5;
      vm.issueComments[uuid].page = page;
      issueCommentsService.filterByCustomer = false;
      return issueCommentsService.getList({
        issue_uuid: uuid
      }).then(function(response) {
        vm.issueComments[uuid].data = response;
        vm.issueComments[uuid].pages = issueCommentsService.pages;
        $rootScope.$broadcast('mini-pagination:getNumberList', vm.issueComments[uuid].pages,
          page, vm.getCommentsForIssue.bind(vm), vm.expandableCommentsKey, uuid);
      });
    },
    addComment: function(issue) {
      var vm = this;
      issue.newCommentSaving = true;
      var instance = issueCommentsService.$create();
      instance.message = issue.newCommentBody;
      instance.issue = issue.url;
      instance.$save(
        function() {
          vm.getCommentsForIssue(issue.uuid);
          issue.newCommentSaving = false;
          issue.newCommentBody = "";
        },
        function(response) {
          issue.newCommentSaving = false;
          alert(response.data.non_field_errors);
        }
      );
    },
  });

  controllerScope.__proto__ = new controllerClass();
}