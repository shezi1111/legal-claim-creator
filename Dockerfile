FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Set dummy env vars for build only (real ones injected by Railway at runtime)
ARG GOOGLE_CLIENT_ID=build-placeholder
ARG GOOGLE_CLIENT_SECRET=build-placeholder
ARG DATABASE_URL=build-placeholder
ARG ANTHROPIC_API_KEY=build-placeholder
ARG OPENAI_API_KEY=build-placeholder
ARG GOOGLE_AI_API_KEY=build-placeholder
ARG NEXT_PUBLIC_APP_URL=build-placeholder

ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV GOOGLE_AI_API_KEY=$GOOGLE_AI_API_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD ["npm", "start"]
