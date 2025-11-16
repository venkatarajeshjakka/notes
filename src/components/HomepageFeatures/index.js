import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Node.js',
    icon: 'Node',
    color: '#68a063',
    description: 'Complete guide to Node.js fundamentals, Express.js, routing, middleware, and database integration with MongoDB.',
    link: '/docs/nodejs/introduction',
  },
  {
    title: '.NET',
    icon: '.NET',
    color: '#512bd4',
    description: 'Explore .NET patterns including middleware, options pattern, authentication, and global error handling.',
    link: '/docs/dotnet/middleware',
  },
  {
    title: 'Database',
    icon: 'DB',
    color: '#4db33d',
    description: 'Learn MongoDB schemas, models, indexing strategies, and compound indexes for optimal query performance.',
    link: '/docs/nodejs/database/create-database-mongodb',
  },
  {
    title: 'Authentication',
    icon: 'Auth',
    color: '#f59e0b',
    description: 'Implement secure authentication with JWT tokens, permission-based authorization, and best practices.',
    link: '/docs/dotnet/authentication/jwt-token',
  },
];

function Feature({icon, title, description, link, color}) {
  return (
    <div className={clsx('col col--6')}>
      <Link to={link} className={styles.featureCard}>
        <div className={styles.featureIcon} style={{backgroundColor: color}}>
          {icon}
        </div>
        <div className={styles.featureContent}>
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2">Technical Documentation</Heading>
          <p className={styles.featuresSubtitle}>
            Comprehensive guides and notes on modern web development technologies
          </p>
        </div>
        <div className="row" style={{rowGap: '1.5rem'}}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
