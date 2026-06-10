<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

May differ from training data — read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# cleo-legaldata-public — vitrine « Legal Data Atlas »

Repo **`Cleo-Labs-IA/cleo-legaldata-public` (PUBLIC)**. Vitrine marketing **sans login** qui montre la couverture de la donnée légale Cleo (sources / juridictions). Rédigée en **anglais** (audience dev/marketing mondiale). À ne pas confondre avec `cleo-legal-public` (privé, portail dev PAYANT avec billing).

## Stack
Next.js (App Router, TS) + Tailwind. Scripts : `dev`, `build`, `start`, `lint`, `typecheck`, `data` (génération de données). Lancer `npm run dev`.

## Design (Cleo Comply V4 — reprendre verbatim)
Tokens : `--c-brand:#0008cf`, `--c-glow:#6b74ff`, `--c-bg:#fafafa`. Polices Fraunces / Satoshi / JetBrains Mono. Surface claire, sémantique monochrome.

## ⚠ Déploiement — PIÈGE domaine custom
- Vercel scope `cleo-academys-projects`. URL par défaut : `cleo-legaldata-public-lyart.vercel.app`. Domaine custom : `legaldata-public.cleolabs.co`.
- **Le domaine custom n'est PAS auto-attaché au dernier déploiement.** Après un push qui ajoute des routes, elles renvoient **404** sur le domaine custom (200 sur l'URL `*.vercel.app`). Il faut ré-aliaser :
  ```bash
  vercel alias set cleo-legaldata-public-lyart.vercel.app legaldata-public.cleolabs.co --scope cleo-academys-projects
  ```
  Vérifier : `curl -s -o /dev/null -w "%{http_code}" https://legaldata-public.cleolabs.co/<route>`.
- **Commits** : email auteur git = `naomie@cleo.academy` (sinon Vercel rejette). Voir les règles deploy complètes de l'org dans la mémoire `project-vercel-deploy-cleo`.
