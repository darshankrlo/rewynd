export const getMe = (req, res) => {
    res.json({
        message: "Authentication successful",
        userId: req.user.userId
    });
};