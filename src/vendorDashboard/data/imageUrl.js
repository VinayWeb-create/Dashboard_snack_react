// src/vendorDashboard/data/imageUrl.js
// Use this everywhere you render a product image.
// Cloudinary images are full https:// URLs – don't prepend API_URL.
// Local dev images start with /uploads/ – prepend API_URL.

import { API_URL } from './apiPath';

export const getProductImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${API_URL}${image}`;
};
