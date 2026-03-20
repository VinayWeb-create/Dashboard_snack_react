// src/vendorDashboard/data/imageUrl.js
//
// Resolves image URLs for BOTH firm images and product images.
// Handles all formats that may exist in the database:
//
//  1. Full Cloudinary URL  →  "https://res.cloudinary.com/..."
//  2. Local /uploads/ path →  "/uploads/filename.png"
//  3. Bare filename        →  "jsuc5lhl5hegx81kiw2b.png"  (old broken saves)

import { API_URL } from './apiPath';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

/**
 * @param {string|null} image   - The image field from MongoDB
 * @param {string} folder       - Cloudinary folder: "suby-products" or "suby-firms"
 * @returns {string|null}
 */
export const resolveImageUrl = (image, folder = 'suby-products') => {
  if (!image) return null;

  // 1. Already a full URL
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  // 2. Local /uploads/ path (dev fallback)
  if (image.startsWith('/uploads/')) return `${API_URL}${image}`;

  // 3. Bare filename — build Cloudinary URL
  if (CLOUDINARY_CLOUD_NAME) {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${folder}/${image}`;
  }

  // 4. Last resort — try local server
  return `${API_URL}/uploads/${image}`;
};

// Shorthand helpers
export const getProductImageUrl = (image) => resolveImageUrl(image, 'suby-products');
export const getFirmImageUrl    = (image) => resolveImageUrl(image, 'suby-firms');
