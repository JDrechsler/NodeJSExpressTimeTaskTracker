var socket = io()

var vueVars = {
    status: 'works',
    foregroundApp: ''
}

var vueMethods = {

}

var vueComputed = {

}

var vueWatchers = {

}

socket.emit('halloVonClient')
socket.on('halloVonServer', function (message) {
    vueVars.status = 'works and connected to server'
    console.log(message)
})

socket.on('response-foregroundApp', function (foregroundApp) {
    vueVars.foregroundApp = foregroundApp
})

document.addEventListener("DOMContentLoaded", () => {
    new Vue({
        el: '#app',
        data: vueVars,
        methods: vueMethods,
        computed: vueComputed,
        watch: vueWatchers
    })

    document.ondragover = document.ondrop = (ev) => {
        ev.preventDefault();
    }
    document.body.ondrop = (ev) => {
        ev.preventDefault();
    }
})