import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Intents } from 'discord.js';
import { AppService } from './app.service';
import { RolesEntity } from './entities/Roles.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cf: ConfigService) => ({
        token: cf.get<string>('BOT_TOKEN'),
        commandPrefix: 'opt!',
        discordClientOptions: {
          intents: [Intents.FLAGS.GUILDS],
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database.sqlite',
      logging: true,
      entities: [RolesEntity],
    }),
    TypeOrmModule.forFeature([RolesEntity]),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
