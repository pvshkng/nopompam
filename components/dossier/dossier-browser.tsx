import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";


const PureDossierBrowser = (props: any) => {
  const { url } = props;

  const [iframeFailed, setIframeFailed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIframeFailed(true);
    }, 2000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
  return (
    <>
      {iframeFailed ? (
        <div className={cn("text-xs text-red-500")}>
          Unable to display document. Please try again later.
        </div>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src="https://www.google.com/"
          onLoad={() => {
            console.log("loaded");
            handleLoad();
          }}
          style={{ minHeight: 200 }}
        />
      )}
    </>
  );
};

export const DossierBrowser = memo(PureDossierBrowser);
