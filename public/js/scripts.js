// All client side scripts go herSe.
window.onload = function () {
    let btn = $('#btnSubscribe')[0];
    const text = JSON.parse($('#btnSubscribe').attr('data-subscribeStatus')) ? "unSubscribe" : "subscribe";
    btn.innerHTML = text;
}

$('#btnSubscribe').click(function () {
    $('#error-message').hide();
    const subscribeStatus = JSON.parse($('#btnSubscribe').attr('data-subscribeStatus'));
    $.post(
        "/communities/userSubscribe", {
        communityId: location.pathname.match(/\/communities\/(\S+)$/)[1],
        subscribeStatus
    }
    ).then(result => {
        let btn = $('#btnSubscribe')[0];
        $('#btnSubscribe').attr('data-subscribeStatus', result.subscribeStatus)
        const text = result.subscribeStatus ? "unSubscribe" : "subscribe";
        btn.innerHTML = text;
    }).fail(result=>{
        alert(result.responseText);
    })
})
