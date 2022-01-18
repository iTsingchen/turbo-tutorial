import React from "react";
import type { AppProps } from "next/app";

import "windi.css";

export default function App({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return React.createElement(Component, pageProps);
}
