$(() => {
    $(document).on('click',"button[name='apply']", function () {
        let applyBtn = $(this)
        let user = $("[name='apply-user']").text()
        let pos = $("[name='apply-pos']").text()

        applyBtn.find("h3").prepend("<span class='fa fa-spinner fa-spin'></span>")
        applyBtn.attr('disable',true)

        $.post('/apply-job', {user: user, pos: pos}).done((data) => {
            if (data) {
                applyBtn.attr('name','avoid')
                applyBtn.attr('class','btn btn-outline-dark')
                applyBtn.attr('disable',false)
                applyBtn.find("h3 .fa").remove()
                applyBtn.find("h3").html('Hủy nộp')
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

        avoidBtn.find("h3").prepend("<span class='fa fa-spinner fa-spin'></span>")
        avoidBtn.attr('disable',true)

        $.post('/avoid-job', {user: user, pos: pos}).done((data) => {
            if (data) {
                avoidBtn.attr('name','apply')
                avoidBtn.attr('class','btn btn-outline-dark')
                avoidBtn.attr('disable',false)
                avoidBtn.find("h3 .fa").remove()
                avoidBtn.find('h3').html('Nộp đơn')
            } else {
                $.alert("Không thể thực hiện hủy đơn đã nộp")
            }
        }).fail(() => {
            alert("Can't avoid job, error unknown")
        })
    })

})