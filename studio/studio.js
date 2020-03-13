function studio_init() {
    $('.studio-remove').each(function (i) {
        var c = $(".studio-remove").eq(i);
        if (c.data('init') != '1') {
            c.data('init', 1);
            c.click(function (e) {
                if ($(this).parent().parent().has('.studio-section').length > 0) {
                    $(this).parent().parent().parent().parent().remove();
                }
                else if ($(this).parent().parent().has('.studio-tab').length > 0) {
                    const hrf = $(this).parent().parent().attr('href');

                    $(this).parent().parent().remove();
                    if ($(hrf).length > 0) $(hrf).remove();
                }
                else if ($(this).parent().parent().has('.studio-radio').length > 0) {
                    $(this).parent().parent().parent().remove();
                }
                else if ($(this).parent().parent().has('.studio-child').length > 0) {
                    $(this).parent().parent().parent().parent().parent().parent().parent().remove();
                }
                else {
                    $(this).parent().parent().remove();
                }
            });
        }
    });
    $('.studio-add').each(function (i) {
        var c = $(".studio-add").eq(i);
        if (c.data('init') !== '1') {
            c.data('init', 1);
            c.click(function (e) {
                if ($(this).parent().parent().has('.studio-section').length > 0) {
                    $(this).parent().parent().parent().parent().remove();
                }
                else if ($(this).parent().parent().has('.studio-tab').length > 0) {
                    const li = '<li draggable="true" class="drag-tab">< a href = "#tab_n" data-toggle="tab" onclick = "storeHash(\'{/sqroot/body/bodyContent/form/info/code/.}\', \'#tab_n\');reloadChild(\'n\')"></a ></li>';
                    $(this).parent().parent().before(li);

                    $(this).parent().parent().remove();
                    if ($(hrf).length > 0) $(hrf).remove();
                }
                else if ($(this).parent().parent().has('.studio-radio').length > 0) {
                    $(this).parent().parent().parent().remove();
                }
                else if ($(this).parent().parent().has('.studio-child').length > 0) {
                    $(this).parent().parent().parent().parent().parent().parent().parent().remove();
                }
                else {
                    $(this).parent().parent().remove();
                }
            });
        }
    });
    //$(window).mouseup(function (e) { mouseup(e) });
    $('.form-group').on('dragstart', function (event) { st_dragstart(event); });
    $('.form-group').on('dragend', function (e) { st_dragend(event); });
    $('.form-group').on('dragover', function (event) { st_dragover(event); });
    $('.form-group').on('drop', function (event) { st_drop(event); });

    $('.drag-col').on('dragstart', function (event) { st_dragstart(event); });
    $('.drag-col').on('dragend', function (event) { st_dragend(event); });
    $('.drag-col').on('dragover', function (event) { st_dragover(event); });
    $('.drag-col').on('drop', function (event) { st_drop(event); });

    $('.drag-section').on('dragstart', function (event) { st_dragstart(event); });
    $('.drag-section').on('dragend', function (event) { st_dragend(event); });
    $('.drag-section').on('dragover', function (event) { st_dragover(event); });
    $('.drag-section').on('drop', function (event) { st_drop(event); });

    $('.drag-tab').on('dragstart', function (event) { st_dragstart(event); });
    $('.drag-tab').on('dragend', function (event) { st_dragend(event); });
    $('.drag-tab').on('dragover', function (event) { st_dragover(event); });
    $('.drag-tab').on('drop', function (event) { st_drop(event); });

}

