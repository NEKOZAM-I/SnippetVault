-- SnippetVault database schema for Supabase (PostgreSQL)
-- Run this in your Supabase project's SQL editor:
-- Dashboard → SQL Editor → New Query → paste → Run
-- If you know SQL then make changes yourself.

create extension if not exists "pgcrypto";

create table if not exists snippets (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  language    text not null,
  code        text not null,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security
alter table snippets enable row level security;

create policy "Public can read snippets"
  on snippets for select
  using (true);

create policy "Public can insert snippets"
  on snippets for insert
  with check (true);

create policy "Public can delete snippets"
  on snippets for delete
  using (true);

-- Helpful index for search/filter performance
create index if not exists snippets_language_idx on snippets (language);
create index if not exists snippets_created_at_idx on snippets (created_at desc);
