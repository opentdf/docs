import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import { Columns, Hero, Features, Feedback } from "../components/Homepage";

export default function Home() {
  return (
    <div className="homepage">
      <Head>
        <meta property="og:title" content="OpenTDF - Protect the Data, Build the Future" />
        <meta property="og:description" content="Persistent data centric security that extends owner control wherever data travels." />
      </Head>
      <Layout title="OpenTDF" description="OpenTDF">
        <Hero
          heading="OpenTDF: A toolkit for zero trust, data-centric security"
          callToAction={{
            text: "Get Started",
            url: "/getting-started",
          }}
        >
          <p>
          OpenTDF is an open source system for implementing data centric security. 
          It provides the basic services required to enable the definition, application, 
          and enforcement of attribute based policies using the Trust Data Format (TDF). 
          TDF is an open standard that enables you to cryptographically bind 
          attribute based access control (ABAC) policy to a data object so that 
          the policy travels with the data wherever it goes.
          </p>
          <p>
          OpenTDF builds upon a decade of experience at Virtru 
          protecting data objects at scale using the Trusted Data Format 
          for organizations of all sizes and across all industries.
          </p>
        </Hero>
        <Columns>
          <Columns.Item title="Zero Trust and OpenTDF" subtitle="Why OpenTDF?">
            <p>
            Today's cybersecurity landscape is increasingly adopting and requiring Zero Trust models and frameworks. 
            Zero Trust operates on the principle of "never trust, always verify," 
            ensuring that every access request is authenticated, authorized, and encrypted, 
            regardless of its origin. OpenTDF implements this model by providing an open-source framework, specification, and set of services
            that prioritizes the protection and integrity of data at every stage. 
            </p>
            <p>
            By integrating OpenTDF’s data security features with a Zero Trust architecture, 
            organizations can enforce strict access controls, ensure data is continuously monitored, 
            and maintain comprehensive visibility into data interactions. This synergy not only 
            minimizes the risk of data breaches but also fosters a secure environment where data 
            can be shared and utilized with confidence. Together, Zero Trust and OpenTDF empower businesses 
            to uphold the highest standards of data security in an interconnected world.
            </p>
          </Columns.Item>
          <Columns.Item title="Project Overview and Current State" subtitle="What's New">
            <p>
            In 2023, the OpenTDF team undertook a significant re-architecture 
            of the OpenTDF platform to enhance its extensibility and interoperability, 
            responding to the evolving needs of our diverse user base and the dynamic cybersecurity landscape.
            See our {" "}<a href="https://github.com/opentdf/">Github Organization Page</a> to navigate the new repositories. 
            </p>
            <p>
            This comprehensive overhaul involved simplifying core service components, 
            adopting standardized policy schemas, and improving platform APIs and SDKs both in 
            developer experience and in capability. By focusing on extensibility, we have enabled 
            developers to customize and extend OpenTDF’s functionalities to suit specific use cases, 
            fostering innovation and adaptability. As we continue to advance, our focus remains on empowering the community with a secure, adaptable, 
            and interoperable platform that meets the highest standards of data protection and fosters collaborative innovation.
            </p>
            <p>
              Through the sponsorship of Virtru and its partners, the OpenTDF project has been
              meeting the needs of customers across industries and use cases. Check out{" "}
              <a href="https://www.virtru.com/data-security-platform">
                Virtru Data Security Platform
              </a>{" "}
              for more.
            </p>
          </Columns.Item>
        </Columns>
        <Features
          title="OpenTDF Examples"
          description="Ideas for leveraging OpenTDF in your own applications"
          imageUrl=""
        >
          {/* <Features.Item title="SecureCycle" description="SecureCycle is a sample application that demonstrates how OpenTDF safeguards private health information &hyphen; in this case, sensitive data related to period tracking and symptoms." icon="carbon:location-heart"
          callToAction={{ title: 'Learn more', url: 'https://google.com' }} /> */}
          <Features.Item title="Secure IoT Sensor Data" description="From full-motion video to biometric devices, attach access controls and preserve data integrity to guard against data spoofing." icon="carbon:fingerprint-recognition" />
          <Features.Item title="Secure Data Sharing" description="Securely share data with partners, customers, and suppliers, and maintain control over who can access it." icon="carbon:ai-governance-lifecycle" />
        </Features>
        <Feedback
          title="Share Your Feedback"
        >
          <p>
            Virtru, the sponsor of the OpenTDF developer community, would love to hear from you!
          </p>
          <p>
            We're developers, too, and as we mature the project, we're curious what you're building, and what kind of problems you may be encountering or are trying to solve.
          </p>
          <p>
            You can provide anonymous feedback (name, email, and company are not required fields on this form), or share your contact information for access to curated resources, updates, and if you request a response.
          </p>
        </Feedback>
      </Layout>
    </div>
  );
}
