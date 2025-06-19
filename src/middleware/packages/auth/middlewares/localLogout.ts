const localLogout = (req: any, res: any, next: any) => {
  req.logout(); // Passport logout
  next();
};

export default localLogout;
