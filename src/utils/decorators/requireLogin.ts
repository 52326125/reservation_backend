import { SetMetadata } from '@nestjs/common';
import { REQUIRE_LOGIN } from 'src/const/decorator';

export const requireLogin = () => SetMetadata(REQUIRE_LOGIN, true);
