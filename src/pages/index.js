import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.heroBackground}></div>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.badge}>Developer Notes</div>
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <p className={styles.heroDescription}>
            Curated collection of practical guides, code examples, and best practices
            for modern full-stack development
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/nodejs/introduction">
              Get Started
            </Link>
            <Link
              className={clsx('button button--outline button--lg', styles.buttonGithub)}
              to="https://github.com/venkatarajeshjakka/notes">
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Stats() {
  const stats = [
    { value: '50+', label: 'Documentation Pages' },
    { value: '4', label: 'Technology Stacks' },
    { value: '100%', label: 'Free & Open Source' },
  ];

  return (
    <section className={styles.stats}>
      <div className="container">
        <div className={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <div key={idx} className={styles.statItem}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Developer Notes & Guides`}
      description="Comprehensive technical documentation covering Node.js, .NET, databases, authentication, and modern web development practices">
      <HomepageHeader />
      <main>
        <Stats />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
