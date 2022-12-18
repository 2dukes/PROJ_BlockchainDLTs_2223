const storeImages = (req, res) => {
    return res.status(200).json({
        status: true,
        message: "Hello Store Images!",
    });
};

module.exports = {
    storeImages
};