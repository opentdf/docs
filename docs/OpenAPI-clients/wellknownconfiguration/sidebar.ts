import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "Well-Known Configuration",
      items: [
        {
          type: "doc",
          id: "wellknownconfiguration-well-known-service-get-well-known-configuration",
          label: "GetWellKnownConfiguration",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
