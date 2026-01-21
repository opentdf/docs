import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "V2 Entity Resolution",
      items: [
        {
          type: "doc",
          id: "entityresolution-v-2-entity-resolution-service-resolve-entities",
          label: "ResolveEntities",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "entityresolution-v-2-entity-resolution-service-create-entity-chains-from-tokens",
          label: "CreateEntityChainsFromTokens",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
