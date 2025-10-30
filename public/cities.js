// Popular cities for SEO landing pages
const popularCities = [
    // Top US Cities
    { name: 'New York', country: 'United States', slug: 'new-york' },
    { name: 'Los Angeles', country: 'United States', slug: 'los-angeles' },
    { name: 'Chicago', country: 'United States', slug: 'chicago' },
    { name: 'Houston', country: 'United States', slug: 'houston' },
    { name: 'Phoenix', country: 'United States', slug: 'phoenix' },
    { name: 'Philadelphia', country: 'United States', slug: 'philadelphia' },
    { name: 'San Antonio', country: 'United States', slug: 'san-antonio' },
    { name: 'San Diego', country: 'United States', slug: 'san-diego' },
    { name: 'Dallas', country: 'United States', slug: 'dallas' },
    { name: 'San Jose', country: 'United States', slug: 'san-jose' },
    { name: 'Austin', country: 'United States', slug: 'austin' },
    { name: 'Jacksonville', country: 'United States', slug: 'jacksonville' },
    { name: 'Fort Worth', country: 'United States', slug: 'fort-worth' },
    { name: 'Columbus', country: 'United States', slug: 'columbus' },
    { name: 'San Francisco', country: 'United States', slug: 'san-francisco' },
    { name: 'Charlotte', country: 'United States', slug: 'charlotte' },
    { name: 'Indianapolis', country: 'United States', slug: 'indianapolis' },
    { name: 'Seattle', country: 'United States', slug: 'seattle' },
    { name: 'Denver', country: 'United States', slug: 'denver' },
    { name: 'Washington DC', country: 'United States', slug: 'washington-dc' },
    { name: 'Boston', country: 'United States', slug: 'boston' },
    { name: 'Nashville', country: 'United States', slug: 'nashville' },
    { name: 'Las Vegas', country: 'United States', slug: 'las-vegas' },
    { name: 'Portland', country: 'United States', slug: 'portland' },
    { name: 'Miami', country: 'United States', slug: 'miami' },

    // Europe
    { name: 'London', country: 'United Kingdom', slug: 'london' },
    { name: 'Paris', country: 'France', slug: 'paris' },
    { name: 'Berlin', country: 'Germany', slug: 'berlin' },
    { name: 'Madrid', country: 'Spain', slug: 'madrid' },
    { name: 'Rome', country: 'Italy', slug: 'rome' },
    { name: 'Barcelona', country: 'Spain', slug: 'barcelona' },
    { name: 'Amsterdam', country: 'Netherlands', slug: 'amsterdam' },
    { name: 'Vienna', country: 'Austria', slug: 'vienna' },
    { name: 'Prague', country: 'Czech Republic', slug: 'prague' },
    { name: 'Budapest', country: 'Hungary', slug: 'budapest' },
    { name: 'Warsaw', country: 'Poland', slug: 'warsaw' },
    { name: 'Brussels', country: 'Belgium', slug: 'brussels' },
    { name: 'Stockholm', country: 'Sweden', slug: 'stockholm' },
    { name: 'Copenhagen', country: 'Denmark', slug: 'copenhagen' },
    { name: 'Oslo', country: 'Norway', slug: 'oslo' },
    { name: 'Helsinki', country: 'Finland', slug: 'helsinki' },
    { name: 'Lisbon', country: 'Portugal', slug: 'lisbon' },
    { name: 'Athens', country: 'Greece', slug: 'athens' },
    { name: 'Dublin', country: 'Ireland', slug: 'dublin' },
    { name: 'Edinburgh', country: 'United Kingdom', slug: 'edinburgh' },

    // Asia
    { name: 'Tokyo', country: 'Japan', slug: 'tokyo' },
    { name: 'Beijing', country: 'China', slug: 'beijing' },
    { name: 'Shanghai', country: 'China', slug: 'shanghai' },
    { name: 'Hong Kong', country: 'Hong Kong', slug: 'hong-kong' },
    { name: 'Singapore', country: 'Singapore', slug: 'singapore' },
    { name: 'Seoul', country: 'South Korea', slug: 'seoul' },
    { name: 'Bangkok', country: 'Thailand', slug: 'bangkok' },
    { name: 'Dubai', country: 'United Arab Emirates', slug: 'dubai' },
    { name: 'Mumbai', country: 'India', slug: 'mumbai' },
    { name: 'Delhi', country: 'India', slug: 'delhi' },
    { name: 'Bangalore', country: 'India', slug: 'bangalore' },
    { name: 'Kuala Lumpur', country: 'Malaysia', slug: 'kuala-lumpur' },
    { name: 'Manila', country: 'Philippines', slug: 'manila' },
    { name: 'Jakarta', country: 'Indonesia', slug: 'jakarta' },
    { name: 'Taipei', country: 'Taiwan', slug: 'taipei' },

    // Oceania
    { name: 'Sydney', country: 'Australia', slug: 'sydney' },
    { name: 'Melbourne', country: 'Australia', slug: 'melbourne' },
    { name: 'Brisbane', country: 'Australia', slug: 'brisbane' },
    { name: 'Perth', country: 'Australia', slug: 'perth' },
    { name: 'Auckland', country: 'New Zealand', slug: 'auckland' },

    // Canada
    { name: 'Toronto', country: 'Canada', slug: 'toronto' },
    { name: 'Montreal', country: 'Canada', slug: 'montreal' },
    { name: 'Vancouver', country: 'Canada', slug: 'vancouver' },
    { name: 'Calgary', country: 'Canada', slug: 'calgary' },
    { name: 'Ottawa', country: 'Canada', slug: 'ottawa' },

    // Latin America
    { name: 'Mexico City', country: 'Mexico', slug: 'mexico-city' },
    { name: 'Buenos Aires', country: 'Argentina', slug: 'buenos-aires' },
    { name: 'São Paulo', country: 'Brazil', slug: 'sao-paulo' },
    { name: 'Rio de Janeiro', country: 'Brazil', slug: 'rio-de-janeiro' },
    { name: 'Lima', country: 'Peru', slug: 'lima' },
    { name: 'Bogotá', country: 'Colombia', slug: 'bogota' },
    { name: 'Santiago', country: 'Chile', slug: 'santiago' },

    // Middle East & Africa
    { name: 'Istanbul', country: 'Turkey', slug: 'istanbul' },
    { name: 'Cairo', country: 'Egypt', slug: 'cairo' },
    { name: 'Tel Aviv', country: 'Israel', slug: 'tel-aviv' },
    { name: 'Johannesburg', country: 'South Africa', slug: 'johannesburg' },
    { name: 'Cape Town', country: 'South Africa', slug: 'cape-town' },
    { name: 'Nairobi', country: 'Kenya', slug: 'nairobi' },

    // Georgia
    { name: 'Tbilisi', country: 'Georgia', slug: 'tbilisi' },
    { name: 'Batumi', country: 'Georgia', slug: 'batumi' },

    // Russia
    { name: 'Moscow', country: 'Russia', slug: 'moscow' },
    { name: 'Saint Petersburg', country: 'Russia', slug: 'saint-petersburg' }
];

// Get city by slug
function getCityBySlug(slug) {
    return popularCities.find(city => city.slug === slug);
}

// Generate city meta data for SEO
function getCityMeta(city) {
    return {
        title: `Weather in ${city.name}, ${city.country} - 7 Day Forecast | CloudVibes`,
        description: `Get accurate weather forecast for ${city.name}, ${city.country}. 7-day predictions, hourly updates, temperature, humidity, and precipitation. Free real-time weather data.`,
        keywords: `${city.name} weather, ${city.name} forecast, ${city.name} temperature, weather ${city.name}, ${city.country} weather`
    };
}
