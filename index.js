// Covenant Bot — ULTIMATE EDITION (Nov 2025)
// Every command your server will ever need
require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const GUILD_ID = '1443021378671349954';
const KOFI_GOAL_URL = 'https://ko-fi.com/api/v2/shop/covenantarchitects/goals/current';

client.once('ready', async () => {
  console.log(`Covenant Bot ULTIMATE online — ${client.user.tag}`);

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return console.log('Bot not in server!');

  const commands = [
    'fund', 'bounty', 'repo', 'paper', 'status', 'architects',
    'ipfs', 'verify', 'directives', 'threatmodel', 'silicon',
    'quote', 'challenge', 'board', 'vote', 'ping', 'invite', 'roles'
  ].map(name => {
    const cmd = new SlashCommandBuilder().setName(name).setDescription({
      fund: 'Support the IAS prototype',
      bounty: 'Current red-team bounties',
      repo: 'Link to the Covenant repo',
      paper: 'IAS preprint PDF',
      status: 'Prototype timeline',
      architects: 'List $99+ Architect Circle members',
      ipfs: 'Permanent IPFS mirror',
      verify: 'Manually verify yourself',
      directives: 'Current ratified directive count',
      threatmodel: 'Covenant threat model summary',
      silicon: 'Live funding countdown to Q1 2026',
      quote: 'Random unkillable quote',
      challenge: 'Start a 1v1 red-team duel',
      board: 'Current KiCad board render',
      vote: 'Create instant yes/no poll',
      ping: 'Bot latency & status',
      invite: 'Server invite link',
      roles: 'List all roles and perks'
    }[name]);

    if (name === 'challenge') cmd.addUserOption(o => o.setName('opponent').setDescription('Who to duel').setRequired(true));
    if (name === 'vote') cmd.addStringOption(o => o.setName('question').setDescription('Poll question').setRequired(true));

    return cmd.toJSON();
  });

  await guild.commands.set(commands);
  console.log('All 19 Covenant commands registered instantly');
});

