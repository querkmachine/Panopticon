Panopticon
==========

I wanted a really simple javascript carousel one day, so I knocked this out in a few hours.

**Features:**
* Responsive!
* BEM class names by default.
* Basic touch support.
* Backwards/forwards controls.
* Continuous scrolling (click next on the last slide to go back to the first, and vice versa).
* Support for multiple slides per page.

It's intended to be a simple starting point so that it can be hacked up and changed depending on the needs at the time. The focus is on simplicity rather than being feature rich or beautiful. 

Future features (maybe)
-----------------------
* Enhance touch support so the slider visibly moves.
* Automatically hide controls when there's only one slide.
* I dunno, probably some other stuff.

Changelog
---------

### 1.0.1 
* Fixed bug with touch controls no longer working. 

### 1.0
* Entire plugin has been refactored.
* Current 'pip' now has a selected class.
* Removed vertical alignment calculations for the time being. They're pretty buggy. 
* *BREAKING:* Some output HTML and class names have been changed. This will break existing styling.

### 0.3
* Added vertical alignment for slideshows with varying height.
* Added 'pips'.
* *BREAKING:* Renamed 'controls' option to 'arrows'.

### 0.2
* Converted to jQuery plugin.
* Added touch support.

### 0.1
* Initial commit.