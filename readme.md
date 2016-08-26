# Version 0.0.1 alpha.  It's barely real.

## TL;DR

This code takes a table that you feed it (feed it with an ID attribute) and mashes it up into a mobile version if the
plugin detects a mobile experience.  Be warned.  This is a work in progress.  Just be warned.

## Code Example

Add the `script` to the project.
```
<script src="pocketTableBuilder.js"></script>
```

Call the class to initialze by using the table's `ID`.
```
var mobileTable = new MobileTable('PricingDetails');
mobileTable.run();
```

The plugin will auto detect whether or not the environment is mobile or not.  Keep in mind, it looks for user agents.
If the mobile environment is detected, the plugin will build a mobile version of your table based on the data in the
desktop version of the table.

This script could take a while to load the data depending on how heavy your table is.  Perhaps you could add your script
to a Web Worker to keep things rolling smoothly.

## Installation

Fork the project or download a zip, include it in your project and start mashing tables.

## License

MIT License included.  Share this code, improve on this code, have fun with this code, print it and burn it.