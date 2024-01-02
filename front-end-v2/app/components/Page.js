import React, { useEffect } from "react";

function Page(props) {
  useEffect(() => {
    document.title = `${props.title} | TMS`;
    window.scrollTo(0, 0);
  }, []);
  return <>{props.children}</>;
}

export default Page;
