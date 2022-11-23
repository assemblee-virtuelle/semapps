import React from 'react';
import styles from './team.module.scss';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";

const Subtitle = ({ label }) => {
  return (
    <div className={styles.memberSubtitleContainer}>
      <AnimationOnScroll animateIn="animate__slideInRight" duration={2}>
        <h3>{label}</h3>
      </AnimationOnScroll>
      <div className={styles.border}>&nbsp;</div>
    </div>
  );
};

export default Subtitle;