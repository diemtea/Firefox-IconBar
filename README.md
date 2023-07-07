# Firefox-IconBar
 A Firefox extension for icon bookmarks, similar to Edge's sidebar.
 NOTE: In order to have the thin sidebar, you need to create/edit your _userChrome.css_ file.

## How to create/edit userChrome.css
1. Open Firefox, and in your url bar type **about:profiles** 
2. Look for the Profile that says _This is the profile in use ..._ and click the **Open Folder** of the **Root Directory** section
3. Open the **chrome** folder (create it if it doesn't exists)
4. Open **userChrome.css** or (create it if it doesn't exists)
5. Add the following code:
```
/* remove maximum/minimum width restriction of sidebar */
#sidebar-box {
  max-width: 60px !important;
  min-width: 60px !important;
  width: 60px !important;
}

/* Minimize sidebar header to a light blue stripe (except Bookmarks, History, Sync'd Tabs); appears normally on hover */
#sidebar-box:not([sidebarcommand="viewBookmarksSidebar"]):not([sidebarcommand="viewHistorySidebar"]):not([sidebarcommand="viewTabsSidebar"]) #sidebar-header:not(:hover) {
  max-height: 5px !important;
  min-height: 5px !important;
  padding: 0 !important;
  background-color: #7ad !important;
  opacity: 0.5 !important;
}

#sidebar-box:not([sidebarcommand="viewBookmarksSidebar"]):not([sidebarcommand="viewHistorySidebar"]):not([sidebarcommand="viewTabsSidebar"]) #sidebar-header:not(:hover) #sidebar-switcher-target {
  /* BAD NEWS: display: none !important; */
  opacity: 0 !important;
}

/* #sidebar-box[sidebarcommand="yourExtensionId"] .sidebar-header .close-icon { */
#sidebar-box .sidebar-header .close-icon {
  display: none !important;
}
```
6. Restart Firefox
