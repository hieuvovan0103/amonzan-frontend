export type VendorVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type VendorVerificationTab = VendorVerificationStatus | "ALL";

export type AdminVendorVerificationRequest = {
    shopId: string;
    userId: string;

    shopName: string;
    description: string | null;
    businessLicenseNo: string | null;

    verificationStatus: VendorVerificationStatus;

    contactPhone: string | null;
    contactEmail: string | null;

    partnerType: string | null;
    identityNumber: string | null;

    identityFrontPath: string | null;
    identityBackPath: string | null;

    province: string | null;
    district: string | null;
    addressDetail: string | null;

    ownerFullName: string | null;
    ownerEmail: string | null;
    ownerPhoneNumber: string | null;

    createdAt: string | null;
};
