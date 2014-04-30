Ext.filterField
===============

**Licensed under [cc by-sa 3.0](http://creativecommons.org/licenses/by-sa/3.0/) with attribution required**

Toolbar input field for better live grid filtering in ExtJS 4x



Use: 
---
`Ext.create('Ext.ux.FilterField')` ---or--- `xtype:'filterfield'`


Config: 
--
`emptyText: 'Filter...'` // text to display when field is empty
`grid: null`  // grid object/ref to filter- if field is within grid component (e.g. tbar/bbar), works out grid automatically
`buttons: true` // whether to include manual clear/filter buttons
`filterOnType: false` // whether to filter on keypress or when user presses enter

Methods:
--
`setValue(value)` // sets filter field value and filters
`getValue()` // gets filter field value

Events:
--
`filter(field,value,store)` // event fired on filter, can be listened to

