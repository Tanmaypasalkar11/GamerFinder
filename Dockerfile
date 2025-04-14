# Development stage
FROM node:18-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production stage
FROM node:18-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]




# navigate kar jaha file hai aur agar devlopment mode me run karna hai toh ye kar "docker build --target dev -t gamerfinder-dev . " aut agar prod ke liye run karna hai toh ye "docker build --target prod -t gamerfinder-prod ." isse docker image build ho jayega fir container run karna next step pe

#dev ke liye ye cmd "docker run -p 3000:3000 -v ${PWD}:/app -v /app/node_modules gamerfinder-dev" aur prod ke liye ye "docker run -p 3000:3000 gamerfinder-prod"

#uske baad you're good to go to localhost:3000
# ye sab karne ke baad agar koi changes hota hai toh sirf "docker-compose up" karna hai aur sab kuch ho jayega