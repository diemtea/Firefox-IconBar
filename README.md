# Firefox-IconBar
 A Firefox extension for icon bookmarks, similar to Edge's sidebar. Will look for bookmarks in the folder: **Other Bookmarks > IconsBar**
 [https://addons.mozilla.org/en-US/firefox/addon/iconbar/](https://addons.mozilla.org/en-US/firefox/addon/iconbar/)
 
 ![alt text](https://addons.mozilla.org/user-media/previews/full/284/284649.png "IconBar Preview")
 
 NOTE: In order to have the thin sidebar, you need to create/edit your _userChrome.css_ file.

## How to create/edit userChrome.css
1. Open Firefox, and in your url bar type **about:profiles**
   
3. Look for the Profile that says _"This is the profile in use and it cannot be deleted."_ and click the **Open Folder** of the **Root Directory** section
   
5. Open the **chrome** folder (create it if it doesn't exists)
   
7. Open **userChrome.css** inside the **chrome** folder (create it if it doesn't exists)
   
9. Add the following code:
```
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

6. Restart Firefox
