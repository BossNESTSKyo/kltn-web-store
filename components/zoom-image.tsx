import React from "react";
import ReactImageMagnify from "react-image-magnify";

interface ZoomImageProps {
  img: string;
  alt: string;
}

const ZoomImage: React.FC<ZoomImageProps> = ({ img, alt }) => {
  const imageProps = {
    smallImage: {
      alt: alt,
      isFluidWidth: true,
      src: img,
    },
    largeImage: {
      src: img,
      width: 1200,
      height: 800,
    },
    enlargedImageContainerDimensions: {
      width: "120%",
      height: "80%",
    },
  };

  return <ReactImageMagnify {...imageProps} />;
};

export default ZoomImage;
