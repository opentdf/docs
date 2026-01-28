import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "V1 Entity Resolution",
      items: [
        {
          type: "doc",
          id: "entityresolution-entity-resolution-service-resolve-entities",
          label: "ResolveEntities",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "entityresolution-entity-resolution-service-create-entity-chain-from-jwt",
          label: "CreateEntityChainFromJwt",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
