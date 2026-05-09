"use client";

import type {
  PortfolioAnimation,
  PortfolioNodeStyle,
  PortfolioTemplateNode,
} from "./types";

const selectControls: Array<{
  key: keyof PortfolioNodeStyle;
  label: string;
  options: string[];
}> = [
  { key: "layout", label: "Layout", options: ["stack", "split", "grid", "centered", "inline"] },
  { key: "align", label: "Align", options: ["left", "center", "right"] },
  { key: "columns", label: "Columns", options: ["1", "2", "3", "4"] },
  { key: "gap", label: "Gap", options: ["none", "sm", "md", "lg", "xl"] },
  { key: "paddingY", label: "Y Padding", options: ["none", "sm", "md", "lg", "xl"] },
  { key: "paddingX", label: "X Padding", options: ["none", "sm", "md", "lg", "xl"] },
  { key: "marginY", label: "Y Margin", options: ["none", "sm", "md", "lg", "xl"] },
  { key: "marginX", label: "X Margin", options: ["none", "sm", "md", "lg", "xl"] },
  { key: "maxWidth", label: "Max Width", options: ["sm", "md", "lg", "xl", "full"] },
  { key: "backgroundSize", label: "BG Size", options: ["cover", "contain", "auto"] },
  { key: "backgroundPosition", label: "BG Position", options: ["center", "top", "bottom", "left", "right"] },
  { key: "imagePlacement", label: "Image Mode", options: ["side", "cover", "top", "none"] },
  { key: "aspectRatio", label: "Aspect", options: ["auto", "video", "square", "portrait", "wide"] },
  { key: "mediaFit", label: "Media Fit", options: ["cover", "contain"] },
  { key: "borderStyle", label: "Border Style", options: ["none", "solid", "dashed", "dotted"] },
  { key: "radius", label: "Radius", options: ["none", "sm", "md", "lg", "xl", "full"] },
  { key: "shadow", label: "Shadow", options: ["none", "sm", "md", "lg"] },
];

const textControls: Array<{
  key: keyof PortfolioNodeStyle;
  label: string;
  placeholder: string;
}> = [
  { key: "width", label: "Width", placeholder: "100%, 420px" },
  { key: "height", label: "Height", placeholder: "auto, 320px" },
  { key: "minHeight", label: "Min Height", placeholder: "480px" },
  { key: "fontFamily", label: "Font Face", placeholder: "Inter, Arial, sans-serif" },
  { key: "fontSize", label: "Font Size", placeholder: "16px" },
  { key: "lineHeight", label: "Line Height", placeholder: "1.6" },
  { key: "fontWeight", label: "Font Weight", placeholder: "400, 700, 900" },
  { key: "backgroundImage", label: "Background Image", placeholder: "{{media.0.src}} or URL" },
  { key: "backgroundOverlay", label: "Background Overlay", placeholder: "rgba(9, 10, 11, 0.45)" },
  { key: "backgroundBlur", label: "Background Blur", placeholder: "8px" },
  { key: "backdropBlur", label: "Backdrop Blur", placeholder: "12px" },
  { key: "borderWidth", label: "Border Width", placeholder: "1px" },
  { key: "imageWidth", label: "Image Width", placeholder: "320px" },
  { key: "imageHeight", label: "Image Height", placeholder: "260px" },
];

const colorControls: Array<{
  key: keyof PortfolioNodeStyle;
  label: string;
}> = [
  { key: "backgroundColor", label: "Background" },
  { key: "textColor", label: "Text" },
  { key: "accentColor", label: "Accent" },
  { key: "borderColor", label: "Border" },
];

const cardSelectControls: Array<{
  key: keyof PortfolioNodeStyle;
  label: string;
  options: string[];
}> = [
  { key: "cardContentAlign", label: "Content Align", options: ["left", "center", "right"] },
  { key: "cardContentJustify", label: "Content Position", options: ["start", "center", "end", "between"] },
  { key: "cardContentGap", label: "Content Gap", options: ["none", "sm", "md", "lg", "xl"] },
  { key: "cardPaddingY", label: "Card Y Padding", options: ["none", "sm", "md", "lg", "xl"] },
  { key: "cardPaddingX", label: "Card X Padding", options: ["none", "sm", "md", "lg", "xl"] },
  { key: "cardBorderStyle", label: "Card Border", options: ["none", "solid", "dashed", "dotted"] },
  { key: "cardRadius", label: "Card Radius", options: ["none", "sm", "md", "lg", "xl", "full"] },
  { key: "cardShadow", label: "Card Shadow", options: ["none", "sm", "md", "lg"] },
];

