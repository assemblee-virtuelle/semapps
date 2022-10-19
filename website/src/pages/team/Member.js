import React from 'react';
import styles from './team.module.scss';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';

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
          {linkedIn && <a href={linkedIn} target='_blank' ><LinkedInIcon /></a>}
          {twitter && <a href={twitter} target='_blank' ><TwitterIcon /></a>}
          {github && <a href={github} target='_blank' ><GitHubIcon /></a>}
        </div>
      </div>
    </>
  );
};

export default Member;