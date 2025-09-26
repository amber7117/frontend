export const checkStatus = (res, status) => {
  if (status === "blocked") {
    return res.status(400).json({
      success: false,
      message: "You're blocked for some reason. Please contact support!",
    });
  }
  if (status === "overdue") {
    return res.status(400).json({
      success: false,
      message: "Please renew your subscription to continue using our services!",
    });
  }
};
