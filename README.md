# Firefox IconBar
 A Firefox extension for displaying bookmark icons in a sidebar that seamlessly matches your browser's theme. You can also upload your own icons to customize it further. Will look for bookmarks in the folder: **Other Bookmarks > IconsBar**

 [https://addons.mozilla.org/en-US/firefox/addon/iconbar/](https://addons.mozilla.org/en-US/firefox/addon/iconbar/)
 
 NOTE: In order to have the thin sidebar, you need to create/edit your _userChrome.css_ file.
 
 ![alt text](https://addons.mozilla.org/user-media/previews/full/314/314692.png?modified=1740251192)

## How to create/edit userChrome.css
1. Open Firefox, and in your url bar type **about:profiles**
   
2. Look for the Profile that says _"This is the profile in use and it cannot be deleted."_ and click the **Open Folder** of the **Root Directory** section
   
3. Open the **chrome** folder (create it if it doesn't exists)
   
4. Open **userChrome.css** inside the **chrome** folder (create it if it doesn't exists)
   
5. Add the following code:
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

6. Set Firefox to look for userChrome.css at startup:
In a new tab, type or paste **about:config** in the address bar and press Enter/Return. Click the button accepting the risk.
In the search box above the list, type or paste **userprof** and pause while the list is filtered.
Double-click the **toolkit.legacyUserProfileCustomizations.stylesheets** preference to switch the value from false to **true**.

7. Restart Firefox
