import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Trop facile</>,
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Nous utilisons les standards du web sémantique qui permettent à de multiples systèmes d’information de s’interconnecter.
      </>
    ),
  },
  {
    title: <>Trop cool</>,
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        SemApps intègre la spécification SOLID portée par Tim Berners Lee (inventeur du web), ainsi que le protocole ActivityPub.
      </>
    ),
  },
  {
    title: <>Trop... bien!</>,
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        Nous concevons SemApps sur la base des principes suivants : Interopérabilité - Modularité - Généricité - Adaptabilité - Scalabilité - Accessibilité - Convivialité
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
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
              to={useBaseUrl('docs/doc1')}>
              Commencer
            </Link>
          </div>
        </div>
      </header>
      <main>
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
