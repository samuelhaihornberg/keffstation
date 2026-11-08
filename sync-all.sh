#!/usr/bin/env bash
# =============================================================================
# sync-all.sh
# Synchronisation complète : commit, push, merge branches, cache clear, refresh
# =============================================================================
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

REMOTE="${REMOTE:-origin}"
BRANCH="${BRANCH:-main}"

log() { printf '[sync] %s\n' "$*"; }
warn() { printf '[sync][WARN] %s\n' "$*" >&2; }

# -----------------------------------------------------------------------------
# 1. Git : ajouter, committer, pousser les mises à jour locales
# -----------------------------------------------------------------------------
git_sync() {
    log "Synchronisation git sur ${REMOTE}/${BRANCH}"

    git fetch --all --prune

    # Stash si des modifications non commitées existent
    if ! git diff --quiet || ! git diff --cached --quiet; then
        log "Modifications locales detectes -> commit"
        git add -A
        git commit -m "sync: mise a jour automatique des scripts et configuration" || true
    fi

    git checkout "$BRANCH" 2>/dev/null || git checkout -b "$BRANCH"
    git pull --ff-only "$REMOTE" "$BRANCH" 2>/dev/null || true
    git push "$REMOTE" "$BRANCH"
    log "Push termine sur ${REMOTE}/${BRANCH}"
}

# -----------------------------------------------------------------------------
# 2. Git : fusionner toutes les branches locales entre elles (dans main)
# -----------------------------------------------------------------------------
git_merge_all() {
    log "Fusion de toutes les branches vers ${BRANCH}"

    local current
    current="$(git rev-parse --abbrev-ref HEAD)"

    # Récupère toutes les branches locales
    local branches
    mapfile -t branches < <(git for-each-ref --format='%(refname:short)' refs/heads/)

    for b in "${branches[@]}"; do
        if [[ "$b" == "$BRANCH" ]]; then
            continue
        fi
        log "Merge de la branche '${b}' dans '${BRANCH}'"
        git checkout "$BRANCH"
        if git merge --no-ff -m "merge: integration de ${b}" "$b" 2>/dev/null; then
            log "Branche '${b}' fusionnee avec succes"
        else
            warn "Conflit ou echec sur '${b}' -> abandon du merge, etat preserve"
            git merge --abort 2>/dev/null || true
        fi
    done

    git checkout "$current" 2>/dev/null || true
    git push "$REMOTE" "$BRANCH" || true
}

# -----------------------------------------------------------------------------
# 3. Vider les caches connus (npm, pip, apt, yarn, etc.)
# -----------------------------------------------------------------------------
clear_caches() {
    log "Vidage des caches"

    if command -v npm >/dev/null 2>&1; then
        npm cache clean --force 2>/dev/null || warn "npm cache clean echec"
        log "Cache npm vide"
    fi

    if command -v pip >/dev/null 2>&1; then
        pip cache purge 2>/dev/null || warn "pip cache purge echec"
        log "Cache pip vide"
    elif command -v pip3 >/dev/null 2>&1; then
        pip3 cache purge 2>/dev/null || warn "pip3 cache purge echec"
        log "Cache pip3 vide"
    fi

    if command -v apt-get >/dev/null 2>&1; then
        apt-get clean 2>/dev/null || warn "apt-get clean echec"
        rm -rf /var/lib/apt/lists/* 2>/dev/null || true
        log "Cache apt vide"
    fi

    if command -v yarn >/dev/null 2>&1; then
        yarn cache clean 2>/dev/null || warn "yarn cache clean echec"
        log "Cache yarn vide"
    fi

    # Cache bash / shell
    hash -r 2>/dev/null || true
    log "Hash shell rafraichi"
}

# -----------------------------------------------------------------------------
# 4. Hard refresh / actualisation de l'environnement
# -----------------------------------------------------------------------------
hard_refresh() {
    log "Hard refresh de l'environnement"
    # Recharge la config shell si disponible
    if [[ -f "${HOME}/.bashrc" ]]; then
        # shellcheck source=/dev/null
        source "${HOME}/.bashrc" 2>/dev/null || true
        log ".bashrc recharge"
    fi
    # Sync des fichystems
    sync 2>/dev/null || true
    log "Hard refresh termine"
}

# -----------------------------------------------------------------------------
# Point d'entrée
# -----------------------------------------------------------------------------
main() {
    local mode="${1:-full}"

    case "$mode" in
        git)
            git_sync
            ;;
        merge)
            git_merge_all
            ;;
        cache)
            clear_caches
            ;;
        refresh)
            hard_refresh
            ;;
        full|*)
            git_sync
            git_merge_all
            clear_caches
            hard_refresh
            log "Synchronisation complete terminee."
            ;;
    esac
}

main "$@"
