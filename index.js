// Covenant Bot — full-featured, Nov 2025
require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const TOKEN = process.env.TOKEN;

client.once('ready', async () => {
  console.log(`Covenant Bot online — ${client.user.tag}`);

  // INSTANT commands — only in THIS server (appears in 3 seconds)
  const guildId = '1443021378671349954'; // ← your server ID
  const guild = client.guilds.cache.get(guildId);
  if (guild) {
    await guild.commands.set([
      new SlashCommandBuilder().setName('fund').setDescription('Support the IAS prototype').toJSON(),
      new SlashCommandBuilder().setName('bounty').setDescription('Current red-team bounties').toJSON(),
      new SlashCommandBuilder().setName('repo').setDescription('Link to the Covenant repo').toJSON(),
    ]);
    console.log('Slash commands registered instantly in Covenant server!');
  }
});

// Welcome DM
client.on('guildMemberAdd', member => {
  member.send(
    `Welcome, potential Architect.\n` +
    `Read the primer in #covenant-primer and react ✅ to verify.\n` +
    `Repo: https://github.com/CovenantArchitects/The-Partnership-Covenant`
  ).catch(() => {});
});

// Reaction role for primer
client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.channel.name !== 'covenant-primer' || reaction.emoji.name !== '✅') return;
  const guild = reaction.message.guild;
  const member = await guild.members.fetch(user.id);
  const role = guild.roles.cache.find(r => r.name === 'Verified');
  if (role) member.roles.add(role);
});

// Slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'fund') {
    const embed = new EmbedBuilder()
      .setColor(0x00ff88)
      .setTitle('Fund the Immediate Action System')
      .setDescription('$150,000 → first 1,000 open-hardware 10 ns kill-switch boards (Q1 2026)')
      .addFields(
        { name: 'Ko-fi', value: 'https://ko-fi.com/covenantarchitects', inline: true },
        { name: 'Buy Me a Coffee', value: 'https://buymeacoffee.com/covenant', inline: true },
        { name: 'thanks.dev (0% fee)', value: 'https://thanks.dev/covenantarchitects', inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'bounty') {
    await interaction.reply({
      content: '**Active Bounties**\n• $5k–$50k — IAS physical bypass (see #red-team)\n• $2k — Find remaining compliant extinction vector\n• $1k — Best KiCad layout improvement',
    });
  }

  if (interaction.commandName === 'repo') {
    await interaction.reply('https://github.com/CovenantArchitects/The-Partnership-Covenant');
  }
});

client.login(TOKEN);