var sourceElement;
function st_dragstart(ev) {
    sourceElement = ev.target;
    if ($(ev.target).children('.studio-field').length > 0 || $(ev.target).parent().children('.studio-field').length > 0) {
        setTimeout(function () {
            $('.studio-field').parent().css('border', '2px dashed black');
            $(ev.target).css('border', '0px');
            $(ev.target).parent().css('border', '0px');
            console.log('field-start');
        }, 350);
    }
    else if ($(ev.target).children('.studio-radio').length > 0 || $(ev.target).parent().children('.studio-radio').length > 0) {
        $('.studio-radio').parent().css('border', '2px dashed black');
        $(ev.target).css('border', '0px');
        $(ev.target).parent().css('border', '0px');
    }
    else if ($(ev.target).children('.studio-column').length > 0) {
        $('.studio-column').parent().css('border', '2px dashed black');
        $(ev.target).css('border', '0px');
        $(ev.target).parent().css('border', '0px');
    }
    
    else if ($(ev.target).children('.studio-section').length > 0 || $(ev.target).parent().children('.studio-section').length > 0) {
        $('.studio-section').parent().parent().css('border', '2px dashed black');
        $(ev.target).css('border', '0px');
        $(ev.target).parent().css('border', '0px');
    }
    if ($(ev.target).children('.studio-tab').length > 0 || $(ev.target).parent().children('.studio-tab').length > 0) {
        $('.studio-tab').parent().css('border', '2px dashed black');
        $(ev.target).css('border', '0px');
        $(ev.target).parent().css('border', '0px');
    }
    
    //ev.dataTransfer.setData("text", ev.target.id);
}

function st_dragover(ev) {
    if (($(ev.target).children('.studio-radio').length > 0 || $(ev.target).parent().children('.studio-radio').length > 0)
        && ($(ev.target).children('.studio-radio').length > 0 || $(ev.target).parent().children('.studio-radio').length > 0)) {
        console.log('field-over');
        ev.preventDefault();
    }
    else if (($(ev.target).children('.studio-field').length > 0)
        && ($(ev.target).children('.studio-field').length > 0)) {
        ev.preventDefault();
    }
    else if (($(ev.target).children('.studio-column').length > 0)
        && ($(ev.target).children('.studio-column').length > 0)) {
        ev.preventDefault();
    }
    else if (($(ev.target).children('.studio-section').length > 0 || $(ev.target).parent().children('.studio-section').length > 0)
        && ($(ev.target).children('.studio-section').length > 0 || $(ev.target).parent().children('.studio-section').length > 0)) {
        ev.preventDefault();
    }
    else if (($(ev.target).children('.studio-tab').length > 0 || $(ev.target).parent().children('.studio-tab').length > 0)
        && ($(ev.target).children('.studio-tab').length > 0 || $(ev.target).parent().children('.studio-tab').length > 0)) {
        ev.preventDefault();
    }

}

