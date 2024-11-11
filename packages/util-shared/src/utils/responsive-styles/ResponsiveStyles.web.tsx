import ResponsiveStyles from "./ResponsiveStyles.module.scss";

import { ResponsiveStylesObject, ResponsiveTypeWithNone, TextResponsiveStylesObject } from "./types";
type Breakpoint = "mobile" | "tablet" | "desktop" | "all";

type MappedResponsiveStyles = {
  gap: ResponsiveStylesObject["gap"];
  ["row-gap"]: ResponsiveStylesObject["rowGap"];
  ["column-gap"]: ResponsiveStylesObject["columnGap"];
  ["margin"]: ResponsiveStylesObject["margin"];
  ["margin-horizontal"]: ResponsiveStylesObject["marginHorizontal"];
  ["margin-vertical"]: ResponsiveStylesObject["marginVertical"];
  ["margin-top"]: ResponsiveStylesObject["marginTop"];
  ["margin-bottom"]: ResponsiveStylesObject["marginBottom"];
  ["margin-left"]: ResponsiveStylesObject["marginLeft"];
  ["margin-right"]: ResponsiveStylesObject["marginRight"];
  ["padding"]: ResponsiveStylesObject["padding"];
  ["padding-horizontal"]: ResponsiveStylesObject["paddingHorizontal"];
  ["padding-vertical"]: ResponsiveStylesObject["paddingVertical"];
  ["padding-top"]: ResponsiveStylesObject["paddingTop"];
  ["padding-bottom"]: ResponsiveStylesObject["paddingBottom"];
  ["padding-left"]: ResponsiveStylesObject["paddingLeft"];
  ["padding-right"]: ResponsiveStylesObject["paddingRight"];
  ["border-radius"]: ResponsiveStylesObject["borderRadius"];
  ["shadow"]: ResponsiveStylesObject["shadow"];
  ["justify-content"]: ResponsiveStylesObject["justifyContent"];
  ["align-content"]: ResponsiveStylesObject["alignContent"];
  ["align-items"]: ResponsiveStylesObject["alignItems"];
  ["align-self"]: ResponsiveStylesObject["alignSelf"];
  ["flex-wrap"]: ResponsiveStylesObject["flexWrap"];
  ["flex-direction"]: ResponsiveStylesObject["flexDirection"];
  ["flex-grow"]: ResponsiveStylesObject["flexGrow"];
  ["flex-shrink"]: ResponsiveStylesObject["flexShrink"];
  ["text-align"]: TextResponsiveStylesObject["textAlign"];
};

type MappedResponsiveStylesKeys = keyof MappedResponsiveStyles;


const getClassName = <K extends MappedResponsiveStylesKeys, V = MappedResponsiveStyles[K]>(
  property: K,
  value: V | "none",
  breakpoint: Breakpoint = "all"
) => {
  if (value === "none") {
    return undefined;
  }
  return ResponsiveStyles[`${property}-${value}-${breakpoint}`];
};

const getResponsiveClassName = <K extends MappedResponsiveStylesKeys, V = MappedResponsiveStyles[K]>(
  property: K,
  value: ResponsiveTypeWithNone<V>,
) => {
  if (!Array.isArray(value)) {
    return getClassName(property, value);
  }
  return [
    getClassName(property, value[0], "mobile"),
    getClassName(property, value[1], "tablet"),
    getClassName(property, value[2] || value[1], "desktop"),
  ].filter(Boolean).join(" ");
};

const getResponsiveClassNames = (styles: Partial<MappedResponsiveStyles>) => {
  return Object.entries(styles).map(([property, value]) => getResponsiveClassName(property as MappedResponsiveStylesKeys, value)).join(" ");
};

export { getClassName, getResponsiveClassName, getResponsiveClassNames };
