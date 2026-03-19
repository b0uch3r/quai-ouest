/**
 * Script d'optimisation des images — Quai Ouest
 *
 * Usage:
 *   node scripts/optimize-images.js
 *
 * Prérequis:
 *   npm install sharp glob
 *
 * Ce script :
 * 1. Prend toutes les images dans assets/images/instagram/ et assets/images/facebook/
 * 2. Génère des versions WebP optimisées dans assets/images/optimized/
 * 3. Génère plusieurs tailles (responsive) pour chaque image
 * 4. Met à jour gallery.json avec le champ "downloaded: true" automatiquement
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { glob } = require('glob');

const ROOT = path.join(__dirname, '..');
const SOURCES = [
  path.join(ROOT, 'assets/images/instagram'),
  path.join(ROOT, 'assets/images/facebook'),
];
const OUTPUT_DIR = path.join(ROOT, 'assets/images/optimized');
const GALLERY_JSON = path.join(ROOT, 'content/gallery.json');

// Tailles générées pour chaque image (responsive)
const SIZES = [
  { name: 'thumb',  width: 400,  quality: 80 },  // Galerie — vignette
  { name: 'medium', width: 800,  quality: 82 },  // Galerie — affichage normal
  { name: 'large',  width: 1200, quality: 85 },  // Lightbox / Hero
  { name: 'hero',   width: 1920, quality: 88 },  // Hero plein écran
];

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function optimizeImage(inputPath, filename) {
  const base = path.basename(filename, path.extname(filename));
  const outputSubDir = path.join(OUTPUT_DIR, base);
  await ensureDir(outputSubDir);

  const results = [];

  for (const size of SIZES) {
    const outputFile = path.join(outputSubDir, `${base}-${size.name}.webp`);

    try {
      const metadata = await sharp(inputPath).metadata();
      // Ne pas upscaler une image plus petite que la taille cible
      const targetWidth = Math.min(size.width, metadata.width || size.width);

      await sharp(inputPath)
        .resize(targetWidth, null, { withoutEnlargement: true })
        .webp({ quality: size.quality, effort: 4 })
        .toFile(outputFile);

      const stat = fs.statSync(outputFile);
      results.push({
        size: size.name,
        width: targetWidth,
        file: `assets/images/optimized/${base}/${base}-${size.name}.webp`,
        sizeKb: Math.round(stat.size / 1024),
      });

      console.log(`  ✓ ${base}-${size.name}.webp (${Math.round(stat.size / 1024)} Ko)`);
    } catch (err) {
      console.error(`  ✗ Erreur pour ${size.name}: ${err.message}`);
    }
  }

  return results;
}

async function updateGalleryJson(processedFiles) {
  const gallery = JSON.parse(fs.readFileSync(GALLERY_JSON, 'utf-8'));

  for (const photo of gallery.photos) {
    const targetFile = photo.filename;
    if (processedFiles.has(targetFile)) {
      photo.downloaded = true;
      photo.optimized = processedFiles.get(targetFile);
    }
  }

  gallery._meta.lastUpdated = new Date().toISOString().split('T')[0];
  fs.writeFileSync(GALLERY_JSON, JSON.stringify(gallery, null, 2), 'utf-8');
  console.log('\n✓ gallery.json mis à jour');
}

async function main() {
  console.log('🖼️  Optimisation des images — Quai Ouest\n');
  await ensureDir(OUTPUT_DIR);

  const processedFiles = new Map();
  let total = 0;
  let skipped = 0;

  for (const sourceDir of SOURCES) {
    if (!fs.existsSync(sourceDir)) {
      console.log(`⚠️  Dossier introuvable: ${sourceDir} (ignoré)`);
      continue;
    }

    const images = await glob('*.{jpg,jpeg,png,JPG,JPEG,PNG}', { cwd: sourceDir });

    if (images.length === 0) {
      console.log(`ℹ️  Aucune image dans: ${sourceDir}`);
      continue;
    }

    console.log(`📁 ${path.relative(ROOT, sourceDir)} (${images.length} images)`);

    for (const filename of images) {
      const inputPath = path.join(sourceDir, filename);
      const outputBase = path.join(OUTPUT_DIR, path.basename(filename, path.extname(filename)));

      // Vérifier si déjà optimisé (skip si tous les fichiers existent)
      const existingWebp = `${outputBase}-large.webp`;
      if (fs.existsSync(existingWebp)) {
        console.log(`  ↩ ${filename} (déjà optimisé)`);
        skipped++;
        continue;
      }

      console.log(`  → ${filename}`);
      try {
        const results = await optimizeImage(inputPath, filename);
        processedFiles.set(filename, results);
        total++;
      } catch (err) {
        console.error(`  ✗ ${filename}: ${err.message}`);
      }
    }
  }

  if (processedFiles.size > 0) {
    await updateGalleryJson(processedFiles);
  }

  console.log(`\n✅ Terminé — ${total} optimisées, ${skipped} ignorées (déjà traitées)`);
  console.log(`📂 Résultat dans: assets/images/optimized/`);
}

main().catch(console.error);
