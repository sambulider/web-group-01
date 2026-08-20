CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  description TEXT,
  schedule TEXT,
  duration TEXT,
  seats INTEGER NOT NULL DEFAULT 0,
  mode TEXT NOT NULL DEFAULT 'In person',
  facilitator_id TEXT,
  image_url TEXT,
  form_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tag TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  item_type TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  video_url TEXT,
  poster_url TEXT,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  taken_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  member_id TEXT,
  phone TEXT,
  institution TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS enrollments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  program_id TEXT NOT NULL REFERENCES programs(id),
  status TEXT NOT NULL DEFAULT 'active',
  progress INTEGER DEFAULT 0,
  attendance_percentage FLOAT DEFAULT 0,
  sessions_attended INTEGER DEFAULT 0,
  sessions_total INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  program_id TEXT NOT NULL REFERENCES programs(id),
  result TEXT NOT NULL,
  scanner_id TEXT,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_program_status_category ON programs (status, category);
CREATE INDEX IF NOT EXISTS idx_program_created_at ON programs (created_at);
CREATE INDEX IF NOT EXISTS idx_announcement_published_date ON announcements (is_published, created_at);
CREATE INDEX IF NOT EXISTS idx_gallery_category_published ON gallery_items (category, is_published);
CREATE INDEX IF NOT EXISTS idx_user_role_active ON users (role, is_active);
