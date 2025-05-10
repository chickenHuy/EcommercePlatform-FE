# E-commerce Platform Frontend

A comprehensive, multi-user e-commerce platform built with Next.js, offering role-based functionality for administrators, vendors, and customers.

## Features

### For Customers
- **Product Browsing & Search**: Advanced search with filters and categories
- **Product Details**: Images, specifications, reviews, and suggestions
- **Shopping Cart**: Add products, manage quantities, and variants
- **Checkout Process**: Address management and payment integration
- **Order Management**: Track order status and history
- **User Profile**: Account settings and preferences
- **Chat with Vendors**: Real-time communication with store owners

### For Vendors
- **Store Management**: Set up and manage your online store
- **Product Management**: Create, update, and organize products
- **Inventory Management**: Track stock and product variants
- **Order Processing**: Receive and process customer orders
- **Chat with Customers**: Real-time support and communication
- **Sales Analytics**: Track sales, revenue, and performance

### For Administrators
- **User Management**: Manage customers, vendors, and admin accounts
- **Store Oversight**: Monitor and manage all stores on the platform
- **Product Category Management**: Create and organize product categories
- **Order Oversight**: Monitor and manage all orders
- **Brand Management**: Create and organize brands
- **Platform Analytics**: Track sales, users, and overall performance

### General Features
- **Multi-language Support**: Internationalization for multiple markets
- **Theme Customization**: Light/dark mode and UI themes
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Using WebSockets for live data
- **Authentication**: Secure login with OAuth support

## Technology Stack

- **Frontend Framework**: Next.js 14
- **State Management**: Redux Toolkit
- **UI Libraries**:
  - Material UI
  - Radix UI Components (Shadcn)
  - TailwindCSS
- **Form Handling**: React Hook Form with Zod validation
- **API Communication**: Custom HTTP client
- **Real-time Communication**: WebSockets (SockJS + StompJS)
- **Data Visualization**: Recharts
- **Internationalization**: next-intl
- **Authentication**: JWT with cookie-based auth
- **Theme Management**: next-themes
- **File Upload**: react-dropzone

## Project Structure

```
src/
├── api/                 # API request functions by domain
│   ├── admin/           # Admin-specific API requests
│   ├── auth/            # Authentication API
│   ├── cart/            # Shopping cart API
│   ├── user/            # User management API
│   └── vendor/          # Vendor-specific API
├── app/                 # Next.js App Router pages
│   ├── [locale]/        # Internationalized routes
│   │   ├── admin/       # Admin dashboard and features
│   │   ├── auth/        # Authentication pages
│   │   ├── cart/        # Shopping cart pages
│   │   ├── checkout/    # Checkout process
│   │   ├── search/      # Search functionality
│   │   ├── user/        # User account and settings
│   │   └── vendor/      # Vendor dashboard and features
├── components/          # Shared UI components
│   ├── auth/            # Authentication components
│   ├── card/            # Product and shopping cards
│   ├── chat/            # Chat functionality
│   ├── dialogs/         # Modal dialogs
│   ├── headers/         # Page headers
│   ├── ui/              # Base UI components
├── configs/             # App configurations
├── hooks/               # Custom React hooks
├── lib/                 # Core utilities
├── locales/             # Translation files
├── store/               # Redux store configuration
│   └── features/        # Redux slices
└── utils/               # Helper functions
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-org/ecommerce-platform-fe.git
   cd ecommerce-platform-fe
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables
   - Copy the `.env` file to `.env.local` and update the values

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint the code

## Configuration

The application can be configured through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_BASE_URL | Frontend base URL | http://localhost:3000 |
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:8080 |
| NEXT_PUBLIC_JWT_NAME | JWT cookie name | jwt |

## Deployment

The application can be deployed on any platform that supports Next.js applications, such as:

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Good alternative with similar features
- **AWS Amplify**: For AWS infrastructure
- **Docker**: Can be containerized for custom deployments

### Deployment Steps for Vercel

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Import the project on Vercel
3. Configure environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Material UI](https://mui.com/) - React UI framework
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
