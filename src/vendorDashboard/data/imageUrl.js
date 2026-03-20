// src/vendorDashboard/data/imageUrl.js
//
// Handles every image format that may exist in MongoDB:
//
//  FORMAT 1: Full Cloudinary URL  → "https://res.cloudinary.com/dctmlindk/image/upload/suby-products/abc.jpg"
//  FORMAT 2: Local /uploads/ path → "/uploads/1773999022764.jpg"
//  FORMAT 3: Bare timestamp name  → "1773999022764.jpg"   ← broken old saves (never on Cloudinary)
//  FORMAT 4: Bare Cloudinary ID   → "suby-products/abc"   ← rare edge case
//
// For FORMAT 3 (bare timestamp filenames) we cannot recover the image because
// it was saved to Render's ephemeral disk which is now wiped — show placeholder.

import { API_URL } from './apiPath';

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

const isTimestampFilename = (str) => {
  // Matches patterns like "1773999022764.jpg" — just digits + extension, no slashes
  return /^\d{10,}[.\-]\w+(\.\w+)?$/.test(str) || /^\d{10,}-\d+\.\w+$/.test(str);
};

/**
 * Resolves an image field from MongoDB to a usable URL.
 * @param {string|null} image  - raw value from DB
 * @param {string} folder      - "suby-products" or "suby-firms"
 * @returns {string|null}      - full URL or null (show placeholder)
 */
export const resolveImageUrl = (image, folder = 'suby-products') => {
  if (!image) return null;

  // FORMAT 1: already a full URL
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  // FORMAT 2: local /uploads/ path
  if (image.startsWith('/uploads/')) return `${API_URL}${image}`;

  // FORMAT 3: bare timestamp filename → was on local disk, now gone → return null
  if (isTimestampFilename(image)) return null;

  // FORMAT 4: bare Cloudinary public ID like "suby-products/abc123"
  if (CLOUD && image.includes('/')) {
    return `https://res.cloudinary.com/${CLOUD}/image/upload/${image}`;
  }

  // FORMAT 5: bare filename with no folder — try Cloudinary folder
  if (CLOUD) {
    return `https://res.cloudinary.com/${CLOUD}/image/upload/${folder}/${image}`;
  }

  // Last resort: try local server
  return `${API_URL}/uploads/${image}`;
};

export const getProductImageUrl = (image) => resolveImageUrl(image, 'suby-products');
export const getFirmImageUrl    = (image) => resolveImageUrl(image, 'suby-firms');
