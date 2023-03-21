import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './team/team.module.scss';
import "animate.css/animate.min.css";
import Member from './team/Member';
import Subtitle from './team/Subtitle';

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`${siteConfig.title} - A toolbox for semantic web applications`}
      description={`${siteConfig.title} - A toolbox for semantic web applications`}>

      <div className={classnames(styles.layoutContainer, styles.teamContainer)}>

        <section className={styles.teamIntro}>
          <h1>SemApps and Virtual Assembly</h1>
          <div className={styles.image}><img src="/img/av-baniere.png" alt="virtual assembly banner" /></div>
          <p>SemApps is a software project hosted within Virtual Assembly.</p>
          <p>It has been nourished since 2013 by the collective intelligence of the community, which was among the first in the world to position itself on the SOLID project (even before it existed!). Since then, other software based on SOLID / ActivityPub / Semantic Web have joined the Virtual Assembly ecosystem.</p>
          <p>They are ideal partners for SemApps to prototype the decentralization of the web and the federation of its communities.</p>
        </section>

        <section className={classnames(styles.teamMembers, styles.contrast)}>
          <div className={styles.wrapper}>
            <h2>Team</h2>
            <Subtitle label='Core team' />
            <ul>
              <li className={styles.memberCard}>
                <Member 
                  label='Sébastien Rosset' 
                  image='/img/srosset.jpg' 
                  description='Web maker since 1995. Want to build a web that has a real & positive impact on society.'
                  roles={[
                    'Code architect',
                    'Facilitation',
                    'Virtual Assembly coordination'
                  ]}
                  linkedIn='https://www.linkedin.com/in/sebastien-rosset-reconnexion/'
                  twitter=''
                  github='https://github.com/srosset81'
                />
              </li>
              <li className={styles.memberCard}>
                <Member 
                  label='Simon Louvet' 
                  image='/img/simon-louvet.jpg' 
                  description='Technical Director at Data Players'
                  roles={[]}
                  linkedIn='https://www.linkedin.com/in/simon-louvet-a9842018/'
                  twitter=''
                  github='https://github.com/simonLouvet'
                />
              </li>
              <li className={styles.memberCard}>
                <Member 
                  label='Niko Bonnieure' 
                  image='img/niko.png' 
                  description='Software engineer specialized in semantic web, P2P and security.'
                  roles={[]}
                  linkedIn=''
                  twitter=''
                  github='https://github.com/nikoPLP'
                />
              </li>
              <li className={styles.memberCard}>
                <Member 
                  label='Guillaume Rouyer' 
                  image='/img/guillaume-rouyer.jpg' 
                  description='Co-founder of <a href="https://virtual-assembly.org/">Virtual Assembly</a>, PhD student at ADEME / UTT / Data Players'
                  roles={[
                    'Products',
                    'Economic sustainability',
                    'Communication',
                  ]}
                  linkedIn='https://www.linkedin.com/in/guillaume-rouyer-paris/'
                  twitter=''
                  github='https://github.com/GuillaumeAV'
                />
              </li>
              <li className={styles.memberCard}>
                <Member 
                  label='Yannick Duthé' 
                  image='/img/yannick-duthe.png' 
                  description='JS/React/D3 developer, <a href="https://flod.io">Flod.io</a> project owner'
                  roles={[
                    'Information gardening',
                    'Onboarding'
                  ]}
                  linkedIn='https://www.linkedin.com/in/yannick-duthe-569a741b/'
                  twitter=''
                  github='https://github.com/fluidlog'
                />
              </li>
              <li className={styles.memberCard}>
                <Member 
                  label='Bastien Siguier' 
                  image='/img/bastien-siguier.jfif' 
                  description='Dev Ops, Designer / Software Developer and business relations'
                  roles={[]}
                  linkedIn='https://www.linkedin.com/in/bastien-siguier/'
                  twitter=''
                  github='https://github.com/BastienSig'
                />
              </li>
              <li className={styles.memberCard}>
                <Member 
                  label='Vincent Farcy' 
                  image='/img/vincent-farcy.png' 
                  description='Freelance developer on meaningful projects'
                  roles={[]}
                  linkedIn='https://www.linkedin.com/in/vincentfarcy/'
                  twitter=''
                  github='https://github.com/VincentFarcy'
                />
              </li>
              <li className={styles.memberCard}>
                <Member
                  label='Maxime Lecoq'
                  image='/img/maxime_lecoq.jpeg'
                  description='Freelance free software engineer'
                  roles={[
                    'Technical partnership'
                  ]}
                  linkedIn=''
                  twitter=''
                  github='https://github.com/lecoqlibre'
                />
              </li>
            </ul>
            <Subtitle label='Advisors' />
            <ul>
              <li className={styles.memberCard}>
                <Member
                  label='Pierre Bouvier-Muller'
                  image='/img/pierre-bouvier-muller.png'
                  description='Mediation & Digital Responsibility'
                  roles={[]}
                  linkedIn='https://www.linkedin.com/in/bouviermullerp/'
                  twitter=''
                  github='https://github.com/bouviermullerp'
                />
              </li>
              <li className={styles.memberCard}>
                <Member 
                  label='Thomas Francart' 
                  image='/img/Thomas-Francart.jpg' 
                  description='Knowledge Graph and Semantic Web senior consultant'
                  roles={[]}
                  linkedIn='https://www.linkedin.com/in/thomasfrancart/'
                  twitter=''
                  github='https://github.com/tfrancart'
                />
              </li>
            </ul>
          </div>
        </section>

      </div>

    </Layout >
  );
}

export default Home;
