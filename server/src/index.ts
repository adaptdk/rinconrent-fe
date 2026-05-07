import type { Core } from '@strapi/strapi';
import { COMPONENT_CONFIGS } from './admin/content-manager-config';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await applyContentManagerConfig(strapi);
  },
};

async function applyContentManagerConfig(strapi: Core.Strapi) {
  const store = (strapi as any).store({ type: 'plugin', name: 'content_manager' });

  for (const [uid, componentConfig] of Object.entries(COMPONENT_CONFIGS)) {
    const key = `configuration_components::${uid}`;

    let config: any;
    try {
      config = await store.get({ key });
    } catch {
      continue;
    }

    if (!config?.metadatas) continue;

    let changed = false;
    const metadatas = { ...config.metadatas };

    for (const [fieldName, fieldConfig] of Object.entries(componentConfig.fields)) {
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
      await store.set({ key, value: { ...config, metadatas } });
      strapi.log.info(`[content-manager-config] Updated metadata for ${uid}`);
    }
  }
}