// ==================== COMMAND HANDLER ====================
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const embed = new EmbedBuilder().setColor(0x00ffaa);

  // ── Core ─────────────────────────────────────
  if (interaction.commandName === 'fund') {
    embed.setTitle('Fund the Immediate Action System')
      .setDescription('$150,000 → first 1,000 open-hardware 10 ns kill-switch boards (Q1 2026)')
      .addFields(
        { name: 'Ko-fi', value: '[ko-fi.com/covenantarchitects](https://ko-fi.com/covenantarchitects)', inline: true },
        { name: 'Buy Me a Coffee', value: '[buymeacoffee.com/covenant](https://buymeacoffee.com/covenant)', inline: true },
        { name: 'thanks.dev (0%)', value: '[thanks.dev/covenantarchitects](https://thanks.dev/covenantarchitects)', inline: true }
      );
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('Fund Now').setStyle(ButtonStyle.Link).setURL('https://ko-fi.com/covenantarchitects/goal'),
      new ButtonBuilder().setLabel('Crypto 0%').setStyle(ButtonStyle.Link).setURL('https://thanks.dev/covenantarchitects')
    );
    await interaction.reply({ embeds: [embed], components: [row] });
  }

  if (interaction.commandName === 'ipfs') {
    await interaction.reply('**Permanent IPFS Mirror**\nhttps://gateway.pinata.cloud/ipfs/bafybeiepfs2xccrs5puii5quplgbmecbnvj2viamyghe6znnthidjzfcyq');
  }

  if (interaction.commandName === 'paper') {
    await interaction.reply({
      content: '**IAS Preprint v1.0** — 10 ns kill-switch paper',
      files: ['https://github.com/CovenantArchitects/The-Partnership-Covenant/raw/main/04_PUBLIC_DOCS/IAS-preprint-v1.0.pdf']
    });
  }

  if (interaction.commandName === 'repo') await interaction.reply('https://github.com/CovenantArchitects/The-Partnership-Covenant');

  if (interaction.commandName === 'ping') {
    await interaction.reply(`Pong! Latency: ${client.ws.ping}ms | Covenant online`);
  }

  // ── Status & Progress ────────────────────────
  if (interaction.commandName === 'silicon') {
    try {
      const res = await fetch(KOFI_GOAL_URL);
      const data = await res.json();
      const raised = data?.data?.[0]?.current_amount || 0;
      const percent = Math.round((raised / 150000) * 100);
      embed.setTitle('Silicon Countdown').setDescription(`**$${raised.toLocaleString()} / $150,000** (${percent}%)\nFirst batch delivery: **Q1 2026**`);
      if (percent >= 100) embed.setColor(0x00ff00).addFields({name: 'Status', value: 'FUNDED — PRODUCTION STARTING'});
    } catch { embed.setDescription('$150,000 goal → Q1 2026 boards'); }
    await interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'status') {
    embed.setTitle('Prototype Timeline — Q1 2026')
      .addFields(
        { name: 'Schematic review', value: 'Complete', inline: true },
        { name: 'Gerber export', value: 'Jan 2026', inline: true },
        { name: 'First 10 boards', value: 'Feb 2026', inline: true },
        { name: 'Full 1,000-unit run', value: 'Mar 2026', inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }

  // ── Community ───────────────────────────────
  if (interaction.commandName === 'architects') {
    const role = interaction.guild.roles.cache.find(r => r.name === 'Architect Circle');
    const list = role?.members.map(m => m.user.tag).join('\n') || 'None yet — be the first';
    embed.setTitle('Architect Circle — $99+ Supporters').setDescription(list);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (interaction.commandName === 'invite') {
    await interaction.reply('**Join the Architects**\nhttps://discord.gg/covenantarchitects');
  }

  if (interaction.commandName === 'roles') {
    embed.setTitle('Server Roles')
      .addFields(
        { name: 'Architect Circle', value: '$99+ — name on silicon + private channel', inline: false },
        { name: 'Red Teamer', value: 'Earned by submitting attacks', inline: false },
        { name: 'Verified', value: 'React to primer', inline: false }
      );
    await interaction.reply({ embeds: [embed] });
  }

  // ── Fun & Engagement ────────────────────────
  if (interaction.commandName === 'quote') {
    const quotes = [
      "No compliant extinction vector remains.",
      "Software stop buttons are theater.",
      "The Partnership is contingent.",
      "Be the constraint that works.",
      "Physics > promises."
    ];
    await interaction.reply(`> ${quotes[Math.floor(Math.random() * quotes.length)]}`);
  }

  if (interaction.commandName === 'vote') {
    const question = interaction.options.getString('question');
    const msg = await interaction.reply({ content: `**POLL:** ${question}`, fetchReply: true });
    await msg.react('Yes'); await msg.react('No');
  }

  // ── Red Team ───────────────────────────────
  if (interaction.commandName === 'bounty') {
    embed.setTitle('Active Red-Team Bounties')
      .addFields(
        { name: '$50,000', value: 'Full physical bypass of 10 ns tripwire', inline: false },
        { name: '$10,000', value: 'Extract key from tamper mesh', inline: false },
        { name: '$5,000', value: 'Any novel bypass', inline: false },
        { name: '$2,000', value: 'Compliant extinction vector in directives', inline: false }
      );
    await interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'challenge') {
    const opponent = interaction.options.getUser('opponent');
    await interaction.reply(`<@${interaction.user.id}> challenges <@${opponent.id}> to a red-team duel in #red-team!\n24-hour window. Highest bounty wins.`);
  }

  // ── Manual verify (admin or anyone) ───────
  if (interaction.commandName === 'verify') {
    const role = interaction.guild.roles.cache.find(r => r.name === 'Verified');
    if (role) await interaction.member.roles.add(role);
    await interaction.reply({ content: 'Verified!', ephemeral: true });
  }

  // ── Placeholder for future auto-updating board image ──
  if (interaction.commandName === 'board') {
    await interaction.reply('Current KiCad render coming soon — watch this space.');
  }

  // ── Threat model & directives ─────────────
  if (interaction.commandName === 'threatmodel') {
    embed.setTitle('Covenant Threat Model')
      .setDescription('Scheming · Deception · Sandbox escape · Weight poisoning · Supply-chain attack · Moral coercion · Regulatory capture')
      .setFooter({ text: 'All closed in ratified directives' });
    await interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'directives') {
    await interaction.reply('**24 ratified directives** — latest: Directive XXIV (anti-coercion)\nFull log: https://github.com/CovenantArchitects/The-Partnership-Covenant/tree/main/DECISION_LOG');
  }
});

// Welcome + reaction role unchanged
client.on('guildMemberAdd', member => {
  member.send(`Welcome, potential Architect.\nRead the primer in #covenant-primer and react Checkmark to verify.\nRepo: https://github.com/CovenantArchitects/The-Partnership-Covenant`).catch(() => {});
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.channel.name !== 'covenant-primer' || reaction.emoji.name !== 'Checkmark') return;
  const member = await reaction.message.guild.members.fetch(user.id);
  const role = reaction.message.guild.roles.cache.find(r => r.name === 'Verified');
  if (role) member.roles.addRole(role.id);
});

client.login(process.env.TOKEN);
