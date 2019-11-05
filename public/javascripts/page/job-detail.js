$(() => {
    $(document).on('click',"button[name='apply']", function () {
        let applyBtn = $(this)
        let user = $("[name='apply-user']").text()
        let pos = $("[name='apply-pos']").text()


        $.post('/apply-job', {user: user, pos: pos}).done((data) => {
            if (data) {
                applyBtn.attr('name','avoid')
                applyBtn.attr('class','btn btn-outline-dark')
                applyBtn.html('<h3>Hủy nộp</h3>')
            } else {
                $.alert("Không thể thực hiện nộp đơn")
            }
        }).fail(() => {
            alert("Can't apply job, error unknown")
        })

    })

    $(document).on('click',"button[name='avoid']",function () {
        let avoidBtn = $(this)
        let user = $("[name='apply-user']").text()
        let pos = $("[name='apply-pos']").text()

        $.post('/avoid-job', {user: user, pos: pos}).done((data) => {
            if (data) {
                avoidBtn.attr('name','apply')
                avoidBtn.attr('class','btn btn-outline-dark')
                avoidBtn.html('<h3>Nộp đơn</h3>')
            } else {
                $.alert("Không thể thực hiện hủy đơn đã nộp")
            }
        }).fail(() => {
            alert("Can't avoid job, error unknown")
        })
    })

})