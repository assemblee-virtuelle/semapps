import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';
import styles from './index/index.module.scss';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";
import Carousel from 'react-material-ui-carousel';
import { Paper, Button } from '@mui/material';
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
        image: 'img/cdlt.jpg'
      },
      {
        label: 'Les chemins de la transition',
        link: 'https://lescheminsdelatransition.org/',
        image: 'img/cdlt.jpg'
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
                <img src="img/toolbox.jpg" alt="semapps toolbox" />
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
                <Tool label='LDP' content='Read and write data through a standard API' />
              </li>
              <li className={styles.toolCard}>
                <Tool label='ActivityPub' content='Let actors communicate with each others.' />
              </li>
              <li className={styles.toolCard}>
                <Tool label='SPARQL' content='Make advanced queries through semantic data.' />
              </li>
              <li className={styles.toolCard}>
                <Tool label='WebId' content='Identify users accross plateforms' />
              </li>
              <li className={styles.toolCard}>
                <Tool label='WebAcl' content='Manage and verify rights of users' />
              </li>
              <li className={styles.toolCard}>
                <Tool label='ShEx(soon)' content='Validate submitted data.' />
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
                  description='Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta, at ipsum numquam sapiente ipsam sit.' 
                  image='img/archipelago.png' 
                  github='https://github.com/assemblee-virtuelle/archipelago'
                  link='https://archipel.assemblee-virtuelle.org/'
                />
              </li>
              <li className={styles.productCard}>
                <Product 
                  label='OrganiGraph' 
                  description='Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta, at ipsum numquam sapiente ipsam sit.' 
                  image='img/Organigraph.png' 
                  github='https://github.com/assemblee-virtuelle/organigraph'
                  link=''
                />
              </li>
              <li className={styles.productCard}>
                <Product 
                  label='ActivityPods' 
                  description='Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta, at ipsum numquam sapiente ipsam sit.' 
                  image='img/activity-pods.png' 
                  github='https://github.com/assemblee-virtuelle/activitypods'
                  link=''
                />
              </li>
              <li className={styles.productCard}>
                <Product 
                  label='Minicourses' 
                  description='Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta, at ipsum numquam sapiente ipsam sit.' 
                  image='img/minicourses.png' 
                  github='https://github.com/assemblee-virtuelle/minicourses'
                  link=''
                />
              </li>
              <li className={styles.productCard}>
                <Product 
                  label='ActivityPub-Bridge' 
                  description='Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta, at ipsum numquam sapiente ipsam sit.' 
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

        <section className={styles.clients}>
          <div className={styles.wrapper}>
            <h2><span className={styles.primary}>SemApps</span> clients</h2>
            <div className={styles.clientlogosContainer}>
              <div className={styles.clientlogo}>
                <img src="img/logo-colibris.svg" alt="colibri logo" />
              </div>
              <div className={styles.clientlogo}>
                <img src="img/collectif-emploi.png" alt="collectif emploi logo" className={styles.small} />
              </div>
            </div>
          </div>
        </section>

      </div>

    </Layout >
  );
}

export default Home;
