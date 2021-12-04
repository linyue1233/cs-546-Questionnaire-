// All client side scripts go herSe.
window.onload = function () {
    let btn = $('#btnSubscribe')[0];
    const text = Boolean($('#btnSubscribe').attr('data-subscribeStatus')) ? "unSubscribe" : "subscribe";
    btn.innerHTML = text;
}

$('#btnSubscribe').click(function () {
    const subscribeStatus = Boolean($('#btnSubscribe').attr('data-subscribeStatus'));
    console.log(typeof subscribeStatus);
    $.post(
        "/communities/userSubscribe", {
        communityId: location.pathname.match(/\/communities\/(\S+)$/)[1],
        subscribeStatus
    }
    ).then(result => {
        let btn = $('#btnSubscribe')[0];
        $('#btnSubscribe').attr('data-subscribeStatus', result.subscribeResult)
        const text = result.subscribeResult ? "unSubscribe" : "subscribe";
        btn.innerHTML = text;
        console.log(result.subscribeResult);
    })
})
