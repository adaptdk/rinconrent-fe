/**
 * One-time script: initializes pageHeader with defaults on all pages that don't have one.
 * Run with: node scripts/init-page-headers.js
 */

"use strict";

const { createStrapi, compileStrapi } = require("@strapi/strapi");

async function run() {
  const app = await createStrapi(await compileStrapi()).load();

  const pages = await app.documents("api::page.page").findMany({
    fields: ["documentId", "title"],
    populate: { pageHeader: { fields: ["hideHeader"] } },
    status: "published",
  });

  let updated = 0;

  for (const page of pages) {
    if (page.pageHeader) continue;

    await app.documents("api::page.page").update({
      documentId: page.documentId,
      data: {
        pageHeader: {
          hideHeader: false,
          headerType: "text",
          headerSize: "small",
          horizontalLayout: false,
        },
      },
      status: "published",
    });

    console.log(`  ✓ ${page.title}`);
    updated++;
  }

  console.log(`\nDone — ${updated} page(s) initialized.`);
  await app.destroy();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
