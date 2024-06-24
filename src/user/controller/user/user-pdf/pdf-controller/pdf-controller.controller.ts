// pdf.controller.ts
import { Controller, Get, Param, Res } from '@nestjs/common';
import { PdfService } from 'src/user/service/user/pdf-service/pdf-service.service';
import { Response } from 'express';
import { UserService } from 'src/user/service/user/user.service';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly userService: UserService,
  ) {}

  @Get('generate/:id')
  async generatePdf(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      const user = await this.userService.findUserById(parseInt(id, 10));

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const pdfBuffer = await this.pdfService.generatePdf(user);

      const filename = `user-${id}.pdf`;
      await this.pdfService.savePdfToFile(pdfBuffer, filename);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.length.toString(),
        'Content-Disposition': `attachment; filename=${filename}`,
      });

      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Get('retrieve/:id')
  async retrievePdf(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      const pdfBuffer = await this.pdfService.retrievePdf(parseInt(id, 10));

      if (!pdfBuffer) {
        res.status(404).json({ message: 'PDF not found' });
        return;
      }

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.length.toString(),
        'Content-Disposition': `inline; filename=generated-${id}.pdf`,
      });

      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error retrieving PDF:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
