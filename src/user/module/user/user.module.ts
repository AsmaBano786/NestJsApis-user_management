import { Module } from '@nestjs/common';
import { UserController } from 'src/user/controller/user/user.controller';
import { UserService } from 'src/user/service/user/user.service';
import { PdfController } from 'src/user/controller/user/user-pdf/pdf-controller/pdf-controller.controller';
import { PdfService } from 'src/user/service/user/pdf-service/pdf-service.service';
@Module({
  controllers: [UserController,PdfController],
  providers: [UserService,PdfService],
})
export class UserModule {}
