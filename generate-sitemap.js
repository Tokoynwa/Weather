const fs = require('fs');

const cities = [
    'new-york', 'los-angeles', 'chicago', 'houston', 'phoenix', 'philadelphia', 'san-antonio', 'san-diego', 'dallas', 'san-jose',
    'austin', 'jacksonville', 'fort-worth', 'columbus', 'san-francisco', 'charlotte', 'indianapolis', 'seattle', 'denver', 'washington-dc',
    'boston', 'nashville', 'las-vegas', 'portland', 'miami', 'london', 'paris', 'berlin', 'madrid', 'rome',
    'barcelona', 'amsterdam', 'vienna', 'prague', 'budapest', 'warsaw', 'brussels', 'stockholm', 'copenhagen', 'oslo',
    'helsinki', 'lisbon', 'athens', 'dublin', 'edinburgh', 'tokyo', 'beijing', 'shanghai', 'hong-kong', 'singapore',
    'seoul', 'bangkok', 'dubai', 'mumbai', 'delhi', 'bangalore', 'kuala-lumpur', 'manila', 'jakarta', 'taipei',
    'sydney', 'melbourne', 'brisbane', 'perth', 'auckland', 'toronto', 'montreal', 'vancouver', 'calgary', 'ottawa',
    'mexico-city', 'buenos-aires', 'sao-paulo', 'rio-de-janeiro', 'lima', 'bogota', 'santiago', 'istanbul', 'cairo', 'tel-aviv',
    'johannesburg', 'cape-town', 'nairobi', 'tbilisi', 'batumi', 'moscow', 'saint-petersburg'
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://cloudvibes.org/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
${cities.map(city => `    <url>
        <loc>https://cloudvibes.org/weather/${city}</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('./public/sitemap.xml', sitemap);
console.log('Sitemap generated with', cities.length + 1, 'URLs');
