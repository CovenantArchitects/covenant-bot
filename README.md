# Covenant Bot

A lightweight, open-source Discord bot for the Covenant Architects community—handling welcomes, slash commands for funding/bounties/repo links, reaction roles, and more. Built with Discord.js v14 for Node.js. Keeps things simple and on-brand: physics > promises.

## Quick Features
- **Slash Commands** (19 total): `/fund` (funding options), `/bounty` (active red-team challenges), `/repo` (Covenant repo), `/status` (prototype timeline), `/paper` (IAS PDF), `/silicon` (funding countdown), and more.
- **Auto-Welcome**: DMs new members with primer info and repo link.
- **Reaction Roles**: Auto-assigns `@Verified` on ✅ in #covenant-primer.
- **Red-Team Tools**: Logs bounties and challenges for easy tracking.

Ties into the main Covenant project (open constitutional framework + IAS hardware): [github.com/CovenantArchitects/The-Partnership-Covenant](https://github.com/CovenantArchitects/The-Partnership-Covenant).
## Setup (5 Minutes)
1. **Clone & Install**:      
git clone https://github.com/CovenantArchitects/covenant-bot.git
cd covenant-bot
npm install

2. **Bot Token**:
- Create a bot in the [Discord Developer Portal](https://discord.com/developers/applications).
- Copy the token.
- Create `.env` file:
TOKEN=your_bot_token_here
GUILD_ID=your_server_id_here  # Optional for guild-only commands

3. **Invite the Bot**:
- In Developer Portal > OAuth2 > URL Generator > Scopes: `bot` > Bot Permissions: `Send Messages`, `Embed Links`, `Read Message History`, `Add Reactions`, `Use Slash Commands`.
- Copy the URL, open it, select your server, authorize.

4. **Run It**:

- Bot goes online. Slash commands appear in 3 seconds (guild-only).

## Hosting 24/7 (Free)
- **Railway.app**: Deploy from GitHub (free 500 hours/month).
- **Render.com**: Free web service tier.
- **Glitch.com**: Remix and run.

## Contributing
- Fork, branch (`feature/your-idea`), PR to `main`.
- Ideas welcome: more commands, webhook integrations, or red-team tools.
- Keep it lightweight—no external deps beyond discord.js/dotenv.

## License
MIT — fork, modify, deploy freely.

Physics > promises. Let's build the constraint.
