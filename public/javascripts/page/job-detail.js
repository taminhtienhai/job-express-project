$(()=>{
    $("button[name='apply']").on('click', function () {
        let applyBtn = $(this)
        let user = $("[name='apply-user']").text()
        let pos = $("[name='apply-pos']").text()
        $.post('/apply-job',{ user: user, pos: pos}).done((data)=>{
            if (data){
                applyBtn.html('<h3>Đã nộp</h3>')
                applyBtn.attr("disabled", true)
            } else {
                alert("Không thể thực hiện nộp đơn")
            }
        }).fail(()=>{
            alert("Can't apply job, error unknown")
        })
    })
})