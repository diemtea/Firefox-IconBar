// Get the bookmarks from the "IconsBar" folder and display them in the sidebar
function showBookmarks() {
  chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    var otherBookmarks = bookmarkTreeNodes[0].children.find(function (node) {
      return node.title === "Other Bookmarks";
    });

    if (otherBookmarks) {
      var iconsBarFolder = otherBookmarks.children.find(function (node) {
        return node.title === "IconsBar";
      });

      if (iconsBarFolder) {
        var bookmarks = iconsBarFolder.children;
        var sidebar = document.querySelector('.sidebar');

        sidebar.innerHTML = ''; // Clear previous content

        bookmarks.forEach(function (bookmark) {
          var listItem = document.createElement('li');
          var bookmarkLink = document.createElement('a');
          bookmarkLink.href = bookmark.url;

          var favicon = document.createElement('img');
          favicon.src = "https://www.google.com/s2/favicons?sz=64&domain_url=" + bookmark.url;
          favicon.alt = "Favicon";
          favicon.style.width = '25px';
          favicon.style.height = '25px';
          bookmarkLink.appendChild(favicon);

          listItem.appendChild(bookmarkLink);
          sidebar.appendChild(listItem);
        });
      } else {
        var sidebar = document.querySelector('.sidebar');
        sidebar.textContent = "IconsBar folder not found";
      }
    } else {
      var sidebar = document.querySelector('.sidebar');
      sidebar.textContent = "Other Bookmarks folder not found";
    }
  });
}

// Add the active page as a bookmark to the "IconsBar" folder
function addBookmark() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    var bookmarkData = {
      parentId: "toolbar_____",
      title: activeTab.title,
      url: activeTab.url
    };
    chrome.bookmarks.create(bookmarkData, function (bookmark) {
      console.log('Bookmark added:', bookmark);
    });
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
