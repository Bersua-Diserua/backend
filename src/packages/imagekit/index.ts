import { config } from "@packages/config";
import ImageKit from "imagekit";

const imageKit = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: config.IMAGEKIT_ENDPOINT,
});

export { imageKit as imageKitClient };
