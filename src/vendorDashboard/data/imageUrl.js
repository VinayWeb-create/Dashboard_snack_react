// src/vendorDashboard/data/imageUrl.js
//
// Handles all 3 image URL formats that may exist in your database:
//
//  1. Full Cloudinary URL  →  "https://res.cloudinary.com/..."  (new uploads)
//  2. Local path           →  "/uploads/filename.png"           (old local uploads)
//  3. Bare filename        →  "jsuc5lhl5hegx81kiw2b.png"        (broken old saves)
//
// For format 3 we try to build a Cloudinary URL using your cloud name env var
// so old images can still show if they were actually uploaded to Cloudinary.

import { API_URL } from './apiPath';

// Set your Cloudinary cloud name here as a fallback
// (same value as CLOUDINARY_CLOUD_NAME in your .env)
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

export const getProductImageUrl = (image) => {
  if (!image) return null;

  // 1. Already a full URL (Cloudinary or any https)
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  // 2. Local /uploads/ path
  if (image.startsWith('/uploads/')) {
    return `${API_URL}${image}`;
  }

  // 3. Bare filename — try to build Cloudinary URL
  if (CLOUDINARY_CLOUD_NAME) {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/suby-products/${image}`;
  }

  // 4. Last resort — try local server
  return `${API_URL}/uploads/${image}`;
};
