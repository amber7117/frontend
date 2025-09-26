import { useState } from "react";
import Image from "next/image";

export default function BlurImage({ ...props }) {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      {...props}
      src={props.src}
      alt={props.alt}
      style={{
        // transition: "filter .3s ease-in-out,-webkit-filter .3s ease-in-out",
        ...(isLoading
          ? {
              filter: "blur(15px)",
            }
          : {
              filter: "blur(0px)",
            }),
      }}
      onLoad={() => setLoading(false)}
    />
  );
}
