# Starlink User Portal

## Overview
The Starlink User Portal is a React-based frontend interface that allows Starlink customers in West Africa to manage and activate their Starlink kits efficiently. This interactive platform provides real-time updates, easy navigation, and a modern user experience for seamless service management.

## Features
- User registration and account setup
- Kit activation and management
- Real-time network performance monitoring
- Customer support and troubleshooting guides
- Billing and subscription management

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (>= 16.x)
- npm or yarn

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/starlink-user-portal.git
   cd starlink-user-portal
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Start the development server:
   ```sh
   npm start  # or yarn start
   ```

## Deployment
### Docker
1. Build and run the container:
   ```sh
   docker-compose up --build
   ```

### Vercel/Netlify
1. Deploy using Vercel:
   ```sh
   vercel deploy
   ```
2. Deploy using Netlify:
   ```sh
   netlify deploy
   ```

## Environment Variables
Create a `.env` file and configure the following:
```
REACT_APP_API_BASE_URL=https://api.starlink.com
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_key
```

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a Pull Request

## License
This project is licensed under the MIT License.

