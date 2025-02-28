import { AmethystEmbed } from '@thereallonewolf/amethystframework';
import { Guild } from 'discordeno/transformers';

import Schema from '../../database/models/afk.js';
import Schema4 from '../../database/models/birthday.js';
import Schema5 from '../../database/models/blacklist.js';
import Schema6 from '../../database/models/channelList.js';
import Schema7 from '../../database/models/chatbot-channel.js';
import Schema8 from '../../database/models/count.js';
import Schema9 from '../../database/models/countChannel.js';
import Schema13 from '../../database/models/family.js';
import Schema15 from '../../database/models/guessNumber.js';
import Schema16 from '../../database/models/guessWord.js';
import Schema17 from '../../database/models/levelChannels.js';
import Schema18 from '../../database/models/levelRewards.js';
import Schema19 from '../../database/models/logChannels.js';
import Schema40 from '../../database/models/messageRewards.js';
import Schema20 from '../../database/models/messages.js';
import Schema27 from '../../database/models/reactionRoles.js';
import Schema28 from '../../database/models/reviewChannels.js';
import Schema29 from '../../database/models/stats.js';
import Schema30 from '../../database/models/suggestionChannels.js';
import Schema31 from '../../database/models/ticketChannels.js';
import Schema32 from '../../database/models/ticketMessage.js';
import Schema34 from '../../database/models/tickets.js';
import Schema35 from '../../database/models/verify.js';
import Schema38 from '../../database/models/warnings.js';
import { AeonaBot } from '../../extras/index.js';

export default async (client: AeonaBot, guild: Guild) => {
  client.extras.lastguildcount = client.cache.guilds.memory.size;
  const embed = new AmethystEmbed()
    .setTitle('🔴 Removed from a server!')
    .addField('Total servers:', `${client.cache.guilds.memory.size}`, true)
    .addField('Server name', `${guild.name}`, true)
    .addField('Server ID', `${guild.id}`, true)
    .addField('Server members', `${guild.memberCount}`, true)
    .addField('Server owner', `<@!${guild.ownerId}> (${guild.ownerId})`, true)

    .setColor(client.extras.config.colors.normal);
  client.extras.webhook({
    embeds: [embed],
  });
  await Schema.deleteMany({ Guild: guild.id });
  await Schema4.deleteMany({ Guild: guild.id });
  await Schema5.deleteMany({ Guild: guild.id });
  await Schema6.deleteMany({ Guild: guild.id });
  await Schema7.deleteMany({ Guild: guild.id });
  await Schema8.deleteMany({ Guild: guild.id });
  await Schema9.deleteMany({ Guild: guild.id });
  await Schema13.deleteMany({ Guild: guild.id });
  await Schema15.deleteMany({ Guild: guild.id });
  await Schema16.deleteMany({ Guild: guild.id });
  await Schema17.deleteMany({ Guild: guild.id });
  await Schema18.deleteMany({ Guild: guild.id });
  await Schema19.deleteMany({ Guild: guild.id });
  await Schema20.deleteMany({ Guild: guild.id });
  await Schema27.deleteMany({ Guild: guild.id });
  await Schema28.deleteMany({ Guild: guild.id });
  await Schema29.deleteMany({ Guild: guild.id });
  await Schema30.deleteMany({ Guild: guild.id });
  await Schema31.deleteMany({ Guild: guild.id });
  await Schema32.deleteMany({ Guild: guild.id });
  await Schema34.deleteMany({ Guild: guild.id });
  await Schema35.deleteMany({ Guild: guild.id });
  await Schema38.deleteMany({ Guild: guild.id });
  await Schema40.deleteMany({ Guild: guild.id });
};
