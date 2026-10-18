import fs from 'node:fs';
import path from 'node:path';
import { getDocument } from 'pdfjs-dist';
import sharp from 'sharp';

async function exportAllPages() {
  const outDir = './public/images/pdf_pages';
  fs.mkdirSync(outDir, { recursive: true });
  const data = new Uint8Array(fs.readFileSync('D:/dowload/phongvanvong2_2026.pdf'));
  const doc = await getDocument({ data }).promise;
  console.log('Doc pages:', doc.numPages);

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const ops = await page.getOperatorList();
    for (let i = 0; i < ops.fnArray.length; i++) {
      const args = ops.argsArray[i];
      if (args && args.length >= 3 && args[1] > 1000 && args[2] > 1000) {
        const name = args[0];
        await new Promise((resolve) => {
          page.objs.get(name, async (img) => {
            if (img && img.data) {
              const channels = img.data.length / (img.width * img.height);
              const outFile = path.join(outDir, 'page_' + p + '.png');
              try {
                await sharp(img.data, { raw: { width: img.width, height: img.height, channels } })
                  .png({ quality: 90 })
                  .toFile(outFile);
                console.log('Saved page', p, '->', outFile);
              } catch (e) {
                console.error('Error saving page', p, e.message);
              }
            }
            resolve();
          });
        });
        break;
      }
    }
  }
  console.log('Done exporting all pages!');
}

exportAllPages().catch(console.error);
