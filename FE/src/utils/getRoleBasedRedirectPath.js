export const getRoleBasedRedirectPath = (userType, chucVu) => {
  switch (userType) {
    case "DOANTRUONG":
      return "/doan-truong/dashboard";

    case "DOANKHOA":
      return "/doan-khoa/dashboard";

    case "DOANVIEN":
      if (chucVu === "Bí thư Chi đoàn") {
        return "/bi-thu/dashboard";
      }
      return "/doan-vien/thong-tin-ca-nhan";

    default:
      return "/doan-vien/thong-tin-ca-nhan";
  }
};
