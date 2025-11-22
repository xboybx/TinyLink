# TinyLink - URL Shortener

A modern, production-ready URL shortener built with React.js, Node.js, Express, 
and MongoDB. Features a Minimal UI design and comprehensive API.


![Demo](Public/Demo.gif)


## 🌟 Features

- ✨ Create short, memorable links with custom codes
- 📊 Detailed click analytics and statistics
- 🔍 Search and filter your links
- 📱 Fully responsive design
- 🎨 Minimal UI
- ⚡ Fast and lightweight
- 🔒 Input validation and error handling
- 📋 One-click link copying
- 🗑️ Easy link management

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Date-fns** - Date utility library

## 📁 Project Structure

```
tinylink/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── linkController.js
│   │   ├── models/
│   │   │   └── Link.js
│   │   ├── routes/
│   │   │   └── links.js
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── StatsPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` file with your configuration:
   ```env
   MONGO_URL=mongodb://localhost:27017/tinylink
   BASE_URL=http://localhost:5000
   PORT=5000
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` file:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Link Management
- `POST /api/links` - Create a new short link
- `GET /api/links` - List all links
- `GET /api/links/:code` - Get link statistics
- `DELETE /api/links/:code` - Delete a link

### Redirection
- `GET /:code` - Redirect to target URL (302 redirect)

### Health Check
- `GET /healthz` - Health check endpoint

## 📋 Usage Guide

### Creating a Short Link

1. **With Auto-generated Code:**
   ```bash
   POST /api/links
   {
     "targetUrl": "https://example.com/very-long-url"
   }
   ```

2. **With Custom Code:**
   ```bash
   POST /api/links
   {
     "targetUrl": "https://example.com/very-long-url",
     "code": "MYLINK"
   }
   ```

### Response Format

Success response (201):
```json
{
  "code": "ABC123",
  "targetUrl": "https://example.com",
  "shortUrl": "http://localhost:5000/ABC123",
  "clicks": 0,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

Error response (409 - duplicate code):
```json
{
  "error": "Code already exists",
  "code": "CODE_EXISTS"
}
```

## 🔐 Validation Rules

- **URL Validation**: Must be a valid URL format
- **Code Format**: 6-8 alphanumeric characters (A-Z, a-z, 0-9)
- **Code Uniqueness**: Custom codes must be unique
- **Auto-generation**: If no code provided, system generates a 6-character code

## 🎨 UI Components

### Glass-morphism Design
The frontend features a modern glass-morphism design with:
- Semi-transparent backgrounds with backdrop blur
- Gradient overlays and subtle borders
- Smooth animations and transitions
- Responsive grid layouts

### Component Library
- **Button**: Primary, secondary, danger, and success variants
- **Input**: Validated form inputs with error states
- **Card**: Glass-morphism container components
- **Modal**: Overlay modals with backdrop blur
- **Loader**: Animated loading indicators
- **Toast**: Notification system for user feedback

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm run lint
```

## 🚀 Deployment

### Production Build

1. **Backend:**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

### Environment Variables for Production

**Backend (.env):**
```env
MONGO_URL=mongodb://your-production-mongodb-url
BASE_URL=https://your-domain.com
PORT=5000
```

**Frontend (.env):**
```env
VITE_BACKEND_URL=https://your-api-domain.com
```

### Docker Deployment

Create a `docker-compose.yml` file:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URL=mongodb://mongo:27017/tinylink
      - BASE_URL=http://localhost:5000
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_BACKEND_URL=http://localhost:5000

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

## 🔧 Configuration

### MongoDB Indexes
The application automatically creates the following indexes:
- `code` - Unique index for fast lookups
- `createdAt` - Index for sorting

### Rate Limiting
Default rate limiting configuration:
- Window: 15 minutes
- Max requests: 100 per IP
- Headers: Standard rate limit headers

## 📱 Mobile Responsiveness

The application is fully responsive with:
- Mobile-first design approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface elements
- Optimized typography scaling

## 🎯 Performance Optimizations

- Lazy loading of components
- Image optimization
- Minimal bundle size
- Efficient database queries
- Caching strategies
- Compression middleware

## 🔒 Security Features

- Helmet.js for security headers
- Input validation and sanitization
- CORS configuration
- Rate limiting
- MongoDB injection prevention
- XSS protection

## 📊 Analytics

Track link performance with:
- Click count tracking
- Last clicked timestamp
- Creation date logging
- Visual statistics dashboard

## 🛠️ Development Tips

### Code Style
- ESLint configuration included
- Prettier formatting
- Consistent naming conventions
- Modular component structure

### Debugging
- Development mode with hot reloading
- Detailed error messages
- Console logging in development
- Network request monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- Lucide for the beautiful icons
- Express.js community for the robust backend framework