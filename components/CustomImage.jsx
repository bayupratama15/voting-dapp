import React, { forwardRef } from "react";
import Image from "next/image";

const CustomImage = forwardRef((props, ref) => {
  return (
    <Image src={props.src} 
    style={props.style}
    alt={props.alt} width={props.width} height={props.height} ref={ref} />
  );
});

export default CustomImage;