-- Add content_format tracking column
ALTER TABLE blog_posts
  ADD COLUMN content_format text NOT NULL DEFAULT 'html';

-- Store original Markdown source for round-trip editing
ALTER TABLE blog_posts
  ADD COLUMN content_markdown_source text;

-- Backfill existing posts as legacy plaintext
UPDATE blog_posts SET content_format = 'plaintext';
