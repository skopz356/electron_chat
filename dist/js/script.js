$(document).ready(() => {
    let ipcRenderer = require('electron').ipcRenderer;

    $("#add-article").submit((e) => {
        e.preventDefault();
        let formData = $("#add-article").serializeArray();
        ipcRenderer.send('submitForm', formData);
        $("#add-article").trigger("reset");
    });

    $(".switcher > button").click(function (e) {
        e.preventDefault();
        let change = $(this).data("change");
        $("[data-item]").removeClass();
        $(`[data-item="${change}"]`).addClass("active");
    });

    $('[data-item="filter"] select').change(function (e) {
        e.preventDefault();
        let selected = $(this).find("option:selected").val(),
            data;
        if ($(this).attr("name") === "filter_date") {
            data = { "filter_date": selected };
        } else if ($(this).attr("name") === "filter_attr") {
            let value = $('[name="filter_value"]').val();
            data = {"filter_attr": [selected, value]};
        }

        ipcRenderer.send("getArticles", data);
        ipcRenderer.on('asynchronous-reply', (event, articles_html) => {
            $(".articles").html(articles_html);
        });
    });

    $(".load-more").click((e) => {
        e.preventDefault();
        let first_created = $("article").first().data("created");
        ipcRenderer.send("getArticles", first_created);
        ipcRenderer.on('asynchronous-reply', (event, articles_html) => {
            let old = $(".articles").html();
            let new_html = articles_html + old;
            $(".articles").html(new_html);
        })
    });
});