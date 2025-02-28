import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'addroletohumans',
  description: 'Add role to all the humans in your server.',
  commandType: ['application', 'message'],
  category: 'moderation',
  args: [
    {
      name: 'role',
      description: 'The role to be given',
      required: false,
      type: 'Role',
    },
    {
      name: 'reason',
      description: 'The reason to give the role.',
      required: false,
      type: 'String',
    },
  ],
  userGuildPermissions: ['MODERATE_MEMBERS'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const role = await ctx.options.getRole('role', true);
    const reason = ctx.options.getLongString('reason') || `Not given`;
    const members = (await client.helpers.getMembers(ctx.guild.id, {})).filter(
      (member) => !member.user?.toggles.bot || true,
    );
    const seconds = Number(members.size) * 1500;

    const message = await client.extras.embed(
      {
        title: 'Add role to all humans.',
        desc: `Adding <@&${role.id}> to ${members.size} members. \n I will take ${seconds} seconds to complete this operation`,
        type: 'reply',
      },
      ctx,
    );
    let success = 0;
    let failed = 0;
    members.forEach((member) => {
      client.helpers
        .addRole(ctx.guild!.id, member.id, role.id, reason)
        .then(() => success++)
        .catch(() => failed++);
    });

    const interval = setInterval(() => {
      if (success + failed == members.size) clearInterval(interval);

      client.extras.editEmbed(
        {
          title: 'Add role to all humans.',
          desc: `Adding <@&${role.id}> to ${members.size} members. \n Successfully added role to ${success} members. \n Failed to add role to ${failed} members.`,
        },
        message,
      );
    }, 5000);
  },
} as CommandOptions;
