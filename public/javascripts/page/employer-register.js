$(function () {
    $("input").change(function () {
        sessionStorage.email_sr = $("[name='email']").val()
        sessionStorage.password_sr = $("[name='password']").val()
        sessionStorage.confirm_sr = $("[name='confirm']").val()
        sessionStorage.company_sr = $("[name='company']").val()
        sessionStorage.tel_sr = $("[name='tel']").val()
    })
    $("select").change(function () {
        sessionStorage.pro_sr = $("[name='pro']").val()
        sessionStorage.city_sr = $("[name='city']").val()
    })

    $("[name='email']").val(sessionStorage.email_sr)
    $("[name='password']").val(sessionStorage.password_sr)
    $("[name='confirm']").val(sessionStorage.confirm_sr)
    $("[name='company']").val(sessionStorage.company_sr)
    $("[name='tel']").val(sessionStorage.tel_sr)

    $("[name='pro']").val(sessionStorage.pro_sr)
    $("[name='city']").val(sessionStorage.city_sr)
    $(".selectpicker").selectpicker('refresh')

})