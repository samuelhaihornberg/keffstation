# Migration vers l'organisation `KeffStation`

Objectif : déplacer `samuelhaihornberg/keffstation` vers `KeffStation/keffstation`
en conservant l'historique Git, les branches et les réglages du dépôt.

## Méthode recommandée : transfert GitHub

Le transfert conserve l'historique, les branches, les issues/PR et les réglages
du dépôt. Il se fait avec un token GitHub (droits admin sur le dépôt + droit de
créer un dépôt dans l'organisation).

### Avec `gh` (une fois authentifié)

```bash
gh api -X POST repos/samuelhaihornberg/keffstation/transfer \
  -f new_owner=KeffStation

git remote set-url origin git@github.com:KeffStation/keffstation.git
git fetch origin
```

### Sans `gh` (interface web)

1. Ouvrir https://github.com/samuelhaihornberg/keffstation/settings
2. Descendre jusqu'à **Danger Zone** → **Transfer ownership**.
3. Saisir `KeffStation` comme nouveau propriétaire et confirmer.
4. Mettre à jour le remote local :

```bash
git remote set-url origin git@github.com:KeffStation/keffstation.git
```

## Après le transfert — à vérifier

- [ ] **Secrets Actions** : ils ne sont **pas** transférés. Recréer dans
      `KeffStation/keffstation` → Settings → Secrets and variables → Actions :
      `paypal_secret_ID` (Client ID public) et `paypal_key` (clé secrète).
- [ ] **GitHub Pages** : Settings → Pages → Source = **GitHub Actions**, puis
      relancer le workflow `Deploy to GitHub Pages`.
- [ ] **Environnement `github-pages`** : recréé automatiquement au premier
      déploiement ; vérifier qu'il n'y a ni reviewer ni wait timer.
- [ ] **URLs du site** : remplacer `samuelhaihornberg.github.io/keffstation`
      par `keffstation.github.io/keffstation` dans `README.md`, `app.js` et
      `tests/run.js`.
- [ ] **Adresse du dépôt distant** : `git remote -v` doit pointer vers
      `git@github.com:KeffStation/keffstation.git`.
- [ ] **Ancienne URL** : GitHub redirige normalement l'ancien dépôt ; vérifier
      que `https://samuelhaihornberg.github.io/keffstation/` ne casse pas les
      applications qui utilisent encore l'ancien domaine.

## Notes

- Le workflow `aws.yml` (ECS) échoue déjà avant la migration ; sans lien.
- Les commits locaux non poussés ne sont pas concernés par le transfert :
  pousser la branche avant ou après, puis mettre à jour le remote.
- Ne jamais pousser sur `main` sans validation explicite.
