import tw, { styled } from "twin.macro";

export const StateButton = styled.button({
  ...tw`rounded py-1 px-3 cursor-pointer tabular-nums whitespace-nowrap`,
  ...tw` outline-none transition-shadow focus-visible:ring`,

  variants: {
    color: {
      green: {
        ...tw`bg-green-800 text-green-50 focus-visible:ring-green-900`,
      },
      red: {
        ...tw`bg-red-800 text-red-50 focus-visible:ring-red-900`,
      },
      gray: {
        ...tw`bg-gray-700 text-gray-50 focus-visible:ring-gray-900`,
      },
    },
  },

  defaultVariants: {
    color: "green",
  },
});
