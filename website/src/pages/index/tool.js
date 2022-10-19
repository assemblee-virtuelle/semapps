import React from 'react';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";

const Tool = ({ styles, label, content }) => {
  return (
    <>
      <div className={styles.iconContainer}>
        <i className='fa-solid fa-cubes'></i>
      </div>
      <div className={styles.textContainer}>
        <h3>{label}</h3>
        <div className={styles.borderContainer}>&nbsp;
          <AnimationOnScroll animateIn="animate__fadeInUp">
            <div className={styles.border}>&nbsp;</div>
          </AnimationOnScroll>
        </div>
        <div className={styles.toolDescription}>{content}</div>
      </div>
    </>
  );
};

export default Tool;