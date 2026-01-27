import ImageKit from 'imagekit-javascript';

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '';
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '';

if (!publicKey || !urlEndpoint) {
  console.warn('ImageKit environment variables are not set');
}

export const imagekit = new ImageKit({
  publicKey: publicKey,
  urlEndpoint: urlEndpoint,
});

export const getImageKitUrl = (path: string, transformations?: any) => {
  if (!urlEndpoint) return '';
  
  return imagekit.url({
    path: path,
    transformation: transformations || [],
  });
};
