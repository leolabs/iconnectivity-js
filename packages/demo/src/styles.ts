import tw, { globalStyles } from "twin.macro";
import { globalCss } from "../stitches.config";

const customStyles = {
  body: {
    ...tw`bg-gray-900 text-gray-50 antialiased font-sans`,
  },
};

const styles = () => {
  globalCss(customStyles)();
  globalCss(globalStyles as Record<any, any>)();
};

export default styles;
