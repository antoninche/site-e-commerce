# NIKE (demo) — Site e-commerce (HTML/CSS/JS)

⚠️ **Projet démo** (portfolio / apprentissage).
Style **inspiré** (minimal noir/blanc), sans logo officiel.

## Structure pour GitHub Pages

Le site statique est maintenant servi depuis le dossier `docs/`.

- Page d'accueil : `docs/index.html`
- Catalogue : `docs/products.html`
- Panier : `docs/cart.html`

## Déploiement GitHub Pages

Dans GitHub :
1. `Settings` → `Pages`
2. `Build and deployment` → `Deploy from a branch`
3. Branche: `main` (ou ta branche cible), dossier: `/docs`
4. Save

## Lancer en local

```bash
python -m http.server 8000 --directory docs
```

Puis ouvre `http://localhost:8000`.