function st_dragend(ev) {
    if ($(ev.target).parent().children('.studio-radio').length > 0 || $(ev.target).children('.studio-radio').length > 0) {
        $('.studio-radio').parent().css('border', '0px');
    }
    else if ($(ev.target).children('.studio-field').length > 0) {
        $('.studio-field').parent().css('border', '0px');
        console.log('field-stop');
    }
    else if ($(ev.target).children('.studio-column').length > 0) {
        $('.studio-column').parent().css('border', '0px');
    }
    else if ($(ev.target).parent().children('.studio-section').length > 0 || $(ev.target).children('.studio-section').length > 0) {
        $('.studio-section').parent().parent().css('border', '0px');
    }
    else if ($(ev.target).parent().children('.studio-tab').length > 0 || $(ev.target).children('.studio-tab').length > 0) {
        $('.studio-tab').parent().css('border', '0px');
    }

    //$('.droparea').removeClass('hide').addClass('hide');
    ev.preventDefault();
}
function mouseup(ev) {
    $('.studio-tab').parent().css('border', '0px');
    $('.studio-section').parent().parent().css('border', '0px');
    $('.studio-column').parent().css('border', '0px');
    $('.studio-field').parent().css('border', '0px');
    $('.studio-radio').parent().css('border', '0px');
}
function st_drop(ev) {
    if ($(sourceElement).parent().children('.studio-tab').length > 0 || $(sourceElement).children('.studio-tab').length > 0) {
        $('.studio-tab').parent().css('border', '0px');
        let src;
        if ($(sourceElement).is('li')) {
            src = $(sourceElement);
        }
        else if ($(sourceElement).parent().is('li')) {
            src = $(sourceElement).parent();
        }
        if ($(ev.target).is('li')) {
            $(ev.target).before($(src));
            //$(src).remove();
        }
        else if ($(ev.target).parent().is('li')) {
            $($(ev.target).parent()).before($(src));
            //$(src).remove();
        }
        $('.studio-tab').parent().css('border', '0px');
    }
    else if ($(sourceElement).children('.studio-section').length > 0) {
        $('.studio-section').parent().css('border', '0px');
        let src;
        if ($(sourceElement).is('div.row')) {
            src = $(sourceElement);
        }
        else if ($(sourceElement).parent().is('div.row')) {
            src = $(sourceElement).parent();
        }
        if ($(ev.target).is('div.row')) {
            $(ev.target).before($(src));
            //$(src).remove();
        }
        else if ($(ev.target).parent().is('div.row')) {
            $($(ev.target).parent()).before($(src));
            //$(src).remove();
        }
        $('.studio-section').parent().parent().css('border', '0px');
    }
    else if ($(sourceElement).children('.studio-column').length > 0) {
        $('.studio-column').parent().css('border', '0px');
        let src;
        if ($(sourceElement).is('div.drag-col')) {
            src = $(sourceElement);
        }
        else if ($(sourceElement).parent().is('div.drag-col')) {
            src = $(sourceElement).parent();
        }
        if ($(ev.target).is('div.drag-col')) {
            let sc = $(src).parent();
            if ($(ev.target).parent().children().length - 1 < 4)
                $(ev.target).before($(src));
            const cm = 'col-md-' + 12 / ($(ev.target).parent().children().length - 1);
            $(ev.target).parent().children().each(function (i) {
                if (i > 0) $(ev.target).parent().children().eq(i).removeClass('col-md-12').removeClass('col-md-6').removeClass('col-md-4').removeClass('col-md-3').addClass(cm);
            });
            if ($(sc).children().length - 1 > 0) {
                const cm = 'col-md-' + 12 / ($(sc).children().length - 1);
                $(sc).children().each(function (i) {
                    if (i > 0) $(sc).children().eq(i).removeClass('col-md-12').removeClass('col-md-6').removeClass('col-md-4').removeClass('col-md-3').addClass(cm);
                });
            }
            //$(src).remove();
        }
        else if ($(ev.target).parent().is('div.drag-col')) {
            if ($(ev.target.parent()).parent().children().length - 1 < 4)
                $($(ev.target).parent()).before($(src));
            const cm = 'col-md-' + 12 / ($(ev.target.parent()).parent().children().length - 1);
            $(ev.target.parent()).parent().children().each(function (i) {
                if (i > 0) $(ev.target.parent()).parent().children().eq(i).removeClass('col-md-12').removeClass('col-md-6').removeClass('col-md-4').removeClass('col-md-3').addClass(cm);
            });
        }
        $('.studio-column').parent().css('border', '0px');
    }
    else if ($(sourceElement).children('.studio-field').length > 0) {
        $('.studio-field').parent().css('border', '0px');
        let src;
        if ($(sourceElement).is('div.form-group')) {
            src = $(sourceElement);
        }
        else if ($(sourceElement).parent().is('div.form-group')) {
            src = $(sourceElement).parent();
        }
        if ($(ev.target).is('div.form-group')) {
            $(ev.target).before($(src));

            //$(src).remove();
        }
        else if ($(ev.target).parent().is('div.form-group')) {
            $($(ev.target).parent()).before($(src));

        }
        $('.studio-field').parent().css('border', '0px');
    }
    ev.preventDefault();
    //var data = ev.dataTransfer.getData("text");
    //ev.target.appendChild(document.getElementById(data));

}