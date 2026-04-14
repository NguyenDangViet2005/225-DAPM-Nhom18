export const getRoleBasedRedirectPath = (userType, chucVu) => {
  switch (userType) {
    case "DOAN_TRUONG":
      return "/doan-truong/dashboard";

    case "DOAN_KHOA":
      return "/doan-khoa/dashboard";

    case "DOAN_VIEN":
      if (chucVu === "Bí thư Chi đoàn") {
        return "/bi-thu/dashboard";
      }
      return "/doan-vien/thong-tin-ca-nhan";

    default:
      return "/doan-vien/thong-tin-ca-nhan";
  }
};
