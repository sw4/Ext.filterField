/**
 * @Use: Ext.create('Ext.ux.FilterField') ---or--- xtype:'filterfield'
 * 
 * @Config: 
 * emptyText: 'Filter...' // text to display when field is empty
 * grid: null  // grid object/ref to filter- if field is within grid component (e.g. tbar/bbar), works out grid automatically
 * buttons: true // whether to include manual clear/filter buttons
 * filterOnType: false // whether to filter on keypress or when user presses enter
 * 
 * @Methods:
 * setValue(value) // sets filter field value and filters
 * getValue() // gets filter field value
 * 
 * @Events:
 * filter(field,value,store) // event fired on filter, can be listened to
 */
Ext.define("Ext.ux.FilterField", {
    extend: 'Ext.container.Container',
    alias: 'widget.filterfield',
    emptyText: 'Filter...',
    buttons: true,
    border: false,
    grid: null,
    filterIcon: 'resources/img/icons/magnifier.png',
    clearIcon: 'resources/img/icons/cross-script.png',
    filterOnType: false,
    doFilter: function (value) {
        var grid = this.grid || this.up('grid');
        var store = grid.getStore();

        value = value.toLowerCase();

        if (!value) {
            store.clearFilter();
            this.fireEvent('unfilter', this, value, store);
            return false;
        }

        value = (value.split(', ').length != 1) ? value.split(', ') : value.split(',');

        var columns = grid.getView().getHeaderCt().getVisibleGridColumns();
        var fields = [];
        Ext.each(columns, function (col) {
            fields.push(col.dataIndex);
        });
        store.clearFilter();
        store.filterBy(function (record) {
            var success = 0;
            Ext.each(value, function (term, index) {
                Ext.each(fields, function (dataIndex) {
                    term.trim() != '' && record.get(dataIndex).toLowerCase().indexOf(term) !== -1 && success++;
                });
            });
            return (success == value.length) ? true : false;
        });
        this.fireEvent('filter', this, value, store);
    },
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    flex: 1,
    afterFirstLayout: function () {
        var filterField = this;
        filterField.callParent(arguments);
        filterField.add(Ext.create('Ext.form.field.Text', {
            emptyText: filterField.emptyText,
            flex: 1,
            grow: true,
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER && !field.up('container').filterOnType) {
                        filterField.doFilter(field.getValue());
                    }
                },
                change: function (field, value) {
                    if (!value) {
                        filterField.doFilter(field.getValue());
                        Ext.each(filterField.query('button'), function (btn) {
                            btn.setDisabled(true);
                        });
                        return false;
                    } else {
                        filterField.filterOnType && filterField.doFilter(field.getValue());
                        Ext.each(filterField.query('button'), function (btn) {
                            btn.setDisabled(false);
                        });
                    }
                }
            }
        }));
        if (filterField.buttons) {
            filterField.add([{
                xtype: 'button',
                icon: filterField.filterIcon,
                disabled: true,
                margin: '0 0 0 2',
                handler: function () {
                    this.up('container').doFilter(this.up('container').down('textfield').getValue());
                }
            }, {
                xtype: 'button',
                icon: filterField.clearIcon,
                disabled: true,
                margin: '0 0 0 2',
                handler: function () {
                    this.up('container').down('textfield').setValue('');
                }
            }]);
        }
    },
    setValue: function (value) {
        this.down('textfield').setValue(value);
    },
    getValue: function () {
        return this.down('textfield').getValue();
    }
});
