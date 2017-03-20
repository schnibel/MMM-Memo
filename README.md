# MMM-Memo
This an extension for the [MagicMirror²](https://magicmirror.builders/).
<br>This Module is used to add one to many memo notes on your Magic Mirror.
<br>Content is manageable through HTTP get requests.

## What does it look like
![alt tag](https://github.com/schnibel/MMM-Memo/blob/master/img/MMM-Memo.png)

## Dependencies
  * An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/schnibel/MMM-Memo.git
````

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
    {
        module: 'MMM-Memo',
        position: 'top_left',
        classes: 'default everyone',        // if using MMM-ProfileSwitcher module
        config: {
            // See 'Configuration options' for more information.
            ...
        }
    }
]
````
If you declare several modules in the `config/config.js` file, you will get several memo notes on your MagicMirror<sup>2</sup> profile.

## Configuration options

The following properties can be configured:

| Option                     | Description
| -------------------------- | -----------
| `memoTitle`                | [MANDATORY]<br>Title of the memo note.<br>This title is also used to retreive memos from the persistence file.<br><br> **This is NOT case sensitive**
| `memoMaxItems`             | [OPTIONAL]<br>Integer used to define the maximum number of memo to display per note.<br>If the number of memos is greater than the one specified here, a message (e.g. `+ 2 more memos`) will be displayed at the bottom of the note.<br><br> **Default value:** `5`
| `memoMaxMsgSize`           | [OPTIONAL]<br>Integer used to define the maximum number of characters to be displayed per memo.<br><br> **Default value:** `false` (It will show all characters)
| `memoDisplayDuration`      | [OPTIONAL]<br>Used to show since when memos have been created.<br><br> **Possible values:** `true` or `false`<br> **Default value:** `false`
| `memoDisplayIfEmpty`       | [OPTIONAL]<br>Used to display (or not) an empty note if there is no memo inside.<br><br> **Possible values:** `true` or `false`<br> **Default value:** `false`
| `memoDisplayId`            | [OPTIONAL]<br>Used to display (or not) a number before each memo. This number is necessary to remove a memo.<br><br>** Note that this unicode character is limited to 20 **<br><br> **Possible values:** `true` or `false`<br> **Default value:** `true`
| `memoDisplayHeader`        | [OPTIONAL]<br>Used to display (or not) the memoTitle at the top of the note.<br><br> **Possible values:** `true` or `false`<br> **Default value:** `true`
| `memoColorBackground`      | [OPTIONAL]<br>Used to define the color of the note.<br><br> **Possible values:** See [Colors](#colors) for more information.<br> **Default value:** `Yellow`
| `memoColorHeader`          | [OPTIONAL]<br>Used to define the color of the header (if displayed).<br><br> **Possible values:** See [Colors](#colors) for more information.<br> **Default value:** `Black`
| `memoColorFont`            | [OPTIONAL]<br>Used to define the color of the memo font.<br><br> **Possible values:** See [Colors](#colors) for more information.<br> **Default value:** `Black`
| `memoColorWarning`         | [OPTIONAL]<br>Used to define the color of a WARNING note.<br><br> **Possible values:** See [Colors](#colors) for more information.<br> **Default value:** `Red`
| `memoRotation`             | [OPTIONAL]<br>Used to rotate the note.<br><br> **Possible values:** `-10` or `-8` or `-6` or `-4` or `-2` or `0` or `2` or `4` or `6` or `8` or `10`<br> **Default value:** `0`
| `memoWidth`                | [OPTIONAL]<br>Value to specify the width of the note.<br><br> **Default value:** `100px`
| `memoHeight`               | [OPTIONAL]<br>Value to specify the height of the note.<br><br> **Default value:** `100px`
| `memoPadding`              | [OPTIONAL]<br>Value to specify the padding of the note.<br><br> **Default value:** `20px`
| `format`                   | [OPTIONAL]<br>Displays relative date format, for absolute date format provide a string like `'DD:MM HH:mm'` [All Options](http://momentjs.com/docs/#/displaying/format/)



## How to Use

I'm using this module with my Jarvis installation from [DomotiqueFacile](http://domotiquefacile.fr/jarvis/).
<br>When I speak to Jarvis, I say for example : "add FRUITS to the SHOPPING memo list", and Jarvis automatically sends a HTTP get request to the MMM-Memo module.
<br><br>The available HTTP get requests are the following at the moment:

### To add `Fruits` to the `Shopping` memo note:
````
http://MIRROR_IP:MIRROR_PORT/AddMemo?memoTitle=SHOPPING&item=Fruits&level=INFO
````

### To add `Daddy: +33123456789` to the `Phone Numbers` memo note with a WARNING level:
````
http://MIRROR_IP:MIRROR_PORT/AddMemo?memoTitle=phone%20numbers&item=Daddy%3A%20%2B33123456789&level=WARNING
````

### To remove the second displayed memo of the `Phone Numbers` memo note:
````
http://MIRROR_IP:MIRROR_PORT/RemoveMemo?memoTitle=phone%20numbers&item=2
````

### To remove ALL memos of the `Phone Numbers` memo note:
````
http://MIRROR_IP:MIRROR_PORT/RemoveMemo?memoTitle=phone%20numbers&item=ALL
````

### To temporary display the second memo of the `Shopping` memo note. It will be useful for cut memos:
This HTTP request is <b>NOT YET IMPLEMENTED</b>
````
http://MIRROR_IP:MIRROR_PORT/DisplayMemo?memoTitle=SHOPPING&item=2
````

### To temporary display ALL memos of the `Shopping` memo note. It will be useful when a note does not display all memos:
This HTTP request is <b>NOT YET IMPLEMENTED</b>
````
http://MIRROR_IP:MIRROR_PORT/DisplayMemo?memoTitle=SHOPPING&item=ALL
````


## Colors
Here are the available colors.
### Whites / Pastels
![alt tag](https://github.com/schnibel/MMM-Memo/blob/master/img/MMM-Memo-Whites.png)

### Grays
![alt tag](https://github.com/schnibel/MMM-Memo/blob/master/img/MMM-Memo-Grays.png)

### Blues
![alt tag](https://github.com/schnibel/MMM-Memo/blob/master/img/MMM-Memo-Blues.png)

### Greens
![alt tag](https://github.com/schnibel/MMM-Memo/blob/master/img/MMM-Memo-Greens.png)

### Yellows
![alt tag](https://github.com/schnibel/MMM-Memo/blob/master/img/MMM-Memo-Yellows.png)

### Browns
![alt tag](https://github.com/schnibel/MMM-Memo/blob/master/img/MMM-Memo-Browns.png)

### Oranges
![alt tag](https://github.com/schnibel/MMM-Memo/blob/master/img/MMM-Memo-Oranges.png)

### Pinks / Violets
![alt tag](https://github.com/schnibel/MMM-Memo/blob/master/img/MMM-Memo-Pinks.png)




## Special Thanks
- [Michael Teeuw](https://github.com/MichMich) for creating the awesome [MagicMirror2](https://github.com/MichMich/MagicMirror/tree/develop) project that made this module possible.
- [Paviro](https://github.com/paviro) for creating the [MMM-Syslog](https://github.com/paviro/MMM-syslog) module that I used as guidance in creating this module.
- [Taylored Marketing](http://www.tayloredmktg.com/rgb/#PI) for colors definition.
- [Creative Punch](http://creative-punch.net/2014/02/create-css3-post-it-note/), for the memo note CSS creation.
<br><br>Enjoy... and do not hesitate to make comments or propose new functionalities.
