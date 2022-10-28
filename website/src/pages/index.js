import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index/index.module.scss';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";
import Carousel from 'react-material-ui-carousel';
import Product from './index/Product';
import Tool from './index/Tool';
import Website from './index/Website';


function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  
  var carouselItems = [
      {
        label: 'Les chemins de la transition',
        link: 'https://lescheminsdelatransition.org/',
        image: 'img/cdlt-cover.png'
      },
      {
        label: 'Acteurs solidarité Aurba',
        link: 'https://acteurs-solidarite.aurba.org/',
        image: 'img/aurba-cover.png'
      },
      {
        label: 'Les 100 lieux nourriciers',
        link: 'https://100lieuxnourriciers.fr/',
        image: 'img/100-lieux-cover.png'
      },
      {
        label: 'Bienvenue Chez Moi',
        link: 'https://bienvenuechezmoi.org/',
        image: 'img/bienvenue-chez-moi.png'
      }
  ]
  
  return (
    <Layout
      title={`${siteConfig.title} - A toolbox for semantic web applications`}
      description={`${siteConfig.title} - A toolbox for semantic web applications`}>

      <div className={styles.layoutContainer}>

        <section className={styles.hero}>
          <div className={styles.Wrapper}>
            <div className={styles.heroContainer}>
              <div className={styles.heroImageContainer}>
                <img src="img/dreamstime_s_23213432.jpg" alt="semapps toolbox" />
              </div>
              <div className={styles.heroTextContainer}>
                <h1 className={styles.heroTitle}>SemApps</h1>
                <div className={styles.heroSubtitle}>
                  <p>An open source <strong>toolbox</strong></p>
                  <p>to help you easily build</p>
                  <p><strong>semantic web</strong> applications</p>
                </div>
                <div className={styles.heroIcons}>
                  <img src="img/sw-icon.svg" alt="semantic web icon" />
                  <img src="img/react-icon.svg" alt="semantic react icon" />
                  <img src="img/ra-icon.svg" alt="react admin icon "/>
                  <img src="img/solid-icon.svg" alt="solid icon" />
                  <img src="img/activitypub-icon.svg" alt="activitypub icon" />
                </div>
                <AnimationOnScroll animateIn="animate__slideInLeft">
                  <div className={styles.av}>
                    <span>SemApps is co-built as part of the Virtual Assembly</span>
                    <img src="img/av-icon.png" alt="virtual assembly icon" />
                  </div>
                </AnimationOnScroll>
               </div>
            </div>
          </div>
        </section>

        <section className={classnames(styles.tools, styles.contrast)}>
          <div className={styles.wrapper}>
            <h2>What's in the box ?</h2>
            <ul>
              <li className={styles.toolCard}>
                <Tool label='LDP' content='Read and write data through a standard API' link='' link2='https://www.w3.org/2012/ldp/wiki/Main_Page' />
              </li>
              <li className={styles.toolCard}>
                <Tool label='ActivityPub' content='Let actors communicate with each others.' link='https://activitypub.rocks/' />
              </li>
              <li className={styles.toolCard}>
                <Tool label='SPARQL' content='Make advanced queries through semantic data.' link='https://www.w3.org/wiki/SPARQL' />
              </li>
              <li className={styles.toolCard}>
                <Tool label='WebId' content='Identify users accross plateforms' link='https://www.w3.org/wiki/WebID' />
              </li>
              <li className={styles.toolCard}>
                <Tool label='WebAcl' content='Manage and verify rights of users' link='https://www.w3.org/wiki/WebAccessControl' />
              </li>
              <li className={styles.toolCard}>
                <Tool label='ShEx (soon)' content='Validate submitted data.' link='https://github.com/shexSpec/shex/wiki/ShEx' />
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.products}>
          <div className={styles.wrapper}>
            <h2>Products built with <span className={styles.primary}>SemApps</span></h2>
            <ul>
              <li className={styles.productCard}>
                <Product 
                  label='Archipelago' 
                  description='
                    <p>Fostering interconnections between communities by creating synergies between their platforms.</p>
                    <p>A collaborative, interoperable and modular knowledge management system, compliant with most semantic web specifications: LDP, SPARQL, ActivityPub, WAC, WebID.</p>
                  ' 
                  image='img/archipelago.png' 
                  github='https://github.com/assemblee-virtuelle/archipelago'
                  link='https://archipel.assemblee-virtuelle.org/'
                />
              </li>
              <li className={styles.productCard}>
                <Product 
                  label='OrganiGraph' 
                  description='
                    <p>Open-source software developed with the objective of helping organizations make their operations visible.</p>
                    <p>It allows to visualize the structure of the organization (in the form of a hierarchy of "circles") and, for each circle, to see its sub-circles, the people involved, the meeting schedule, documents, news, etc.</p>
                    <p>A simple tool that allows anyone to see what is going on and potentially get involved.</p>
                  ' 
                  image='img/organigraph.png' 
                  github='https://github.com/assemblee-virtuelle/organigraph'
                  link=''
                />
              </li>
              <li className={styles.productCard}>
                <Product 
                  label='ActivityPods' 
                  description='
                    <p>A new kind of architecture which makes use of two important standards: (1) PODs (Personal Online Datastore), the masterpiece of the Solid project led by Tim Berners-Lee (2) ActivityPub, which enables communication between the PODs through a shared vocabulary.</p>
                  '
                  image='img/activity-pods.png' 
                  github='https://github.com/assemblee-virtuelle/activitypods'
                  link=''
                />
              </li>
              <li className={styles.productCard}>
                <Product 
                  label='Minicourses' 
                  description='Build minicourses with image and texts and allow subscribers to receive them by email in the chosen frequency.' 
                  image='img/minicourses.png' 
                  github='https://github.com/assemblee-virtuelle/minicourses'
                  link=''
                />
              </li>
              <li className={styles.productCard}>
                <Product 
                  label='ActivityPub-Bridge' 
                  description='
                    <p>Subscribe to ActivityPub actors and send their activities in given chat channels.</p>
                    <p>Currently only supports <a href="https://mattermost.com" rel="nofollow">Mattermost</a>. Slack and Rocketchat support coming soon.</p>
                  ' 
                  image='img/activitypub-bridge.png' 
                  github='https://github.com/assemblee-virtuelle/activitypub-bridge'
                  link=''
                />
              </li>
            </ul>
          </div>
        </section>

        <section className={classnames(styles.websites, styles.contrast)}>
          <div className={styles.wrapper}>
            <h2>Websites made with <span className={styles.primary}>SemApps</span></h2>
            <Carousel     
              indicatorIconButtonProps={{className: 'indicatorIcon_src-pages-index-index-module'}}
              activeIndicatorIconButtonProps={{className: 'activeIndicatorIcon_src-pages-index-index-module'}}
            >
              { carouselItems.map( (item, i) => <Website key={i} label={item.label} link={item.link} image={item.image} /> ) }
            </Carousel>
          </div>
        </section>

        <section className={styles.users}>
          <div className={styles.wrapper}>
            <h2><span className={styles.primary}>SemApps</span> users</h2>
            <div className={styles.userLogosContainer}>
              <div className={styles.userLogo}>
                <img src="img/logo-4ch-fb.png" alt="4ch logo" className={styles.sm} />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/logo-ademe.png" alt="ademe logo" className={styles.lg} />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/logo-afaup.png" alt="afaup logo" />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/logo-av.jpg" alt="av logo" />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/logo-aurba.png" alt="aurba logo" />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/logo-classe-dehors.png" alt="classe dehors logo" className={styles.lg} />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/logo-colibris.svg" alt="colibri logo" />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/collectif-emploi.png" alt="collectif emploi logo" className={styles.xs} />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/logo-dfc.png" alt="data food consortium logo" className={styles.sm}  />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/logo-flodio.png" alt="flodio logo" className={styles.sm} />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/logo-lacoop.png" alt="la coop des territoires logo" />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/logo-cdlt.png" alt="la coop des territoires logo" />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/logo-petr.png" alt="PETR Maconnais Sud Bourgogne logo" className={styles.sm} />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/logo-energie-partagee.png" alt="Prats ENR Énergie Partagée logo" className={styles.sm} />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/logo-utt.png" alt="Utt logo" className={styles.sm} />
              </div>
            </div>
          </div>
        </section>

      </div>

    </Layout >
  );
}

export default Home;
