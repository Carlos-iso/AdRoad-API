exports.handleTokenInvalid = function (err, res) {
    if (err.status === 401 && err.message.details === "token-expired") {
        res.redirect("/refresh-token");
    } else {
        next(err);
    }
};
