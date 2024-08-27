
import User from '../models/userModel.js';
import ErrorHandler from './../utils/ErrorHandler.js';
import jwt from 'jsonwebtoken';


export const isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("User token not found", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    if (!req.user) {
        return next(new ErrorHandler("User not found", 404));
    }
    next();
}

export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};