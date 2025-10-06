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
            text: "Get Started with OpenTDF",
            url: "/tutorials/your-first-tdf",
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
          <div style={{ 
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem',
            zIndex: 5,
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => document.getElementById('find-what-you-need')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '40px',
                backgroundColor: 'transparent',
                border: '2px solid var(--vds-color-blue-006)',
                color: 'var(--vds-color-blue-006)',
                fontWeight: 'bold',
                borderRadius: '5px',
                margin: '1rem',
                padding: '2rem 1rem',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--vds-color-blue-006)';
                e.currentTarget.style.color = 'var(--ifm-color-white)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--vds-color-blue-006)';
              }}
            >
              Learn More About OpenTDF
            </button>
          </div>
          <p style={{ 
            textAlign: 'center',
            color: 'var(--vds-color-blue-007)', 
            fontSize: '0.9rem',
            marginTop: '1rem',
            fontStyle: 'italic'
          }}>
            Want to get an instance of the OpenTDF Platform up and running? Click below!
          </p>
        </Hero>

        {/* Add spacing after hero section */}
        <div style={{ padding: '40px 0' }}>
          
          {/* Find What You Need Section */}
          <div id="find-what-you-need" className="container">
            <div className="row">
              <div className="col col--12">
                <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Find What You Need</h2>
                <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  Choose your learning path based on what you want to accomplish
                </p>
                <p style={{ 
                  textAlign: 'center', 
                  marginBottom: '3rem', 
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'var(--ifm-color-emphasis-700)'
                }}>

                </p>
              </div>
            </div>
            
            <div className="row" style={{ marginBottom: '3rem' }}>
              <div className="col col--6">
                <div className="card" style={{ 
                  height: '100%', 
                  padding: '2rem',
                  backgroundColor: 'var(--vds-color-blue-008)',
                  border: '1px solid var(--vds-color-blue-light)'
                }}>
                  <div className="card__header">
                    <h3>🚀 Tutorials</h3>
                    <p><em>I want to learn by doing</em></p>
                  </div>
                  <div className="card__body">
                    <p>Step-by-step guides that take you by the hand through a series of steps to complete a project or solve a problem.</p>
                    <ul>
                      <li><strong><a href="/tutorials/your-first-tdf">Your First TDF</a></strong> - Get hands-on experience creating your first protected data file</li>
                      <li><strong><a href="/tutorials">Complete Tutorial Series</a></strong> - Step-by-step guides for learning OpenTDF</li>
                      <li><strong><a href="/getting-started/configuration">Platform Configuration</a></strong> - Set up OpenTDF services</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="col col--6">
                <div className="card" style={{ 
                  height: '100%', 
                  padding: '2rem',
                  backgroundColor: 'var(--vds-color-blue-008)',
                  border: '1px solid var(--vds-color-blue-light)'
                }}>
                  <div className="card__header">
                    <h3>📖 How-To Guides</h3>
                    <p><em>I have a specific problem to solve</em></p>
                  </div>
                  <div className="card__body">
                    <p>Practical guides for common tasks and problems you'll encounter when working with OpenTDF.</p>
                    <ul>
                      <li><strong><a href="/how-to/sdk-recipes/tdf">Working with TDF Files</a></strong> - Encrypt and decrypt data with SDK examples</li>
                      <li><strong><a href="/how-to/sdk-recipes/authorization">Authorization Patterns</a></strong> - Manage access control with practical examples</li>
                      <li><strong><a href="/how-to/sdk-recipes">SDK Integration Recipes</a></strong> - Complete code examples and patterns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row" style={{ marginBottom: '3rem' }}>
              <div className="col col--6">
                <div className="card" style={{ 
                  height: '100%', 
                  padding: '2rem',
                  backgroundColor: 'var(--vds-color-blue-lighter)',
                  border: '1px solid var(--vds-color-blue-light)'
                }}>
                  <div className="card__header">
                    <h3>💡 Explanations</h3>
                    <p><em>I want to understand the concepts</em></p>
                  </div>
                  <div className="card__body">
                    <p>Big-picture explanations of how OpenTDF works and why it's built the way it is.</p>
                    <ul>
                      <li><strong><a href="/explanation/data-centric-security">Data-Centric Security</a></strong> - Core concepts and principles of OpenTDF</li>
                      <li><strong><a href="/explanation/platform-architecture">Platform Architecture</a></strong> - How OpenTDF services work together</li>
                      <li><strong><a href="/explanation/trusted-data-format">Trusted Data Format</a></strong> - Understanding TDF and self-protecting data</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="col col--6">
                <div className="card" style={{ 
                  height: '100%', 
                  padding: '2rem',
                  backgroundColor: 'var(--vds-color-blue-lighter)',
                  border: '1px solid var(--vds-color-blue-light)'
                }}>
                  <div className="card__header">
                    <h3>📚 Reference</h3>
                    <p><em>I need to look up specific details</em></p>
                  </div>
                  <div className="card__body">
                    <p>Technical descriptions of the machinery and how to operate it.</p>
                    <ul>
                      <li><strong><a href="/reference/api">Platform APIs</a></strong> - Complete REST API reference for all services</li>
                      <li><strong><a href="/reference/specifications">Technical Specifications</a></strong> - TDF format, protocols, and schemas</li>
                      <li><strong><a href="/how-to/sdk-recipes">SDK Examples</a></strong> - Code examples and integration patterns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
            By integrating OpenTDF's data security features with a Zero Trust architecture, 
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
            developers to customize and extend OpenTDF's functionalities to suit specific use cases, 
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