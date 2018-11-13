if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        var code = getCode() == undefined ? '' : '?code=' + getCode();
        var guid = getGUID() == undefined ? '' : '&guid=' + getGUID();

        navigator.serviceWorker
            .register('../../../sw_offline.aspx' + code + guid)
            .then(function (reg) { console.log('Service Worker: Registered') })
            .catch(function (err) { console.log('Service Worker: Error: ' + err) })
    });
}