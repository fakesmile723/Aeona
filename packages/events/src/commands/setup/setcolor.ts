import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/functions.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'setcolor',
  description: 'Set the color of the embed',
  commandType: ['application', 'message'],
  category: 'setup',
  args: [
    {
      name: 'color',
      description: '<color>/default',
      required: true,
      type: 'String',
    },
  ],
  userGuildPermissions: ['MANAGE_GUILD'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const rawColor = ctx.options.getString('color', true);
    let color = '';
    if (!rawColor) return;
    if (rawColor.toUpperCase() == 'DEFAULT') {
      color = client.extras.config.colors.normal.replace('#', '');
    } else {
      color = rawColor;
    }

    if (!isHexColor(color))
      return client.extras.errNormal(
        {
          error: 'You did not specify an hex color! Example: ff0000',
          type: 'reply',
        },
        ctx,
      );

    Schema.findOne(
      { Guild: ctx.guild!.id },
      async (err: any, data: { Color: string; save: () => void }) => {
        if (data) {
          data.Color = `#${color}`;
          data.save();
        } else {
          new Schema({
            Guild: ctx.guild!.id,
            Color: `#${color}`,
          }).save();
        }
      },
    );

    client.extras.succNormal(
      {
        text: `The embed color has been adjusted successfully`,
        fields: [
          {
            name: `New color`,
            value: `#${color}`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;

function isHexColor(hex: string | any[]) {
  return typeof hex === 'string' && hex.length === 6 && !isNaN(Number(`0x${hex}`));
}
