import jsonFile from 'jsonfile';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.join(__dirname, '../src/');
const distPath = path.join(__dirname, '../dist/');
const manifestFilePath = path.join(srcPath, '/manifest.json');

// read manifest & version
const manifest = jsonFile.readFileSync(manifestFilePath);
const version = manifest.version.split('.');

// create archive
const archiveName = 'build_' + version.join('_') + '.zip';
const archiveFilePath = path.join(distPath, archiveName);
const archive = archiver('zip', {
    comment: manifest.version,
});
archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
        console.log('warning', err);
    } else {
        throw err;
    }
});
archive.on('error', (err) => { throw err; });

// create file to stream archive into
const output = fs.createWriteStream(archiveFilePath);
output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});
output.on('end', function () {
    console.log('Data has been drained');
});

archive.pipe(output); // pipe archive data to the file
archive.directory(srcPath, false); // append files from a sub-directory, putting its contents at the root of archive
// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize();
