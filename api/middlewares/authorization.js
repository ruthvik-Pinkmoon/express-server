// authorizationMiddleware.js
const authorizationMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this resource.' });
    }
    next();
  };
};

module.exports = authorizationMiddleware;
