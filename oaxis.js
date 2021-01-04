#!/usr/bin/env node

// import modules with ES Module
import { program } from 'commander';
import Oaxis from './lib/Oaxis.js';
import { RequestError } from './lib/Request.js';
import dotenv from 'dotenv';

// generate variable environment
dotenv.config();

// start program
program
  .name('oaxis')
  .usage('command <package id> [args...]')
  .version('1.0.1')
  .requiredOption(
    '-a, --auth <code>',
    'authorization code',
    process.env.AUTH_CODE
  )
  .option('-y, --yes', 'always yes');

program
  .command('list')
  .option('--active', 'list active packages')
  .option('-f, --filter <pkg>', 'filter packages')
  .action(async (cmd) => {
    const axis = new Oaxis(cmd.parent.auth);
    if (cmd.active) {
      await axis.listActive();
    } else {
      await axis.list(cmd.filter?.toLowerCase());
    }
  });

program.command('active').action(async (cmd) => {
  const axis = new Oaxis(cmd.parent.auth);
  await axis.listActive();
});

program
  .command('buy <packageId>')
  .option('-t, --type <type>', 'package type')
  .action(async (packageId, cmd) => {
    const axis = new Oaxis(cmd.parent.auth);
    if (!cmd.parent.yes) await axis.confirm();
    await axis.buy(packageId, cmd.type);
  });

program
  .command('claim <packageName>')
  .option('-t, --type <type>', 'package type')
  .action(async (packageName, cmd) => {
    const axis = new Oaxis(cmd.parent.auth);
    if (!cmd.parent.yes) await axis.confirm();
    await axis.claim(packageName, cmd.type);
  });

try {
  await program.parseAsync(process.argv);
} catch (error) {
  if (error instanceof RequestError) {
    console.log(`${error.name} ${error.status}: ${error.message}`);
    process.exit(1);
  }
}
