import { chromium } from 'playwright';
import * as XLSX from 'xlsx'; // Importar la biblioteca xlsx
import open from 'open';

(async () => {
    // Inicia el navegador
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Navega a la página de Amazon
    await page.goto('URL DE LA BÚSQUEDA');
    
    // Extrae los productos
    const products = await page.$$eval(
        '.s-card-container',
        (results) => {
            return results.map(el => {
                const title = el.querySelector('h2')?.innerText || "N/A";
                const image = el.querySelector('img')?.getAttribute("src") || "N/A";
                const price = el.querySelector('.a-price .a-offscreen')?.innerText || "N/A";
                const link = el.querySelector('.a-link-normal')?.getAttribute('href') || "N/A";
                return { title, image, price, link };
            }).filter(product => product.title !== "N/A"); // Filtrar productos sin título
        }
    );

    // console.log("Productos extraídos:", products);

    // Cierra el navegador
    await browser.close();

    // Crea un libro de Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(products);

    // Agrega la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

    // Guarda el archivo
    XLSX.writeFile(workbook, 'productos.xlsx');
    // console.log("Archivo Excel guardado como 'productos.xlsx'");
    await open('productos.xlsx');
})();
