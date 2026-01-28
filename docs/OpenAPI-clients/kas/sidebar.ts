import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "kas",
      items: [
        {
          type: "doc",
          id: "kas-access-service-public-key",
          label: "PublicKey",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "kas-access-service-legacy-public-key",
          label: "LegacyPublicKey",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "kas-access-service-rewrap",
          label: "Rewrap",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
