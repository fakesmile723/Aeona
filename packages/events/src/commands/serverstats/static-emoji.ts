import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno/types';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'static-emoji',
  description: 'Create a stats channel for the number of static emojies',
  commandType: ['application', 'message'],
  category: 'serverstats',
  args: [],
  userGuildPermissions: ['MANAGE_CHANNELS'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    let channelName = await client.extras.getTemplate(ctx.guild!.id);
    channelName = channelName.replace(`{emoji}`, '😀');
    channelName = channelName.replace(
      `{name}`,
      `Static Emojis: ${(await client.helpers.getEmojis(ctx.guild!.id)).size || '0'}`,
    );

    client.helpers
      .createChannel(ctx.guild!.id, {
        name: channelName,
        type: ChannelTypes.GuildVoice,
        permissionOverwrites: [
          {
            deny: ['CONNECT'],
            type: 0,
            id: ctx.guild!.id,
          },
        ],
      })
      .then(async (channel) => {
        Schema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
          if (data) {
            data.StaticEmojis = channel.id;
            data.save();
          } else {
            new Schema({
              Guild: ctx.guild!.id,
              StaticEmojis: channel.id,
            }).save();
          }
        });

        client.extras.succNormal(
          {
            text: `Static emoji count created!`,
            fields: [
              {
                name: `<:channel:1049292166343688192> Channel`,
                value: `<#${channel.id}>`,
              },
            ],
            type: 'reply',
          },
          ctx,
        );
      });
  },
} as CommandOptions;
