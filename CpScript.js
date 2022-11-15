(function () {
    var Long = {};
    Long.EditBox = function (data) {
        var id = data.HtmlID
        var line_height = typeof (data.line_height) == "undefined" ? 20.8 : data.line_height
        var seq = 1;
        Html()
        scroll()
        Enter()
        Backspace()
        function Html() {
            var html = `
                <div id="${id}_seq" class="Cp_EditBox_seq">
                <li>1</li>
                </div>
                <textarea id="${id}_content" class="Cp_EditBox_content"></textarea>
                 `
            $(`#${id}`).html(html)
            $(`#${id}`).css({
                "display": "flex",
                "border": "1px solid skyblue"
            })
            $('.Cp_EditBox_content').css('line-height', line_height + 'px')
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
                    $('.Cp_EditBox_seq').css('overflow', 'auto')
                    $('.Cp_EditBox_seq').css('overflow-y', 'hidden')
                    $('.Cp_EditBox_content').css('overflow', 'auto')
                    $('.Cp_EditBox_content').css('overflow-x', 'hidden')
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
            $('.Cp_EditBox_seq li').css('line-height', line_height + 'px')
            if ($(`#${id}_content`).scrollLeft() > 0) {
                $('.Cp_EditBox_seq').css('overflow', 'scroll')
                $('.Cp_EditBox_seq').css('overflow-y', 'hidden')
                $('.Cp_EditBox_content').css('overflow', 'auto')
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
    Long.Table = function (TableData) {
        var HtmlID = TableData.HtmlID
        var TheadData = typeof (TableData.TheadData) == "undefined" ? [] : TableData.TheadData
        var ThWidth = typeof (TableData.ThWidth) == "undefined" ? '' : TableData.ThWidth
        var BoolEditTh = typeof (TableData.BoolEditTh) == "undefined" ? '' : TableData.BoolEditTh
        var SeqThWidth = typeof (TableData.SeqThWidth) == "undefined" ? '15%' : TableData.SeqThWidth
        var BtnThWidth = typeof (TableData.BtnThWidth) == "undefined" ? '20%' : TableData.BtnThWidth
        var TbodyData = TableData.TbodyData
        var TbodyDataKey = TbodyDataKey()
        var IsDataSeq = TableData.IsDataSeq
        var TheadSeqName = typeof (TableData.TheadSeqName) == "undefined" ? '' : TableData.TheadSeqName
        var TheadBtnName = typeof (TableData.TheadBtnName) == "undefined" ? '' : TableData.TheadBtnName
        var IsEditBtn = TableData.IsEditBtn
        var IsDelBtn = TableData.IsDelBtn
        var TbodyDataLength = typeof (TableData.TbodyDataLength) == "undefined" ? TbodyData.length : TableData.TbodyDataLength
        var TbodyPageCount = !isNaN(TableData.TbodyPageCount) ? TableData.TbodyPageCount : "All"
        var PagesCount = 1  //当前页数
        var backups = ''//备份
        var width = ''
        GetWidth()
        TableHtml()
        Thead_Th()
        IsPaging()//判断是否分页
        function IsPaging() {
            if (TbodyPageCount != 'All') {
                PageHtml()
                if (TbodyDataLength < TbodyPageCount) { Tbody_Td(0, TbodyDataLength - 1) }
                else { Tbody_Td(0, TbodyPageCount - 1) }
            }
            else {
                Tbody_Td(0, TbodyDataLength - 1)
            }
        }

        function TableHtml() {
            var tables = `<table class="Cp_table" border="0"><thead id="${HtmlID}_Thead"></thead><tbody id="${HtmlID}_Tbody"></tbody></table>`
            $(`#${HtmlID}`).html(tables)
            $(`#${HtmlID}`).css({ "display": "flex", "flex-direction": "column", "justify-content": "space-between" })
        }

        function Thead_Th() {
            var TheadHtml = ''
            if ((IsDataSeq == 'Seq1' || IsDataSeq == 'Seq2') && TheadData.length != 0) {
                TheadHtml += `<th style="width:${SeqThWidth};">${TheadSeqName}</th>`
            }
            for (var i = 0; i < TheadData.length; i++) {
                if (ThWidth != '') {
                    TheadHtml += `<th style="width:${ThWidth[i]};">${TheadData[i]}</th>`
                }
                else {
                    TheadHtml += `<th style="width:${width}%;">${TheadData[i]}</th>`
                }

            }
            if ((IsEditBtn || IsDelBtn) && TheadData.length != 0) {
                TheadHtml += `<th style="width:${BtnThWidth};">${TheadBtnName}</th>`
            }
            $(`#${HtmlID}_Thead`).html(TheadHtml)
        }

        function TbodyDataKey() {
            var key = []
            for (var d in TbodyData[0]) {
                key.push(d)
            }
            return key
        }

        function Tbody_Td(start, end) {
            var TbodyHtml = ''
            if (TbodyData.length != 0) {
                for (var i = start; i <= end; i++) {
                    if (i % 2 == 0) {
                        TbodyHtml += `<tr id="${HtmlID}_Tbody_Tr${i}" class="SeparateColor" >`
                    }
                    else {
                        TbodyHtml += `<tr id="${HtmlID}_Tbody_Tr${i}">`
                    }

                    if (IsDataSeq == 'Seq1' || IsDataSeq == 'Seq2') {
                        if (IsDataSeq == 'Seq1') {
                            TbodyHtml += `<td contenteditable="false" style="width:${SeqThWidth};">` + (i + 1) + '</td>'
                        }
                        else {
                            if (TbodyPageCount != 'All') {
                                TbodyHtml += `<td style="width:${SeqThWidth};" contenteditable="false">` + (i - TbodyPageCount * (PagesCount - 1) + 1) + '</td>'
                            }
                            else {
                                TbodyHtml += `<td style="width:${SeqThWidth};" contenteditable="false">` + (i + 1) + '</td>'
                            }
                        }

                    }

                    for (var j = 0; j < TbodyDataKey.length; j++) {
                        if (ThWidth != '') {
                            TbodyHtml += `<td contenteditable="${BoolEditTh == "" ? "none" : BoolEditTh[j] == 'true' ? 'none' : 'false'}" style="width:${ThWidth[j]};">` + eval(`TbodyData[i].${TbodyDataKey[j]}`) + '</td>'
                        }
                        else {
                            TbodyHtml += `<td contenteditable="${BoolEditTh == "" ? "none" : BoolEditTh[j] == 'true' ? 'none' : 'false'}" style="width:${width}%;">` + eval(`TbodyData[i].${TbodyDataKey[j]}`) + '</td>'
                        }

                    }

                    if (IsEditBtn || IsDelBtn) {
                        TbodyHtml += `<td style="width:${BtnThWidth};">`
                        if (IsEditBtn) {
                            TbodyHtml += `<button contenteditable="false" class="Cp_Btn Cp_table_BtnEdit ${HtmlID}_table_BtnEdit">编辑</button>`
                        }
                        if (IsDelBtn) {
                            TbodyHtml += `<button contenteditable="false" class="Cp_Btn Cp_table_BtnDel ${HtmlID}_table_BtnDel">删除</button>`
                        }
                        TbodyHtml += '</td>'
                    }
                    TbodyHtml += '</tr>'
                }
            }
            $(`#${HtmlID}_Tbody`).html(TbodyHtml)
            TableBtn();//按钮事件
        }

        function TableBtn() {
            $(`.${HtmlID}_table_BtnEdit`).on('click', function () {
                if ($(this).text() == '编辑') {
                    if (backups == "") {
                        backups = $(this.parentNode.parentNode.parentNode).html()//备份 用于取消按钮
                        $(this).html('保存')
                        $(this.nextSibling).html('取消')
                        IsEdit(this.parentNode.parentNode, 'true')
                        $(this.parentNode.parentNode).css('color', "red")
                        $(`#${this.parentNode.parentNode.id} td`).css({ 'border-left': ' 1px solid rgb(188, 222, 232)' })
                    }
                }
                else {
                    IsEdit(this.parentNode.parentNode, 'false')
                    $(this).html('编辑')
                    $(this.nextSibling).html('删除')
                    backups = ""
                    $(this.parentNode.parentNode).css('color', "black")
                    $(`#${this.parentNode.parentNode.id} td`).css({ 'border-left': 'none' })
                    var count = this.parentNode.parentNode.id.replace(`${HtmlID}_Tbody_Tr`, '')
                    var array = [];//声明一个新的数组
                    $(`#${this.parentNode.parentNode.id}`).children().each(function (index, element) {//遍历每个对象
                        array.push($(this).html());//往数组中存入值
                    });

                    if ((IsDataSeq == 'Seq1' || IsDataSeq == 'Seq2')) {
                        array.shift()
                    }
                    if (IsEditBtn || IsDelBtn) {
                        array.pop()
                    }
                    var data = {}
                    for (var i = 0; i < TbodyDataKey.length; i++) {
                        data[TbodyDataKey[i]] = array[i]
                    }
                    TbodyData[count] = data
                    data['array_seq'] = count
                    let funName = eval(`${HtmlID}_table_BtnEdit`);
                    funName.call(this, data);
                    data = {}
                }

            })
            $(`.${HtmlID}_table_BtnDel`).on('click', function () {
                if ($(this).text() == '取消') {
                    IsEdit(this.parentNode.parentNode, 'false')
                    $(this.previousSibling).html('编辑')
                    $(this).html('删除')
                    $(this.parentNode.parentNode).css('color', "black")
                    $(`#${this.parentNode.parentNode.id} td`).css({ 'border-left': 'none' })
                    $(this.parentNode.parentNode.parentNode).html(backups)
                    backups = ""
                    TableBtn()
                }
                else {
                    var count = this.parentNode.parentNode.id.replace(`${HtmlID}_Tbody_Tr`, '')
                    var data = TbodyData[count]
                    data['array_seq'] = count
                    let funName = eval(`${HtmlID}_table_BtnDel`);
                    funName.call(this, data)
                    data = {}
                    TbodyData.splice(count, 1)
                    TbodyDataLength = TbodyData.length
                    $(`#${HtmlID}_TbodyDataLength`).html(TbodyDataLength)
                    if (TbodyPageCount != 'All') {
                        if (PagesCount * TbodyPageCount <= TbodyDataLength) {
                            Tbody_Td((PagesCount - 1) * TbodyPageCount, PagesCount * TbodyPageCount - 1)
                        }
                        else {
                            Tbody_Td((PagesCount - 1) * TbodyPageCount, TbodyDataLength - 1)
                        }
                    }
                    else {
                        Tbody_Td(0, TbodyDataLength - 1)
                    }
                }
            })
        }

        function IsEdit(id, isbool) {
            $(id).attr('contenteditable', isbool)
        }

        function PageHtml() {
            var page = `
        <div class="Cp_paging">
        <span>共${TbodyPageCount}条/页</span>
        <div>
          <strong class="IsPaging"  id="${HtmlID}_subtract"><<</strong>
            <span id="${HtmlID}_pages" class="Cp_PagesCount">1</span>
          <strong class="IsPaging"  id="${HtmlID}_add">>></strong>
        </div>
        <span>共<span id="${HtmlID}_TbodyDataLength">${TbodyDataLength}</span>条记录</span>
        </div>
        `
            $(`#${HtmlID}`).append(page)
            Page_Operation()
        }

        function Page_Operation() {
            $(`#${HtmlID}_subtract`).on('click', function () {
                if (PagesCount > 1) {
                    PagesCount--;
                    $(`#${HtmlID}_pages`).html(PagesCount)
                    Tbody_Td(PagesCount * TbodyPageCount - TbodyPageCount, PagesCount * TbodyPageCount - 1)
                }
            })
            $(`#${HtmlID}_add`).on('click', function () {
                if (PagesCount < TbodyDataLength / TbodyPageCount) {
                    PagesCount++;
                    $(`#${HtmlID}_pages`).html(PagesCount)
                    if (PagesCount * TbodyPageCount <= TbodyDataLength) {
                        Tbody_Td((PagesCount - 1) * TbodyPageCount, PagesCount * TbodyPageCount - 1)
                    }
                    else {
                        Tbody_Td((PagesCount - 1) * TbodyPageCount, TbodyDataLength - 1)
                    }
                }
            })
        }

        function GetWidth() {
            if (IsDataSeq == 'Seq1' || IsDataSeq == 'Seq2') {

                if (IsEditBtn || IsDelBtn) {
                    width = (100 - SeqThWidth.replace("%", "") - BtnThWidth.replace("%", "")) / TbodyDataKey.length
                }
                else {
                    width = (100 - SeqThWidth.replace("%", "")) / TbodyDataKey.length
                }
            }
            else {
                if (IsEditBtn || IsDelBtn) {
                    width = (100 - BtnThWidth.replace("%", "")) / TbodyDataKey.length
                }
                else {
                    width = 100 / TbodyDataKey.length
                }
            }
        }
    }
    Long.ForLoop=function (str, data) {
        var regex3 = /\{\{(.+?)\}\}/g;
        var variable = str.match(regex3)
        var str1 = str
        var res = "";
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < variable.length; j++) {
                str1 = str1.replace(variable[j], eval(variable[j]).replace('{{', '').replace('}}', ""))
            }
            res += str1
            str1 = str
        }
       return res
    }
    Long.DropDown=function (checkbox) {
        var data = []
        $(`input:checkbox[name="${checkbox.Checkbox_Name}"]`).on('click', function () {
            if (this.checked) {
                data.push($(this.parentNode).text().trim() + ",")
            }
            else {
                for (var i = 0; i < data.length; i++) {
                    if (data[i] == $(this.parentNode).text().trim() + ",") {
                        data.splice(i, 1);
                    }
                }
            }
            $(`#${checkbox.HtmlID}`).html(data)
        })
    }
    window.Long = Long;
})();