import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import styles from "./index.module.css";

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
                  Zero-trust data protection that travels with your data wherever it goes. 
                  OpenTDF cryptographically binds access control policies directly to data objects, 
                  ensuring your data remains secure regardless of network boundaries or storage location.
                </p>
                <div className="hero-actions">
                  <a href="/getting-started" className="hero-button hero-button--primary">
                    <iconify-icon data-icon="mdi:rocket-launch" style={{fontSize: '1.2rem'}}></iconify-icon>
                    Get Started
                  </a>
                  <a href="/documentation" className="hero-button hero-button--secondary">
                    <iconify-icon data-icon="mdi:book-open-variant" style={{fontSize: '1.2rem'}}></iconify-icon>
                    View Documentation
                  </a>
                </div>
              </div>
              <div className="hero-visual slide-in-right">
                <div className="hero-icon-container">
                  <iconify-icon data-icon="mdi:shield-lock" className="hero-icon"></iconify-icon>
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
                  Once data crosses network boundaries, traditional security models lose control. 
                  OpenTDF solves this by cryptographically binding policies to data objects themselves, 
                  creating self-protecting data that enforces access controls anywhere it travels.
                </p>
                <div className="hero-actions">
                  <a href="/explanation/data-centric-security" className="hero-button hero-button--solid">
                    <iconify-icon data-icon="mdi:lightbulb-on" style={{fontSize: '1.2rem'}}></iconify-icon>
                    Learn the Concepts
                  </a>
                  <a href="/explanation" className="hero-button hero-button--secondary">
                    <iconify-icon data-icon="mdi:eye" style={{fontSize: '1.2rem'}}></iconify-icon>
                    See Use Cases
                  </a>
                </div>
              </div>
              <div className="hero-visual slide-in-left">
                <div className="hero-icon-container">
                  <iconify-icon data-icon="mdi:shield-alert" className="hero-icon" style={{color: '#dc3545'}}></iconify-icon>
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
                  <a href="/tutorials" className="hero-button hero-button--primary">
                    <iconify-icon data-icon="mdi:code-tags" style={{fontSize: '1.2rem'}}></iconify-icon>
                    Quick Start
                  </a>
                  <a href="/reference" className="hero-button hero-button--secondary">
                    <iconify-icon data-icon="mdi:api" style={{fontSize: '1.2rem'}}></iconify-icon>
                    API Reference
                  </a>
                </div>
              </div>
              <div className="hero-visual slide-in-right">
                <div className="hero-icon-container">
                  <iconify-icon data-icon="mdi:code-brackets" className="hero-icon"></iconify-icon>
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
                  <a href="https://virtru.com" className="hero-button hero-button--primary">
                    <iconify-icon data-icon="mdi:domain" style={{fontSize: '1.2rem'}}></iconify-icon>
                    Enterprise Solutions
                  </a>
                  <a href="/how-to" className="hero-button hero-button--secondary">
                    <iconify-icon data-icon="mdi:cog" style={{fontSize: '1.2rem'}}></iconify-icon>
                    Deployment Guides
                  </a>
                </div>
              </div>
              <div className="hero-visual slide-in-left">
                <div className="hero-icon-container">
                  <iconify-icon data-icon="mdi:office-building" className="hero-icon"></iconify-icon>
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
                  <a href="/reference/trusted-data-format/specifications" className="hero-button hero-button--solid">
                    <iconify-icon data-icon="mdi:certificate" style={{fontSize: '1.2rem'}}></iconify-icon>
                    View Specifications
                  </a>
                  <a href="/explanation/platform-architecture" className="hero-button hero-button--secondary">
                    <iconify-icon data-icon="mdi:chart-timeline-variant" style={{fontSize: '1.2rem'}}></iconify-icon>
                    Architecture Overview
                  </a>
                </div>
              </div>
              <div className="hero-visual slide-in-right">
                <div className="hero-icon-container">
                  <iconify-icon data-icon="mdi:check-decagram" className="hero-icon" style={{color: '#28a745'}}></iconify-icon>
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
                    <iconify-icon data-icon="mdi:github" style={{fontSize: '1.2rem'}}></iconify-icon>
                    GitHub
                  </a>
                  <a href="https://github.com/orgs/opentdf/discussions" className="hero-button hero-button--secondary">
                    <iconify-icon data-icon="mdi:forum" style={{fontSize: '1.2rem'}}></iconify-icon>
                    Community Discussions
                  </a>
                </div>
              </div>
              <div className="hero-visual slide-in-left">
                <div className="hero-icon-container">
                  <iconify-icon data-icon="mdi:account-group" className="hero-icon"></iconify-icon>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section style={{padding: '4rem 0', textAlign: 'center', background: '#f8f9fa'}}>
          <div className="container">
            <h2 style={{fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--ifm-color-primary)'}}>
              Ready to Protect Your Data?
            </h2>
            <p style={{fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.8}}>
              Choose your path and start building with OpenTDF today.
            </p>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
              <a href="/tutorials/your-first-tdf" className="hero-button hero-button--solid">
                <iconify-icon data-icon="mdi:play-circle" style={{fontSize: '1.2rem'}}></iconify-icon>
                Start Tutorial
              </a>
              <a href="/documentation" className="hero-button hero-button--secondary">
                <iconify-icon data-icon="mdi:book-open-variant" style={{fontSize: '1.2rem'}}></iconify-icon>
                Browse Documentation
              </a>
              <a href="https://github.com/opentdf" className="hero-button hero-button--secondary">
                <iconify-icon data-icon="mdi:github" style={{fontSize: '1.2rem'}}></iconify-icon>
                View Source
              </a>
            </div>
          </div>
        </section>
        
      </Layout>
    </div>
  );
}
