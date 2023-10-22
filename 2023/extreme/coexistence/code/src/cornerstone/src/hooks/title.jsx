import { useEffect, useRef } from "react";

const useTitle = (title, dependencies = []) => {
  const documentDefined = typeof document !== "undefined";
  const originalTitle = useRef(documentDefined ? document.title : null);
  useEffect(() => {
    if (!documentDefined) return;

    if (document.title !== title) document.title = title;

    return () => {
      document.title = originalTitle.current;
    };
  }, [...dependencies]);
};

export default useTitle;
