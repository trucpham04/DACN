![Landing page](https://github.com/ct2n/next-template/blob/main/public/images/landing-page.png?raw=true)

# Next.js Project Template

A simple and opinionated Next.js project template pre-configured with essential tools and best practices for modern web development.

## Built-in Features

- **Theming**: Integrated with `next-themes`.
- **Localization**: Multi-language support powered by `next-intl`.
- **UI Components**: Beautifully designed components using **shadcn/ui**.
- **API Handling**: Robust data fetching and state synchronization using `axios` and `swr`.
- **Developer Experience**:
  - **Biome**: Fast and performant toolchain for linting and formatting.
  - **Prettier**: Code formatting with `prettier-plugin-tailwindcss` for consistent class sorting.
  - **Docker**: Ready-to-use `Dockerfile` based on Alpine Linux with multi-stage build.

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/ct2n/next-template.git
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker

1. **Build the image**

   ```bash
   docker build -t next-template .
   ```

2. **Run the container**

   ```bash
   docker run -p 3000:3000 next-template
   ```

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Checks for linting errors using Biome.
- `npm run format`: Formats code using Biome.
