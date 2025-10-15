const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function convertHtmlToImage() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Configurar viewport para 1200x630
  await page.setViewport({ width: 1200, height: 630 });
  
  const files = [
    'hidratacao-og-image.html',
    'proteina-og-image.html', 
    'imc-og-image.html',
    'nutricao-og-image.html',
    'herbalead-main-og-image.html'
  ];
  
  for (const file of files) {
    const htmlPath = path.join(__dirname, 'public', 'og-images', file);
    const jpgPath = htmlPath.replace('.html', '.jpg');
    
    console.log(`Convertendo ${file}...`);
    
    // Carregar HTML
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    await page.setContent(htmlContent);
    
    // Aguardar animações carregarem
    await page.waitForTimeout(2000);
    
    // Capturar screenshot
    await page.screenshot({
      path: jpgPath,
      type: 'jpeg',
      quality: 90,
      fullPage: false
    });
    
    console.log(`✅ ${file} convertido para JPG`);
  }
  
  await browser.close();
  console.log('🎉 Todas as imagens foram convertidas!');
}

convertHtmlToImage().catch(console.error);
