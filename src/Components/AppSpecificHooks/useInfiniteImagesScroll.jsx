import { useState, useEffect } from "react";

const useInfiniteImagesScroll = callback => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) return;
    callback(() => {});
  }, [isLoading]);

  useEffect(() => {
    window.addEventListener("scroll", handleImagesScroll);
    return () => window.removeEventListener("scroll", handleImagesScroll);
  }, []);

  const handleImagesScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return setIsLoading(true);
  };

  return [isLoading, setIsLoading];
};

export default useInfiniteImagesScroll;
