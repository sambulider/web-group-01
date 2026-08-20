import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ImagePlusIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import {
  createAnnouncement,
  createGalleryItem,
  deleteAnnouncement,
  deleteGalleryItem,
  fetchAnnouncements,
  fetchGalleryItems,
  fetchPrograms,
  updateAnnouncement,
  updateGalleryItem,
  updateProgram,
} from '../../../lib/api';
import { formatDate } from '../../../utils/format';
import { Modal, StatusPill, btnGhost, btnPrimary } from '../../ui/Primitives';
import { cn } from '../../../utils/cn';
import type { Program, Announcement as AnnouncementType, GalleryItem as GalleryItemType } from '../../../types';

export function AdminContent({ view }: { view: 'announcements' | 'gallery' | 'cms'; }) {
  const [composing, setComposing] = useState(false);
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItemType[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementType | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItemType | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (view === 'announcements') {
          const data = await fetchAnnouncements();
          setAnnouncements(data);
          return;
        }

        if (view === 'gallery') {
          const data = await fetchGalleryItems();
          setGalleryItems(data);
          return;
        }

        const data = await fetchPrograms();
        setPrograms(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [view]);

  const handleAnnouncementSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = {
      title: (form.elements.namedItem('an-title') as HTMLInputElement).value,
      tag: (form.elements.namedItem('an-tag') as HTMLSelectElement).value,
      body: (form.elements.namedItem('an-body') as HTMLTextAreaElement).value,
    };

    try {
      const item = editingAnnouncement
        ? await updateAnnouncement(editingAnnouncement.id, payload)
        : await createAnnouncement(payload);
      setAnnouncements((current) => editingAnnouncement
        ? current.map((entry) => entry.id === item.id ? item : entry)
        : [item, ...current]);
      setEditingAnnouncement(null);
      setComposing(false);
      form.reset();
      toast.success(editingAnnouncement ? 'Announcement updated' : 'Announcement published');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to publish announcement');
    }
  };

  const handleAnnouncementDelete = async (item: AnnouncementType) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try {
      await deleteAnnouncement(item.id);
      setAnnouncements((current) => current.filter((entry) => entry.id !== item.id));
      toast.success('Announcement deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete announcement');
    }
  };

  const handleGallerySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = {
      title: (form.elements.namedItem('gallery-title') as HTMLInputElement).value,
      category: (form.elements.namedItem('gallery-category') as HTMLSelectElement).value,
      type: (form.elements.namedItem('gallery-type') as HTMLSelectElement).value,
      src: (form.elements.namedItem('gallery-src') as HTMLInputElement).value,
      poster: (form.elements.namedItem('gallery-poster') as HTMLInputElement).value || undefined,
    };

    try {
      const item = editingGallery
        ? await updateGalleryItem(editingGallery.id, payload)
        : await createGalleryItem(payload);
      setGalleryItems((current) => editingGallery
        ? current.map((entry) => entry.id === item.id ? item : entry)
        : [item, ...current]);
      setEditingGallery(null);
      setComposing(false);
      form.reset();
      toast.success(editingGallery ? 'Gallery item updated' : 'Gallery item saved');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload media');
    }
  };

  const handleGalleryDelete = async (item: GalleryItemType) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try {
      await deleteGalleryItem(item.id);
      setGalleryItems((current) => current.filter((entry) => entry.id !== item.id));
      toast.success('Gallery item deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete gallery item');
    }
  };

  const handleProgramSave = async (program: Program) => {
    try {
      const updated = await updateProgram(program.id, {
        title: program.title,
        category: program.category,
        status: program.status,
        summary: program.summary,
        schedule: program.schedule,
        duration: program.duration,
        seats: program.seats,
        mode: program.mode,
        image: program.image,
        formUrl: program.formUrl,
        featured: Boolean(program.featured),
      });

      setPrograms((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      toast.success('Programme updated in Supabase');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update programme');
    }
  };

  const handleProgramSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingProgram) return;
    const form = event.currentTarget;
    const updated = await updateProgram(editingProgram.id, {
      title: (form.elements.namedItem('program-title') as HTMLInputElement).value,
      category: (form.elements.namedItem('program-category') as HTMLSelectElement).value,
      status: (form.elements.namedItem('program-status') as HTMLSelectElement).value,
      summary: (form.elements.namedItem('program-summary') as HTMLTextAreaElement).value,
      schedule: (form.elements.namedItem('program-schedule') as HTMLInputElement).value,
      duration: (form.elements.namedItem('program-duration') as HTMLInputElement).value,
      seats: Number((form.elements.namedItem('program-seats') as HTMLInputElement).value),
      mode: (form.elements.namedItem('program-mode') as HTMLSelectElement).value,
      image: (form.elements.namedItem('program-image') as HTMLInputElement).value,
      formUrl: (form.elements.namedItem('program-form-url') as HTMLInputElement).value,
      featured: (form.elements.namedItem('program-featured') as HTMLInputElement).checked,
    });
    setPrograms((current) => current.map((item) => item.id === updated.id ? updated : item));
    setEditingProgram(null);
    toast.success('Programme updated in Supabase');
  };

  if (view === 'announcements') {
    return (
      <div className="grid gap-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Announcements</h2>
            <p className="mt-1 text-sm text-muted">Published to the homepage and member dashboards</p>
          </div>
          <button type="button" onClick={() => { setEditingAnnouncement(null); setComposing(true); }} className={btnPrimary}>
            <PlusIcon className="h-4 w-4" />
            New announcement
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-line bg-surface p-5 text-sm text-muted">Loading announcements…</div>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {announcements.map((a) => (
              <li key={a.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                      {a.tag}
                    </span>
                    <time className="text-xs text-muted">{formatDate(a.date)}</time>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink">{a.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{a.body}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditingAnnouncement(a); setComposing(true); }}
                    aria-label={`Edit ${a.title}`}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-line text-muted transition-colors duration-150 hover:text-ink"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleAnnouncementDelete(a)}
                    aria-label={`Delete ${a.title}`}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-line text-muted transition-colors duration-150 hover:text-secondary"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Modal open={composing} onClose={() => { setComposing(false); setEditingAnnouncement(null); }} title={editingAnnouncement ? 'Edit announcement' : 'New announcement'}>
          <form className="grid gap-4" onSubmit={handleAnnouncementSubmit}>
            <div>
              <label htmlFor="an-title" className="text-sm font-medium text-ink">
                Title
              </label>
              <input
                id="an-title"
                required
                defaultValue={editingAnnouncement?.title ?? ''}
                className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-sm text-ink"
                placeholder="e.g. Applications open for Cohort 13"
              />
            </div>
            <div>
              <label htmlFor="an-tag" className="text-sm font-medium text-ink">
                Category
              </label>
              <select id="an-tag" defaultValue={editingAnnouncement?.tag ?? 'Notice'} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-sm text-ink">
                <option>Notice</option>
                <option>Deadline</option>
                <option>Result</option>
                <option>Update</option>
              </select>
            </div>
            <div>
              <label htmlFor="an-body" className="text-sm font-medium text-ink">
                Body
              </label>
              <textarea
                id="an-body"
                rows={4}
                required
                defaultValue={editingAnnouncement?.body ?? ''}
                className="mt-1.5 w-full rounded-xl border border-line bg-bg p-3.5 text-sm text-ink"
                placeholder="Write the announcement…"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className={btnPrimary}>Publish</button>
              <button type="button" onClick={() => setComposing(false)} className={btnGhost}>Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (view === 'gallery') {
    return (
      <div className="grid gap-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Gallery manager</h2>
            <p className="mt-1 text-sm text-muted">{galleryItems.length} items published</p>
          </div>
          <button type="button" onClick={() => { setEditingGallery(null); setComposing(true); }} className={btnPrimary}>
            <ImagePlusIcon className="h-4 w-4" />
            Upload media
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-line bg-surface p-5 text-sm text-muted">Loading gallery…</div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {galleryItems.map((item) => (
              <li key={item.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
                <img src={item.type === 'video' ? item.poster : item.src} alt="" loading="lazy" className="h-32 w-full object-cover" />
                <div className="p-4">
                  <p className="line-clamp-2 text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-xs text-muted">{item.category} · {formatDate(item.date)}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setEditingGallery(item); setComposing(true); }}
                      className="flex-1 rounded-lg border border-line py-1.5 text-xs font-semibold text-muted transition-colors duration-150 hover:text-ink"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleGalleryDelete(item)}
                      className="flex-1 rounded-lg border border-line py-1.5 text-xs font-semibold text-muted transition-colors duration-150 hover:text-secondary"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Modal open={composing} onClose={() => { setComposing(false); setEditingGallery(null); }} title={editingGallery ? 'Edit media' : 'Upload media'}>
          <form className="grid gap-4" onSubmit={handleGallerySubmit}>
            <div>
              <label htmlFor="gallery-title" className="text-sm font-medium text-ink">Title</label>
              <input id="gallery-title" defaultValue={editingGallery?.title ?? ''} required className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" />
            </div>
            <div>
              <label htmlFor="gallery-type" className="text-sm font-medium text-ink">Type</label>
              <select id="gallery-type" defaultValue={editingGallery?.type ?? 'photo'} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-sm text-ink">
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label htmlFor="gallery-category" className="text-sm font-medium text-ink">Category</label>
              <select id="gallery-category" defaultValue={editingGallery?.category ?? 'Programs'} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-sm text-ink">
                <option>Programs</option>
                <option>Events</option>
                <option>Community</option>
                <option>Workshops</option>
              </select>
            </div>
            <div>
              <label htmlFor="gallery-src" className="text-sm font-medium text-ink">Image or video URL</label>
              <input id="gallery-src" defaultValue={editingGallery?.src ?? ''} required className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" />
            </div>
            <div>
              <label htmlFor="gallery-poster" className="text-sm font-medium text-ink">Poster URL (for video)</label>
              <input id="gallery-poster" defaultValue={editingGallery?.poster ?? ''} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className={btnPrimary}>Save</button>
              <button type="button" onClick={() => setComposing(false)} className={btnGhost}>Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">Programme content</h2>
          <p className="mt-1 text-sm text-muted">Edit programme details, seats and application links</p>
        </div>
        <button type="button" onClick={() => toast.info('Create a programme through the API or seed script')} className={btnPrimary}>
          <PlusIcon className="h-4 w-4" />
          New programme
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-line bg-surface p-5 text-sm text-muted">Loading programmes…</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <caption className="sr-only">Programmes managed through the CMS</caption>
              <thead className="border-b border-line bg-elevated/60 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Programme</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Category</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Seats</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Facilitator</th>
                  <th scope="col" className="px-5 py-3 font-semibold sr-only">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {programs.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-4 font-medium text-ink">{p.title}</td>
                    <td className="px-5 py-4 text-muted">{p.category}</td>
                    <td className="px-5 py-4">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="px-5 py-4 text-muted">{p.seatsTaken}/{p.seats}</td>
                    <td className="px-5 py-4 text-muted">{p.facilitator}</td>
                    <td className={cn('px-5 py-4 text-right')}>
                      <button
                        type="button"
                        onClick={() => setEditingProgram(p)}
                        className="text-sm font-semibold text-primary transition-colors duration-150 hover:text-primary-deep"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={Boolean(editingProgram)} onClose={() => setEditingProgram(null)} title="Edit programme">
        {editingProgram && (
          <form className="grid gap-4" onSubmit={handleProgramSubmit}>
            <input id="program-title" defaultValue={editingProgram.title} required className="h-11 rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" aria-label="Programme title" />
            <div className="grid gap-4 sm:grid-cols-2">
              <select id="program-category" defaultValue={editingProgram.category} className="h-11 rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" aria-label="Programme category">
                {['Regular', 'Thematic', 'Skill Development', 'Leadership', 'Digital Literacy', 'Entrepreneurship', 'Career Development'].map((value) => <option key={value}>{value}</option>)}
              </select>
              <select id="program-status" defaultValue={editingProgram.status} className="h-11 rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" aria-label="Programme status">
                {['Open', 'Upcoming', 'Closed'].map((value) => <option key={value}>{value}</option>)}
              </select>
              <input id="program-seats" type="number" min="0" defaultValue={editingProgram.seats} required className="h-11 rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" aria-label="Seats" />
              <select id="program-mode" defaultValue={editingProgram.mode} className="h-11 rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" aria-label="Programme mode">
                {['In person', 'Hybrid', 'Online'].map((value) => <option key={value}>{value}</option>)}
              </select>
            </div>
            <input id="program-schedule" defaultValue={editingProgram.schedule} className="h-11 rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" aria-label="Schedule" />
            <input id="program-duration" defaultValue={editingProgram.duration} className="h-11 rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" aria-label="Duration" />
            <textarea id="program-summary" defaultValue={editingProgram.summary} rows={4} className="rounded-xl border border-line bg-bg p-3.5 text-sm text-ink" aria-label="Summary" />
            <input id="program-image" defaultValue={editingProgram.image} className="h-11 rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" aria-label="Image URL" />
            <input id="program-form-url" defaultValue={editingProgram.formUrl} className="h-11 rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" aria-label="Application URL" />
            <label className="flex items-center gap-2 text-sm text-ink"><input id="program-featured" type="checkbox" defaultChecked={editingProgram.featured} /> Featured programme</label>
            <div className="flex gap-2"><button type="submit" className={btnPrimary}>Save changes</button><button type="button" onClick={() => setEditingProgram(null)} className={btnGhost}>Cancel</button></div>
          </form>
        )}
      </Modal>
    </div>
  );
}
