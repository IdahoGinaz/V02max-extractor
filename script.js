import FitParser from 'fit-file-parser';
import JSZip from 'jszip';

document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  let buffer;
  if (file.name.endsWith('.zip')) {
    const zip = await JSZip.loadAsync(file);
    const fitFile = Object.values(zip.files).find(f => f.name.endsWith('.fit'));
    buffer = await fitFile.async('arraybuffer');
  } else {
    buffer = await file.arrayBuffer();
  }

  const parser = new FitParser({ force: true });
  parser.parse(buffer, (err, data) => {
    if (err) {
      document.getElementById('result').textContent = 'Error parsing file';
      return;
    }
    const vo2 = data.sessions?.[0]?.enhanced_vo2_max;
    document.getElementById('result').textContent = vo2
      ? `VO₂ max: ${vo2.toFixed(3)}`
      : 'VO₂ max not found';
  });
});
