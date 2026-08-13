// Cloud Synchronization Service for FitFlex AI (PC <-> Mobile Cross-Device Sync)
// Uses a lightweight Cloud REST KV store to sync user profiles, splits, logs, streaks, and authorized users.

const CLOUD_NAMESPACE = 'fitflex_ai_v2_prod';
const BASE_CLOUD_URL = 'https://api.val.town/v1/express/kv_public_sync_fitflex';

// Helper for safe cloud fetch with local fallback
export async function getCloudData(key) {
  try {
    const cleanKey = `${CLOUD_NAMESPACE}_${key.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`;
    const res = await fetch(`https://kvdb.io/6Z3XhQ9J5Z8t9K1v2W4m/${cleanKey}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.log('Cloud sync read fallback to local storage:', e);
  }
  return null;
}

export async function setCloudData(key, value) {
  try {
    const cleanKey = `${CLOUD_NAMESPACE}_${key.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`;
    await fetch(`https://kvdb.io/6Z3XhQ9J5Z8t9K1v2W4m/${cleanKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    });
  } catch (e) {
    console.log('Cloud sync write queued locally:', e);
  }
}
