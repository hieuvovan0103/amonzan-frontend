import { Category } from "@/types/category";

type CategoryCardProps = {
  data: Category;
};

export default function CategoryCard({ data }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-[18px] border border-[#E6E6E6] p-5 shadow-[0_1px_2px_rgba(15,17,17,0.06),_0_4px_14px_rgba(15,17,17,0.05)] hover:shadow-[0_6px_20px_rgba(15,17,17,0.10)] transition-shadow duration-300 flex flex-col h-full cursor-pointer group">
      <div className="mb-4">
        <h3 className="text-[20px] font-semibold text-[#222222] leading-[1.3] tracking-[-0.01em]">
          {data.title}
        </h3>

        {data.subtitle && (
          <p className="text-[13px] text-[#6B7280] mt-1 leading-[1.4]">
            {data.subtitle}
          </p>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        {data.type === "single-image" && (
          <div className="w-full aspect-[4/5] rounded-[10px] overflow-hidden bg-[#F7F7F7] mt-auto">
            <img
              src={data.image}
              alt={data.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {data.type === "split-image" && (
          <div className="flex flex-col gap-6 mt-auto">
            <div className="grid grid-cols-2 gap-3">
              {data.images.map((img, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="w-full aspect-square rounded-[8px] overflow-hidden bg-[#F7F7F7]">
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[13px] font-medium text-[#222222]">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {data.links.map((link, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="text-[13px] font-medium text-[#007185] hover:text-[#E47911] hover:underline text-center"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}

        {data.type === "text-grid" && (
          <div className="grid grid-cols-2 gap-y-12 gap-x-4 my-auto pt-8">
            {data.links.map((link, idx) => (
              <a
                key={idx}
                href="#"
                className="text-[14px] font-medium text-[#222222] hover:text-[#E47911] hover:underline flex items-center justify-center p-4 bg-[#F7F7F7] rounded-[10px] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}