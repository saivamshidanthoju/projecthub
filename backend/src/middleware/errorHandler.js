const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log the error internally
    console.error(`💥 Error: ${err.message}`, err);

    if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        // PostgreSQL database unique violation error parser
        if (err.code === '23505') {
            error.statusCode = 409;
            error.message = 'Duplicate field value entered. Resource already exists.';
            error.isOperational = true;
        }

        // PostgreSQL foreign key violation error parser
        if (err.code === '23503') {
            error.statusCode = 400;
            error.message = 'Invalid reference key. Referenced entity does not exist.';
            error.isOperational = true;
        }

        return res.status(error.statusCode).json({
            success: false,
            message: error.isOperational ? error.message : 'Something went wrong on the server.'
        });
    } else {
        // Development mode: detailed error stack trace
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err
        });
    }
};

module.exports = errorHandler;
