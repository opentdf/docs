import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";

export default function Home() {
  return (
    <div className="marketing-homepage">
      <Head>
        <meta property="og:title" content="OpenTDF - Protect the Data, Build the Future" />
        <meta property="og:description" content="Zero-trust data protection that travels with your data wherever it goes" />
      </Head>
      <Layout title="OpenTDF - Protect the Data, Build the Future" description="Zero-trust data protection that travels with your data wherever it goes">
        
        {/* Hero 1: Main Value Proposition */}
        <section className="marketing-hero marketing-hero--primary">
          <div className="container">
            <div className="hero-content fade-in">
              <div className="hero-text">
                <h1 className="hero-title">Protect the Data, Build the Future</h1>
                <p className="hero-subtitle">
                  Open-source data-centric security for developers. OpenTDF delivers the Trusted Data Format (TDF) specification, 
                  foundational services for key management and access control, and SDKs — the building blocks to cryptographically 
                  bind protection directly to your data, wherever it goes.
                </p>
                <p className="hero-subtitle">
                  Explore the standard. Prototype custom applications. Build architectures where security travels with the data, not the network.
                </p>
                <div className="hero-actions">
                  <a href="/getting-started" className="hero-button hero-button--primary">
                    
                    Get Started
                  </a>
                  <a href="/introduction" className="hero-button hero-button--secondary">
                    
                    View Documentation
                  </a>
                </div>
              </div>
              <div className="hero-visual slide-in-right">
                <div className="hero-icon-container">
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero 2: Problem/Solution */}
        <section className="marketing-hero marketing-hero--secondary">
          <div className="container">
            <div className="hero-content hero-content--reverse fade-in">
              <div className="hero-text">
                <h2 className="hero-title">Traditional Security Fails When Data Leaves the Perimeter</h2>
                <p className="hero-subtitle">
                  Firewalls, VPNs, and network policies protect the boundary — not the data. 
                  The moment a file is shared, downloaded, or moved to a new environment, 
                  those controls vanish. Access decisions remain at the perimeter, while the 
                  data moves on without them.
                </p>
                <p className="hero-subtitle">
                  OpenTDF inverts this model. Policies travel with the data itself, so you can:
                </p>
                <ul className="hero-list">
                  <li>Revoke access after sharing — even after data has left your environment</li>
                  <li>Enforce controls in zero-trust environments — no VPN, no network dependency</li>
                  <li>Maintain a complete audit trail — know who accessed what, when, and where</li>
                </ul>
                <p className="hero-subtitle">
                  This is data-centric security: protection that's embedded, not bolted on.
                </p>
                <div className="hero-actions">
                  <a href="/spec/concepts" className="hero-button hero-button--solid">
                    
                    Learn the Concepts
                  </a>
                  <a href="/architecture" className="hero-button hero-button--secondary">
                    
                    Architecture
                  </a>
                </div>
              </div>
              <div className="hero-visual slide-in-left">
                <div className="hero-icon-container">
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero 3: Developer-First */}
        <section className="marketing-hero marketing-hero--dark">
          <div className="container">
            <div className="hero-content fade-in">
              <div className="hero-text">
                <h2 className="hero-title">Built for Developers</h2>
                <p className="hero-subtitle">
                  Native SDKs for Go, Java, and JavaScript. RESTful APIs. Comprehensive documentation. 
                  Get started in minutes, not months. OpenTDF provides the tools developers need to build 
                  secure applications without sacrificing speed or simplicity.
                </p>
                <div className="hero-actions">
                  <a href="/getting-started/quickstart" className="hero-button hero-button--primary">
                    
                    Quick Start
                  </a>
                  <a href="/OpenAPI-clients" className="hero-button hero-button--secondary">
                    
                    API Reference
                  </a>
                </div>
              </div>
              <div className="hero-visual slide-in-right">
                <div className="hero-icon-container">
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero 4: Enterprise Trust */}
        <section className="marketing-hero marketing-hero--accent">
          <div className="container">
            <div className="hero-content hero-content--reverse fade-in">
              <div className="hero-text">
                <h2 className="hero-title">Trusted by Organizations Worldwide</h2>
                <p className="hero-subtitle">
                  Built on a decade of Virtru's experience protecting data at scale. OpenTDF powers 
                  secure data sharing for organizations across industries—from healthcare and finance 
                  to government and defense. Battle-tested, enterprise-ready, open source.
                </p>
                <div className="hero-actions">
                  <a href="https://www.virtru.com/data-security-platform" className="hero-button hero-button--primary">
                    
                    Enterprise Solutions
                  </a>
                </div>
              </div>
              <div className="hero-visual slide-in-left">
                <div className="hero-icon-container">
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero 5: Standards & Compliance */}
        <section className="marketing-hero marketing-hero--secondary">
          <div className="container">
            <div className="hero-content fade-in">
              <div className="hero-text">
                <h2 className="hero-title">Standards-Based Security</h2>
                <p className="hero-subtitle">
                  Built on the proven NIST ABAC model for interoperability and compliance. 
                  OpenTDF follows established standards for attribute-based access control, 
                  ensuring your data protection strategy is future-proof and audit-ready.
                </p>
                <div className="hero-actions">
                  <a href="/spec" className="hero-button hero-button--solid">
                    
                    View Specifications
                  </a>
                  <a href="/explanation/platform-architecture" className="hero-button hero-button--secondary">
                    
                    Architecture Overview
                  </a>
                </div>
              </div>
              <div className="hero-visual slide-in-right">
                <div className="hero-icon-container">
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero 6: Community */}
        <section className="marketing-hero marketing-hero--dark">
          <div className="container">
            <div className="hero-content hero-content--reverse fade-in">
              <div className="hero-text">
                <h2 className="hero-title">Join the Movement</h2>
                <p className="hero-subtitle">
                  Open source, open community. Shape the future of data-centric security with developers, 
                  security professionals, and organizations from around the world. Contribute code, 
                  share ideas, and help build the next generation of data protection.
                </p>
                <div className="hero-actions">
                  <a href="https://github.com/opentdf" className="hero-button hero-button--primary">
                    
                    GitHub
                  </a>
                  <a href="https://github.com/orgs/opentdf/discussions" className="hero-button hero-button--secondary">
                    
                    Community Discussions
                  </a>
                </div>
              </div>
              <div className="hero-visual slide-in-left">
                <div className="hero-icon-container">
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="marketing-cta">
          <div className="container">
            <h2 className="marketing-cta__title">
              Ready to Protect Your Data?
            </h2>
            <p className="marketing-cta__subtitle">
              Choose your path and start building with OpenTDF today.
            </p>
            <div className="marketing-cta__actions">
              <a href="/getting-started/quickstart" className="hero-button hero-button--solid">
                
                Start Tutorial
              </a>
              <a href="/introduction" className="hero-button hero-button--secondary">
                
                Browse Documentation
              </a>
              <a href="https://github.com/opentdf" className="hero-button hero-button--secondary">
                
                View Source
              </a>
            </div>
          </div>
        </section>
        
      </Layout>
    </div>
  );
}
