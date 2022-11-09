function EditBox(data) {
    var id = data.HtmlID
    var line_height = typeof (data.line_height) == "undefined" ? 20.8 : data.line_height
    var seq = 1;
    Html()
    scroll()
    Enter()
    Backspace()
    function Html() {
        var html = `
            <div id="${id}_seq" class="PC_ZYL_EditBox_seq">
            <li>1</li>
            </div>
            <textarea id="${id}_content" class="PC_ZYL_EditBox_content"></textarea>
             `
        $(`#${id}`).html(html)
        $(`#${id}`).css({
            "display": "flex",
            "border": "1px solid skyblue"
        })
        $('.PC_ZYL_EditBox_content').css('line-height', line_height + 'px')
        $(`#${id}_content`).css('width', $(`#${id}`).width() - 35 + 'px')
    }

    function scroll() {
        $(`#${id}_content`).scroll(function () {
            $(`#${id}_seq`).scrollTop($(this).scrollTop()); // 纵向滚动条
        });
        $(`#${id}_seq`).scroll(function () {
            $(`#${id}_content`).scrollTop($(this).scrollTop()); // 纵向滚动条
        });
        $(`#${id}_content`).on('propetychange input', function () {//监听 

            if ($(`#${id}_content`).scrollLeft() == 0) {
                $('.PC_ZYL_EditBox_seq').css('overflow', 'auto')
                $('.PC_ZYL_EditBox_seq').css('overflow-y', 'hidden')
                $('.PC_ZYL_EditBox_content').css('overflow', 'auto')
                $('.PC_ZYL_EditBox_content').css('overflow-x', 'hidden')
            }
        })
    }

    function Enter() {
        $(`#${id}_content`).keyup(function (event) {
            var key = event.which || event.keyCode;
            if (key == 13) {
                Insert()
                $(`#${id}_seq`).scrollTop($(`#${id}_content`)[0].scrollHeight); // 纵向滚动条
            }
        })
        $(`#${id}_content`).on('keypress', function (event) {
            $(`#${id}_content`).keyup(function (event) {
                var key = event.which || event.keyCode;
                if (key == 13) {
                    var row = $(`#${id}_content`).val().split("\n").length
                    if (row > seq) {
                        var count = row - seq
                        for (var i = 0; i < count; i++) {
                            Insert()
                            $(`#${id}_seq`).scrollTop($(`#${id}_content`)[0].scrollHeight); // 纵向滚动条
                        }
                    }
                }
            })
        })
    }

    function Backspace() {
        $(`#${id}_content`).keyup(function (event) {
            var key = event.which || event.keyCode;
            if (key == 8) {
                Del()

            }
        })
    }

    function Insert() {
        $(`#${id}_seq`).append(`<li>${seq + 1}</li>`)
        seq++;
        $('.PC_ZYL_EditBox_seq li').css('line-height', line_height + 'px')
        if ($(`#${id}_content`).scrollLeft() > 0) {
            $('.PC_ZYL_EditBox_seq').css('overflow', 'scroll')
            $('.PC_ZYL_EditBox_seq').css('overflow-y', 'hidden')
            $('.PC_ZYL_EditBox_content').css('overflow', 'auto')
        }

    }

    function Del() {
        var row = $(`#${id}_content`).val().split("\n").length
        if (row < seq) {
            var count = seq - row
            seq = row
            for (var i = 0; i < count; i++) {
                $(`#${id}_seq li`).eq(-1).remove()
            }
        }
    }
}

export { EditBox }