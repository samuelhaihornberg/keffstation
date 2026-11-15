-- Blogum core schema (GABARIT / EXEMPLE) — à adapter et appliquer par ENVIRONNEMENT ISOLÉ (21+, 18-20, <18)
-- NE PAS appliquer tel quel sans revue sécurité/RLS, et NE JAMAIS partager entre environnements.
-- Aucune donnée documentaire d’identité (pas d’images carte/passeport/permis).

-- Extensions (selon projet Supabase/Postgres)
-- create extension if not exists pgcrypto;

-- 1) Profils (1 par utilisateur auth, dans le même environnement)
create table if not exists public.profiles (
  id uuid primary key, -- = auth.uid() (rattaché au système auth de l'env isolé)
  display_name text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Vérification d’âge — résultat minimal uniquement (aucun document/image)
-- status exemples : 'verified_21_plus', 'verified_18_20', 'under_18', 'pending', 'rejected'
create table if not exists public.age_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null,
  method_ref text, -- identifiant/référence de méthode approuvée (sans données sensibles)
  verified_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id)
);

-- 3) Espaces : family, friends, pro, public_streamstars
create table if not exists public.spaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  space_type text not null check (space_type in ('family','friends','pro','public_streamstars')),
  name text not null,
  created_at timestamptz not null default now()
);

-- 4) Membres/autorisations d’espace (base des RLS)
create table if not exists public.space_memberships (
  space_id uuid not null references public.spaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member', -- member/editor/moderator/viewer selon besoin
  created_at timestamptz not null default now(),
  primary key (space_id, user_id)
);

-- 5) Follow = sens unique ; Contact = réciproque
create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  followed_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followed_id),
  check (follower_id <> followed_id)
);

create table if not exists public.contacts (
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'accepted', -- pending/accepted/blocked selon politique
  created_at timestamptz not null default now(),
  primary key (user_a, user_b),
  check (user_a < user_b) -- paire canonique pour réciprocité
);

-- 6) Rubriques / réponses Blog-Forum (contenu auteur)
create table if not exists public.rubrics (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  rubric_type text not null, -- professionnel/familial/amical/sentimental/autre
  title text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rubric_answers (
  id uuid primary key default gen_random_uuid(),
  rubric_id uuid not null references public.rubrics(id) on delete cascade,
  question text not null,
  prompt_example text, -- exemple modifiable (inspiration)
  answer_text text,    -- réponse libre
  position int not null default 0
);

-- 7) Publications et médias (métadonnées) — média en stockage PRIVÉ, jamais URL publique permanente
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  space_id uuid not null references public.spaces(id) on delete cascade,
  post_type text not null, -- texte/image/stickers/video/musique/video_musique
  body text,
  visibility text not null default 'space', -- selon politique d’espace
  status text not null default 'active', -- active/deleted/unavailable
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  media_kind text not null, -- image/video/audio
  storage_path text not null, -- chemin objet dans bucket PRIVÉ (env isolé)
  mime_type text,
  size_bytes bigint,
  duration_ms int,
  created_at timestamptz not null default now()
);

-- 8) Réactions / commentaires (soumis aux mêmes règles d’accès d’espace)
create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction_key text not null, -- like/dislike/adore/surkiff/deteste/degoute
  created_at timestamptz not null default now(),
  unique (post_id, user_id, reaction_key)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- 9) Reposts = référence à l’original + identité du reposter (SANS duplication média)
create table if not exists public.reposts (
  id uuid primary key default gen_random_uuid(),
  original_post_id uuid not null references public.posts(id) on delete restrict,
  reposter_user_id uuid not null references public.profiles(id) on delete cascade,
  target_space_id uuid references public.spaces(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (original_post_id, reposter_user_id, target_space_id)
);
-- NOTE: si l’original est supprimé/accès retiré (status != active ou RLS refuse), la résolution doit renvoyer "publication non disponible".

-- 10) Contrôles parentaux (<18 env uniquement, politiques renforcées à définir)
create table if not exists public.parental_controls (
  id uuid primary key default gen_random_uuid(),
  minor_user_id uuid not null references public.profiles(id) on delete cascade,
  guardian_user_id uuid not null references public.profiles(id) on delete cascade,
  policy jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (minor_user_id, guardian_user_id)
);

-- =========================
-- RLS (GABARIT) — à compléter/valider par table et par environnement
-- =========================
-- Principe : aucun accès par défaut ; autoriser explicitement selon auth.uid(), appartenance espace, et statut.
-- Exemples indicatifs (à adapter précisément) :

-- alter table public.profiles enable row level security;
-- create policy profiles_self_select on public.profiles for select using (id = auth.uid());
-- create policy profiles_self_update on public.profiles for update using (id = auth.uid());

-- alter table public.posts enable row level security;
-- SELECT: auteur OU membre autorisé de l’espace du post (et post actif) ; public_streamstars selon règle contrôlée.
-- INSERT/UPDATE/DELETE: auteur (et droits espace) uniquement.
-- Exemple squelette (à compléter avec vérification space_memberships/spaces) :
-- create policy posts_read on public.posts for select using (
--   status = 'active' and (
--     author_id = auth.uid()
--     or exists (select 1 from public.space_memberships m where m.space_id = posts.space_id and m.user_id = auth.uid())
--   )
-- );

-- IMPORTANT:
-- - Appliquer des politiques RLS équivalentes sur post_media, reactions, comments, reposts, rubrics, rubric_answers, spaces, memberships, follows, contacts, age_verifications, parental_controls.
-- - Faire respecter l’isolation d’environnement au niveau projet/backend (pas de jointure inter-env).
-- - L’accès aux objets de stockage doit être validé côté serveur/fonction (URLs temporaires) en cohérence avec ces règles.
