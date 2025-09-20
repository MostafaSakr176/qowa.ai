"use client"
import React, { useMemo } from "react";

export interface BarDatum {
  label: string;
  value: number;
}

export interface AllScansProps {
  title?: string;
  data: BarDatum[];
  colors?: string[];                     // palette (cycled if shorter than data length)
  valueFormatter?: (value: number, max: number) => string;
  minOpacity?: number;                   // default 0.6
  maxOpacity?: number;                   // default 1
  barHeight?: number;                    // default 35 (px)
  className?: string;                    // outer container extra classes
  showValues?: boolean;                  // toggle right-side values
  emptyPlaceholder?: React.ReactNode;    // custom empty state
}

function defaultValueFormatter(val: number): string {
  if (val >= 1000) {
    return (val / 1000)
      .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      .replace(".", ",") + "k";
  }
  return val.toString();
}

function hexToRgba(hex: string, alpha: number) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map(x => x + x).join("");
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

const AllScans: React.FC<AllScansProps> = ({
  title = "All scans",
  data,
  colors = ["#5B5BD6", "#6C6CDB", "#7D7DE0", "#8E8EE5"],
  valueFormatter,
  minOpacity = 0.6,
  maxOpacity = 1,
  barHeight = 35,
  className = "",
  showValues = true,
  emptyPlaceholder = <div className="text-sm text-muted-foreground px-2 py-4">No data</div>
}) => {

  const { maxValue, formatter } = useMemo(() => {
    const m = data.length ? Math.max(...data.map(d => d.value)) : 0;
    return {
      maxValue: m,
      formatter: (v: number) => (valueFormatter ?? ((x: number, _m: number) => defaultValueFormatter(x)))(v, m)
    };
  }, [data, valueFormatter]);

  if (!data.length) {
    return (
      <div className={`p-6 ${className}`}>
        {title && <div className="mb-2"><span className="font-semibold text-lg text-black">{title}</span></div>}
        {emptyPlaceholder}
      </div>
    );
  }

  const getOpacity = (value: number) => {
    if (maxValue === 0) return minOpacity;
    return minOpacity + ((value / maxValue) * (maxOpacity - minOpacity));
  };

  return (
    <div className={`p-6 ${className}`}>
      {title && (
        <div className="mb-2">
          <span className="font-semibold text-lg text-black">{title}</span>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {data.map((item, idx) => {
          const widthPercent = maxValue === 0 ? 0 : (item.value / maxValue) * 100;
            // cycle through palette
          const baseColor = colors[idx % colors.length];
          const opacity = getOpacity(item.value);
          return (
            <div
              key={item.label}
              className="flex items-center relative"
              style={{ minHeight: barHeight + 5 }}
            >
              <div
                className="flex items-center rounded-full w-full overflow-hidden"
                style={{
                  background: hexToRgba(baseColor, opacity),
                  width: `${widthPercent}%`,
                  minHeight: barHeight,
                  transition: "width 0.4s, background 0.4s",
                  position: "relative"
                }}
              >
                <span className="pl-4 pr-2 text-white font-medium text-[14px] sm:text-[16px] truncate z-10">
                  {item.label}
                </span>
                {showValues && (
                  <span className="ml-auto pr-4 text-white font-medium text-[14px] sm:text-[16px] z-10">
                    {formatter(item.value)}
                  </span>
                )}
              </div>
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ width: "100%", pointerEvents: "none", zIndex: 0 }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllScans;