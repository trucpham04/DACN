# Commit Message Convention

## Format

```
<type>(<scope>): <short description>
```

## Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Maintenance, config, tooling |
| `refactor` | Code restructure without behavior change |
| `style` | Formatting, lint fixes |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `perf` | Performance improvement |

## Scopes

| Scope | Description |
|-------|-------------|
| `fe` | Frontend (Next.js) |
| `be` | Backend (Express/Prisma) |
| `db` | Database schema/migrations |
| `ci` | CI/CD, GitHub Actions |
| `docker` | Docker/compose config |
| `deps` | Dependency updates |

## Examples

```
feat(fe): add login form with validation
feat(be): add user authentication endpoint
feat(db): initialize full database schema
fix(fe): fix sidebar not closing on mobile
fix(be): handle missing env variable on startup
chore(deps): update prisma to v7.5.0
chore(docker): change postgres port to 5432
refactor(be): extract user service logic
docs(be): update README with migration steps
```
