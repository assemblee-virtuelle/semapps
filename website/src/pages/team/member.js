import React from 'react';
import styles from './team.module.scss';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";

const Member = ({ image, label, description, roles=[], linkedIn, twitter, github }) => {
  return (
    <>
      <div className={styles.imageContainer}>
        <img src={image} alt={label} />
      </div>
      <div className={styles.textContainer}>
        <div className={styles.memberName}>{label}</div>
        <div className={styles.memberDescription}>{description}</div>
        <ul className={styles.memberRoles}>
          {roles.map(role => <li>{role}</li>)}
        </ul>
        <div className={styles.memberLinks}>
          {linkedIn && <a href={linkedIn} target='_blank' ><i className='fa-brands fa-linkedin'></i></a>}
          {twitter && <a href={twitter} target='_blank' ><i className='fa-brands fa-twitter'></i></a>}
          {github && <a href={github} target='_blank' ><i className='fa-brands fa-github'></i></a>}
        </div>
      </div>
    </>
  );
};

export default Member;