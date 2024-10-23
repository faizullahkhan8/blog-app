const errorHandler = (error, req, res, next) => {
    let status = 500;
    let data = {
        message: "Internal server error",
    };

    const { ValidationError } = error;

    // if (ValidationError) {
    //     status = error.status;
    //     data.message = error.message;

    //     return res.status(status).json(data);
    // }

    if (error.status) {
        status = error.status;
    }
    if (error.message) {
        data.message = error.message;
    }

    return res.status(status).json(data);
};

module.exports = errorHandler;
