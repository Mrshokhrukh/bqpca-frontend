const fs = require('fs');
const path = require('path');

const baseDir = './src'; // your root dir
const recursive = true;

const replacements = {
  'CPD': 'CPD',
  'Cpd': 'Cpd',
  'cpd': 'cpd',
  'BMHC': 'MHPC',
  'Bmhc': 'Mhpc',
  'Bmh': 'Mhpc',
  'BHMC': 'MHPC',
  'Bhmc': 'Mhpc',
  'bhmc': 'mhpc',
  'mhpc': 'mhpc'
};

function caseAwareReplace(str) {
  for (const [search, replace] of Object.entries(replacements)) {
    const regex = new RegExp(search, 'g');
    str = str.replace(regex, replace);
  }
  return str;
}

// Do post-order traversal (children before parent folder)
function renameEverything(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      renameEverything(fullPath); // recurse first
    }

    const newName = caseAwareReplace(entry.name);
    if (newName !== entry.name) {
      const newFullPath = path.join(directory, newName);
      fs.renameSync(fullPath, newFullPath);
      console.log(`Renamed: ${entry.name} → ${newName}`);
    }
  }
}

renameEverything(baseDir);
