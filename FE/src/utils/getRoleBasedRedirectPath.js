export const getRoleBasedRedirectPath = (userType, laBiThu) => {
  // Priority: Check laBiThu first if user is DOANVIEN
  if (userType === "DOANVIEN" && laBiThu === 1) {
    return "/bi-thu/dashboard";
  }

  switch (userType) {
    case "DOANTRUONG":
      return "/doan-truong/dashboard";

    case "DOANKHOA":
      return "/doan-khoa/dashboard";

    case "DOANVIEN":
      return "/doan-vien/thong-tin-ca-nhan";

    case "BITHU":
      return "/bi-thu/dashboard";

    default:
      return "/doan-vien/thong-tin-ca-nhan";
  }
};
