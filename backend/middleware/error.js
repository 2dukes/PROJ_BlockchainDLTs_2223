const error = (error, req, res, next) => {
    return res.status(400).json({
        status: false,
        error: error,
    });
};

module.exports = error;