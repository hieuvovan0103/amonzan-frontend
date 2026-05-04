"use client";

import { useState, useEffect } from "react";
import { ChevronRight, MapPin, ShieldCheck, Store, Loader2, AlertCircle } from "lucide-react";
import { VendorPartnerType } from "@/types/vendor-registration";
import VendorInputField from "@/components/vendor-registration/VendorInputField";
import VendorTextAreaField from "@/components/vendor-registration/VendorTextAreaField";
import VendorFileUploadField from "@/components/vendor-registration/VendorFileUploadField";
import VendorSelectField from "@/components/vendor-registration/VendorSelectField";
import VendorRadioGroup from "@/components/vendor-registration/VendorRadioGroup";
import VendorSectionCard from "@/components/vendor-registration/VendorSectionCard";
import VendorRegistrationSuccess from "@/components/vendor-registration/VendorRegistrationSuccess";
import { registerVendorApi } from "@/lib/api/vendor";
import { useAuthStore } from "@/stores/useAuthStore";
import { uploadProductImage } from "@/lib/api/productImages";

export default function VendorRegistrationForm() {
    const [step, setStep] = useState<1 | 2>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [shopName, setShopName] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [description, setDescription] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [addressDetail, setAddressDetail] = useState("");
    const [partnerType, setPartnerType] = useState<VendorPartnerType>("individual");
    const [identityNumber, setIdentityNumber] = useState("");
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);

    const [provincesData, setProvincesData] = useState<any[]>([]);

    const { user, profile, setProfile } = useAuthStore();

    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/?depth=2")
            .then(res => res.json())
            .then(data => setProvincesData(data))
            .catch(console.error);
    }, []);

    const provinceOptions = [
        { value: "", label: "Chọn Tỉnh / Thành phố" },
        ...provincesData.map(p => ({ value: p.name, label: p.name }))
    ];

    const selectedProvinceData = provincesData.find(p => p.name === province);
    const districtOptions = [
        { value: "", label: "Chọn Quận / Huyện" },
        ...(selectedProvinceData?.districts.map((d: any) => ({ value: d.name, label: d.name })) || [])
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (!user) throw new Error("Bạn cần đăng nhập để thực hiện thao tác này.");

            let identityFrontUrl = undefined;
            let identityBackUrl = undefined;

            if (frontFile) {
                identityFrontUrl = await uploadProductImage(user.id, frontFile);
            }
            if (backFile) {
                identityBackUrl = await uploadProductImage(user.id, backFile);
            }

            const result = await registerVendorApi({
                shopName,
                contactPhone,
                contactEmail,
                description,
                province,
                district,
                addressDetail,
                partnerType,
                identityNumber,
                identityFrontUrl,
                identityBackUrl,
            });

            if (result?.shopProfile) {
                const nextShopProfiles = Array.isArray(profile?.shop_profiles)
                    ? [...profile.shop_profiles, result.shopProfile]
                    : profile?.shop_profiles
                      ? [profile.shop_profiles, result.shopProfile]
                      : [result.shopProfile];

                setProfile({
                    ...profile,
                    shop_profiles: nextShopProfiles,
                });
            }
            setStep(2);
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === 2) {
        return <VendorRegistrationSuccess onBackHome={() => setStep(1)} />;
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <h1 className="text-[28px] md:text-[32px] font-bold text-[#222222] tracking-[-0.02em] mb-2">
                    Trở thành đối tác cho thuê
                </h1>
                <p className="text-[15px] text-[#565959]">
                    Bắt đầu kiếm thêm thu nhập từ trang phục, đạo cụ và thiết bị nhàn rỗi
                    của bạn.
                </p>
            </div>

            {error && (
                <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                    <p className="text-[14px] leading-relaxed text-red-600">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <VendorSectionCard icon={Store} title="1. Thông tin gian hàng">
                    <VendorInputField
                        label="Tên gian hàng"
                        placeholder="VD: Shikaru Cosplay Store"
                        required
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <VendorInputField
                            label="Số điện thoại liên hệ"
                            placeholder="VD: 0901234567"
                            type="tel"
                            required
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                        />
                        <VendorInputField
                            label="Email hỗ trợ khách hàng"
                            placeholder="shop@example.com"
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                        />
                    </div>

                    <VendorTextAreaField
                        label="Mô tả gian hàng"
                        placeholder="Giới thiệu ngắn gọn về các loại đồ bạn cho thuê, điểm nổi bật..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </VendorSectionCard>

                <VendorSectionCard icon={MapPin} title="2. Địa chỉ giao dịch chính">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <VendorSelectField
                            label="Tỉnh / Thành phố"
                            required
                            value={province}
                            onChange={(e) => {
                                setProvince(e.target.value);
                                setDistrict("");
                            }}
                            options={provinceOptions}
                        />

                        <VendorSelectField
                            label="Quận / Huyện"
                            required
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            options={districtOptions}
                        />
                    </div>

                    <VendorInputField
                        label="Địa chỉ chi tiết (Số nhà, Đường, Phường)"
                        placeholder="VD: 436A/81 Đường 3 Tháng 2, Phường 12"
                        required
                        value={addressDetail}
                        onChange={(e) => setAddressDetail(e.target.value)}
                    />
                </VendorSectionCard>

                <VendorSectionCard icon={ShieldCheck} title="3. Xác thực pháp lý">
                    <p className="text-[13px] text-[#565959] mb-6 leading-relaxed">
                        Để đảm bảo an toàn cho cộng đồng Amonzan, chúng tôi yêu cầu các đối
                        tác cung cấp giấy tờ tùy thân hoặc giấy phép kinh doanh. Dữ liệu này
                        được mã hóa và bảo mật tuyệt đối.
                    </p>

                    <VendorRadioGroup
                        value={partnerType}
                        onChange={setPartnerType}
                    />

                    <VendorInputField
                        label="Số CCCD / Mã số doanh nghiệp"
                        placeholder="Nhập dãy số..."
                        required
                        value={identityNumber}
                        onChange={(e) => setIdentityNumber(e.target.value)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <VendorFileUploadField
                            label={
                                partnerType === "individual"
                                    ? "Mặt trước CCCD"
                                    : "Giấy phép kinh doanh"
                            }
                            subLabel="Đảm bảo hình ảnh rõ nét, không bị lóa."
                            onFileSelect={setFrontFile}
                        />

                        <VendorFileUploadField
                            label={
                                partnerType === "individual"
                                    ? "Mặt sau CCCD"
                                    : "Giấy tờ bổ sung"
                            }
                            subLabel={
                                partnerType === "individual"
                                    ? "Bắt buộc với cá nhân."
                                    : "Có thể bỏ qua nếu không có."
                            }
                            onFileSelect={setBackFile}
                        />
                    </div>
                </VendorSectionCard>

                <div className="bg-white border border-[#E6E6E6] rounded-[16px] p-6 shadow-sm">
                    <div className="flex items-start gap-3 mb-6">
                        <div className="pt-0.5">
                            <input
                                type="checkbox"
                                required
                                className="w-4 h-4 rounded border-[#D5D9D9] text-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/50 cursor-pointer accent-[#FF9900]"
                            />
                        </div>

                        <p className="text-[13px] text-[#222222] leading-relaxed">
                            Tôi xác nhận rằng các thông tin cung cấp ở trên là chính xác. Tôi
                            đã đọc và đồng ý với{" "}
                            <a
                                href="#"
                                className="text-[#007185] hover:text-[#E47911] hover:underline font-medium"
                            >
                                Quy chế hoạt động dành cho gian hàng
                            </a>{" "}
                            và{" "}
                            <a
                                href="#"
                                className="text-[#007185] hover:text-[#E47911] hover:underline font-medium"
                            >
                                Chính sách xử lý tranh chấp / hư hỏng tài sản
                            </a>{" "}
                            của Amonzan.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] text-[#111111] font-bold text-[15px] py-3.5 rounded-[12px] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...
                            </>
                        ) : (
                            <>
                                Gửi yêu cầu đăng ký <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
