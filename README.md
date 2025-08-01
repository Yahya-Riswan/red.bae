# 🖥️ Red.Bae — Used PC E-Commerce Web App

A fully functional **React-based eCommerce application** for **used PCs**, **laptops**, and **PC parts**, featuring **authentication**, **search**, **filtering**, **cart**, **ratings**, and **checkout** — all backed by **JSON Server**.

> 🔐 Admin & User access | 🛒 Persistent Cart | 🔎 Dynamic Filters | 💳 Dummy Checkout | ⭐ User Reviews

---

## 🚀 Features

### 🔐 1. User Authentication

- User **Registration** and **Login** powered by **JSON Server**.
- Role-based login for **Users** and **Admins**.
- Session is securely stored in **LocalStorage**.
- Actions like *add to cart*, *checkout*, and *wishlist* are **restricted for unauthenticated users**.
- **Logout** completely clears:
  - Cart  
  - Wishlist  
  - Session

---

### 🛍️ 2. Product Listing & Search

- Dynamic fetching of products from the server.
- Powerful frontend features:
  - 🔎 **Live Search** (filter products by title)
  - 🎯 **Category Filtering** (Sports, Casual, Formal, etc.)
  - ↕️ **Sorting** (e.g., Price: Low to High)
  - 🛑 Prevents **duplicate product entries**

---

### 📦 3. Product Details Page

- Clickable products open a **detailed product view**
- Displays:
  - ✅ Name  
  - ✅ Description  
  - ✅ Price  
  - ✅ Category  
  - ✅ Images
  - ⭐ **Average Rating & User Reviews**
- Allows **quantity selection** before adding to cart

---

### ⭐ 4. Ratings & Reviews

- Logged-in users can **add product reviews**
- Display **average rating** with stars
- Show **all previous reviews**
- Prevent duplicate reviews from the same user
- Validates inputs for quality feedback

---

### 🛒 5. Cart Functionality

- Each **user has a unique cart** stored locally
- On login, cart data is fetched for that user
- Cart supports:
  - ➕ Increment & ➖ Decrement of quantities
  - ❌ Item removal
  - 💰 Auto-calculated total price
  - 💾 **Persistence across sessions**
- Redirects **unauthenticated users** to login before adding to cart

---

### 💳 6. Checkout & Payment

- Simulated **dummy checkout page**
- On "payment":
  - 🧹 Cart is cleared
  - 📦 Order moved to **Orders Page**
  - ✅ Confirmation message shown

---

## 📁 Tech Stack

| Tech         | Role                  |
|--------------|-----------------------|
| **React**    | Frontend Framework    |
| **React Router** | Navigation/Routing  |
| **JSON Server** | Mock Backend API     |
| **Axios**    | API Communication     |
| **LocalStorage** | Session & Cart Storage |
| **CSS Modules / SCSS** | Styling        |

---

## 🧠 Future Enhancements

- ✅ Admin Product Management (CRUD)  
- ⏳ Real Payment Integration (e.g., Razorpay, Stripe)  
- ⏳ Profile Page & Address Management  
- ⏳ Email Verification

---

## 📸 Screenshots

> _Add screenshots or a demo video here to showcase the UI_

---

## ⚙️ Getting Started

### 📦 Installation

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
npm install
