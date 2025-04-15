# ------------------------
# 🔧 Development stage
# ------------------------
FROM node:18-alpine AS dev
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy code and prisma files
COPY . .
COPY prisma ./prisma

# 👇 Generate Prisma client AFTER env + prisma are available
RUN npx prisma generate

# Expose port and start dev server
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ------------------------
# 🚀 Production stage
# ------------------------
FROM node:18-alpine AS prod
WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm install --only=production

# Copy code and prisma
COPY . .
COPY prisma ./prisma

# 👇 Generate Prisma client again for production
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# Expose port and run production server
EXPOSE 3000
CMD ["npm", "start"]
