import React from "react";
import type { AppProps } from "next/app";

import "windi.css";

export default function App({ Component, pageProps }: AppProps) {
  return React.createElement(Component, pageProps);
}
