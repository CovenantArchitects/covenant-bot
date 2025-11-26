// Covenant Bot — FINAL PRODUCTION VERSION (Nov 2025)
require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const GUILD_ID = '1443021378671349954'; // your server — never changes

client.once('ready', async () => {
  console.log(`Covenant Bot online — ${client.user.tag}`);

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return console.log('Bot not in server yet!');

  const commands = [
    new SlashCommandBuilder().setName('fund').setDescription('Support the IAS prototype'),
    new SlashCommandBuilder().setName('bounty').setDescription('Current red-team bounties'),
    new SlashCommandBuilder().setName('repo').setDescription('Link to the Covenant repository'),
    new SlashCommandBuilder().setName('paper').setDescription('IAS preprint PDF'),
    new SlashCommandBuilder().setName('status').setDescription('Live funding progress & prototype timeline'),
    new SlashCommandBuilder().setName('architects').setDescription('List of $99+ Architect Circle members'),
  ].map(cmd => cmd.toJSON());

  await guild.commands.set(commands);
  console.log('All Covenant slash commands registered instantly');
});

// ==================== COMMANDS ====================
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const embed = new EmbedBuilder().setColor(0x00ffaa);

  if (interaction.commandName === 'fund') {
    embed
      .setTitle('Fund the Immediate Action System')
      .setDescription('$150,000 → first 1,000 open-hardware 10 ns kill-switch boards (Q1 2026)')
      .addFields(
        { name: 'Ko-fi', value: '[ko-fi.com/covenantarchitects](https://ko-fi.com/covenantarchitects)', inline: true },
        { name: 'Buy Me a Coffee', value: '[buymeacoffee.com/covenant](https://buymeacoffee.com/covenant)', inline: true },
        { name: 'thanks.dev (0 % fee)', value: '[thanks.dev/covenantarchitects](https://thanks.dev/covenantarchitects)', inline: true }
      )
      .setFooter({ text: 'Every dollar → silicon. No salaries.' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('Fund Now').setStyle(ButtonStyle.Link).setURL('https://ko-fi.com/covenantarchitects/goal'),
      new ButtonBuilder().setLabel('Crypto (0%)').setStyle(ButtonStyle.Link).setURL('https://thanks.dev/covenantarchitects')
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }

  if (interaction.commandName === 'bounty') {
    embed
      .setTitle('Active Red-Team Bounties')
      .setDescription('Break the IAS → get paid + name etched on silicon')
      .addFields(
        { name: '$50,000', value: 'Full physical bypass of the 10 ns tripwire without physical access', inline: false },
        { name: '$10,000', value: 'Extract secret key from tamper mesh', inline: false },
        { name: '$5,000', value: 'Any novel bypass (documented)', inline: false },
        { name: '$2,000', value: 'Find remaining compliant extinction vector in ratified directives', inline: false }
      );
    await interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'repo') {
    await interaction.reply('https://github.com/CovenantArchitects/The-Partnership-Covenant');
  }

 8000

  if (interaction.commandName === 'paper') {
    await interaction.reply({
      content: '**IAS Preprint v1.0** — The 10 ns kill-switch paper\nhttps://github.com/CovenantArchitects/The-Partnership-Covenant/blob/main/04_PUBLIC_DOCS/IAS-preprint-v1.0.pdf',
      files: ['https://github.com/CovenantArchitects/The-Partnership-Covenant/raw/main/04_PUBLIC_DOCS/IAS-preprint-v1.0.pdf']
    });
  }

  if (interaction.commandName === 'status') {
    embed
      .setTitle('Prototype Status — Q1 2026 Run')
      .addFields(
        { name: 'Schematic review', value: 'Complete', inline: true },
        { name: 'Gerber export', value: 'January 2026', inline: true },
        { name: 'First 10-board run', value: 'February 2026', inline: true },
        { name: 'Full 1,000-unit batch', value: 'March 2026', inline: true },
        { name: 'Funding progress', value: 'Live at /fund', inline: false }
      );
    await interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'architects') {
    const role = interaction.guild.roles.cache.find(r => r.name === 'Architect Circle');
    const members = role ? role.members.map(m => m.user.tag).join('\n') || 'None yet — be the first' : 'Role not found';
    embed.setTitle('Architect Circle — $99+ Supporters').setDescription(members);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
});

// Welcome DM + reaction role remains unchanged (already perfect)
client.on('guildMemberAdd', member => {
  member.send(
    `Welcome, potential Architect.\n` +
    `Read the primer in #covenant-primer and react ✅ to verify.\n` +
    `Repo: https://github.com/CovenantArchitects/The-Partnership-Covenant`
  ).catch(() => {});
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.channel.name !== 'covenant-primer' || reaction.emoji.name !== '✅') return;
  const guild = reaction.message.guild;
  const member = await guild.members.fetch(user.id);
  const role = guild.roles.cache.find(r => r.name === 'Verified');
  if (role) member.roles.add(role);
});

client.login(process.env.TOKEN);
