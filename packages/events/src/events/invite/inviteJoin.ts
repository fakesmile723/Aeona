import { BigString, Member, User } from 'discordeno';

import invitedBy from '../../database/models/inviteBy.js';
import messages from '../../database/models/inviteMessages.js';
import rewards from '../../database/models/inviteRewards.js';
import invites from '../../database/models/invites.js';
import welcomeSchema from '../../database/models/welcomeChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default async (
  client: AeonaBot,
  member: Member,
  invite: User | null,
  inviter: User | null,
) => {
  const messageData = await messages.findOne({ Guild: member.guildId });
  client.events;
  if (!invite || !inviter) {
    if (messageData && messageData.inviteJoin) {
      const guild = await client.cache.guilds.get(member.guildId);
      if (!guild) return;

      let joinMessage = messageData.inviteJoin;
      if (!joinMessage) return;
      const u = await client.helpers.getUser(member.id);
      joinMessage = joinMessage.replace(`{user:username}`, u.username);
      joinMessage = joinMessage.replace(
        `{user:discriminator}`,
        u.discriminator,
      );

      joinMessage = joinMessage.replace(
        `{user:tag}`,
        u.username + '#' + u.discriminator,
      );
      joinMessage = joinMessage.replace(
        `{user:mention}`,
        '<@' + member.id + '>',
      );

      joinMessage = joinMessage.replace(`{inviter:username}`, 'System');
      joinMessage = joinMessage.replace(`{inviter:discriminator}`, '#0000');
      joinMessage = joinMessage.replace(`{inviter:tag}`, 'System#0000');
      joinMessage = joinMessage.replace(`{inviter:mention}`, 'System');
      joinMessage = joinMessage.replace(`{inviter:invites}`, '∞');
      joinMessage = joinMessage.replace(`{inviter:invites:left}`, '∞');

      joinMessage = joinMessage.replace(`{guild:name}`, guild.name);
      joinMessage = joinMessage.replace(
        `{guild:members}`,
        guild.approximateMemberCount + '',
      );

      welcomeSchema.findOne(
        { Guild: member.guildId },
        async (err: any, channelData: { Channel: BigString }) => {
          if (channelData) {
            const channel = await client.cache.channels.get(
              BigInt(channelData.Channel),
            );

            await client.extras
              .embed(
                {
                  title: `👋 Welcome`,
                  desc: joinMessage,
                },
                channel!,
              )
              .catch();
          }
        },
      );
    } else {
      welcomeSchema.findOne(
        { Guild: member.guildId },
        async (err: any, channelData: { Channel: any }) => {
          if (channelData) {
            const channel = await client.cache.channels.get(
              channelData.Channel,
            );
            const u = await client.helpers.getUser(member.id);
            client.extras
              .embed(
                {
                  title: `👋 Welcome`,
                  desc: `I cannot trace how **<@${member.id}> | ${
                    u.username + '#' + u.discriminator
                  }** has been joined`,
                },
                channel!,
              )
              .catch();
          }
        },
      );
    }
  } else {
    const data = await invites.findOne({
      Guild: member.guildId,
      User: inviter.id + '',
    });

    if (data) {
      if (!data.Invites) data.Invites = 0;
      if (!data.Total) data.Total = 0;
      data.Invites += 1;
      data.Total += 1;
      data.save();

      if (messageData) {
        let joinMessage = messageData.inviteJoin;
        const guild = await client.cache.guilds.get(member.guildId);
        const u = await client.helpers.getUser(member.id);
        if (!guild || !joinMessage) return;
        joinMessage = joinMessage.replace(`{user:username}`, u.username);
        joinMessage = joinMessage.replace(
          `{user:discriminator}`,
          u.discriminator,
        );
        joinMessage = joinMessage.replace(
          `{user:tag}`,
          u.username + '#' + u.discriminator,
        );
        joinMessage = joinMessage.replace(
          `{user:mention}`,
          '<@' + member.id + '>',
        );

        joinMessage = joinMessage.replace(
          `{inviter:username}`,
          inviter.username,
        );
        joinMessage = joinMessage.replace(
          `{inviter:discriminator}`,
          inviter.discriminator,
        );
        joinMessage = joinMessage.replace(
          `{inviter:tag}`,
          inviter.username + '#' + inviter.discriminator,
        );
        joinMessage = joinMessage.replace(
          `{inviter:mention}`,
          '<@' + inviter.id + '>',
        );
        joinMessage = joinMessage.replace(
          `{inviter:invites}`,
          data.Invites + '',
        );
        joinMessage = joinMessage.replace(
          `{inviter:invites:left}`,
          data.Left + '',
        );

        joinMessage = joinMessage.replace(`{guild:name}`, guild.name);
        joinMessage = joinMessage.replace(
          `{guild:members}`,
          guild.approximateMemberCount + '',
        );

        welcomeSchema.findOne(
          { Guild: member.guildId },
          async (err: any, channelData: { Channel: any }) => {
            if (channelData) {
              const channel = await client.cache.channels.get(
                channelData.Channel,
              );

              await client.extras
                .embed(
                  {
                    title: `👋 Welcome`,
                    desc: joinMessage,
                  },
                  channel!,
                )
                .catch();
            }
          },
        );
      } else {
        welcomeSchema.findOne(
          { Guild: member.guildId },
          async (err: any, channelData: { Channel: any }) => {
            const u = await client.helpers.getUser(member.id);
            if (channelData) {
              const channel = await client.cache.channels.get(
                channelData.Channel,
              );
              client.extras.embed(
                {
                  title: `👋 Welcome`,
                  desc: `**<@${member.id}> | ${
                    u.username + '#' + u.discriminator
                  }** was invited by ${
                    inviter.username + '#' + inviter.discriminator
                  } **(${data.Invites} invites)**`,
                },
                channel!,
              );
            }
          },
        );
      }

      rewards.findOne(
        { Guild: member.guildId, Invites: data.Invites },
        async (err: any, data: { Role: any }) => {
          if (data) {
            client.helpers.addRole(member.guildId, member.id + '', data.Role);
          }
        },
      );
    } else {
      new invites({
        Guild: member.guildId,
        User: inviter.id + '',
        Invites: 1,
        Total: 1,
        Left: 0,
      }).save();

      if (messageData) {
        const u = await client.helpers.getUser(member.id);
        let joinMessage = messageData.inviteJoin;
        if (!joinMessage) return;
        joinMessage = joinMessage.replace(`{user:username}`, u.username!);
        joinMessage = joinMessage.replace(
          `{user:discriminator}`,
          u.discriminator!,
        );
        const guild = await client.cache.guilds.get(member.guildId);
        if (!guild) return;
        joinMessage = joinMessage.replace(
          `{user:tag}`,
          u.username + '#' + u.discriminator,
        );
        joinMessage = joinMessage.replace(
          `{user:mention}`,
          '<@' + member.id + '>',
        );

        joinMessage = joinMessage.replace(
          `{inviter:username}`,
          inviter.username,
        );
        joinMessage = joinMessage.replace(
          `{inviter:discriminator}`,
          inviter.discriminator,
        );
        joinMessage = joinMessage.replace(
          `{inviter:tag}`,
          inviter.username + '#' + inviter.discriminator,
        );
        joinMessage = joinMessage.replace(
          `{inviter:mention}`,
          '<@' + inviter.id + '>',
        );
        joinMessage = joinMessage.replace(`{inviter:invites}`, '1');
        joinMessage = joinMessage.replace(`{inviter:invites:left}`, '0');

        joinMessage = joinMessage.replace(`{guild:name}`, guild.name);
        joinMessage = joinMessage.replace(
          `{guild:members}`,
          guild.approximateMemberCount + '',
        );

        welcomeSchema.findOne(
          { Guild: member.guildId },
          async (err: any, channelData: { Channel: any }) => {
            if (channelData) {
              const channel = await client.cache.channels.get(
                channelData.Channel,
              );

              await client.extras
                .embed(
                  {
                    title: `👋 Welcome`,
                    desc: joinMessage,
                  },
                  channel!,
                )
                .catch();
            }
          },
        );
      } else {
        welcomeSchema.findOne(
          { Guild: member.guildId },
          async (err: any, channelData: { Channel: any }) => {
            if (channelData) {
              const u = await client.helpers.getUser(member.id);
              const channel = await client.cache.channels.get(
                channelData.Channel,
              );

              await client.extras
                .embed(
                  {
                    title: `👋 Welcome`,
                    desc: `**<@${member.id}> | ${
                      u.username + '#' + u.discriminator
                    }** was invited by ${
                      inviter.username + '#' + inviter.discriminator
                    } **(1 invites)**`,
                  },
                  channel!,
                )
                .catch();
            }
          },
        );
      }
    }

    invitedBy.findOne(
      { Guild: member.guildId },
      async (
        err: any,
        data2: { inviteUser: bigint; User: bigint; save: () => void },
      ) => {
        if (data2) {
          (data2.inviteUser = inviter.id), (data2.User = member.id);
          data2.save();
        } else {
          new invitedBy({
            Guild: member.guildId,
            inviteUser: inviter.id + '',
            User: member.id + '',
          }).save();
        }
      },
    );
  }
};
