type BoxProps = {
  margin?: ConstantSpacing;
  padding?: ConstantSpacing;
  borderRadius?: ConstantSpacing;
  backgroundColor?: "light" | "dark" | "white" | "black";
  children?: React.ReactNode;
};

type ConstantSpacing = 'none' | 'small' | 'medium' | 'large';

export const getValueFromConstantSpacing = (value: ConstantSpacing | undefined) => {
  if (!value) return 0;
  switch (value) {
    case 'none': return 0;
    case 'small': return 4;
    case 'medium': return 8;
    case 'large': return 16;
  }
}

export const getBackgroundColor = (value: BoxProps['backgroundColor']) => {
  if (!value) return 'white';
  switch (value) {
    case 'light': return '#f0f0f0';
    case 'dark': return '#333333';
    case 'white': return '#ffffff';
    case 'black': return '#000000';
  }
}

export type { BoxProps };
