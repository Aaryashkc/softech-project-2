# Database Seed Scripts

## Home Data Seed

This script populates the database with initial home page data.

### Usage

```bash
# Seed home data (will skip if data already exists)
npm run seed:home

# Force seed (overwrites existing data)
npm run seed:home -- --force
```

### What it does

- Connects to MongoDB using `MONGO_URL` from `.env`
- Checks if home data already exists
- Creates initial home page data with:
  - Hero section (name, title, description, buttons)
  - Highlights section (with 3 default items)
  - Initiatives section (with 2 default items)
  - CTA section

### Notes

- Profile image will be empty initially - upload via admin panel at `/admin`
- All data can be updated through the admin panel after seeding
- Use `--force` flag to overwrite existing data

### First Time Setup

1. Make sure your `.env` file has `MONGO_URL` configured
2. Run the seed script: `npm run seed:home`
3. Start your server: `npm run dev`
4. Access admin panel to upload profile image and customize content

