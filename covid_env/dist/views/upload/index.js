document.getElementById('upload').addEventListener('click', async (event) => {
  event.preventDefault();
  const files = document.getElementById('files').files;
  const file = files[0];
  if (file.name === 'export_dataframe.xlsx') {
    let response;
    const formData = new FormData();
    formData.append('file', file);
    try {
      response = await fetch('http://localhost:8080/api/data/file', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.log(error);
    }
    if (response.status === 200) {
      window.location.href = 'graphs';
    }
  }
});
