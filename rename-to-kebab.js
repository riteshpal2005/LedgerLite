const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');
const testsDir = path.join(rootDir, '__tests__');

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function getAllFiles(dirPath, arrayOfFiles) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles || [];
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });
  return arrayOfFiles;
}

// 1. Gather all files in components and screens to rename
const targetDirs = [
  path.join(srcDir, 'components'),
  path.join(srcDir, 'screens')
];

let filesToRename = [];
targetDirs.forEach(dir => {
  filesToRename = filesToRename.concat(getAllFiles(dir));
});

const renameMap = {}; // { 'AddTransactionSheet': 'add-transaction-sheet' }

filesToRename.forEach(filePath => {
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  
  if (baseName !== baseName.toLowerCase() && !baseName.startsWith('+') && !baseName.startsWith('_')) {
    const kebabName = toKebabCase(baseName);
    renameMap[baseName] = kebabName;
    
    // Execute git mv
    const newPath = path.join(path.dirname(filePath), kebabName + ext);
    try {
      execSync(`git mv "${filePath}" "${newPath}"`);
      console.log(`Renamed: ${baseName}${ext} -> ${kebabName}${ext}`);
    } catch (e) {
      console.error(`Failed to move ${filePath}`);
    }
  }
});

// 2. Fix imports in all files
let allFiles = getAllFiles(srcDir).concat(getAllFiles(testsDir));

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // We only want to replace path strings in imports
  // Matches: import ... from '...'; OR import '...'; OR require('...');
  const importRegex = /(?:import|from|require\()\s*['"]([^'"]+)['"]/g;
  
  content = content.replace(importRegex, (match, importPath) => {
    let newImportPath = importPath;
    
    // Check if the import path ends with any of our renamed base names
    for (const [pascal, kebab] of Object.entries(renameMap)) {
      // E.g., if importPath is '../transactions/AddTransactionSheet'
      // It should become '../transactions/add-transaction-sheet'
      if (newImportPath.endsWith(`/${pascal}`)) {
        newImportPath = newImportPath.replace(new RegExp(`/${pascal}$`), `/${kebab}`);
      } else if (newImportPath === `./${pascal}`) {
        newImportPath = `./${kebab}`;
      } else if (newImportPath.includes(`/${pascal}/`)) {
          // If it was importing a file from a folder that got renamed? We only renamed files, not folders.
      }
    }
    
    return match.replace(importPath, newImportPath);
  });
  
  // Also fix Expo Router imports in _layout.tsx and index.tsx etc (e.g. router.push('/Login'))
  // Wait, router paths don't use file paths directly unless we linked them.
  // Actually Expo Router paths in our app:
  // e.g. <Stack.Screen name="(auth)" /> -> this maps to folders, which we didn't change.
  // Did we rename index.tsx? No, it doesn't have uppercase.
  // Did we rename login.tsx in src/app/(auth)/ ? No, it was already login.tsx.

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('Finished renaming to kebab-case and fixing imports!');
