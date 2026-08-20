const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function fetchPrograms() {
  const response = await fetch(`${API_BASE}/api/v1/programs`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load programs: ${response.status}`);
  }

  return response.json();
}

export async function fetchAnnouncements() {
  const response = await fetch(`${API_BASE}/api/v1/announcements`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load announcements: ${response.status}`);
  }

  return response.json();
}

export async function createAnnouncement(payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE}/api/v1/announcements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create announcement: ${response.status}`);
  }

  return response.json();
}

export async function updateAnnouncement(announcementId: string, payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE}/api/v1/announcements/${announcementId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Failed to update announcement: ${response.status}`);
  return response.json();
}

export async function deleteAnnouncement(announcementId: string) {
  const response = await fetch(`${API_BASE}/api/v1/announcements/${announcementId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error(`Failed to delete announcement: ${response.status}`);
  return response.json();
}

export async function fetchGalleryItems() {
  const response = await fetch(`${API_BASE}/api/v1/gallery`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load gallery: ${response.status}`);
  }

  return response.json();
}

export async function createGalleryItem(payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE}/api/v1/gallery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create gallery item: ${response.status}`);
  }

  return response.json();
}

export async function updateGalleryItem(galleryId: string, payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE}/api/v1/gallery/${galleryId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Failed to update gallery item: ${response.status}`);
  return response.json();
}

export async function deleteGalleryItem(galleryId: string) {
  const response = await fetch(`${API_BASE}/api/v1/gallery/${galleryId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error(`Failed to delete gallery item: ${response.status}`);
  return response.json();
}

export async function updateProgram(programId: string, payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE}/api/v1/programs/${programId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update program: ${response.status}`);
  }

  return response.json();
}

export async function createProgram(payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE}/api/v1/programs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create program: ${response.status}`);
  }

  return response.json();
}

export async function fetchAdminOverview() {
  const response = await fetch(`${API_BASE}/api/v1/admin/overview`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load admin overview: ${response.status}`);
  }

  return response.json();
}

export async function fetchAdminReports() {
  const response = await fetch(`${API_BASE}/api/v1/admin/reports`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load admin reports: ${response.status}`);
  }

  return response.json();
}

export async function fetchAdminSettings() {
  const response = await fetch(`${API_BASE}/api/v1/admin/settings`);
  if (!response.ok) throw new Error(`Failed to load admin settings: ${response.status}`);
  return response.json();
}

export async function updateAdminSettings(payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE}/api/v1/admin/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Failed to save admin settings: ${response.status}`);
  return response.json();
}

export async function exportAdminReport(payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE}/api/v1/admin/reports/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Failed to generate report: ${response.status}`);
  return response.json();
}
