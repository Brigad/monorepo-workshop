const dynamicClasses = [
  // Existing alignment classes
  "items-start",
  "items-end",
  "items-center",
  "items-stretch",
  "content-start",
  "content-end",
  "content-center",
  "content-stretch",
  "self-auto",
  "self-start",
  "self-end",
  "self-center",
  "self-stretch",
  "justify-start",
  "justify-end",
  "justify-center",
  "justify-between",
  "justify-around",

  // Flex classes
  "flex-row",
  "flex-col",
  "flex-wrap",
  "flex-wrap-reverse",
  "flex-nowrap",
  "flex-none",
  "flex-1",
  "grow-0",
  "grow",
  "shrink-0",
  "shrink",
  "basis-0",

  // Spacing classes
  "gap-1",
  "gap-2",
  "gap-4",
  "gap-y-1",
  "gap-y-2",
  "gap-y-4",
  "gap-x-1",
  "gap-x-2",
  "gap-x-4",

  // Margin classes
  "m-1",
  "m-2",
  "m-4",
  "mx-1",
  "mx-2",
  "mx-4",
  "my-1",
  "my-2",
  "my-4",
  "ml-1",
  "ml-2",
  "ml-4",
  "mr-1",
  "mr-2",
  "mr-4",
  "mt-1",
  "mt-2",
  "mt-4",
  "mb-1",
  "mb-2",
  "mb-4",

  // Padding classes
  "p-1",
  "p-2",
  "p-4",
  "px-1",
  "px-2",
  "px-4",
  "py-1",
  "py-2",
  "py-4",
  "pl-1",
  "pl-2",
  "pl-4",
  "pr-1",
  "pr-2",
  "pr-4",
  "pt-1",
  "pt-2",
  "pt-4",
  "pb-1",
  "pb-2",
  "pb-4",

  // Border radius classes
  "rounded",
  "rounded-lg",
  "rounded-2xl",

  // Shadow classes
  "shadow",
  "shadow-md",
  "shadow-lg",

  // Background color classes
  "bg-slate-900",
  "bg-slate-100",
  "bg-white",
  "bg-red-500",
  "bg-green-500",
  "bg-yellow-500"
];

/** @type {import('tailwindcss').Config} */
export default {
  content: {
    relative: true,
    files:[
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "../util-shared/**/*.{js,ts,jsx,tsx}",
    ],
  },
  safelist: [
    ...dynamicClasses.map(c => {
      return {
        pattern: new RegExp(`^${c}$`),
        variants: ["max-md", "md:max-lg", "lg"]
      }
    }),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
