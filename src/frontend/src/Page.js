import React from 'react';
import NavBar from './NavBar';

const Page = ({ children }) => {
  return (
    <>
      <NavBar/>
      <br />
      <div className="container">
        {children}
      </div>
    </>
  );
};

export default Page;
