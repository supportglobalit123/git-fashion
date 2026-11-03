"use client";

import { usePathname } from "next/navigation";

/**
 * Loads the storefront stylesheet bundle only outside of the admin dashboard.
 * Keeping these out of the dashboard avoids the dashboard's own `style.css`
 * clashing with the storefront's global styles.
 */
export default function StoreStyles() {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <>
      <link rel="stylesheet" href="/assets/css/bootstrap.min.css" precedence="default" />
      <link rel="stylesheet" href="/assets/css/plugins.css" precedence="default" />
      <link rel="stylesheet" href="/assets/css/style.css" precedence="default" />
    </>
  );
}
