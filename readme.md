# Version 0.0.1 alpha.  It's barely real.

## TL;DR

This code takes a table that you feed it (feed it with an ID attribute) and mashes it up into a mobile version if the
plugin detects a mobile experience.  Be warned.  This is a work in progress.  Just be warned.

## Code Example

Include the `stylesheet` in your project (TODO: Make a stylesheet).
```<link rel="stylesheet" href="pocketTableBuilder.min.css">```

Add the `script` to the project along with jQuery.
```
<script src="https://code.jquery.com/jquery-2.2.4.min.js"
        integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
        crossorigin="anonymous">
</script>
<script src="pocketTableBuilder.js"></script>
```

Initialize the plugin on your table element using the table's `ID`.
```
$(function () {
    $('#PricingDetails').pocketTableBuilder();
});
```

The plugin will auto detect whether or not the environment is mobile or not.  Keep in mind, it looks for user agents.
If the mobile environment is detected, the plugin will build a mobile version of your table based on the data in the
desktop version of the table.

## Installation

Fork the project or download a zip, include it in your project and start mashing tables.

## License

MIT License included.  Share this code, improve on this code, have fun with this code, print it and burn it.