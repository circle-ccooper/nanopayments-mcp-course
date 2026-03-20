# Troubleshooting

If you encounter issues during environment setup, check the following.

1. That Node.js 18+ is installed (`node --version`)
2. That `npm install` completed without errors
3. That your `tsconfig.json` exists and has the correct configuration
4. That the `buyer/`, `seller/`, and `scripts/` directories exist

Common issues include:

- **`ERR_MODULE_NOT_FOUND`**: Your `package.json` is missing `"type": "module"`. Run `npm pkg set type="module"`.
- **`Cannot find module 'viem'`**: Dependencies aren't installed. Run `npm install` again. If that doesn't work, delete `node_modules/` and `package-lock.json` and reinstall.
- **`tsx: command not found`**: tsx isn't installed globally. Use `npx tsx` instead of `tsx` directly, or install with `npm install -g tsx`.
- **TypeScript errors about missing types**: Ensure `@types/node` and `@types/express` are installed as dev dependencies.
- **`EACCES` permission errors on npm install**: Don't use `sudo`. Fix npm permissions or use a Node version manager like `nvm`.
- **Network errors during npm install**: Check your internet connection. If you're behind a proxy, configure npm with `npm config set proxy`.

If you're having trouble, try creating a fresh project directory and following the setup steps again from the beginning.

In the next module, you'll learn how Circle Gateway makes gasless nanopayments possible.
