-- PRD §2.1 schema. Run this once against the NeonDB project (Phase 0).
CREATE TABLE IF NOT EXISTS posts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    content     TEXT NOT NULL,
    section     TEXT NOT NULL CHECK (section IN ('tutorials', 'india-tech', 'jobs', 'news', 'meetups')),
    image_url   TEXT,
    published   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_section ON posts (section);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);
