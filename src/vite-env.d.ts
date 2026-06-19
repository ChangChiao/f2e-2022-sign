/// <reference types="vite/client" />

// svgr (vite-plugin-svgr) exposes SVGs as React components via the
// `ReactComponent` named export. Declared here instead of referencing
// `vite-plugin-svgr/client`, whose subpath isn't exposed under the
// "Bundler" module resolution exports map.
declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.ComponentProps<"svg"> & { title?: string }
  >;

  const src: string;
  export default src;
}
