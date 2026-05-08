import type { Core } from '@strapi/strapi';
import { COMPONENT_CONFIGS, CONTENT_TYPE_CONFIGS } from './admin/content-manager-config';

// Actions that should be publicly readable (no auth required).
const PUBLIC_ACTIONS = [
  'api::destination.destination.find',
  'api::destination.destination.findOne',
  'api::seo-config.seo-config.find',
  'api::testimonial.testimonial.find',
  'api::testimonial.testimonial.findOne',
  // Travel guide categories
  'api::travel-guide-category.travel-guide-category.find',
  'api::travel-guide-category.travel-guide-category.findOne',
  // Investor guide categories
  'api::investor-guide-category.investor-guide-category.find',
  'api::investor-guide-category.investor-guide-category.findOne',
  // Travel guides
  'api::travel-guide.travel-guide.find',
  'api::travel-guide.travel-guide.findOne',
  // Investor guides
  'api::investor-guide.investor-guide.find',
  'api::investor-guide.investor-guide.findOne',
];

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await applyPublicPermissions(strapi);
    await applyContentManagerConfig(strapi);
  },
};

async function applyPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await (strapi as any).query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });
  if (!publicRole) return;

  for (const action of PUBLIC_ACTIONS) {
    const existing = await (strapi as any).query('plugin::users-permissions.permission').findOne({
      where: { action, role: publicRole.id },
    });
    if (!existing) {
      await (strapi as any).query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
      strapi.log.info(`[permissions] Granted public access: ${action}`);
    }
  }
}

async function applyContentManagerConfig(strapi: Core.Strapi) {
  const store = (strapi as any).store({ type: 'plugin', name: 'content_manager' });

  for (const [uid, componentConfig] of Object.entries(COMPONENT_CONFIGS)) {
    const key = `configuration_components::${uid}`;
    await applyFieldConfig(store, key, componentConfig, strapi);
  }

  for (const [uid, contentTypeConfig] of Object.entries(CONTENT_TYPE_CONFIGS)) {
    const key = `configuration_content_types::${uid}`;
    await applyFieldConfig(store, key, contentTypeConfig, strapi);
  }
}

async function applyFieldConfig(
  store: any,
  key: string,
  config: { mainField?: string; fields: Record<string, { label?: string; description?: string }> },
  strapi: Core.Strapi
) {
  let stored: any;
  try {
    stored = await store.get({ key });
  } catch {
    return;
  }

  if (!stored?.metadatas) return;

  let changed = false;
  const metadatas = { ...stored.metadatas };
  const settings = { ...stored.settings };

  if (config.mainField !== undefined && settings.mainField !== config.mainField) {
    settings.mainField = config.mainField;
    changed = true;
  }

  for (const [fieldName, fieldConfig] of Object.entries(config.fields)) {
    if (!metadatas[fieldName]) continue;

    const currentEdit = metadatas[fieldName].edit ?? {};
    const patch: Record<string, string> = {};

    if (fieldConfig.label !== undefined && currentEdit.label !== fieldConfig.label) {
      patch.label = fieldConfig.label;
    }
    if (fieldConfig.description !== undefined && currentEdit.description !== fieldConfig.description) {
      patch.description = fieldConfig.description;
    }

    if (Object.keys(patch).length > 0) {
      metadatas[fieldName] = {
        ...metadatas[fieldName],
        edit: { ...currentEdit, ...patch },
      };
      changed = true;
    }
  }

  if (changed) {
    await store.set({ key, value: { ...stored, settings, metadatas } });
    strapi.log.info(`[content-manager-config] Updated metadata for ${key}`);
  }
}
