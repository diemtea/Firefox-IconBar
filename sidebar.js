// sidebar.js

// Prevent horizontal scroll caused by tooltips and context menu
document.documentElement.style.overflowX = 'hidden';

//---------------------------------
// Tooltip Element
//---------------------------------
const tooltip = document.createElement('div');
tooltip.id = 'icon-tooltip';
Object.assign(tooltip.style, {
  position: 'fixed',
  background: 'rgba(0,0,0,0.8)',
  color: '#fff',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  pointerEvents: 'none',
  opacity: '0',
  transition: 'opacity 0.2s ease',
  whiteSpace: 'nowrap',
  zIndex: '10001'
});
document.body.appendChild(tooltip);

//---------------------------------
// Reset Favicon to Default
//---------------------------------
function resetFavicon(favicon, bookmarkUrl) {
  favicon.src = `https://www.google.com/s2/favicons?sz=32&domain_url=${bookmarkUrl}`;
  chrome.storage.local.remove(bookmarkUrl);
}

//---------------------------------
// Show Bookmarks in Sidebar
//---------------------------------
let currentFolderId = null;

function showBookmarks() {
  chrome.bookmarks.getTree(nodes => {
    const sidebar = document.querySelector('.sidebar');
    try {
      const other = nodes[0].children.find(n => n.title === 'Other Bookmarks');
      if (!other) {
        sidebar.textContent = 'Other Bookmarks folder not found';
        return;
      }
      const iconBarFolder = other.children.find(n => n.title === 'IconBar');
      if (!iconBarFolder) {
        sidebar.textContent = 'IconBar folder not found';
        return;
      }

      currentFolderId = iconBarFolder.id;
      sidebar.innerHTML = '';

      iconBarFolder.children.forEach(bookmark => {
        const li = document.createElement('li');
        li.draggable = true;
        li.dataset.bookmarkId = bookmark.id;
        li.dataset.bookmarkUrl = bookmark.url;
        li.dataset.title = bookmark.title;

        chrome.storage.local.get([bookmark.url], result => {
          // Favicon
          const favicon = document.createElement('img');
          favicon.src = result[bookmark.url] ||
            `https://www.google.com/s2/favicons?sz=32&domain_url=${bookmark.url}`;
          favicon.alt = 'Favicon';
          Object.assign(favicon.style, { width: '20px', height: '20px' });
          favicon.addEventListener('click', () => {
            chrome.tabs.create({ url: bookmark.url });
          });
          li.appendChild(favicon);

          // Upload Button
          const uploadBtn = document.createElement('button');
          uploadBtn.textContent = 'Upload';
          uploadBtn.classList.add('btn', 'upload-btn');
          uploadBtn.style.display = 'none';
          li.appendChild(uploadBtn);

          // Reset Button
          const resetBtn = document.createElement('button');
          resetBtn.textContent = 'Reset';
          resetBtn.classList.add('btn', 'reset-btn');
          resetBtn.style.display = 'none';
          li.appendChild(resetBtn);

          //---------------------------------
          // Drag & Drop Handlers
          //---------------------------------
          li.addEventListener('dragstart', e =>
            e.dataTransfer.setData('text/plain', bookmark.id)
          );
          li.addEventListener('dragover', e => {
            e.preventDefault();
            li.classList.add('drag-over');
          });
          li.addEventListener('dragleave', () =>
            li.classList.remove('drag-over')
          );
          li.addEventListener('drop', e => {
            e.preventDefault();
            li.classList.remove('drag-over');
            const draggedId = e.dataTransfer.getData('text/plain');
            if (draggedId === bookmark.id) return;
            const items = Array.from(sidebar.querySelectorAll('li'));
            const targetIdx = items.findIndex(
              item => item.dataset.bookmarkId === bookmark.id
            );
            chrome.bookmarks.move(
              draggedId,
              { parentId: currentFolderId, index: targetIdx },
              showBookmarks
            );
          });

          //---------------------------------
          // Tooltip Handlers
          //---------------------------------
          let tipTimer;
          li.addEventListener('mouseenter', () => {
            tipTimer = setTimeout(() => {
              tooltip.textContent = bookmark.title;
              const rect = li.getBoundingClientRect();
              document.body.appendChild(tooltip);
              const tipRect = tooltip.getBoundingClientRect();

              let top = rect.top - tipRect.height - 5;
              if (top < 0) top = rect.bottom + 5;

              let left = rect.left;
              if (left + tipRect.width > window.innerWidth) {
                left = window.innerWidth - tipRect.width - 5;
              }
              if (left < 5) left = 5;

              tooltip.style.top = `${top}px`;
              tooltip.style.left = `${left}px`;
              tooltip.style.opacity = '1';
            }, 500);
          });
          li.addEventListener('mouseleave', () => {
            clearTimeout(tipTimer);
            tooltip.style.opacity = '0';
          });

          //---------------------------------
          // Upload Logic
          //---------------------------------
          uploadBtn.addEventListener('click', e => {
            e.stopPropagation();
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';
            input.onchange = evt => {
              const file = evt.target.files[0];
              const reader = new FileReader();
              reader.onload = ev => {
                const img = new Image();
                img.src = ev.target.result;
                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  const maxD = 50;
                  let { width, height } = img;
                  if (width > height) {
                    if (width > maxD) { height *= maxD/width; width = maxD; }
                  } else {
                    if (height > maxD) { width *= maxD/height; height = maxD; }
                  }
                  canvas.width = width;
                  canvas.height = height;
                  ctx.drawImage(img, 0, 0, width, height);
                  const dataUrl = canvas.toDataURL('image/png');
                  const sizeKB = (dataUrl.length * 3) / 4 / 1024;
                  if (sizeKB <= 100) {
                    favicon.src = dataUrl;
                    chrome.storage.local.set({ [bookmark.url]: dataUrl });
                  } else {
                    alert('Icon too large – choose a smaller file.');
                  }
                };
              };
              reader.readAsDataURL(file);
            };
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
          });

          //---------------------------------
          // Reset Logic
          //---------------------------------
          resetBtn.addEventListener('click', e => {
            e.stopPropagation();
            resetFavicon(favicon, bookmark.url);
          });

          sidebar.appendChild(li);
        });
      });
    } catch (err) {
      console.error('Error retrieving bookmarks:', err);
    }
  });
}

