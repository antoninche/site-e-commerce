# 👟 NIKE-Like Store — Projet E-commerce Front-End (Portfolio)
## Boutique de démonstration en HTML / CSS / JavaScript 
---

## Lien du site web , hébergé sur Github Pages:  
##    https://antoninche.github.io/site-e-commerce/

---

## 📌 Présentation

Ce dépôt contient une **recréation de boutique e-commerce inspirée de Nike**, réalisée en **JavaScript vanilla**, **HTML** et **CSS**.

Le projet est pensé comme un **portfolio front-end** :
il met l’accent sur l’UX e-commerce réelle, la lisibilité du code, l’accessibilité, et une base maintenable pour des projets de boutiques plus avancés.

Le site inclut actuellement :

- Une page d’accueil
- Un catalogue produits avec tri / recherche / filtres
- Un panier persistant via `localStorage`
- Une fiche produit dédiée (PDP)
- Un parcours de paiement **simulé** (démo)
- Des améliorations accessibilité
- Des métadonnées SEO et social preview

⚠️ **Important** : c’est un projet de démonstration. Aucun paiement réel n’est effectué.

---

## 🎯 Objectifs du projet

- Reproduire une expérience e-commerce crédible en front pur
- Travailler une structure de code claire et extensible
- Servir de base pour de futurs projets e-commerce professionnels

---

## 🚀 Fonctionnalités principales

### 🏠 Accueil (Home)

- Hero visuel avec CTA principaux
- Section catégories
- Section best-sellers dynamique
- Section spotlight “collections”
- Barre d’annonce type storefront

### 🛍️ Catalogue produits

- Recherche textuelle
- Tri (sélection, prix croissant/décroissant, nom)
- Filtres multi-critères (genre, catégorie, badge)
- Chips de filtres actifs
- Cartes produits avec choix de taille + ajout au panier
- Lien vers fiche produit détaillée (PDP)
- Liens produits externes

### 🛒 Panier

- Persistance locale (`localStorage`)
- Modification des quantités
- Suppression de lignes
- Vidage complet du panier
- Calcul sous-total / livraison / total
- Redirection vers la page paiement

### 💳 Paiement (démo)

- Formulaire de paiement simulé
- Validation native HTML des champs
- Résumé de commande dynamique
- Message final expliquant qu’il s’agit d’une démo (pas de paiement réel)

---


## 🎨 Direction visuelle (inspiration Nike)

- Palette majoritairement noir / blanc / gris
- Typographie forte et hiérarchie claire
- UI minimaliste orientée produit
- Composants e-commerce classiques (cards, badges, CTA, summary)
- Ambiance premium sans surcharge visuelle

---

## 🧩 Architecture du projet

Le site est **simple et lisible** :

- `docs/*.html` → pages (accueil, catalogue, panier, paiement)
- `docs/js/data.js` → données produits
- `docs/js/app.js` → logique front principale (rendu, panier, interactions)
- `docs/styles.css` → styles globaux + responsive

---

## 📂 Structure du projet

```text
site-e-commerce/
│
├── README.md
└── docs/
    ├── index.html
    ├── products.html
    ├── cart.html
    ├── product.html
    ├── payment.html
    ├── styles.css
    └── js/
        ├── app.js
        └── data.js
```

---

## 🧪 Qualité du code (état actuel)

- Code front sans dépendances lourdes
- Logique principale centralisée et documentée
- Comportements métier e-commerce simulés de façon cohérente
- Orientation lisibilité avant sur-ingénierie

---
## ⚠️ Notes légales / contenu

- Projet de démonstration non affilié à Nike.
- Les médias visuels utilisés pointent vers des **liens externes**.
- Aucun asset local obligatoire pour l’exécution du site.

---

## 👤 Auteur

Projet réalisé dans un objectif d’apprentissage avancé et de portfolio e-commerce front-end.
