# WebPIP

## INTRODUCTION
WebPIP allows multiple web pages to be displayed in full-screen PIP grids. It does not require additional external monitor or video card to achieve the same result.

There are two versions of WebPIP; web-based version and standalone version. Please choose either one of the versions depending on the preference.

![WebPIP 2x2 grid](https://raw.githubusercontent.com/ykhwong/webpip/master/resources/2x2_grid_example.png)

## USAGE
Download: https://github.com/ykhwong/webpip/releases

### Web-based version
For the web-based version, the only requirement is a modern web browser. Mainly tested with Google Chrome.
Simply download the web-version archive, extract it and run the index.html.

"WEB PIP CONFIGURATION" will be appeared as soon as the the WebPIP is executed.
The following can be specified:
* Default URL (Optional)
* Top-offset (Optional)
* Left-offset (Optional)
* Bottom-offset (Optional)
* Right-offset (Optional)
* Grid (Required)

Click "CREATE GRID" button to create the grid view.

### Standalone version
Standalone version does not require any web client.
Just download and run the executable. Currently tested on Microsoft Windows only.

"WEB PIP CONFIGURATION" will be appeared as soon as the the WebPIP is executed.
The following can be specified:
* Default URL (Optional)
* Y-offset (Optional)
* Grid (Required)

To save the current configurtaion, click "Set as default".
Click "CREATE GRID" button to create the grid view. Hit F11 key to go to the fullscreen.

## FEATURES

| Features | Standalone | Web-based | Note |
| ------------- | ------------- | ------------- | ------------- |
| Grids | 2x2 and 4x4 | 2x2 only |  |
| View | Webview | Innerframe |  |
| Offset | Y-offset only | Top, Left, Right, and Bottom | |
| Fullscreen per view | Supported | Not supported | |
| Chomre extensions | Supported | Supported | See below for details |

### Grids

Specifies how many grid views can be displayed. 2x2 gives the four web page view while 4x4 provides 16 web page view at once. The 4x4 grid is only supported on the standalone version.

### View

Views share data including cookies and sessions, but there are some differences by the version.

Standalone version is capable of using webview and combines multiple frameless windows into one main window. The multiple windows are all independent. For example, when a view enters the fullscreen mode or refreshes itself, the other views will not be affected.

On the other hand, web-based version places multiple inner frames into a single page. It means that the views can affect the other.

### Offset

Offsets are sometimes useful when portion of the elements needs to be hidden from the view.

For the standalone version, this feature will be always enabled regardless of the grid's fullscreen mode. Upon the vertical mouse-scroll, views can be moved vertically by the Y-offset size.

Web-based version also supports the offset(top, left, right, and bottom), but will work only in the fullscreen mode (for example, by pressing the F11 key).

### Chrome Extensions
For the standalone version, Chrome extensions will be automatically loaded by searching %APPDATA% on Microsoft Windows. For the web-baesd version, the extensions can be loaded if if Chromium-based browser is installed on the system.

## Q&A
Q1. There is a website that fails to load properly.

A1. Some websites send "X-Frame-Options: SAME ORIGIN" that prevents the browser from displaying innerframe or iframe which may be the issue.

* This problem does not occur in the standalone version.
* There are some Chrome extensions to resolve the issue when using web-based version.
  * https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe
  * https://chrome.google.com/webstore/detail/iframe-allow/gifgpciglhhpmeefjdmlpboipkibhbjg?hl=en

Q2. My website is dependent on the Chrome extensions which do not seem to work.

A2. For the standalone version, not all extensions are supported due to the Electron's limited API support. Please use the web-based version along with the Chromium-based web browser such as Chrome.

Q3. I have a multi-monitor environment with extended display enabled. Can I use the WebPIP for the non-primary display?

A3. Yes, please use the web-based version. Just move the position of the web browser window to the non-primary display and hit F11 key.
