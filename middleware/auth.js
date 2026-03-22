module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token === 'garima-admin-secret-token') {
      next();
    } else {
      res.status(401).json({ msg: 'Unauthorized' });
    }
  } catch (err) {
    res.status(401).json({ msg: 'Unauthorized' });
  }
};