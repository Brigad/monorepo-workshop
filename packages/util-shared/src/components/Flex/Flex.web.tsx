import { match, P } from "ts-pattern";
import { FlexProps, ResponsiveFlexProps } from "./Flex.common";
import React from "react";

const makeResponsive = <T,>(func: (T) => string) => {
  return (value: T | [T | "none", T | "none", T | "none"]) => {
    if (!Array.isArray(value)) {
      return func(value);
    }

    return value
      .map((v, i) => {
        if (v === "none") {
          return undefined;
        }

        return `${match(i as 0 | 1 | 2)
          .with(0, () => "max-md:")
          .with(1, () => "md:max-lg:")
          .with(2, () => "lg:")
          .exhaustive()}${func(v)}`;
      })
      .filter(Boolean)
      .join(" ");
  };
};

const getAlignItems = makeResponsive((value: FlexProps["alignItems"]) => {
  return match(value)
    .with("flex-start", () => "items-start")
    .with("flex-end", () => "items-end")
    .with("center", () => "items-center")
    .with("stretch", () => "items-stretch")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getAlignContent = makeResponsive((value: FlexProps["alignContent"]) => {
  return match(value)
    .with("flex-start", () => "content-start")
    .with("flex-end", () => "content-end")
    .with("center", () => "content-center")
    .with("stretch", () => "content-stretch")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getAlignSelf = makeResponsive((value: FlexProps["alignSelf"]) => {
  return match(value)
    .with("auto", () => "self-auto")
    .with("flex-start", () => "self-start")
    .with("flex-end", () => "self-end")
    .with("center", () => "self-center")
    .with("stretch", () => "self-stretch")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getJustifyContent = makeResponsive((value: FlexProps["justifyContent"]) => {
  return match(value)
    .with("flex-start", () => "justify-start")
    .with("flex-end", () => "justify-end")
    .with("center", () => "justify-center")
    .with("space-between", () => "justify-between")
    .with("space-around", () => "justify-around")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getFlexDirection = makeResponsive((value: FlexProps["flexDirection"]) => {
  return match(value)
    .with("row", () => "flex-row")
    .with("column", () => "flex-col")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getGap = makeResponsive((value: FlexProps["gap"]) => {
  return match(value)
    .with("small", () => "gap-1")
    .with("medium", () => "gap-2")
    .with("large", () => "gap-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getRowGap = makeResponsive((value: FlexProps["rowGap"]) => {
  return match(value)
    .with("small", () => "gap-y-1")
    .with("medium", () => "gap-y-2")
    .with("large", () => "gap-y-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getColumnGap = makeResponsive((value: FlexProps["columnGap"]) => {
  return match(value)
    .with("small", () => "gap-x-1")
    .with("medium", () => "gap-x-2")
    .with("large", () => "gap-x-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getFlexWrap = makeResponsive((value: FlexProps["flexWrap"]) => {
  return match(value)
    .with("wrap", () => "flex-wrap")
    .with("wrap-reverse", () => "flex-wrap-reverse")
    .with("nowrap", () => "flex-nowrap")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getFlex = makeResponsive((value: FlexProps["flex"]) => {
  return match(value)
    .with(0, () => "flex-none")
    .with(1, () => "flex-1")
    .with(P.number, () => `flex-[${value}]`)
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getFlexGrow = makeResponsive((value: FlexProps["flexGrow"]) => {
  return match(value)
    .with(0, () => "grow-0")
    .with(1, () => "grow")
    .with(P.number, () => `grow-[${value}]`)
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getFlexShrink = makeResponsive((value: FlexProps["flexShrink"]) => {
  return match(value)
    .with(0, () => "shrink-0")
    .with(1, () => "shrink")
    .with(P.number, () => `shrink-[${value}]`)
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getFlexBasis = makeResponsive((value: FlexProps["flexBasis"]) => {
  return match(value)
    .with(0, () => "basis-0")
    .with(P.number, () => `basis-[${value}px]`)
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getMargin = makeResponsive((value: FlexProps["margin"]) => {
  return match(value)
    .with("small", () => "m-1")
    .with("medium", () => "m-2")
    .with("large", () => "m-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getMarginHorizontal = makeResponsive((value: FlexProps["marginHorizontal"]) => {
  return match(value)
    .with("small", () => "mx-1")
    .with("medium", () => "mx-2")
    .with("large", () => "mx-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getMarginVertical = makeResponsive((value: FlexProps["marginVertical"]) => {
  return match(value)
    .with("small", () => "my-1")
    .with("medium", () => "my-2")
    .with("large", () => "my-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getMarginLeft = makeResponsive((value: FlexProps["marginLeft"]) => {
  return match(value)
    .with("small", () => "ml-1")
    .with("medium", () => "ml-2")
    .with("large", () => "ml-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getMarginRight = makeResponsive((value: FlexProps["marginRight"]) => {
  return match(value)
    .with("small", () => "mr-1")
    .with("medium", () => "mr-2")
    .with("large", () => "mr-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getMarginTop = makeResponsive((value: FlexProps["marginTop"]) => {
  return match(value)
    .with("small", () => "mt-1")
    .with("medium", () => "mt-2")
    .with("large", () => "mt-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getMarginBottom = makeResponsive((value: FlexProps["marginBottom"]) => {
  return match(value)
    .with("small", () => "mb-1")
    .with("medium", () => "mb-2")
    .with("large", () => "mb-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getPadding = makeResponsive((value: FlexProps["padding"]) => {
  return match(value)
    .with("small", () => "p-1")
    .with("medium", () => "p-2")
    .with("large", () => "p-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getPaddingHorizontal = makeResponsive((value: FlexProps["paddingHorizontal"]) => {
  return match(value)
    .with("small", () => "px-1")
    .with("medium", () => "px-2")
    .with("large", () => "px-4")
    .with(P.nullish, () => undefined)
      .exhaustive();
    }
  );

const getPaddingVertical = makeResponsive((value: FlexProps["paddingVertical"]) => {
  return match(value)
    .with("small", () => "py-1")
    .with("medium", () => "py-2")
    .with("large", () => "py-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getPaddingLeft = makeResponsive((value: FlexProps["paddingLeft"]) => {
  return match(value)
    .with("small", () => "pl-1")
    .with("medium", () => "pl-2")
    .with("large", () => "pl-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getPaddingRight = makeResponsive((value: FlexProps["paddingRight"]) => {
  return match(value)
    .with("small", () => "pr-1")
    .with("medium", () => "pr-2")
    .with("large", () => "pr-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getPaddingTop = makeResponsive((value: FlexProps["paddingTop"]) => {
  return match(value)
    .with("small", () => "pt-1")
    .with("medium", () => "pt-2")
    .with("large", () => "pt-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getPaddingBottom = makeResponsive((value: FlexProps["paddingBottom"]) => {
  return match(value)
    .with("small", () => "pb-1")
    .with("medium", () => "pb-2")
    .with("large", () => "pb-4")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getBorderRadius = makeResponsive((value: FlexProps["borderRadius"]) => {
  return match(value)
    .with("small", () => "rounded")
    .with("medium", () => "rounded-lg")
    .with("large", () => "rounded-2xl")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getShadow = makeResponsive((value: FlexProps["shadow"]) => {
  return match(value)
    .with("low", () => "shadow")
    .with("medium", () => "shadow-md")
    .with("high", () => "shadow-lg")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getBackgroundColor = makeResponsive((value: FlexProps["backgroundColor"]) => {
  return match(value)
    .with("dark", () => "bg-slate-900")
    .with("light", () => "bg-slate-100")
    .with("white", () => "bg-white")
    .with("error", () => "bg-red-500")
    .with("success", () => "bg-green-500")
    .with("warning", () => "bg-yellow-500")
    .with(P.nullish, () => undefined)
    .exhaustive();
});

const getClassNameFromProps = (props: ResponsiveFlexProps) => {
  return Object.entries(props)
    .reduce<(string | undefined)[]>(
      (acc, [key, value]) => {
        if (key === "flexDirection") {
          console.log(value);
        }
        return [
          ...acc,
          match(key as keyof FlexProps)
            .with("alignItems", () =>
              getAlignItems(value as FlexProps["alignItems"])
            )
            .with("alignContent", () =>
              getAlignContent(value as FlexProps["alignContent"])
            )
            .with("alignSelf", () =>
              getAlignSelf(value as FlexProps["alignSelf"])
            )
            .with("justifyContent", () =>
              getJustifyContent(value as FlexProps["justifyContent"])
            )
            .with("flexDirection", () =>
              getFlexDirection(
                (value as FlexProps["flexDirection"]) ?? "column"
              )
            )
            .with("gap", () => getGap(value as FlexProps["gap"]))
            .with("rowGap", () => getRowGap(value as FlexProps["rowGap"]))
            .with("columnGap", () =>
              getColumnGap(value as FlexProps["columnGap"])
            )
            .with("flexWrap", () => getFlexWrap(value as FlexProps["flexWrap"]))
            .with("flex", () => getFlex(value as FlexProps["flex"]))
            .with("flexGrow", () => getFlexGrow(value as FlexProps["flexGrow"]))
            .with("flexShrink", () =>
              getFlexShrink(value as FlexProps["flexShrink"])
            )
            .with("flexBasis", () =>
              getFlexBasis(value as FlexProps["flexBasis"])
            )
            .with("margin", () => getMargin(value as FlexProps["margin"]))
            .with("marginHorizontal", () =>
              getMarginHorizontal(value as FlexProps["marginHorizontal"])
            )
            .with("marginVertical", () =>
              getMarginVertical(value as FlexProps["marginVertical"])
            )
            .with("marginLeft", () =>
              getMarginLeft(value as FlexProps["marginLeft"])
            )
            .with("marginRight", () =>
              getMarginRight(value as FlexProps["marginRight"])
            )
            .with("marginTop", () =>
              getMarginTop(value as FlexProps["marginTop"])
            )
            .with("marginBottom", () =>
              getMarginBottom(value as FlexProps["marginBottom"])
            )
            .with("padding", () => getPadding(value as FlexProps["padding"]))
            .with("paddingHorizontal", () =>
              getPaddingHorizontal(value as FlexProps["paddingHorizontal"])
            )
            .with("paddingVertical", () =>
              getPaddingVertical(value as FlexProps["paddingVertical"])
            )
            .with("paddingLeft", () =>
              getPaddingLeft(value as FlexProps["paddingLeft"])
            )
            .with("paddingRight", () =>
              getPaddingRight(value as FlexProps["paddingRight"])
            )
            .with("paddingTop", () =>
              getPaddingTop(value as FlexProps["paddingTop"])
            )
            .with("paddingBottom", () =>
              getPaddingBottom(value as FlexProps["paddingBottom"])
            )
            .with("borderRadius", () =>
              getBorderRadius(value as FlexProps["borderRadius"])
            )
            .with("shadow", () => getShadow(value as FlexProps["shadow"]))
            .with("backgroundColor", () =>
              getBackgroundColor(value as FlexProps["backgroundColor"])
            )
            .exhaustive(),
        ];
      },
      ["flex"]
    )
    .filter(Boolean)
    .join(" ");
};

export const Flex = ({
  children,
  flexDirection = "column",
  ...props
}: ResponsiveFlexProps & { children?: React.ReactNode }) => {
  const classNames = getClassNameFromProps({
    flexDirection,
    ...props,
  });

  return <div className={classNames}>{children}</div>;
};
