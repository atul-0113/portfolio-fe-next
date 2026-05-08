import { badgeColorClasses, colorClasses } from "./theme";

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const layoutStyles = {
  page: "mx-auto w-full max-w-[1130px] px-4 py-8 sm:px-6 lg:px-0",
  pageWide: "mx-auto max-w-[1200px]",
  pageShell: "px-6 py-10 lg:px-12",
  sectionHeader: "mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
  toolbar: "mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
  gridCards: "grid gap-8 md:grid-cols-2 xl:grid-cols-3",
  metricGrid: "mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
} as const;

export const typographyStyles = {
  pageTitle: cx("font-bold leading-tight", colorClasses.textStrong, "text-[30px]"),
  pageTitleLarge: cx("font-bold leading-tight", colorClasses.textStrong, "text-[34px]"),
  sectionTitle: cx("text-lg font-bold", colorClasses.textStrong),
  cardTitle: cx("text-base font-bold", colorClasses.textStrong),
  cardTitleLarge: cx("text-[21px] font-bold leading-snug", colorClasses.textStrong),
  body: cx("text-sm leading-6", colorClasses.textMuted),
  bodyLarge: cx("text-base leading-7", colorClasses.textMuted),
  bodySmall: cx("text-xs leading-5", colorClasses.textMuted),
  label: cx("text-xs font-medium tracking-[0.1em]", colorClasses.text),
  tableHeader: cx("text-[11px] font-semibold uppercase tracking-[0.12em]", colorClasses.textMuted),
} as const;

export const componentStyles = {
  card: cx("rounded-lg border", colorClasses.border, colorClasses.surface),
  cardCompact: cx("rounded-lg border", colorClasses.border, colorClasses.surface, "px-6 py-6"),
  tableShell: cx("overflow-x-auto rounded-lg border", colorClasses.border, colorClasses.surface),
  tableHeader: cx("border-b px-6 py-3", colorClasses.border, typographyStyles.tableHeader),
  tableRow: cx("items-center border-b px-6 py-3 last:border-b-0", colorClasses.border),
  buttonPrimary: cx(
    "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold text-white shadow-sm transition",
    colorClasses.primaryBg,
    colorClasses.primaryHoverBg,
  ),
  buttonPrimaryCompact: cx(
    "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold text-white shadow-sm transition",
    colorClasses.primaryBg,
    colorClasses.primaryHoverBg,
  ),
  buttonSecondary: cx(
    "inline-flex h-10 items-center gap-3 rounded-md border bg-white px-6 text-base font-medium transition",
    colorClasses.border,
    colorClasses.text,
    colorClasses.hoverBorder,
    colorClasses.hoverText,
  ),
  input: cx(
    "rounded-md border bg-[#f8f9fa] text-sm outline-none focus:bg-white",
    colorClasses.border,
    colorClasses.text,
    colorClasses.focusBorder,
  ),
  chip: cx("inline-flex h-9 items-center rounded-full px-5 text-sm", badgeColorClasses.info),
  badgeNeutral: cx("w-fit rounded px-2.5 py-0.5 text-xs", badgeColorClasses.neutral),
  badgeMuted: cx("w-fit rounded px-2.5 py-0.5 text-xs font-semibold", badgeColorClasses.muted),
  badgePrimary: cx("w-fit rounded px-2.5 py-0.5 text-xs font-semibold", badgeColorClasses.primary),
} as const;
