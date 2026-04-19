# 🍽️ VendorHub — Vendor Dashboard

A full-featured, dark-themed restaurant vendor management dashboard built with **React + Vite**. Vendors can register, manage their firm, add/edit/delete menu products, and track analytics — all from a sleek single-page application.

---

## 🌐 Live Demo

> **Frontend:** Deployed on [Vercel](https://dashboard-snack-react.vercel.app/)  
> **Backend API:** `https://backend-nodejs-suby-2-rts0.onrender.com`

---

## ✨ Features

### 🔐 Authentication
- Vendor registration & login with JWT-based token auth
- Persistent login via `localStorage`
- Secure logout with confirmation dialog
- Change password with real-time strength meter & match indicator

### 🏪 Firm Management
- Add a restaurant firm (name, area, category, region, offer, image)
- Edit firm details inline via a modal (supports image replacement)
- One firm per vendor enforced

### 📦 Product Management
- Add products with name, price, description, category, cuisine tags, best-seller flag, and image
- Full product table with search, multi-filter (category, cuisine, best-seller)
- Edit any product via a modal without page reload
- Delete products with a confirm dialog
- Mobile-friendly card list view (table hidden on small screens)

### 📊 Analytics Dashboard
- Stat cards: Total products, Veg, Non-Veg, Best Sellers
- Category breakdown with animated progress bars
- Top products by price with bar chart
- Image coverage tracker
- Visual dot grid showing category distribution

### 👤 User Details
- View account info (username, email)
- View and edit firm details (with image preview)
- Scrollable menu item list with images, badges, and prices

### 🎨 UI / UX
- Fully dark theme with CSS custom properties
- Responsive: desktop sidebar → collapsed icon sidebar at ≤900px → bottom navigation at ≤640px
- Animated food panel (right video panel on key views)
- Toast notifications (success, error, warning, info)
- Confirm modal for destructive actions
- Smooth page transitions with `fadeUp` animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Bundler | Vite 5 |
| Routing | React Router DOM v6 |
| Styling | Pure CSS (custom properties, no CSS framework) |
| Fonts | Google Fonts — Syne + DM Sans |
| Loader | react-loader-spinner |
| Images | Cloudinary CDN |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
src/
├── App.jsx                        # Root routes
├── App.css                        # Global styles & design tokens
├── main.jsx                       # React DOM entry point
└── vendorDashboard/
    ├── pages/
    │   └── LandingPage.jsx        # Main page — state management & layout
    ├── components/
    │   ├── NavBar.jsx             # Top navigation bar
    │   ├── SideBar.jsx            # Desktop sidebar navigation
    │   ├── Welcome.jsx            # Dashboard home / hero
    │   ├── AllProducts.jsx        # Products table + edit modal
    │   ├── AnalyticsDashboard.jsx # Charts & stats
    │   ├── UserDetails.jsx        # Account info + edit firm modal
    │   ├── ChangePassword.jsx     # Password update form
    │   ├── VideoPanel.jsx         # Cloudinary video right panel
    │   ├── FoodAnimationPanel.jsx # Animated floating food cards
    │   ├── Toast.jsx              # Toast notification system (Context)
    │   ├── ConfirmModal.jsx       # Reusable confirm dialog (Context)
    │   └── forms/
    │       ├── Login.jsx          # Login form
    │       ├── Register.jsx       # Registration form
    │       ├── AddFirm.jsx        # Add firm form
    │       └── AddProduct.jsx     # Add product form
    └── data/
        ├── apiPath.js             # API base URL
        └── imageUrl.js            # Cloudinary / local image URL resolver
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 8

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/vendor-dashboard.git
cd vendor-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

> **Note:** The backend API URL is configured directly in `src/vendorDashboard/data/apiPath.js`. Update it there for local development:
> ```js
> export const API_URL = "http://localhost:5000";
> ```

---

## 🔌 API Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| POST | `/vendor/register` | Register a new vendor |
| POST | `/vendor/login` | Vendor login |
| GET | `/vendor/single-vendor/:id` | Fetch vendor details |
| PUT | `/vendor/change-password` | Update password |
| POST | `/firm/add-firm` | Create a new firm |
| PUT | `/firm/update-firm/:id` | Update firm details |
| GET | `/product/:firmId/products` | Get all products for a firm |
| POST | `/product/add-product/:firmId` | Add a product |
| PUT | `/product/:id` | Edit a product |
| DELETE | `/product/:id` | Delete a product |

---

## 🖼️ Image Handling

Images are resolved via `src/vendorDashboard/data/imageUrl.js` with this priority:

1. Full `https://` URL → used as-is (Cloudinary CDN)
2. `/uploads/` path → prefixed with API URL (local dev)
3. Timestamp-only filename → treated as dead (Render wipes disk) → shows placeholder
4. Bare Cloudinary `public_id` → constructed via `VITE_CLOUDINARY_CLOUD_NAME`

---

## 📱 Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| > 900px | Full sidebar with labels |
| ≤ 900px | Collapsed icon-only sidebar |
| ≤ 640px | Sidebar hidden; bottom navigation shown |
| ≤ 380px | Compact stat grid; logo text hidden |

---

## 🧩 Context Providers

Two React contexts wrap the entire app:

- **`ToastProvider`** — exposes `useToast()` with `.success()`, `.error()`, `.warning()`, `.info()` methods. Toasts auto-dismiss after 3.5 seconds.
- **`ConfirmProvider`** — exposes `useConfirm()` which returns a Promise-based confirm dialog. Resolves `true` (confirmed) or `false` (cancelled).

---

## 🚢 Deployment

### Vercel

The `vercel.json` at the project root configures SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

Push to your connected GitHub repo and Vercel handles the rest.

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  Built with ❤️ for restaurant vendors · Powered by <strong>VendorHub</strong>
</div>
