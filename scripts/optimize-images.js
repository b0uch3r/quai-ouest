/**
 * Script d'optimisation des images — Quai Ouest
 *
 * Usage:
 *   node scripts/optimize-images.js
 *
 * Prérequis:
 *   npm install sharp
 *
 * Ce script :
 * 1. Prend toutes les images JPG dans assets/images/ (racine)
 * 2. Génère des versions WebP optimisées dans assets/images/optimized/
 * 3. Génère plusieurs tailles (responsive) pour chaque image
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'assets/images');
const OUTPUT_DIR = path.join(ROOT, 'assets/images/optimized');

// Tailles générées pour chaque image (responsive)
const SIZES = [
  { name: 'small',  width: 400,  quality: 80 },  // Mobile / vignette galerie
  { name: 'medium', width: 800,  quality: 82 },  // Tablette / galerie desktop
  { name: 'large',  width: 1200, quality: 85 },  // Lightbox / desktop
];

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function optimizeImage(inputPath, base) {
  const results = [];

  for (const size of SIZES) {
    const outputFile = path.join(OUTPUT_DIR, `${base}-${size.name}.webp`);

    try {
      const metadata = await sharp(inputPath).metadata();
      const targetWidth = Math.min(size.width, metadata.width || size.width);

      await sharp(inputPath)
        .resize(targetWidth, null, { withoutEnlargement: true })
        .webp({ quality: size.quality, effort: 4 })
        .toFile(outputFile);

      const stat = fs.statSync(outputFile);
      results.push({
        size: size.name,
        width: targetWidth,
        file: `assets/images/optimized/${base}-${size.name}.webp`,
        sizeKb: Math.round(stat.size / 1024),
      });

      console.log(`  ✓ ${base}-${size.name}.webp (${Math.round(stat.size / 1024)} Ko)`);
    } catch (err) {
      console.error(`  ✗ Erreur pour ${size.name}: ${err.message}`);
    }
  }

  return results;
}

async function main() {
  console.log('Optimisation des images — Quai Ouest\n');
  await ensureDir(OUTPUT_DIR);

  // Lister les JPG dans le dossier racine images (pas les sous-dossiers)
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  if (files.length === 0) {
    console.log('Aucune image trouvée dans assets/images/');
    return;
  }

  console.log(`${files.length} images à optimiser\n`);

  let total = 0;
  let skipped = 0;
  let savedBytes = 0;

  for (const filename of files) {
    const inputPath = path.join(SOURCE_DIR, filename);
    const base = path.basename(filename, path.extname(filename));

    // Skip si déjà optimisé
    const checkFile = path.join(OUTPUT_DIR, `${base}-medium.webp`);
    if (fs.existsSync(checkFile)) {
      console.log(`  ↩ ${filename} (déjà optimisé)`);
      skipped++;
      continue;
    }

    const originalSize = fs.statSync(inputPath).size;
    console.log(`→ ${filename} (${Math.round(originalSize / 1024)} Ko)`);

    try {
      const results = await optimizeImage(inputPath, base);
      const mediumResult = results.find(r => r.size === 'medium');
      if (mediumResult) {
        savedBytes += originalSize - (mediumResult.sizeKb * 1024);
      }
      total++;
    } catch (err) {
      console.error(`  ✗ ${filename}: ${err.message}`);
    }
  }

  console.log(`\nTerminé — ${total} optimisées, ${skipped} ignorées`);
  console.log(`Économie estimée : ~${Math.round(savedBytes / 1024)} Ko`);
  console.log(`Résultat dans : assets/images/optimized/`);
}

main().catch(console.error);
