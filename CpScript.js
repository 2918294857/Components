(function () {
    var Long = {};
    Long.EditBox = function (data) {
        var id = data.HtmlID
        var line_height = typeof (data.line_height) == "undefined" ? 20.8 : data.line_height
        var seq = 1;
        Html()
        Init_Css()
        scroll()
        Enter()
        Backspace()
        function Html() {
            var html = `<div id="${id}_seq" class="Cp_EditBox_seq">
                           <li>1</li>
                        </div>
                        <textarea id="${id}_content" class="Cp_EditBox_content"></textarea>`
            $(`#${id}`).html(html)
        }
        function Init_Css() {
            $(`#${id}`).css({
                "display": "flex",
                "border": "1px solid skyblue"
            })
            $('.Cp_EditBox_content').css('line-height', line_height + 'px')
            $(`#${id}_content`).css('width', $(`#${id}`).width() - 35 + 'px')
            $('.Cp_EditBox_seq li').css('line-height', line_height + 'px')
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
    Long.ForLoopOne = function (str, data) {
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
    Long.DropDown = function (Ddata) {
        var data = []
        var HtmlID = Ddata.HtmlID
        var Type = Ddata.type
        var Checkbox_Name = Ddata.Checkbox_Name
        var Select = Ddata.data
        var allcheckbox = ''
        DHtml_checkbox()
        DHtml()
        Dclick()
        Iclick()
        function DHtml() {
            var html = `<input id="Cp_DropDown_${HtmlID}" placeholder="请选择" readonly="true" class="Cp_DropDown" type="text">
                        <div id="Cp_DropDownItem_${HtmlID}" class="Cp_DropDownItem">${allcheckbox}</div>`
            $(`#${HtmlID}`).html(html)
        }
        function DHtml_checkbox() {
            for (var i = 0; i < Select.length; i++) {
                allcheckbox += ` <div> <input name="${Checkbox_Name}" type="checkbox"> ${Select[i]} </div>`
            }
        }
        function Iclick() {
            $(`#Cp_DropDown_${HtmlID}`).on('click', function () {
                if ($(`#Cp_DropDownItem_${HtmlID}`).css('display') == 'block') {
                    $(`#Cp_DropDownItem_${HtmlID}`).css('display', 'none')
                }
                else {
                    $(`#Cp_DropDownItem_${HtmlID}`).css('display', 'block')
                }
            })
        }
        function Dclick() {
            if (Type == 'Checkbox1') {
                $(`#Cp_DropDownItem_${HtmlID} div input`).css('pointer-events', 'none')
                $(`#Cp_DropDownItem_${HtmlID} div`).on('click', function () {
                    if (!$(this).find('input').prop('checked')) {
                        $(this).find('input').prop('checked', true)
                        data.push($(this).text().trim())
                    }
                    else {
                        $(this).find('input').prop('checked', false)
                        for (var i = 0; i < data.length; i++) {
                            if (data[i] == $(this).text().trim()) {
                                data.splice(i, 1);
                            }
                        }
                    }
                    $(`#Cp_DropDown_${HtmlID}`).val(data)
                })
            }
            else {
                $(`#Cp_DropDownItem_${HtmlID} div input`).css(' pointer-events', 'all')
                $(`input:checkbox[name="${Checkbox_Name}"]`).on('click', function () {
                    if (this.checked) {
                        data.push($(this.parentNode).text().trim())
                    }
                    else {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i] == $(this.parentNode).text().trim()) {
                                data.splice(i, 1);
                            }
                        }
                    }
                    $(`#Cp_DropDown_${HtmlID}`).val(data)
                })
            }
        }

    }
    Long.Message = function (data) {
        var Tiptitle, DKey, MKey, MID, Distance, MColor, MText, MBackground, MIcon, Tforward
        MessageKey()
        MText = data.text
        MIcon = data.Icon
        MColor = data.Color
        MID = 'Cp_Mkey' + MKey
        MBackground = data.Background
        Mhtml()
        Mgo()
        Mreturn()
        ClearHtml()

        function MessageKey() {
            MKey = parseInt(sessionStorage.getItem('Cp_MessageKey'))
            if (isNaN(MKey)) {
                MKey = 0
                DKey = 0
                sessionStorage.setItem('Cp_MessageKey', MKey)
                sessionStorage.setItem('Cp_MessageDelKey', DKey)
            }
            MKey += 1
            sessionStorage.setItem('Cp_MessageKey', MKey)
        }

        function Mhtml() {
            $('body').append(` <div id='${MID}' class="Cp_Message"></div>`)
            $(`#${MID}`).css({ 'color': MColor, 'background': MBackground })
            Tiptitle = `<img src="${MIcon}" class="Cp_Message_ICON"  alt="">${MText}`
            $(`#${MID}`).html(Tiptitle)
        }

        function Mgo() {
            var Tgo = setInterval(function () {
                 Distance = MKey == 1 ? (MKey * 20) : parseInt($(`#Cp_Mkey${MKey - 1}`).css('top')) + 50
                var Htop = $(`#${MID}`).css('top') == 'auto' ? -40 : parseInt($(`#${MID}`).css('top'))
                if (Htop < Distance) {
                    $(`#${MID}`).css('top', Htop + 1 + 'px')
                }
                else {
                    clearInterval(Tgo)
                    Mforward()
                }
            }, 0)
        }

        function Mforward() {
                Tforward = setInterval(function () {
                    if (MKey != 1 && parseInt($(`#Cp_Mkey${MKey - 1}`).css('top')) + 50 == parseInt($(`#${MID}`).css('top')) - 50) {
                        var top = parseInt($(`#${MID}`).css('top')) - 45
                        var Titem = setInterval(() => {
                            var Htop = parseInt($(`#${MID}`).css('top'))
                            if (Htop > top) {
                                $(`#${MID}`).css('top', Htop - 1 + 'px')
                            }
                            else {
                                clearInterval(Titem)
                            }
                        })
                    }
                }, 0)
        }


        function Mreturn() {
            setTimeout(() => {
                clearInterval(Tforward)
                var Treture = setInterval(function () {
                    var Htop = parseInt($(`#${MID}`).css('top'))
                    if (Htop > -40) {
                        $(`#${MID}`).css('top', Htop - 1 + 'px')
                    }
                    else {
                        clearInterval(Treture)
                    }
                }, 0)
            }, 3000)
        }

        function ClearHtml() {
            setTimeout(() => {
                $(`#${MID}`).removeClass(`Cp_Message_animation`);
                $(`#${MID}`).remove()
                ClearItem()
            }, 3500)
        }

        function ClearItem() {
            DKey = parseInt(sessionStorage.getItem('Cp_MessageDelKey')) + 1
            sessionStorage.setItem('Cp_MessageDelKey', DKey)
            setTimeout(() => {
                var MKey1 = parseInt(sessionStorage.getItem('Cp_MessageKey'))
                var DKey1 = parseInt(sessionStorage.getItem('Cp_MessageDelKey'))
                if (MKey1 == DKey1) {
                    sessionStorage.removeItem('Cp_MessageKey')
                    sessionStorage.removeItem('Cp_MessageDelKey')
                    $('.Cp_Message').remove()
                    clearInterval()
                }
            }, 0);
        }

        window.onunload = function () {
            sessionStorage.removeItem('Cp_MessageKey')
            sessionStorage.removeItem('Cp_MessageDelKey')
            $('.Cp_Message').remove()
            clearInterval()
        }

    }
    Long.Switch = function (data) {
        var HtmlID = data.HtmlID
        var OnColor = data.OnColor
        var OffColor = data.OffColor
        SHtml()
        SClick()
        function SHtml() {
            var html = `<div id="Cp_Switch_${HtmlID}" class="Cp_Switch">
                          <div id="Cp_BtnSwitch_${HtmlID}" class="Cp_BtnSwitch"></div>
                        </div>`
            $(`#${HtmlID}`).html(html)
            $(`#Cp_Switch_${HtmlID}`).css('background', `${OffColor}`)
        }
        function SClick() {
            var i = 0;
            $(`#Cp_BtnSwitch_${HtmlID}`).on('click', function () {
                if (i == 0) {
                    $(`#Cp_Switch_${HtmlID}`).css('background', `${OnColor}`)
                    $(`#Cp_Switch_${HtmlID}`).css('justify-content', 'right')
                    i = 1
                }
                else {
                    $(`#Cp_Switch_${HtmlID}`).css('background', `${OffColor}`)
                    $(`#Cp_Switch_${HtmlID}`).css('justify-content', 'left')
                    i = 0
                }
            })
        }
    }
    Long.DialogBox = function (data) {
        var text = data.text
        var HtmlID = data.HtmlID
        var direction = data.direction
        function DialogHtml() {
            var html = `<div id="CP_Dialog_${HtmlID}" class="CP_Dialog">${text}</div>`
            $('body').append(html)
        }
        $(`#${HtmlID}`).mouseover(function () {
            DialogHtml()
            var x = ''
            var y = ''
            OffTop = $(`#${HtmlID}`).offset().top
            Offleft = $(`#${HtmlID}`).offset().left
            Wtip = parseFloat($(`#CP_Dialog_${HtmlID}`).width())
            Htip = parseFloat($(`#CP_Dialog_${HtmlID}`).height())
            Wcontainer = parseFloat($(`#${HtmlID}`).width())
            Hcontainer = parseFloat($(`#${HtmlID}`).height())
            if (direction == 'top') {
                $(`#CP_Dialog_${HtmlID}`).addClass('CP_Dialog_top')
                y = OffTop - Htip - 20 - 10
                x = Offleft + (Wcontainer + 2) / 2 - (Wtip + 20) / 2
            }
            if (direction == 'bottom') {
                $(`#CP_Dialog_${HtmlID}`).addClass('CP_Dialog_bottom')
                y = OffTop + Hcontainer + 10
                x = Offleft + (Wcontainer + 2) / 2 - (Wtip + 20) / 2
            }
            if (direction == 'right') {
                $(`#CP_Dialog_${HtmlID}`).addClass('CP_Dialog_right')
                y = OffTop + (Hcontainer + 2) / 2 - (Htip + 20) / 2
                x = Offleft + Wcontainer + 10
            }
            if (direction == 'left') {
                $(`#CP_Dialog_${HtmlID}`).addClass('CP_Dialog_left')
                y = OffTop + (Hcontainer + 2) / 2 - (Htip + 20) / 2
                x = Offleft - (Wtip + 20) - 10
            }
            $(`#CP_Dialog_${HtmlID}`).css('top', y)
            $(`#CP_Dialog_${HtmlID}`).css('left', x)
        })
        $(`#${HtmlID}`).mouseout(function () {
            $(`#CP_Dialog_${HtmlID}`).remove()
        })
    }
    Long.Carousel = function (data) {
        var Quantity = typeof (data.Quantity) == 'undefined' ? 1 : data.Quantity
        var height = parseInt($(`#${data.HtmlID}`).height())
        var width = parseInt($(`#${data.HtmlID}`).width())
        var ImageHref = data.ImageHref
        var HtmlID = data.HtmlID
        var Image = data.Image
        var Timer
        var Count = 0
        var allimg = ''
        var allspot = ''
        var Indicator = 0


        Carousel_Html()
        Carousel_InitCss()
        Carousel_Automatic()
        Carousel_Monitor()
        function Carousel_Html() {
            Carousel_ForHtml()
            var html = `<div id="Cp_Carousel_Img_${HtmlID}" class="Cp_Carousel_Img">  
                           <p style="background:url(${Image[Image.length - 1]});"></p>${allimg}
                           <p style="background:url(${Image[0]});"></p>
                        </div>
                        <div id="Cp_Carousel_Click_${HtmlID}" class="Cp_Carousel_Click"> 
                          <button id="Cp_Carousel_Left_${HtmlID}" class="Cp_Carousel_Btn  Cp_Carousel_Left"> ＜</button>
                          <div id="Cp_Carousel_BtnSpot_${HtmlID}" class="Cp_Carousel_BtnSpot"><p id="Cp_Carousel_BtnSpot_${HtmlID}_Href"></p><div>${allspot}</div></div>
                          <button id="Cp_Carousel_Right_${HtmlID}" class="Cp_Carousel_Btn  Cp_Carousel_Right">＞</button>
                        </div>`
            $(`#${HtmlID}`).html(html)

        }

        function Carousel_ForHtml() {
            for (var i = 0; i < Image.length; i++) {
                allimg += `<p style="background:url(${Image[i]});"></p>`
                allspot += '<p></p>'
            }
        }

        function Carousel_InitCss() {
            $(`#Cp_Carousel_Img_${HtmlID} p`).css({
                'background-repeat': 'no-repeat',
                'background-size': 'cover',
                'background-size': '100% 100%'
            })
            $(`#Cp_Carousel_Img_${HtmlID} p`).css('left', -width + 'px')
            $(`#Cp_Carousel_Click_${HtmlID}`).css('top', -height)
            $(`#Cp_Carousel_BtnSpot_${HtmlID} div p`).eq(Indicator).css('background', 'rgb(242, 134, 134)')
        }

        function Carousel_direction(direction) {
            if (Count == 0) {
                var time = setInterval(() => {
                    var img_left = parseInt($(`#Cp_Carousel_Img_${HtmlID} p`).css('left'))
                    if (Count + Quantity <= width) {
                        if (direction == 'Left') {
                            img_left += Quantity
                        }
                        else {
                            img_left -= Quantity
                        }
                        Count += Quantity
                    }
                    else {
                        if (direction == 'Left') {
                            img_left += (width - Count)
                        }
                        else {
                            img_left -= (width - Count)
                        }
                        clearInterval(time)
                        Count = 0;
                        if (img_left == 0) {
                            img_left = -(width * Image.length)
                        }
                        if (img_left == -(width * (Image.length + 1))) {
                            img_left = -width
                        }
                    }
                    $(`#Cp_Carousel_Img_${HtmlID} p`).css('left', img_left + 'px')
                }, 0)
            }
        }

        function Carousel_Monitor() {
            $(`#${HtmlID}`).mouseover(function () {
                clearInterval(Timer)
                $(`#Cp_Carousel_Right_${HtmlID}`).css('visibility', 'visible')
                $(`#Cp_Carousel_Left_${HtmlID}`).css('visibility', 'visible')
            })
            $(`#${HtmlID}`).mouseout(function () {
                Carousel_Automatic()
                $(`#Cp_Carousel_Right_${HtmlID}`).css('visibility', 'hidden')
                $(`#Cp_Carousel_Left_${HtmlID}`).css('visibility', 'hidden')
            })
            $(`#Cp_Carousel_Right_${HtmlID}`).on('click', function () {
                if (Count == 0) {
                    clearInterval(Timer)
                    var data
                    if (Indicator != Image.length - 1) { data = Indicator + 1 }
                    else { data = 0; }
                    IndicatorCss(data)
                    Carousel_direction('Right')
                }
            })
            $(`#Cp_Carousel_Left_${HtmlID}`).on('click', function () {
                if (Count == 0) {
                    clearInterval(Timer)
                    var data
                    if (Indicator != 0) { data = Indicator - 1 }
                    else { data = Image.length - 1; }
                    IndicatorCss(data)
                    Carousel_direction('Left')
                }
            })

            $(`#Cp_Carousel_BtnSpot_${HtmlID}_Href`).on('click', function () {
                if (typeof (ImageHref[Indicator]) != 'undefined' || ImageHref[Indicator]) {
                    window.location.href = ImageHref[Indicator]
                }
            })

            $(`#Cp_Carousel_BtnSpot_${HtmlID} div p`).on('click', function () {
                $(`#Cp_Carousel_Img_${HtmlID} p`).css('left', -width * ($(this).index() + 1) + 'px')
                IndicatorCss($(this).index())
            })
        }

        function Carousel_Automatic() {
            Timer = setInterval(() => {
                if (Count == 0) {
                    var data
                    if (Indicator != Image.length - 1) { data = Indicator + 1 }
                    else { data = 0; }
                    IndicatorCss(data)
                    Carousel_direction('Right')
                }
            }, 4000);
        }

        function IndicatorCss(data) {
            $(`#Cp_Carousel_BtnSpot_${HtmlID} div p`).eq(Indicator).css('background', 'white')
            Indicator = data
            $(`#Cp_Carousel_BtnSpot_${HtmlID} div p`).eq(Indicator).css('background', 'rgb(242, 134, 134)')
        }
    }
    window.Long = Long;
})();