FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Next.js needs these at build time for route compilation but NOT baked into runtime
# Railway injects real values at runtime via docker run -e
RUN GOOGLE_CLIENT_ID=placeholder \
    GOOGLE_CLIENT_SECRET=placeholder \
    DATABASE_URL=placeholder \
    ANTHROPIC_API_KEY=placeholder \
    OPENAI_API_KEY=placeholder \
    GOOGLE_AI_API_KEY=placeholder \
    NEXT_PUBLIC_APP_URL=placeholder \
    npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD ["npm", "start"]