//---------------------------------
// Theme Application
//---------------------------------
function applyTheme() {
  browser.theme.getCurrent().then(theme => {
    if (theme.colors?.frame) {
      document.body.style.backgroundColor = theme.colors.frame;
    }
  });
}

//---------------------------------
// Context Menu with Undoable Delete
//---------------------------------
function setupContextMenu() {
  const menu       = document.getElementById('context-menu');
  const uploadItem = document.getElementById('ctx-upload');
  const resetItem  = document.getElementById('ctx-reset');
  const deleteItem = document.getElementById('ctx-delete');
  if (!menu || !uploadItem || !resetItem || !deleteItem) {
    console.error('Context-menu elements missing');
    return;
  }

  let currentLi = null;

  document.querySelector('.sidebar').addEventListener('contextmenu', e => {
    const li = e.target.closest('li');
    if (!li) return;
    e.preventDefault();
    currentLi = li;

    // Position menu with edge-awareness
    const clickX = e.clientX;
    const clickY = e.clientY;
    menu.classList.remove('hidden');
    menu.style.top = '0';
    menu.style.left = '0';

    const { width, height } = menu.getBoundingClientRect();
    let top = clickY;
    let left = clickX;
    if (top + height > window.innerHeight) top = clickY - height;
    if (left + width > window.innerWidth) left = window.innerWidth - width - 5;
    if (top < 5) top = 5;
    if (left < 5) left = 5;

    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
  });

  document.addEventListener('click', () => {
    menu.classList.add('hidden');
  });

  uploadItem.addEventListener('click', () => {
    menu.classList.add('hidden');
    currentLi?.querySelector('.upload-btn')?.click();
  });

  resetItem.addEventListener('click', () => {
    menu.classList.add('hidden');
    currentLi?.querySelector('.reset-btn')?.click();
  });

  deleteItem.addEventListener('click', () => {
    menu.classList.add('hidden');
    const bmId = currentLi?.dataset.bookmarkId;
    if (!bmId) return;

    chrome.bookmarks.get(bmId, nodes => {
      const bm = nodes[0];
      const { parentId, index } = bm;
      const liElement = currentLi;

      // Create placeholder with SVG undo icon
      const placeholder = document.createElement('li');
      placeholder.classList.add('placeholder');
      Object.assign(placeholder.style, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.1)',
        transition: 'opacity 0.5s ease'
      });

      const undoBtn = document.createElement('button');
      undoBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="#e74c3c">
          <path d="M12 5V1L8 5l4 4V6c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.14-7-7h2
                   a5 5 0 0010 0c0-2.76-2.24-5-5-5z"/>
        </svg>`;
      undoBtn.classList.add('btn', 'undo-btn');
      placeholder.appendChild(undoBtn);

      liElement.replaceWith(placeholder);

      // Schedule permanent deletion after 2s
      const timer = setTimeout(() => {
        placeholder.style.opacity = '0';
        placeholder.addEventListener(
          'transitionend',
          () => {
            chrome.bookmarks.remove(bmId);
            placeholder.remove();
          },
          { once: true }
        );
      }, 2000);

      // Undo: restore this exact <li>
      undoBtn.addEventListener('click', () => {
        clearTimeout(timer);
        placeholder.replaceWith(liElement);
      });
    });
  });
}

//---------------------------------
// Initialization
//---------------------------------
document.addEventListener('DOMContentLoaded', () => {
  showBookmarks();
  applyTheme();
  setupContextMenu();
});

// Listen for bookmark changes
chrome.bookmarks.onCreated.addListener(showBookmarks);
chrome.bookmarks.onRemoved.addListener(showBookmarks);
chrome.bookmarks.onChanged.addListener(showBookmarks);

// Listen for theme updates
browser.theme.onUpdated.addListener(applyTheme);
