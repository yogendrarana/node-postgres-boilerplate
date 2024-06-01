import ErrorHandler from '../util/errorHandler.js';
export const verifyAdminRole = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return next(new ErrorHandler(403, "User does not have admin role to access this resource."));
    }
    next();
};
