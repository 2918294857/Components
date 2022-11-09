function PC_ZYL_loop(str, data, HtmlId) {
    var regex3 = /\{\{(.+?)\}\}/g;
    var bl = str.match(regex3)
    var str1 = ""
    str1 = str
    var res = "";
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < bl.length; j++) {
            str1 = str1.replace(bl[j], eval(bl[j]).replace('{{', '').replace('}}', ""))
        }
        res += str1
        str1 = str
    }
    $(HtmlId).innerHTML = res
}