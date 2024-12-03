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
          heading="Protect the Data, Build the Future"
          callToAction={{
            text: "Get Started",
            url: "/getting-started",
          }}
          video={{
            url: "https://www.youtube.com/embed/mOZaPsR3nic",
            title: "Virtru Data Protection Gateway: Automatically Protect the Sensitive Data You Share",
          }}
        >
          <p>
            OpenTDF (Trusted Data Format) is a foundational platform that allows you to build and
            integrate “forever control” of your or your users&rsquo; respective data into new and
            existing applications.
          </p>
          <p>
            OpenTDF includes encryption, but it is much more than that. It includes additional
            cryptographically secured metadata that can ensure policy control throughout the
            lifecycle of data. Imagine being able to grant or revoke, “turn off”, access to your
            data at any time, even if it is not contained within your own network or application
            anymore.
          </p>
        </Hero>
        <Columns>
          <Columns.Item title="Zerotrust and OpenTDF" subtitle="The concept">
            <p>
              The concept of forever control stems from an increasingly common concept known as zero
              trust. Zero trust removes the implicit trust that many of us have granted to our data
              throughout its historical lifecycle. Zero trust says don&rsquo;t release the data
              unless there is a way to maintain control over it.
            </p>
            <p>
              While the idea of zero trust sounds great, making it happen is a bit more difficult.
              That&rsquo;s where OpenTDF comes in. By implementing or integrating OpenTDF into
              applications and projects, the appropriate owner of a respective piece of data can
              maintain control over that data forever, or at least as long as the data has not yet
              completed its intended lifecycle.
            </p>
          </Columns.Item>
          <Columns.Item title="Project Overview and Current State" subtitle="The refresh">
            <p>
              The OpenTDF project was first released in 2022 when the creators realized a real and
              pressing need in the community - the ability to protect data wherever it goes. This
              critical pillar of zero-trust and data-centric security, and the rising needs of
              data-centric interoperability, have fueled the OpenTDF team to build extensible,
              reliable, and easy-to-use software to create value out-of-the-box while also providing
              a clear path to production-scale deployments.
            </p>
            <p>
              To this end, the OpenTDF project has gotten a refresh - you can find details of how to
              get started on Github. The project refresh is in its early stages, so if you&rsquo;d
              like to keep up to date with the latest in OpenTDF, please give the new{" "}
              <a href="https://github.com/opentdf/platform">Platform Github</a>
              repository a Star and a Watch to get notifications about the latest development.
              Please also feel free to submit issues or discussion topics there - we&rsquo;d love to
              hear from you!
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