const cardTextControls: Array<{
  key: keyof PortfolioNodeStyle;
  label: string;
  placeholder: string;
}> = [
  { key: "cardWidth", label: "Card Width", placeholder: "260px, 100%" },
  { key: "cardHeight", label: "Card Height", placeholder: "180px" },
  { key: "cardMinHeight", label: "Card Min Height", placeholder: "140px" },
  { key: "cardBackgroundImage", label: "Card BG Image", placeholder: "{{media.0.src}} or URL" },
  { key: "cardBackgroundOverlay", label: "Card BG Overlay", placeholder: "rgba(255, 255, 255, 0.7)" },
  { key: "cardBackgroundBlur", label: "Card BG Blur", placeholder: "6px" },
  { key: "cardBorderWidth", label: "Card Border Width", placeholder: "1px" },
  { key: "cardFontFamily", label: "Card Font Face", placeholder: "Inter, Arial, sans-serif" },
  { key: "cardFontSize", label: "Card Font Size", placeholder: "15px" },
  { key: "cardLineHeight", label: "Card Line Height", placeholder: "1.5" },
  { key: "cardFontWeight", label: "Card Font Weight", placeholder: "600" },
  { key: "cardValueFontSize", label: "Value Font Size", placeholder: "32px" },
  { key: "cardValueFontWeight", label: "Value Font Weight", placeholder: "900" },
  { key: "cardTitleFontSize", label: "Title Font Size", placeholder: "20px" },
  { key: "cardTitleFontWeight", label: "Title Font Weight", placeholder: "900" },
  { key: "cardBodyFontSize", label: "Body Font Size", placeholder: "14px" },
  { key: "cardBodyLineHeight", label: "Body Line Height", placeholder: "1.6" },
  { key: "cardMetaFontSize", label: "Meta Font Size", placeholder: "12px" },
  { key: "cardTagFontSize", label: "Tag Font Size", placeholder: "12px" },
];

const cardColorControls: Array<{
  key: keyof PortfolioNodeStyle;
  label: string;
}> = [
  { key: "cardBackgroundColor", label: "Card Background" },
  { key: "cardTextColor", label: "Card Text" },
  { key: "cardAccentColor", label: "Card Accent" },
  { key: "cardBorderColor", label: "Card Border" },
  { key: "cardValueColor", label: "Value Text" },
  { key: "cardTitleColor", label: "Title Text" },
  { key: "cardBodyColor", label: "Body Text" },
  { key: "cardMetaColor", label: "Meta Text" },
  { key: "cardTagColor", label: "Tag Text" },
  { key: "cardTagBackgroundColor", label: "Tag Background" },
];

const animationOptions: PortfolioAnimation[] = ["none", "fade-up", "slide-in", "scale-in"];
const cardBackedTypes = new Set(["stats", "projectGrid", "skillCloud", "timeline", "customList"]);

const getStyleValue = (style: PortfolioNodeStyle | undefined, key: keyof PortfolioNodeStyle) =>
  String(style?.[key] ?? "");

const isHexColor = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

interface StyleSelectProps {
  control: {
    key: keyof PortfolioNodeStyle;
    label: string;
    options: string[];
  };
  style: PortfolioNodeStyle | undefined;
  onStyleChange: (key: keyof PortfolioNodeStyle, value: string) => void;
}

