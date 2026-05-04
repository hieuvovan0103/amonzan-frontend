import { UploadCloud, File, X } from "lucide-react";
import { useRef, useState } from "react";

type VendorFileUploadFieldProps = {
    label: string;
    subLabel?: string;
    onFileSelect?: (file: File | null) => void;
};

export default function VendorFileUploadField({
    label,
    subLabel,
    onFileSelect,
}: VendorFileUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            
            // Create preview if it's an image
            if (file.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(file));
            } else {
                setPreviewUrl(null);
            }

            if (onFileSelect) {
                onFileSelect(file);
            }
        }
    };

    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        setPreviewUrl(null);
        if (inputRef.current) inputRef.current.value = "";
        if (onFileSelect) onFileSelect(null);
    };

    return (
        <div className="mb-4">
            <label className="text-[14px] font-bold text-[#222222] block mb-1">
                {label}
            </label>

            {subLabel && (
                <p className="text-[12px] text-[#565959] mb-2">{subLabel}</p>
            )}

            <div 
                onClick={() => inputRef.current?.click()}
                className={`w-full border-2 border-dashed ${selectedFile ? 'border-[#007185] bg-[#F0F8FF]' : 'border-[#D5D9D9]'} rounded-[12px] p-6 flex flex-col items-center justify-center text-center hover:bg-[#F7F7F7] hover:border-[#FF9900] transition-colors cursor-pointer group relative overflow-hidden`}
            >
                {selectedFile ? (
                    <div className="flex flex-col items-center w-full">
                        {previewUrl ? (
                            <div className="w-full h-32 mb-3 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                                <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                            </div>
                        ) : (
                            <File className="w-10 h-10 text-[#007185] mb-2" />
                        )}
                        <span className="text-[13px] font-medium text-[#222222] truncate w-full px-4">
                            {selectedFile.name}
                        </span>
                        <button 
                            onClick={handleRemoveFile}
                            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="w-12 h-12 bg-[#F7F7F7] group-hover:bg-[#FF9900]/10 rounded-full flex items-center justify-center mb-3 transition-colors">
                            <UploadCloud className="w-6 h-6 text-[#6B7280] group-hover:text-[#FF9900]" />
                        </div>

                        <span className="text-[14px] font-bold text-[#007185] group-hover:text-[#E47911] group-hover:underline mb-1">
                            Nhấp để tải lên
                        </span>

                        <span className="text-[12px] text-[#6B7280]">
                            hoặc kéo thả file vào đây (Tối đa 5MB)
                        </span>
                    </>
                )}

                <input 
                    type="file" 
                    ref={inputRef} 
                    className="hidden" 
                    accept="image/jpeg, image/png, image/webp, application/pdf"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}