$(() => {
    // CÀI DỮ LIỆU ĐÃ LƯU LÊN CÁC Ô NHẬP
    $.get('/employer/account-data').done(function (data) {
        $("[name='user']").val(data.user.S)
        $("[name='company_name']").val(data.company_name.S)
        $("[name='address']").val(data.address.S)
        $("[name='contact']").val(data.contact_name.S)
        $("[name='phone']").val(data.phone.S)
    }).fail(function () {
        alert('fail')
    })

    // ĐỔI MẬT KHẨU
    $("button[name='change-password']").on('click', function () {
        $.confirm({
            title: 'Đổi mật khẩu',
            content: "" +
                "<form action='' method='post'>" +
                "<div class='form-group'>" +
                "<label>Nhập mật khẩu cũ<span class='text-danger'>*</span>:</label>" +
                "<input type='password' class='form-control' name='old' required>" +
                "</div>" +
                "<div class='form-group'>" +
                "<label>Nhập mật khẩu mới<span class='text-danger'>*</span>:</label>" +
                "<input type='password' class='form-control' name='new' required>" +
                "</div>" +
                "<div class='form-group'>" +
                "<label>Nhập lại mật khẩu mới<span class='text-danger'>*</span>:</label>" +
                "<input type='password' class='form-control' name='confirm' required>" +
                "</div>" +
                "</form>",
            closeIcon: true,
            buttons: {
                change: {
                    text: 'Đổi',
                    action: function () {
                        let jc = this
                        let old = this.$content.find("[name='old']").val()
                        let news = this.$content.find("[name='new']").val()
                        let confirm = this.$content.find("[name='confirm']").val()
                        $.post('/employer/pass-change', {old: old, news: news, confirm: confirm}).done(function (data) {
                            if (JSON.stringify(data)==='{}'){
                                jc.close()
                                $.alert("Đổi thành công")
                            }
                            else
                                alert("Sai mật khẩu hoặc mật khẩu mới không khớp")

                        }).fail(function () {
                            $.alert("Can't catch Errors")
                        })
                        return false
                    }
                },
                cancel: {
                    text: 'Hủy'
                }
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        })
    })
})