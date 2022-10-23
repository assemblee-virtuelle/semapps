import React from 'react';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";
import styles from './index.module.scss';
import CubesIcon from './CubesIcon';

const Tool = ({ label, content, link, link2 }) => {
  return (
    <>
      <div className={styles.iconContainer}>
        <CubesIcon />
      </div>
      <div className={styles.textContainer}>
        <h3>
          { !!link ? (
            <a href={link} target='_blank'>{label}</a>
          ) : (
            <>{label}</>
          )}
        </h3>
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