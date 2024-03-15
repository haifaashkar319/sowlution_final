const endpoint = 'https://staging-api.hellothematic.com/api/v2/projects/203691';
const endpoint2 = 'https://staging-api.hellothematic.com/api/v2/projects/203691/songs';

const authToken = '6f34994c9dcad2e80a44beae5f6a6e15';
saveAuthToken(authToken);
const savedToken = getAuthToken();

const headers = {
  "Authorization": `Bearer ${authToken}`
};

let updated_name;
let updated_description;

const songsTable = document.getElementById('songsTable');

fetch(endpoint2, {
  method: 'GET',
  headers: headers
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    data.items.forEach((song, index) => {
      const songRow = createSong(song, index);
      songsTable.appendChild(songRow);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

function createSong(song, index) {
  const songRow = document.createElement('tr');

  const imgCell = document.createElement('td');

  const img = document.createElement('img');
  img.src = song.album_art_thumbnail_url;
  imgCell.appendChild(img);
  songRow.appendChild(imgCell);
  img.classList.add("table_img");

  const nameCell = document.createElement('td');
  nameCell.textContent = song.name;
  nameCell.classList.add("song-title-table");
  songRow.appendChild(nameCell);
  nameCell.classList.add("table_title");

  const lineBreak = document.createElement('br');
  nameCell.appendChild(lineBreak);

  const artistText = document.createElement('span');
  artistText.textContent = song.artist_name;
  nameCell.appendChild(artistText);

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
  const dateAddedCell = document.createElement('td');
  const formattedDate = formatDate(song.created_at);
  dateAddedCell.textContent = formattedDate;
  songRow.appendChild(dateAddedCell);
  
  const durationCell = document.createElement('td');
  durationCell.textContent = song.duration;
  songRow.appendChild(durationCell);

  const removeCell = document.createElement('td'); // Create a table cell
  const removeButton = document.createElement('button'); // Create a button
  removeButton.textContent = "-"; // Set the text content of the button
  removeButton.addEventListener('click', function () {
    removeSong(song.id);
    songRow.remove(); // Remove the row from the table
  });
  removeCell.appendChild(removeButton); // Append the button to the table cell
  songRow.appendChild(removeCell);
  const downloadCell = document.createElement('td'); // Create a table cell
  const downloadButton = document.createElement('button'); // Create a button
  downloadButton.textContent = "⇩"; // Set the text content of the button
  downloadCell.appendChild(downloadButton); // Append the button to the table cell
  songRow.appendChild(downloadCell);



  return songRow;
}

let playlist;

fetch(endpoint, {
  method: 'GET',
  headers: headers
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    playlist = {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.songs[0].album_art_thumbnail_url
    };
    createPlaylistCard(playlist);

    console.log("Playlist:", playlist);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
let button_edit;
let popupModal; // Declare popupModal outside the scope of the DOMContentLoaded event listener

function createPlaylistCard(playlist) {
  const playlistContainer = document.querySelector('.playlist-container');
  const playlistImageDiv = document.createElement('div');
  playlistImageDiv.classList.add('playlist-image');
  const playlistImage = document.createElement('img');
  playlistImage.src = playlist.image;
  playlistImage.classList.add('playlist-image');
  playlistImageDiv.appendChild(playlistImage);

  const playlistDetailsDiv = document.createElement('div');
  playlistDetailsDiv.classList.add('playlist-details');

  // Create a span for the title and an input field for editing
  const titleSpan = document.createElement('div');
  titleSpan.textContent = "Playlist Name: ";
  const titleInput = document.createElement('input');
  titleInput.type = "text";
  titleInput.value = playlist.name;
  titleInput.classList.add('title-input'); // Add a custom class for styling

  titleInput.addEventListener('input', function () {
    // Update the playlist name when the input value changes
    playlist.name = this.value;
  });

  // Append the title span and input field to the details div
  playlistDetailsDiv.appendChild(titleSpan);
  playlistDetailsDiv.appendChild(titleInput);

  // Check if playlist.songs is defined before accessing its length property
  if (playlist.songs) {
    // Display the number of songs
    const songCount = playlist.songs.length;
    const songCountPara = document.createElement('p');
    songCountPara.textContent = songCount + " songs";
    playlistDetailsDiv.appendChild(songCountPara);
  }

  // Create a paragraph for the description
  const descriptionPara = document.createElement('p');
  descriptionPara.classList.add('description');
  descriptionPara.textContent = (playlist.description ? playlist.description : "This test playlist playlist from premium creator features the best copyright-free songs for YouTube videos, social media, and podcasts.");

  // Append the description paragraph to the details div
  playlistDetailsDiv.appendChild(descriptionPara);

  // Create the "Edit Description" button
  button_edit = document.createElement('button');
  button_edit.textContent = "Edit Description";
  button_edit.classList.add('edit');
  playlistDetailsDiv.appendChild(button_edit);

  // Create a div for the "Save Changes" button
  const saveChangesDiv = document.createElement('div');
  const saveChangesButton = document.createElement('button');
  saveChangesButton.textContent = "Save Changes";
  saveChangesButton.classList.add('savePlaylist');
  saveChangesButton.addEventListener('click', function () {
    updated_name = titleInput.value;
    updated_description = descriptionPara.textContent;
    updatePlaylist(playlist.id, { name: updated_name, description: updated_description });
  });
  saveChangesDiv.appendChild(saveChangesButton);
  playlistDetailsDiv.appendChild(saveChangesDiv);

  // Append elements to the playlist container
  playlistContainer.appendChild(playlistImageDiv);
  playlistContainer.appendChild(playlistDetailsDiv);

  // Call function to attach event listener to the "Edit Description" button
  createEditButton();
}



function createEditButton() {
  // Event listener for opening the modal when the button is clicked
  button_edit.addEventListener('click', function () {
    descriptionInput.value = playlist.description || ""; // Set the initial value to current description or empty string
    popupModal.style.display = "block"; // Open the modal
  });
}
document.addEventListener('DOMContentLoaded', function () {
  popupModal = document.getElementById('popupModal'); // Assign popupModal within the DOMContentLoaded event listener
  const closeModalBtn = document.getElementById('close');
  const saveDescriptionBtn = document.getElementById('saveDescriptionBtn');
  const descriptionInput = document.getElementById('descriptionInput');

  let modalInputValue = ""; // Variable to store the modal input value

  // Event listener for closing the popup modal when close button is clicked
  closeModalBtn.addEventListener('click', function () {
    popupModal.style.display = "none";
  });

  // Event listener for saving the edited description
  saveDescriptionBtn.addEventListener('click', function () {
    modalInputValue = descriptionInput.value; // Update the modal input value
    updated_description = modalInputValue; // Update updated_description with modal input value
    playlist.description = updated_description; // Update the playlist description
    // You can perform further actions like saving to backend or updating the UI here
    popupModal.style.display = "none"; // Close the modal after saving
  });

  // Event listener for closing the modal when clicking outside the modal content
  window.addEventListener('click', function (event) {
    if (event.target == popupModal) {
      popupModal.style.display = "none";
    }
  });

  // Set the modal input value to the stored value when the modal is opened
  popupModal.addEventListener('click', function () {
    descriptionInput.value = modalInputValue;
  });
});


let offset = 0; // Initial offset
const limit = 15; // Number of songs to fetch per request

// Initial fetch for the first set of songs
fetchSongs(offset, limit);

const showMoreButton = document.getElementById('showMoreButton');

showMoreButton.addEventListener('click', function () {
  offset += limit; // Increment offset by limit for the next fetch
  fetchSongs(offset, limit);
});

function fetchSongs(offset, limit) {
  fetch(endpoint2 + `?offset=${offset}&limit=${limit}`, {
    method: 'GET',
    headers: headers
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      if (data.items.length === 0) {
        // No more songs to fetch, hide the "Show More" button
        showMoreButton.style.display = 'none';
      } else {
        // Append fetched songs to the table
        data.items.forEach((song, index) => {
          const songRow = createSong(song, index);
          songsTable.appendChild(songRow);
        });
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const updatePlaylist = (projectId, updatedData) => {
  const endpoint = `https://staging-api.hellothematic.com/api/v2/projects/203691`;
  const headers = {
    "Authorization": "Bearer 6f34994c9dcad2e80a44beae5f6a6e15",
    "Content-Type": "application/json"
  };

  fetch(endpoint, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(updatedData) // Convert updatedData to JSON format
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to update playlist');
    }
    console.log('Playlist updated successfully');
    // Handle success response as needed
  })
  .catch(error => {
    console.error('Error updating playlist:', error);
    // Handle error response
  });
};
function removeSong(songId) {
  const projectId = 203691; // Replace with your project ID
  const endpoint = `https://staging-api.hellothematic.com/api/v2/projects/${projectId}/songs/${songId}`;
  const headers = {
    "Authorization": "Bearer 6f34994c9dcad2e80a44beae5f6a6e15"
  };

  fetch(endpoint, {
    method: 'DELETE',
    headers: headers
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to remove song');
    }
    console.log('Song removed successfully');
    // Handle success response as needed
  })
  .catch(error => {
    console.error('Error removing song:', error);
    // Handle error response
  });
}
function saveAuthToken(token) {
  sessionStorage.setItem('authToken', token);
}

// Function to get the authentication token from session storage
function getAuthToken() {
  return sessionStorage.getItem('authToken');
}

document.addEventListener('DOMContentLoaded', function () {
  const switchChannelBtn = document.getElementById('switchChannelBtn');
  const switchChannelModal = document.getElementById('switchChannelModal');
  const switchChannelClose = document.getElementById('switchChannelClose');

  // Event listener for opening the Switch Channel modal
  switchChannelBtn.addEventListener('click', function () {
    switchChannelModal.style.display = "block";
  });

  // Event listener for closing the Switch Channel modal
  switchChannelClose.addEventListener('click', function () {
    switchChannelModal.style.display = "none";
  });

  // Event listener for closing the modal when clicking outside the modal content
  window.addEventListener('click', function (event) {
    if (event.target == switchChannelModal) {
      switchChannelModal.style.display = "none";
    }
  });
});

