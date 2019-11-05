$(() => {

    $('select').on('change',function () {
        sessionStorage.select_job = $("[name='choose-pos']").val()
        sessionStorage.select_job_id = $("[name='choose-pos']").find(":selected").index()
    })

    $("[name='choose-pos']").val(sessionStorage.select_job)
    $(".selectpicker").selectpicker('refresh')

    $('a[data-toggle="tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
        let id = $(e.target).attr("href");
        localStorage.setItem('selectedTab', id)
    });

    let selectedTab = localStorage.getItem('selectedTab');
    if (selectedTab != null) {
        $('a[data-toggle="tab"][href="' + selectedTab + '"]').tab('show');
    }

    // CHỌN VỊ TRÍ CÔNG VIỆC ĐỂ HIỂN THỊ DANH SÁCH TƯƠNG ỨNG
    // NÚT LOẠI
    $("select[name='choose-pos']").on('change', function () {
        let value = $(this).val()
        $("tbody").html("")
        $.post('/employer/manager/seeker-for-position', {value: value}).done((data) => {
            if (data && data.applicants) {
                data.applicants.forEach(function (item,index) {
                    $("tbody[name='pos-0']").append(
                        `<tr><td scope='col' name="pos">${index+1}</td><td name="email">${item.applicant}</td><td>
                            <button type="button" class="btn btn-success" name="potential">Tiềm năng</button>
                            <button type="button" class="btn btn-danger" name="fired">Loại</button>
                        </td></tr>`
                    )
                    if (item.classify === 1)
                        $("tbody[name='pos-1']").append(
                            `<tr><td scope='col' name="pos">${index+1}</td><td name="email">${item.applicant}</td><td>
                                <button type="button" class="btn btn-success" name="recruited">Tuyển dụng</button>
                                <button type="button" class="btn btn-outline-dark" name="applicant">Không tiềm năng</button>
                                <button type="button" class="btn btn-danger" name="fired">Loại</button>
                            </td></tr>`
                        )
                    if (item.classify === 2)
                        $("tbody[name='pos-2']").append(
                            `<tr><td scope='col' name="pos">${index+1}</td><td name="email">${item.applicant}</td><td>
                                <button type="button" class="btn btn-success" name="potential">Tiềm năng</button>
                                <button type="button" class="btn btn-danger" name="fired">Loại</button>
                            </td></tr>`
                        )
                })
            }
        }).fail(() => {
            alert("Select position fail")
        })
    })

    // CÁC THAO TÁC VỚI NGƯỜI ĐÃ NỘP ĐƠN
    $(document).on('click',"button[name='fired']",function () {
        let row = $(this).parent().parent()
        let email = row.find("td[name='email']").text()
        let index = row.find("td[name='pos']").text()
        let pos = $("select[name='choose-pos']").val()

        $.confirm({
            content: 'Bạn có chắc muốn loại?',
            type: 'red',
            buttons: {
                fired: {
                    text: 'Loại',
                    btnClass: 'btn-danger',
                    action: function () {
                        $.post('/employer/manager/seeker-fired', { pos: pos, index: (parseInt(index)-1), email: email }).done((data) => {
                            if (data)
                                window.location.reload()
                        }).fail(() => {
                            alert("Select position fail")
                        })
                    }
                },
                cancel: {
                    text: 'Hủy'
                }
            }
        })
    })

    // NÚT ỨNG CỬ VIÊN TIỀM NĂNG
    $(document).on('click',"button[name='potential']",function () {
        let row = $(this).parent().parent()
        let index = row.find("td[name='pos']").text()
        let pos = $("select[name='choose-pos']").val()

        $.confirm({
            content: 'Bạn có chắc đây là hồ sơ tiềm năng?',
            type: 'green',
            buttons: {
                fired: {
                    text: 'Tiềm năng',
                    btnClass: 'btn-success',
                    action: function () {
                        $.post('/employer/manager/seeker-up', { pos: pos, index: (parseInt(index)-1) , po: 0 }).done(function (data) {
                            if (data)  window.location.reload()
                        }).fail(function () {
                            alert('Failed')
                        })
                    }
                },
                cancel: {
                    text: 'Hủy'
                }
            }
        })

    })

    // NÚT TUYỂN DỤNG
    $(document).on('click',"button[name='recruited']",function () {
        let row = $(this).parent().parent()
        let email = row.find("td[name='email']").text()
        let index = row.find("td[name='pos']").text()
        let pos = $("select[name='choose-pos']").val()

        $.confirm({
            content: 'Bạn có chắc đây là hồ sơ muốn tuyển dụng?',
            type: 'green',
            buttons: {
                fired: {
                    text: 'Tuyển dụng',
                    btnClass: 'btn-success',
                    action: function () {
                        $.post('/employer/manager/seeker-up', { pos: pos, index: (parseInt(index)-1) , po: 1 }).done(function (data) {
                            if (data)  window.location.reload()
                        }).fail(function () {
                            alert('Failed')
                        })
                    }
                },
                cancel: {
                    text: 'Hủy'
                }
            }
        })
    })

    // NÚT LOẠI TƯ CÁCH ỨNG VIÊN TIỀM NĂNG
    $(document).on('click',"button[name='applicant']",function () {
        let row = $(this).parent().parent()
        let index = row.find("td[name='pos']").text()
        let pos = $("select[name='choose-pos']").val()

        $.confirm({
            content: 'Bạn có chắc đây không còn là ứng viên tiềm năng?',
            type: 'orange',
            buttons: {
                fired: {
                    text: 'Không tiềm năng',
                    btnClass: 'btn-success',
                    action: function () {
                        $.post('/employer/manager/seeker-down', { pos: pos, index: (parseInt(index)-1) , po: 1 }).done(function (data) {
                            if (data)
                                row.remove()
                        }).fail(function () {
                            alert('Failed')
                        })
                    }
                },
                cancel: {
                    text: 'Hủy'
                }
            }
        })
    })

    //NÚT LOẠI TƯ CÁCH NGƯỜI ĐƯỢC ỨNG TUYỂN
    $(document).on('click',"button[name='potential_down']",function () {
        let row = $(this).parent().parent()
        let email = row.find("td[name='email']").text()
        let index = row.find("td[name='pos']").text()
        let pos = $("select[name='choose-pos']").val()

        $.confirm({
            content: 'Bạn có chắc đây không còn là ứng viên được tuyển dụng?',
            type: 'orange',
            buttons: {
                fired: {
                    text: 'Tiềm năng',
                    btnClass: 'btn-danger',
                    action: function () {
                        $.post('/employer/manager/seeker-down', { pos: pos, index: (parseInt(index)-1) , po: 2 }).done(function (data) {
                            if (data) window.location.reload()
                        }).fail(function () {
                            alert('Failed')
                        })
                    }
                },
                cancel: {
                    text: 'Hủy'
                }
            }
        })
    })


})