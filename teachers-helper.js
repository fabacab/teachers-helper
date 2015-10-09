var Student = function (node) {
    this.node = node;
    this.display_name = '';
    this.points = 0;
    this.present = false;
    this.hilite_color = '#000';
    this.notes = '';
};

Student.prototype.randomizeProperties = function () {
    this.display_name = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    this.points = Math.floor(Math.random() * (10 - 0 + 1)) + 0;
    this.present = Math.random() > .5;
};

Student.prototype.redraw = function () {
    jQuery(this).attr('data-present', this.student.present);
    jQuery(this).find('.display-name').text(this.student.display_name);
    jQuery(this).find('.points').text(this.student.points);
};

/**
 * Toggles the "present/absent" status of a student.
 * I.e., if a student is "present," this function will
 * handle a click event on that student and set them to
 * "absent," and vice versa.
 */
Student.prototype.setAttendance = function () {
    if ('true' === jQuery(this.node).attr('data-present')) {
        this.present = false;
    } else {
        this.present = true;
    }
};

Student.prototype.addPoint = function () {
    if (this.present) { this.points += 1; }
};

var APPUI = (function () {
    this.state = 'add_points';

    var _handleToolbar = function (e) {
        switch (jQuery(e.target).attr('id')) {
            case 'btn-set-present':
                _toggleAttendanceUI();
                break;
            case 'btn-set-hilite':
                break;
            case 'btn-write-note':
                break;
        }
    };

    var _toggleAttendanceUI = function () {
        if ('attendance' === state) {
            state = 'add_points';
            jQuery('#btn-set-present').text('Set Attendance');
        } else {
            state = 'attendance';
            jQuery('#btn-set-present').text('Done (Set Attendance)');
        }
        setClickSeatHandler();
    };

    var addPoint = function (e) {
        e.target.student.addPoint();
        jQuery(e.target).trigger('redraw');
    };
    var setAttendance = function (e) {
        e.target.student.setAttendance();
        jQuery(e.target).trigger('redraw');
    };

    var setClickSeatHandler = function () {
        jQuery('.seat').each(function () {
            jQuery(this).off('click');
            switch (state) {
                case 'add_points':
                    jQuery(this).on('click', addPoint);
                    break;
                case 'attendance':
                    jQuery(this).on('click', setAttendance);
                    break;
            }
        });
    };

    var init = function () {
        setClickSeatHandler();
        jQuery('.seat').each(function () {
            this.student = new Student (this);
            jQuery(this).on('redraw', this.student.redraw);

            this.student.randomizeProperties();
            jQuery(this).trigger('redraw');
        });

        jQuery('menu[type="toolbar"]').on('click', _handleToolbar);
    };

    return {
        'init': init
    };
})();

jQuery(document).ready(function () {
    APPUI.init();
});
