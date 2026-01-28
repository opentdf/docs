import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "V1 Authorization",
      items: [
        {
          type: "doc",
          id: "authorization-authorization-service-get-decisions",
          label: "GetDecisions",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "authorization-authorization-service-get-decisions-by-token",
          label: "GetDecisionsByToken",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "authorization-authorization-service-get-entitlements",
          label: "GetEntitlements",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
