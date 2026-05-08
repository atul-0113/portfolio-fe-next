"use client";

interface NoDataProps {
  className?: string;
  description?: string;
  title?: string;
}

const NoData = ({
  className = "",
  description,
  title = "No data available",
}: NoDataProps) => {
  return (
    <div
      className={`flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed border-[#c7c4d8] bg-[#f8f9fa] px-6 py-8 text-center ${className}`}
    >
      <p className="text-sm font-semibold text-[#191c1d]">{title}</p>
      {description ? (
        <p className="mt-2 max-w-sm text-xs leading-5 text-[#464555]">
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default NoData;
