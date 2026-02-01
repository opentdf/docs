import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "Policy Subject Mapping",
      items: [
        {
          type: "doc",
          id: "policy-subjectmapping-subject-mapping-service-match-subject-mappings",
          label: "MatchSubjectMappings",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "policy-subjectmapping-subject-mapping-service-list-subject-mappings",
          label: "ListSubjectMappings",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "policy-subjectmapping-subject-mapping-service-get-subject-mapping",
          label: "GetSubjectMapping",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "policy-subjectmapping-subject-mapping-service-create-subject-mapping",
          label: "CreateSubjectMapping",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "policy-subjectmapping-subject-mapping-service-update-subject-mapping",
          label: "UpdateSubjectMapping",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "policy-subjectmapping-subject-mapping-service-delete-subject-mapping",
          label: "DeleteSubjectMapping",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "policy-subjectmapping-subject-mapping-service-list-subject-condition-sets",
          label: "ListSubjectConditionSets",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "policy-subjectmapping-subject-mapping-service-get-subject-condition-set",
          label: "GetSubjectConditionSet",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "policy-subjectmapping-subject-mapping-service-create-subject-condition-set",
          label: "CreateSubjectConditionSet",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "policy-subjectmapping-subject-mapping-service-update-subject-condition-set",
          label: "UpdateSubjectConditionSet",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "policy-subjectmapping-subject-mapping-service-delete-subject-condition-set",
          label: "DeleteSubjectConditionSet",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "policy-subjectmapping-subject-mapping-service-delete-all-unmapped-subject-condition-sets",
          label: "DeleteAllUnmappedSubjectConditionSets",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
