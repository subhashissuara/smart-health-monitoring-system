exports.getAuthorization = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: "ACCESS_GRANTED",
  });
};
