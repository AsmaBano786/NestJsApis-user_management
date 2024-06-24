// pdf-service.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { User } from 'src/user/model/user/user.model';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class PdfService {
  async generatePdf(user: User): Promise<Buffer> {
    const docDefinition = {
      content: [
        { text: 'User Information\n\n\n', style: 'header' },
        { text: [
          { text: `Name: ${user.name}\n\n`, style: 'content' },
          { text: `Email: ${user.email}\n\n`, style: 'content' },
          { text: `phone Number: ${user.phoneNumber}\n\n`, style: 'content' },
          { text: `Address: ${user.address}\n\n`, style: 'content' },
          // { text: user.address.join('\n'), style: 'content' }, // Example: Address as an array of lines
        ] },
],
      styles: {
        header: { fontSize: 18, bold: true },
        content: { fontSize: 12 },
      },
    };

    return new Promise((resolve, reject) => {
      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBase64((data: string) => {
        const buffer = Buffer.from(data, 'base64');
        resolve(buffer);
      });
    });
  }

  private async ensureDirectoryExistence(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    return new Promise((resolve, reject) => {
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async savePdfToFile(pdfBuffer: Buffer, filename: string): Promise<void> {
    const filePath = path.join(__dirname, '..', '..', '..', 'pdfs', filename);
    await this.ensureDirectoryExistence(filePath);
console.log(filePath);

    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, pdfBuffer, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async retrievePdf(id: number): Promise<Buffer | null> {
    const filePath = path.join(__dirname, '..', '..', '..', 'pdfs', `user-${id}.pdf`);

    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            resolve(null);
          } else {
            reject(err);
          }
        } else {
          resolve(data);
        }
      });
    });
  }
}
