// Get the bookmarks from the "IconBar" folder and display them in the sidebar
function showBookmarks() {
  chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    try {
      var otherBookmarks = bookmarkTreeNodes[0].children.find(function (node) {
        return node.title === "Other Bookmarks";
      });

      if (otherBookmarks) {
        var IconBarFolder = otherBookmarks.children.find(function (node) {
          return node.title === "IconBar";
        });

        if (IconBarFolder) {
          var bookmarks = IconBarFolder.children;
          var sidebar = document.querySelector('.sidebar');

          sidebar.innerHTML = ''; // Clear previous content

          bookmarks.forEach(function (bookmark) {
            var listItem = document.createElement('li');

            // Check if there's a stored favicon for this bookmark
            chrome.storage.local.get([bookmark.url], function (result) {
              var favicon = document.createElement('img');

              if (result[bookmark.url]) {
                // Use the stored favicon if it exists
                favicon.src = result[bookmark.url];
              } else {
                // Otherwise, use the default favicon from Google API
                favicon.src = "https://www.google.com/s2/favicons?sz=32&domain_url=" + bookmark.url;
              }

              favicon.alt = "Favicon";
              favicon.style.width = '20px';
              favicon.style.height = '20px';

              // Make the bookmark icon clickable
              favicon.addEventListener('click', function () {
                chrome.tabs.create({ url: bookmark.url });
              });

              listItem.appendChild(favicon);

              // Create upload button
              var uploadButton = document.createElement('button');
              uploadButton.textContent = "Upload";
              uploadButton.style.display = "none"; // Initially hide the button
              listItem.appendChild(uploadButton);

              // Create reset button
              var resetButton = document.createElement('button');
              resetButton.textContent = "Reset";
              resetButton.style.display = "none"; // Initially hide the button
              listItem.appendChild(resetButton);

              // Show buttons when hovering over the bookmark icon after a delay
              var hoverTimer;
              listItem.addEventListener('mouseenter', function () {
                hoverTimer = setTimeout(function () {
                  uploadButton.style.display = "inline-block";
                  resetButton.style.display = "inline-block";
                  favicon.style.display = "none"; // Hide the bookmark icon
                }, 1000);
              });

              listItem.addEventListener('mouseleave', function () {
                clearTimeout(hoverTimer);
                uploadButton.style.display = "none";
                resetButton.style.display = "none";
                favicon.style.display = "inline-block"; // Show the bookmark icon
              });

              // Handle upload button click
              uploadButton.addEventListener('click', function () {
                var fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*'; // Allow only image files
                fileInput.style.display = 'none'; // Hide the file input
                fileInput.addEventListener('change', function (event) {
                  var file = event.target.files[0];
                  var reader = new FileReader();
                  reader.onload = function (e) {
                    var img = new Image();
                    img.src = e.target.result;

                    img.onload = function () {
                      // Create a canvas element to resize and compress the image
                      var canvas = document.createElement('canvas');
                      var ctx = canvas.getContext('2d');

                      // Resize the image if it exceeds a certain dimension (e.g., 50px x 50px)
                      var maxDimension = 50; // Max width or height
                      var width = img.width;
                      var height = img.height;

                      // Calculate the scaling factor to maintain aspect ratio
                      if (width > height) {
                        if (width > maxDimension) {
                          height = height * (maxDimension / width);
                          width = maxDimension;
                        }
                      } else {
                        if (height > maxDimension) {
                          width = width * (maxDimension / height);
                          height = maxDimension;
                        }
                      }

                      // Set canvas size to the new dimensions
                      canvas.width = width;
                      canvas.height = height;

                      // Draw the resized image on the canvas
                      ctx.drawImage(img, 0, 0, width, height);

                      // Get the resized image as a PNG to preserve transparency
                      var resizedImage = canvas.toDataURL('image/png');

                      // Check if the resized image fits within the storage limit
                      var imageSize = resizedImage.length * 3 / 4 / 1024; // Size in KB

                      if (imageSize <= 100) {
                        // Store the resized image URL in storage
                        favicon.src = resizedImage;
                        favicon.style.display = "inline-block"; // Show the favicon
                        chrome.storage.local.set({ [bookmark.url]: resizedImage });
                      } else {
                        alert('The image is too large to store. Please upload a smaller file.');
                      }
                    };
                  };

                  reader.readAsDataURL(file);
                });

                document.body.appendChild(fileInput); // Append file input to document
                fileInput.click(); // Trigger click event programmatically
                document.body.removeChild(fileInput); // Remove file input from document
              });

              // Handle reset button click
              resetButton.addEventListener('click', function (event) {
                event.stopPropagation(); // Prevent click event on favicon
                resetFavicon(favicon, bookmark.url);
              });

              sidebar.appendChild(listItem);
            });
          });
        } else {
          var sidebar = document.querySelector('.sidebar');
          sidebar.textContent = "IconBar folder not found";
        }
      } else {
        var sidebar = document.querySelector('.sidebar');
        sidebar.textContent = "Other Bookmarks folder not found";
      }
    } catch (error) {
      console.error("Error retrieving bookmarks:", error);
    }
  });
}

// Function to reset the favicon to default
function resetFavicon(favicon, bookmarkUrl) {
  favicon.src = "https://www.google.com/s2/favicons?sz=32&domain_url=" + bookmarkUrl;
  // Remove the stored favicon URL from storage
  chrome.storage.local.remove(bookmarkUrl);
}

// Load bookmarks when the sidebar is opened
document.addEventListener('DOMContentLoaded', function () {
  var sidebar = document.querySelector('.sidebar');
  sidebar.textContent = 'Loading bookmarks...';

  showBookmarks();
});

// Listen for new bookmark creation, deletion, and modification
chrome.bookmarks.onCreated.addListener(showBookmarks);
chrome.bookmarks.onRemoved.addListener(showBookmarks);
chrome.bookmarks.onChanged.addListener(showBookmarks);

function applyTheme() {
  browser.theme.getCurrent().then((theme) => {
    if (theme.colors && theme.colors.frame) {
      document.body.style.backgroundColor = theme.colors.frame;
    }
  });
}

// Apply the theme when the sidebar loads
document.addEventListener("DOMContentLoaded", applyTheme);

// Listen for theme changes
browser.theme.onUpdated.addListener(applyTheme);
