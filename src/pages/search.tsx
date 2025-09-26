import React from "react";
// next
import dynamic from "next/dynamic";
const Search = dynamic(() => import("src/components/searchDialog/search"));
// loading issue
export default function Searchs() {
  return <Search mobile />;
}
