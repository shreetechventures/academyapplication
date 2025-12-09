// frontend/src/utils/tenant.js

export function getAcademyCodeFromPath(pathname) {
const parts = pathname.split('/').filter(Boolean);
return parts[0] || null; // first segment
}