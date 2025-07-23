exports.pageNotFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
    pageTitle: "Page Not Found",
    currentPage: "404",
    isLoggedIn: req.session?.isLoggedIn || false,
    user: req.session?.user || null,
  });
};
