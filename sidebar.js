// Get the bookmarks from the "IconBar" folder and display them in the sidebar
function showBookmarks() {
  chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
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
          var bookmarkLink = document.createElement('a');
          bookmarkLink.href = bookmark.url;

          var favicon = document.createElement('img');
          favicon.src = "https://www.google.com/s2/favicons?sz=32&domain_url=" + bookmark.url;
          favicon.alt = "Favicon";
          favicon.style.width = '20px';
          favicon.style.height = '20px';
          bookmarkLink.appendChild(favicon);

          listItem.appendChild(bookmarkLink);

          // Show bookmark title on hover
          listItem.title = bookmark.title;

          sidebar.appendChild(listItem);
        });
      } else {
        var sidebar = document.querySelector('.sidebar');
        sidebar.textContent = "IconBar folder not found";
      }
    } else {
      var sidebar = document.querySelector('.sidebar');
      sidebar.textContent = "Other Bookmarks folder not found";
    }
  });
}

// Load bookmarks when the sidebar is opened
document.addEventListener('DOMContentLoaded', function () {
  var sidebar = document.querySelector('.sidebar');
  sidebar.textContent = 'Loading bookmarks...';

  showBookmarks();
});

// Listen for new bookmark creation
chrome.bookmarks.onCreated.addListener(function () {
  var sidebar = document.querySelector('.sidebar');
  sidebar.textContent = 'Loading bookmarks...';

  showBookmarks();
});

// Listen for bookmark deletion
chrome.bookmarks.onRemoved.addListener(function () {
  var sidebar = document.querySelector('.sidebar');
  sidebar.textContent = 'Loading bookmarks...';

  showBookmarks();
});

// Listen for bookmark modification
chrome.bookmarks.onChanged.addListener(function () {
  var sidebar = document.querySelector('.sidebar');
  sidebar.textContent = 'Loading bookmarks...';

  showBookmarks();
});