$(function () {
    // INIT SELECT
    $("select").selectpicker()

    $("a[name='more-benefit']").click(function () {

    })

    $(document).on('click', "input[name='submit']", function () {
        $('#job-form').submit()
    })

    // SAVE THE CURRENT INPUT
    $("input").change(function () {
        sessionStorage.pos = $("[name='pos']").val()
        sessionStorage.minSalary = $("[name='minSalary']").val()
        sessionStorage.maxSalary = $("[name='maxSalary']").val()
        sessionStorage.tag = $("[name='tag']").val()
        sessionStorage.contact = $("[name='contact']").val()
        sessionStorage.email = $("[name='email']").val()
        sessionStorage.name = $("[name='name']").val()
        sessionStorage.address = $("[name='address']").val()
        sessionStorage.benefit = $("[name='benefit']").val()
        sessionStorage.logo = $("[name='logo']").val()
    })
    $("select").change(function () {
        sessionStorage.rank = $("[name='rank']").val()
        sessionStorage.pro = $("[name='pro']").val()
        sessionStorage.workplace = $("[name='workplace']").val()
        sessionStorage.lang = $("[name='lang']").val()
    })
    $("textarea").change(function () {
        sessionStorage.description = $("[name='description']").val()
        sessionStorage.require = $("[name='require']").val()
        sessionStorage.info = $("[name='info']").val()
    })

    // AFTER PAGE LOADED SET FIELD BY OLD INPUT
    $("[name='pos']").val(sessionStorage.pos)
    $("[name='minSalary']").val(sessionStorage.minSalary)
    $("[name='maxSalary']").val(sessionStorage.maxSalary)
    $("[name='tag']").val(sessionStorage.tag)
    $("[name='contact']").val(sessionStorage.contact)
    $("[name='email']").val(sessionStorage.email)
    $("[name='name']").val(sessionStorage.name)
    $("[name='address']").val(sessionStorage.address)
    $("[name='benefit']").val(sessionStorage.benefit)
    $("[name='logo']").val(sessionStorage.logo)

    $("[name='rank']").val(sessionStorage.rank)
    $("[name='pro']").val(sessionStorage.pro)
    $("[name='workplace']").val(sessionStorage.workplace)
    $("[name='lang']").val(sessionStorage.lang)
    $(".selectpicker").selectpicker('refresh')

    $("[name='description']").val(sessionStorage.description)
    $("[name='require']").val(sessionStorage.require)
    $("[name='info']").val(sessionStorage.info)

})