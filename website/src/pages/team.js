import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './team/team.module.scss';
import { AnimationOnScroll } from 'react-animation-on-scroll';
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
          <h1>Semapps and the virtual assembly</h1>
          <div className={styles.image}><img src="/img/av-baniere.png" alt="virtual assembly banner" /></div>
          <p>SemApps is a software project hosted within the Virtual Assembly.</p>
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
                    'Facilitation',
                    'Communication',
                    'DevX',
                    'Code quality',
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
                  description='Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam, fuga?'
                  roles={[
                    'Development',
                    'Economic sustainability'
                  ]}
                  linkedIn='https://www.linkedin.com/in/simon-louvet-a9842018/'
                  twitter=''
                  github='https://github.com/simonLouvet'
                />
              </li>
              <li className={styles.memberCard}>
                <Member 
                  label='Niko Bonnieure' 
                  image='img/niko.png' 
                  description='Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam, fuga?'
                  roles={[]}
                  linkedIn=''
                  twitter=''
                  github='https://github.com/nikoPLP'
                />
              </li>
              <li className={styles.memberCard}>
                <Member 
                  label='Pierre Bouvier-Muller' 
                  image='/img/pierre-bouvier-muller.png' 
                  description='Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam, fuga?'
                  roles={[
                    'Mediation'
                  ]}
                  linkedIn='https://www.linkedin.com/in/bouviermullerp/'
                  twitter=''
                  github='https://github.com/bouviermullerp'
                />
              </li>
              <li className={styles.memberCard}>
                <Member 
                  label='Guillaume Rouyer' 
                  image='/img/guillaume-rouyer.jpg' 
                  description='Co-founder of <a href="https://virtual-assembly.org/">Virtual Assembly</a> / <a href="https://lescheminsdelatransition.org/">Transition Pathways]</a>, PhD student at Ademe / UTT / Data Players'
                  roles={[
                    'Product manager',
                    'Economic sustainability'
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
                  description='Dev JS, React, D3, <a href="https://flod.io">https://flod.io</a> project owner (based on SemApps)'
                  roles={[
                    'Onboarding',
                    'Information',
                    'gardening'
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
                  description='Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam, fuga?'
                  roles={[
                    'Instances hosting'
                  ]}
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
                  roles={[
                    'Web development'
                  ]}
                  linkedIn='https://www.linkedin.com/in/vincentfarcy/'
                  twitter=''
                  github='https://github.com/VincentFarcy'
                />
              </li>
            </ul>
            <Subtitle label='Technical advisors' />
            <ul>
              <li className={styles.memberCard}>
                <Member 
                  label='Thomas Francart' 
                  image='/img/Thomas-Francart.jpg' 
                  description='Knowledge Graph and Semantic Web senior consultant'
                  roles={[
                    'Development',
                    'Economic sustainability'
                  ]}
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
