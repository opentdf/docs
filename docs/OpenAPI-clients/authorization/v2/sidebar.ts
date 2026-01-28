import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "V2 Authorization",
      items: [
        {
          type: "doc",
          id: "authorization-v-2-authorization-service-get-decision",
          label: "GetDecision",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "authorization-v-2-authorization-service-get-decision-multi-resource",
          label: "GetDecisionMultiResource",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "authorization-v-2-authorization-service-get-decision-bulk",
          label: "GetDecisionBulk",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "authorization-v-2-authorization-service-get-entitlements",
          label: "GetEntitlements",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
