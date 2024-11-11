import styles from "./Flex.module.scss";
import { FlexProps } from "./utils";
import { getResponsiveClassNames } from "../../utils/responsive-styles/ResponsiveStyles.web";

export const Flex = ({
  children,
  flexDirection,
  justifyContent,
  alignItems,
  alignContent,
  flexWrap,
  className,
}: FlexProps & { className?: string }) => {
  const responsiveClassName = getResponsiveClassNames({
    "flex-direction": flexDirection,
    "justify-content": justifyContent,
    "align-items": alignItems,
    "align-content": alignContent,
    "flex-wrap": flexWrap,
  });

  const finalClassName = [responsiveClassName, styles.flex, className]
    .filter(Boolean)
    .join(" ");

  return <div className={finalClassName}>{children}</div>;
};
