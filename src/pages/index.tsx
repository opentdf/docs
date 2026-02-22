import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import { Hero, ProblemSolution, DeveloperFirst, Standards, Community, FinalCTA } from "../components/landing";

export default function Home() {
  return (
    <div className="homepage">
      <Head>
        {/* OpenGraph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="OpenTDF" />
        <meta property="og:url" content="https://opentdf.io" />
        <meta property="og:title" content="OpenTDF — Protect the Data, Build the Future" />
        <meta property="og:description" content="Open-source data-centric security for developers. Cryptographically bind protection directly to your data, wherever it goes." />
        <meta property="og:image" content="https://opentdf.io/img/opentdf-social.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="OpenTDF — Protect the Data, Build the Future" />
        <meta name="twitter:description" content="Open-source data-centric security for developers. Cryptographically bind protection directly to your data, wherever it goes." />
        <meta name="twitter:image" content="https://opentdf.io/img/opentdf-social.png" />
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
