import React from 'react';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";

const Website = ({ styles, label, image, link }) => {
  return (
    <>
      <a className={styles.websiteCard} href={link} target='_blank'>
        <div className={styles.imageContainer}>
          <img src={image} />
        </div>
        <h3>{label}</h3>
      </a>
    </>
  );
};

export default Website;