import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ErrorMessage } from "@apitool/utils";
import { Profile, Strategy, StrategyOptions, VerifyCallback } from "passport-google-oauth20";

import { UserService } from "@/server/user/user.service";
import { AuthService } from "@/server/auth/auth.service";
import { UserDto } from "@apitool/dto";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    readonly clientID: string,
    readonly clientSecret: string,
    readonly callbackURL: string,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({ clientID, clientSecret, callbackURL, scope: ["email", "profile"] } as StrategyOptions);
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { emails, photos, username } = profile;

    const email = emails?.[0].value ?? `${username}@google.com`;
    const picture = photos?.[0].value;

    let user: UserDto;

    if (!email) throw new BadRequestException();

    try {
      const user = await this.userService.findOneByIdentifier(email);

      if (!user) throw new UnauthorizedException();

      done(null, user);
    } catch (error) {
      try {
        user = await this.authService.signup({
          userProfile: {
            email,
            username,
            picture,
            locale: "en-US",
            provider: "google",
            emailVerified: true, // auto-verify emails
          },
          secrets: { create: {} }
        })

        done(null, user);
      } catch (error) {
        throw new BadRequestException(ErrorMessage.UserAlreadyExists);
      }
    }
  }
}
