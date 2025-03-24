import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { Crud } from '@dataui/crud';
import { User } from './entities/user.entity';

@Crud({
  model: {
    type: User,
  },
})
@Controller('users')
export class UsersController {
  constructor(public service: UsersService) {}
}
