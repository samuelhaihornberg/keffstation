-- GABARIT RLS Auth/Profils (Blogum) — à appliquer/adapter par ENVIRONNEMENT ISOLÉ (21+, 18-20, <18)
-- Objectif: chaque personne ne peut modifier que son propre profil/données propres, selon règles strictes.
-- Ne pas désactiver les règles de sécurité existantes. À compléter avec les politiques d’espaces/médias.

alter table if exists public.profiles enable row level security;

-- Lecture de son propre profil (exemple minimal ; étendre selon visibilité autorisée)
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select
  using (id = auth.uid());

-- Création de son propre profil (id = auth.uid())
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert
  with check (id = auth.uid());

-- Modification limitée à son propre profil
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Suppression (si autorisée par produit) limitée à son propre profil
-- drop policy if exists profiles_delete_own on public.profiles;
-- create policy profiles_delete_own on public.profiles for delete using (id = auth.uid());

-- age_verifications: l’utilisateur ne lit/écrit pas directement un statut confirmé arbitraire ;
-- la confirmation doit provenir d’un flux serveur/fournisseur approuvé (service role / fonction contrôlée).
alter table if exists public.age_verifications enable row level security;
drop policy if exists age_verifications_select_own on public.age_verifications;
create policy age_verifications_select_own on public.age_verifications
  for select using (user_id = auth.uid());
-- INSERT/UPDATE par le client à restreindre fortement ou interdire (préférer fonction serveur contrôlée).

-- IMPORTANT:
-- - Appliquer le même principe (propriétaire uniquement) aux tables de contenu propre (rubrics, rubric_answers, etc.) avec contrôles d’espace.
-- - Aucun accès croisé entre environnements (projets/BD séparés).
-- - Clés secrètes/service_role uniquement côté serveur.
