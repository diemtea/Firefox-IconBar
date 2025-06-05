# IconBar

![IconBar logo](https://addons.mozilla.org/user-media/addon_icons/2805/2805366-64.png?modified=07715e9d)

[IconBar](https://addons.mozilla.org/firefox/addon/iconbar/) is a Firefox Extension for displaying bookmark icons in a sidebar that seamlessly matches your browser's theme. You can also upload your own icons to customize it further.

The extension looks for bookmarks in the folder: `Other Bookmarks > IconBar`.

## Features

* **Responsive Layout:** Adjusts the number of icon columns based on the sidebar’s width.
* **Theme Sync:** Automatically matches the sidebar background to your Firefox theme and updates on theme changes.
* **Live Updates:** Monitors bookmark creation, removal, and changes, refreshing the sidebar in real time.

**New in v1.3:**

* **Drag & Drop:** Reorder your bookmarks directly in the sidebar via drag-and-drop.
* **Custom Context Menu:** Right-click any icon to quickly Upload or Reset its image.
* **Tooltips:** Hover an icon for 500 ms to see its bookmark title in a styled tooltip.

[Get this Extension for 🦊 Firefox](https://addons.mozilla.org/firefox/addon/iconbar/)

> **Note:** To use the thin sidebar width, edit your *userChrome.css* file.

---

## How to create/edit userChrome.css

1. Open Firefox, and in your URL bar type `about:profiles`

2. Find the profile labeled `This is the profile in use and it cannot be deleted` then click **Open Folder** under `Root Directory`

3. In that folder, open or create a `chrome` subfolder

4. Inside **chrome**, open or create `userChrome.css`

5. Add the following code:

   ```css
   /* remove maximum/minimum width restriction of IconBar */
   #sidebar-box:is([sidebarcommand="_9dba9848-1289-4662-ac96-487a72c7e9fe_-sidebar-action"]) {
     max-width: 60px !important;
     min-width: 60px !important;
     width: 60px !important;
   }

   /* Minimize IconBar header */
   #sidebar-box:is([sidebarcommand="_9dba9848-1289-4662-ac96-487a72c7e9fe_-sidebar-action"]) #sidebar-header {
     height: 0 !important;
     padding: 0 !important;
     margin: 0 !important;
     opacity: 0 !important;
   }

   /* Hide IconBar header */
   #sidebar-box:is([sidebarcommand="_9dba9848-1289-4662-ac96-487a72c7e9fe_-sidebar-action"]) #sidebar-header #sidebar-switcher-target {
     opacity: 0 !important;
   }
   ```

6. Enable userChrome.css loading:

   * In a new tab, go to `about:config` and accept the risk
   * Search for `toolkit.legacyUserProfileCustomizations.stylesheets`
   * Double-click it to set the value to `true`

7. Restart Firefox. Enjoy!
