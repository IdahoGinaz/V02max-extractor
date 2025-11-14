document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  let buffer;
  try {
    if (file.name.endsWith('.zip')) {
      const zip = await JSZip.loadAsync(file);
      const fitFile = Object.values(zip.files).find(f => f.name.endsWith('.fit'));
      if (!fitFile) {
        return document.getElementById('result').textContent = 'No FIT file found in ZIP';
      }
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
        : 'VO₂ max not found in file';
    });
  } catch (error) {
    document.getElementById('result').textContent = 'Unexpected error: ' + error.message;
  }
});
