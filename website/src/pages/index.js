import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>LDP</>,
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        Read and write data through a standard API.
      </>
    ),
  },
  {
    title: <>ActivityPub</>,
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        Let actors communicate with each others
      </>
    ),
  },
  {
    title: <>SPARQL</>,
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Make advanced queries through semantic data.
      </>
    ),
  },
  {
    title: <>WebId</>,
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Identify users accross plateforms.
      </>
    ),
  },
  {
    title: <>WebACL</>,
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Manage and verify rights of users.
      </>
    ),
  },
  {
    title: <>ShEx (soon)</>,
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Validate submitted data.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      <div className="row">
        <div className="col col--3">
          <span className={styles.round} />
          {/*{imgUrl && (*/}
          {/*  <div className="text--center">*/}
          {/*    <img className={styles.featureImage} src={imgUrl} alt={title} />*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
        <div className="col col--6">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="col col--3">
        </div>
      </div>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title} - A toolbox for semantic web applications`}
      description={`${siteConfig.title} - A toolbox for semantic web applications`}>
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/about')}>
              Discover
            </Link>
          </div>
        </div>
      </header>
      <main>
        <h2 className={styles.presentationTitle}>What's in the box ?</h2>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
