import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from './NavBar';
import { clearFlash } from './app/actions';

const Page = ({ children }) => {
  const dispatch = useDispatch();
  const flash = useSelector(state => state.app.flash);

  // TODO use a correct location change listener
  useEffect(() => {
    window.onclick = function(event) {
      dispatch(clearFlash());
    };
  }, [flash, dispatch]);

  return (
    <>
      <NavBar />
      <br />
      <div className="container">
        {flash && (
          <>
            <div className={`alert alert-${flash.role}`} role="alert">
              {flash.message}
            </div>
          </>
        )}
        {children}
      </div>
      <br />
      <br />
    </>
  );
};

export default Page;
