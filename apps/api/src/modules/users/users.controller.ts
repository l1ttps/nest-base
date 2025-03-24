import { Override } from '@dataui/crud';
import { Body, Get, Patch } from '@nestjs/common';
import { ADMIN } from '../../common/common.enum';
import { UserPayload } from '../../common/type';
import { Roles } from '../../guards/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { GetMeDoc, UpdateProfileDoc } from './user.doc';
import { UserContext } from '../../common/decorators/user-context.decorator';
import { UpdateProfileDto } from './dto/user.dto';
import { ControllerCrud } from '../../common/decorators/controller-crud.decorator';

@ControllerCrud({
  name: 'users',
  entity: User,
  crud: {
    query: {
      exclude: ['password', 'deleteAt'],
    },

    routes: {
      only: [
        'createOneBase',
        'getManyBase',
        'getOneBase',
        'deleteOneBase',
        'updateOneBase',
      ],
      getManyBase: {
        decorators: [Roles(ADMIN)],
      },
      getOneBase: {
        decorators: [Roles(ADMIN)],
      },
      deleteOneBase: {
        decorators: [Roles(ADMIN)],
      },
      updateOneBase: {
        decorators: [Roles(ADMIN)],
      },
    },
  },
})
export class UsersController {
  constructor(public service: UsersService) {}
  @Roles(ADMIN)
  @Override('createOneBase')
  createUser(@Body() dto: CreateUserDto) {
    return this.service.createUser(dto);
  }

  @GetMeDoc()
  @Get('me')
  getMe(@UserContext() user: UserPayload) {
    return this.service.getMe(user);
  }

  @UpdateProfileDoc()
  @Patch('me')
  updateProfile(
    @UserContext() user: UserPayload,
    @Body() dto: UpdateProfileDto
  ) {
    return this.service.updateProfile(user, dto);
  }
}
