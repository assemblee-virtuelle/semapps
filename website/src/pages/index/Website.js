import React from 'react';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";
import styles from './index.module.scss';

const Website = ({ label, image, link }) => {
  return (
    <>
      <div className={styles.imageContainer}>
        <a className={styles.websiteCard} href={link} target='_blank'>
          <img src={image} alt={label} />
        </a>
      </div>
      <a className={styles.websiteCard} href={link} target='_blank'>
        <h3>{label}</h3>
      </a>
    </>
  );
};

export default Website;