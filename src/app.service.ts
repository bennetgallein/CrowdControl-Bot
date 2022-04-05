import { Command, DiscordClientProvider, On } from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'discord.js';
import { Repository } from 'typeorm';
import { RolesEntity } from './entities/Roles.entity';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly discordProvider: DiscordClientProvider,
    @InjectRepository(RolesEntity)
    private readonly repo: Repository<RolesEntity>,
  ) {}

  @On('ready')
  botReady(): void {
    this.logger.log(
      `Logged in as ${this.discordProvider.getClient().user.tag}!`,
    );
  }

  @Command({
    name: 'setup',
    description: 'Setup the channel for the Bot to use',
    // allowChannels: ['936371748943847464'],
  })
  async onSetup(message: Message): Promise<any> {
    await message.reply(`Executed command: ${message.content}`);
  }

  @OnCommand({ name: 'out', allowChannels: ['936371748943847464'] })
  async optoutCommand(message: Message): Promise<any> {
    const user = message.guild.members.cache.get(message.author.id);
    const roleId = '934164635450486785';

    if (!user.roles.cache.get(roleId)) {
      message.reply(
        'Looks like you are not opt-in currently. Type "opt!in" to receive announcements again!',
      );
      return;
    }
    user.roles.remove(roleId);

    message.reply("Ok, we've opted you out!");
  }

  @OnCommand({ name: 'in', allowChannels: ['936371748943847464'] })
  async optinCommand(message: Message): Promise<any> {
    const user = message.guild.members.cache.get(message.author.id);
    const roleId = '934164635450486785';

    if (user.roles.cache.get(roleId)) {
      message.reply(
        'Looks like you are already opted in! Type "opt!out" to don\'t receive annoucements any more.',
      );
      return;
    }
    user.roles.add(roleId);

    message.reply("Ok, you're now opted in!");
  }

  private async getGuildSettings(guildId: string, channelId: string) {
    return this.repo.findOne({ where: { guildId, channelId } });
  }
}
