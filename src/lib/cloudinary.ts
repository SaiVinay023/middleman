import { v2 as cloudinary } from 'cloudinary';

// This configures the "Server-Side" SDK
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // NEVER prefix this with NEXT_PUBLIC
  secure: true,
});

export default cloudinary;