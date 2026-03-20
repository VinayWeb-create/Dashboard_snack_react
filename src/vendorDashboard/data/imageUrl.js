// src/vendorDashboard/data/imageUrl.js

import { API_URL } from './apiPath';

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

// Detects old Render local-disk filenames like:
//   "1773999022764.jpg"   (timestamp.ext)
//   "1773999022764-938271.jpg"  (timestamp-random.ext)
// These files are GONE — Render wiped them. Return null → show placeholder.
const isDeadLocalFile = (str) =>
  /^\d{10,}(-\d+)?\.\w+$/.test(str);

/**
 * @param {string|null} image
 * @param {'suby-products'|'suby-firms'} folder
 * @returns {string|null}
 */
export const resolveImageUrl = (image, folder = 'suby-products') => {
  if (!image) return null;

  // 1. Full URL already — use as-is (Cloudinary https:// or any CDN)
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  // 2. Local /uploads/ path — works only in local dev
  if (image.startsWith('/uploads/')) return `${API_URL}${image}`;

  // 3. Dead local filename (timestamp) — file is gone on Render → placeholder
  if (isDeadLocalFile(image)) return null;

  // 4. Bare Cloudinary public_id with folder e.g. "suby-firms/abc123"
  if (CLOUD && image.includes('/'))
    return `https://res.cloudinary.com/${CLOUD}/image/upload/${image}`;

  // 5. Bare filename without folder — append folder and try Cloudinary
  if (CLOUD)
    return `https://res.cloudinary.com/${CLOUD}/image/upload/${folder}/${image}`;

  // 6. Last resort
  return `${API_URL}/uploads/${image}`;
};

export const getProductImageUrl = (image) => resolveImageUrl(image, 'suby-products');
export const getFirmImageUrl    = (image) => resolveImageUrl(image, 'suby-firms');
