console.log("JavaScript file is loaded");

fetch("http://localhost:3000/api/data")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Data fetched:", data);
    data.forEach((item) => {
      console.log("Processing item:", item);

      // Check if there is a video data
      const videoContainer = document.createElement("div");
      videoContainer.innerHTML = `
          <h2>${item.courses}</h2>
          <p>${item.video.description}</p>
          <p>Tags: ${item.video.tags.join(", ")}</p>
          <p>Type: ${item.video.type}</p>
          <p><a href="${item.pdf.url}" target="_blank">View PDF</a></p>
          <video controls>
            <source src="${item.video.url}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
      document.body.appendChild(videoContainer);
      console.log("Appended video container to body with URL:", item.video.url);
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
