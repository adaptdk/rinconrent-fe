const { createStrapi, compileStrapi } = require('@strapi/strapi');
const fs = require('fs');
const path = require('path');
const https = require('https');

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => { file.close(); resolve(filepath); });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(filepath); });
      }
    }).on('error', reject);
  });
}

async function uploadImage(app, filepath, name, mimetype = 'image/jpeg') {
  const file = {
    filepath,
    originalFilename: name,
    mimetype,
    size: fs.statSync(filepath).size,
  };
  const [uploaded] = await app.plugin('upload').service('upload').upload({
    data: {},
    files: file,
  });
  return uploaded;
}

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  const tmpDir = path.join(__dirname, '..', '.tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  // Upload a placeholder logo image
  const logoPath = path.join(tmpDir, 'rinconrent-logo-placeholder.jpg');
  await downloadImage('https://picsum.photos/seed/rinconrent-logo/360/112', logoPath);
  const logoImage = await uploadImage(app, logoPath, 'rinconrent-logo-placeholder.jpg');
  fs.unlinkSync(logoPath);

  const global = await app.documents('api::global.global').findFirst({
    populate: { header: true, footer: { populate: { logo: true, footerMenus: true } } },
  });

  if (!global) {
    console.error('Global entry not found. Ensure Strapi has been started at least once.');
    await app.destroy();
    process.exit(1);
  }

  await app.documents('api::global.global').update({
    documentId: global.documentId,
    data: {
      socialLinks: [
        { platform: 'LINKEDIN', href: 'https://www.linkedin.com/company/rinc%C3%B3n-rent/', label: 'LinkedIn' },
        { platform: 'FACEBOOK', href: 'https://www.facebook.com/RinconRentEU', label: 'Facebook' },
        { platform: 'INSTAGRAM', href: 'https://www.instagram.com/rincon_rent/', label: 'Instagram' },
      ],
      // Footer component: logo, grouped menus, copyright
      footer: {
        logo: {
          logoText: 'Rincón Rent',
          logoLink: '/',
          image: logoImage.id,
        },
        footerMenus: [
          {
            title: 'Guests',
            links: [
              { href: 'https://booking.rinconrent.com/', label: 'Holiday Rentals', isExternal: true, isButtonLink: false },
              { href: '/travel-guide', label: 'Travel guide', isExternal: false, isButtonLink: false },
              { href: '/activities', label: 'Activities', isExternal: false, isButtonLink: false },
            ],
          },
          {
            title: 'Owners & Investors',
            links: [
              { href: '/property-management', label: 'Property Management', isExternal: false, isButtonLink: false },
              { href: '/investment', label: 'Investment', isExternal: false, isButtonLink: false },
              { href: '/design', label: 'Design', isExternal: false, isButtonLink: false },
              { href: '/investor-insights', label: 'Investor insights', isExternal: false, isButtonLink: false },
            ],
          },
          {
            title: 'Rincón',
            links: [
              { href: '/about-us', label: 'About us', isExternal: false, isButtonLink: false },
              { href: '/sustainability', label: 'Sustainability', isExternal: false, isButtonLink: false },
              { href: '/work-with-us', label: 'Work with us', isExternal: false, isButtonLink: false },
              { href: '/contact-us', label: 'Contact us', isExternal: false, isButtonLink: false },
              { href: '/terms-conditions', label: 'Terms & conditions', isExternal: false, isButtonLink: false },
              { href: '/cookies-policy', label: 'Cookies policy', isExternal: false, isButtonLink: false },
              { href: '/privacy-policy', label: 'Privacy policy', isExternal: false, isButtonLink: false },
            ],
          },
        ],
        text: '© 2026 - Rincon Rent',
      },
    },
    status: 'published',
  });

  console.log('Footer seeded successfully.');
  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
