import { Roboto,ADLaM_Display } from "next/font/google";

const roboto = Roboto({
    weight: ["100", "300", "400", "500", "700", "900"],
    subsets: ['latin'],
    variable: '--font-roboto'
});

export const fonts = { roboto }