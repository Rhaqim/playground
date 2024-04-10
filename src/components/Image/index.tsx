"use client";

import React from "react";
import Image from "next/image";

const ImageBase64 = ({ image }: { image: string }) => {
	// Base64 image
	const base64Image = `data:image/jpeg;base64,${image}`;
	return <Image src={base64Image} alt="Image" width={500} height={500} />;
};

export default ImageBase64;
