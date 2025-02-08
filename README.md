# LevelUp-Server

## File Structure And Info

```
LevelUp-Server
├── .husky/
│   └── _/
│       ├── .gitignore
│       ├── commt-msg
│       ├── h
│       ├── post-checkout
│       ├── post-commit
│       └── pre-commit
├── src
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   └── app.ts
│   └── index.ts
├── .env
├── .eslintignore
├── .eslintrc.json
├── .gitattributes
├── .gitignore
├── .lintstagedrc.json
├── .nvmrc
├── .prettierignore
├── .prettierrc.json
├── ecosystem.config.json
├── eslint.config.js
├── LICENSE
├── nodemon.json
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

`.tsconfig.json` - TypeScript configuration file

`package.json` - Node.js package configuration file 💖

`.nodemon.json` - Nodemon configuration file

`.eslintrc.json` - ESLint configuration file

`ecosystem.config.json` - PM2 configuration file.

- Automates process management for Node.js applications.
- Ensures the app restarts on failure.
- Supports zero-downtime deployments.
- Manages multiple applications or services.

`.prettierrc.json` - Prettier configuration file

`.prettierignore` - Prettier ignore file

`.nvmrc` - Node version manager configuration file used to specify the Node.js version to be used for the project.

`.lintstagedrc.json` - Lint-staged configuration file, a tool that runs linters only on staged fils before committing.

`.gitattributes` - Git attributes file, used to configure how Git handles line endings for different file types.

`.gitignore` - Git ignore file

`.eslintignore` - ESLint ignore file

`.eslintrc.js` - ESLint configuration file

`.env` - Environment variables file
