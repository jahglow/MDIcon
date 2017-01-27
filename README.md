## MDIcon ([API docs](https://jahglow.github.io/MDIcon))
`MDIcon` is a React component that returns a JSX for the SVG icon that you may configure with properties:
* `icon` - imported icon definition (jsx) - this is where this tool comes handy, it lets you import, destructure and use icon definitions here.
* `children` - imported icon definition (jsx) if you prefer using children and a closing tag in JSX rather than an icon attribute
* `size` - **[Number,optional] default(`24`)** icon width/height (which equals height since all MD icons have square viewbox). Any of `18|24|36|48` is advised
* `fill` - **[String,optional] default(`rgba(0,0,0,.85)`)** imported icon definition (jsx) if you prefer using children and a closing tag in JSX rather than an icon attribute

### Installation

Type `npm install --save jahglow/MDIcon` in your terminal.

## Material Icons: [React Import Generator](https://jahglow.github.io/MDIcon/constructor)

This is an Import Generator that makes using Google Material Icons easy. Instead of going to [their site](https://material.io/icons) and downloading one icon at a time every time you need to include it in your project,
use this tool that will return you a valid code for importing only necessary icons in your project as well as a bundle with the icons you select. This can be achieved in four simple steps:

1. Select all icons you need for your project</li>
2. In the bottom sheet specify the path from root where you'll place the icons bundle. Note that the path is relative to the document where you'll use the icons.</li>
3. Click the <code>download</code> icon to download the bundle. Place it according to the path you've specified in step 2.</li>
4. Click the <code>copy</code> icon to copy the import code. Paste it into your file where you'll use the icons. We've already destructured the import for you</li>

If you want to see what it exactly looks like from inside in ES6, then press a code button next to each section. If you feel like this project is outdated (there are missing icons that are available on
[MD icons site](https://material.io/icons)) then feel free to fork it and press the download button next to the section you want to update. It will initiate a download for the file that you may
replace the outdated one with at `/src/icons/`.

If you want to  host the same util in your fork on gh-pages with the updated icons, when you build the project make sure you include
`constructor.bundle.js` and `MDIcon.css` into the `/docs/MDIcon/[version_number]/constructor`.

