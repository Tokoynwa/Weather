// Generate sitemap.xml with all cities
const fs = require('fs');

const cities = [
    { slug: 'new-york' }, { slug: 'los-angeles' }, { slug: 'chicago' }, { slug: 'houston' },
    { slug: 'phoenix' }, { slug: 'philadelphia' }, { slug: 'san-antonio' }, { slug: 'san-diego' },
    { slug: 'dallas' }, { slug: 'san-jose' }, { slug: 'austin' }, { slug: 'jacksonville' },
    { slug: 'fort-worth' }, { slug: 'columbus' }, { slug: 'san-francisco' }, { slug: 'charlotte' },
    { slug: 'indianapolis' }, { slug: 'seattle' }, { slug: 'denver' }, { slug: 'washington-dc' },
    { slug: 'boston' }, { slug: 'nashville' }, { slug: 'las-vegas' }, { slug: 'portland' },
    { slug: 'miami' }, { slug: 'london' }, { slug: 'paris' }, { slug: 'berlin' },
    { slug: 'madrid' }, { slug: 'rome' }, { slug: 'barcelona' }, { slug: 'amsterdam' },
    { slug: 'vienna' }, { slug: 'prague' }, { slug: 'budapest' }, { slug: 'warsaw' },
    { slug: 'brussels' }, { slug: 'stockholm' }, { slug: 'copenhagen' }, { slug: 'oslo' },
    { slug: 'helsinki' }, { slug: 'lisbon' }, { slug: 'athens' }, { slug: 'dublin' },
    { slug: 'edinburgh' }, { slug: 'tokyo' }, { slug: 'beijing' }, { slug: 'shanghai' },
    { slug: 'hong-kong' }, { slug: 'singapore' }, { slug: 'seoul' }, { slug: 'bangkok' },
    { slug: 'dubai' }, { slug: 'mumbai' }, { slug: 'delhi' }, { slug: 'bangalore' },
    { slug: 'kuala-lumpur' }, { slug: 'manila' }, { slug: 'jakarta' }, { slug: 'taipei' },
    { slug: 'sydney' }, { slug: 'melbourne' }, { slug: 'brisbane' }, { slug: 'perth' },
    { slug: 'auckland' }, { slug: 'toronto' }, { slug: 'montreal' }, { slug: 'vancouver' },
    { slug: 'calgary' }, { slug: 'ottawa' }, { slug: 'mexico-city' }, { slug: 'buenos-aires' },
    { slug: 'sao-paulo' }, { slug: 'rio-de-janeiro' }, { slug: 'lima' }, { slug: 'bogota' },
    { slug: 'santiago' }, { slug: 'istanbul' }, { slug: 'cairo' }, { slug: 'tel-aviv' },
    { slug: 'johannesburg' }, { slug: 'cape-town' }, { slug: 'nairobi' }, { slug: 'tbilisi' },
    { slug: 'batumi' }, { slug: 'moscow' }, { slug: 'saint-petersburg' }
];

const baseURL = 'https://cloudvibes.org';
const today = new Date().toISOString().split('T')[0];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseURL}/</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
    <lastmod>${today}</lastmod>
  </url>
`;

// Add all cities with priority based on position
cities.forEach((city, index) => {
  let priority = 0.9;
  if (index > 20) priority = 0.8;
  if (index > 50) priority = 0.7;

  sitemap += `  <url>
    <loc>${baseURL}/weather/${city.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>
`;
});

sitemap += `</urlset>
`;

fs.writeFileSync('./public/sitemap.xml', sitemap);
console.log(`✅ Generated sitemap with ${cities.length + 1} URLs (1 homepage + ${cities.length} cities)`);
