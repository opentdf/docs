import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import { Hero, ProblemSolution, DeveloperFirst, Standards, Community, FinalCTA } from "../components/landing";

export default function Home() {
  return (
    <div className="homepage">
      <Head>
        <meta property="og:title" content="OpenTDF - Protect the Data, Build the Future" />
        <meta
          property="og:description"
          content="Open-source data-centric security. Cryptographically bind protection directly to your data, wherever it goes."
        />
      </Head>
      <Layout
        title="OpenTDF — Protect the Data, Build the Future"
        description="Open-source data-centric security. Cryptographically bind protection directly to your data, wherever it goes."
      >
        <Hero />
        <ProblemSolution />
        <DeveloperFirst />
        <Standards />
        <Community />
        <FinalCTA />
      </Layout>
    </div>
  );
}