const StyleSelect = ({ control, style, onStyleChange }: StyleSelectProps) => (
  <label>
    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
      {control.label}
    </span>
    <select
      value={getStyleValue(style, control.key)}
      onChange={(event) => onStyleChange(control.key, event.target.value)}
      className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
    >
      <option value="">Default</option>
      {control.options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

interface StyleTextInputProps {
  control: {
    key: keyof PortfolioNodeStyle;
    label: string;
    placeholder: string;
  };
  style: PortfolioNodeStyle | undefined;
  onStyleChange: (key: keyof PortfolioNodeStyle, value: string) => void;
}

const StyleTextInput = ({ control, style, onStyleChange }: StyleTextInputProps) => (
  <label className="block">
    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
      {control.label}
    </span>
    <input
      value={getStyleValue(style, control.key)}
      placeholder={control.placeholder}
      onChange={(event) => onStyleChange(control.key, event.target.value)}
      className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
    />
  </label>
);

interface StyleColorInputProps {
  control: {
    key: keyof PortfolioNodeStyle;
    label: string;
  };
  style: PortfolioNodeStyle | undefined;
  onStyleChange: (key: keyof PortfolioNodeStyle, value: string) => void;
}

const StyleColorInput = ({ control, style, onStyleChange }: StyleColorInputProps) => {
  const value = getStyleValue(style, control.key);
  const pickerValue = isHexColor(value) ? value : "#ffffff";

  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
        {control.label}
      </span>
      <span className="mt-1.5 flex items-center gap-2">
        <input
          type="color"
          value={pickerValue}
          onChange={(event) => onStyleChange(control.key, event.target.value)}
          className="h-9 w-11 shrink-0 rounded-md border border-[#c7c4d8] bg-white p-1"
        />
        <input
          value={value}
          placeholder="#ffffff, rgba(...), var(...)"
          onChange={(event) => onStyleChange(control.key, event.target.value)}
          className="h-9 min-w-0 flex-1 rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
        />
      </span>
    </label>
  );
};

interface NodeStyleEditorProps {
  node: PortfolioTemplateNode;
  onAnimationChange: (value: PortfolioAnimation) => void;
  onStyleChange: (key: keyof PortfolioNodeStyle, value: string) => void;
}

export const NodeStyleEditor = ({
  node,
  onAnimationChange,
  onStyleChange,
}: NodeStyleEditorProps) => {
  const showCardControls = cardBackedTypes.has(node.type);

  return (
    <div className="space-y-4 border-t border-[#d9d7e8] pt-4">
      <div>
        <h3 className="mb-3 text-sm font-black text-[#090a0b]">Style</h3>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
            Animation
          </span>
          <select
            value={node.animation || "none"}
            onChange={(event) => onAnimationChange(event.target.value as PortfolioAnimation)}
            className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
          >
            {animationOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <details open className="rounded-lg border border-[#d9d7e8] bg-white p-3">
        <summary className="cursor-pointer text-sm font-black text-[#090a0b]">
          Layout
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {selectControls.map((control) => (
            <StyleSelect
              key={control.key}
              control={control}
              style={node.style}
              onStyleChange={onStyleChange}
            />
          ))}
        </div>
      </details>

      <details open className="rounded-lg border border-[#d9d7e8] bg-white p-3">
        <summary className="cursor-pointer text-sm font-black text-[#090a0b]">
          Typography & Size
        </summary>
        <div className="mt-3 grid gap-3">
          {textControls.map((control) => (
            <StyleTextInput
              key={control.key}
              control={control}
              style={node.style}
              onStyleChange={onStyleChange}
            />
          ))}
        </div>
      </details>

      <details open className="rounded-lg border border-[#d9d7e8] bg-white p-3">
        <summary className="cursor-pointer text-sm font-black text-[#090a0b]">
          Color
        </summary>
        <div className="mt-3 grid gap-3">
          {colorControls.map((control) => (
            <StyleColorInput
              key={control.key}
              control={control}
              style={node.style}
              onStyleChange={onStyleChange}
            />
          ))}
        </div>
      </details>

      {showCardControls && (
        <details open className="rounded-lg border border-[#d9d7e8] bg-white p-3">
          <summary className="cursor-pointer text-sm font-black text-[#090a0b]">
            Cards
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {cardSelectControls.map((control) => (
              <StyleSelect
                key={control.key}
                control={control}
                style={node.style}
                onStyleChange={onStyleChange}
              />
            ))}
          </div>
          <div className="mt-3 grid gap-3">
            {cardTextControls.map((control) => (
              <StyleTextInput
                key={control.key}
                control={control}
                style={node.style}
                onStyleChange={onStyleChange}
              />
            ))}
          </div>
          <div className="mt-3 grid gap-3 border-t border-[#d9d7e8] pt-3">
            {cardColorControls.map((control) => (
              <StyleColorInput
                key={control.key}
                control={control}
                style={node.style}
                onStyleChange={onStyleChange}
              />
            ))}
          </div>
        </details>
      )}
    </div>
  );
};
