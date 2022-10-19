import React from 'react';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import styles from './index.module.scss';

const Product = ({ image, label, description, github, link }) => {
  return (
    <>
      <div className={styles.imageContainer}>
        <AnimationOnScroll animateIn="animate__fadeIn" duration={2}>
          { image &&
            <img src={image} alt={label} />
          }
        </AnimationOnScroll>
      </div>
      <div className={styles.titleContainer}>
        <div className={styles.label}>Name:</div>
        <h3>{label}</h3>
      </div>
      <div className={styles.separator}>&nbsp;</div>
      <div className={styles.textContainer}>
        <div className={styles.label}>Description:</div>
        <p>{description}</p>
      </div>
      <div className={styles.separator}>&nbsp;</div>
      <div className={styles.linksContainer}>
        { github && 
          <a href={github} target='_blank'><GitHubIcon /></a>
        }
        { link && 
          <a href={link} target='_blank'><OpenInNewIcon /></a>
        }        
      </div>
    </>
  );
};

export default Product;