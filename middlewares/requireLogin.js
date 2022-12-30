module.exports = (req, res, next) => {
  // console.log("before");
  // console.log(req.user);
  if (!req.user) {
    // console.log("entered");
    return res.status(401).send(new Error('kyuni chlra'));
  }
  // console.log("after");
  next();
};