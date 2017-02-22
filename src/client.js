var socket = io()

var vueVars = {
    table: '#table',
    status: 'working',
    newTask: '',
    foregroundApp: '',
    dataSet: [

    ]
}

var vueMethods = {
    addNewTask() {

        if (vueVars.newTask == '') {
            return
        }
        vueVars.dataSet.push([vueVars.newTask, 0, 0, 0])
        vueVars.newTask = ''
    }
}

var vueComputed = {

}

var vueWatchers = {
    dataSet() {
        refreshTable()
    }
}

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

    var table = $(vueVars.table).DataTable({
        data: vueVars.dataSet,
        columns: [
            { title: "Active window", "width": "50%" },
            { title: "Time spent in seconds" },
            { title: "Time spent in minutes" },
            { title: "Time spent in hours" }
        ],
        dom: 'Blfrtip',
        buttons: [
            {
                extend: 'csvHtml5',
                title: getTableName(),
                class: 'primary'
            },
            {
                extend: 'excelHtml5',
                title: getTableName()
            },
            {
                extend: 'pdfHtml5',
                title: getTableName()
            }
        ]
    })

    $('.export').append(table.buttons().container())
    $('a.buttons-html5').attr('class', 'btn btn-primary')
})

socket.emit('halloVonClient')
socket.on('halloVonServer', function (message) {
    vueVars.status = 'connected to server'
    console.log(message)
})

socket.on('response-foregroundApp', function (foregroundApp) {
    vueVars.foregroundApp = foregroundApp

    var taskExists = false

    for (var i = 0; i < vueVars.dataSet.length; i++) {
        //0-task
        //1-timeSpent in s
        //2-timeSpent in m
        //3-timeSpent in h
        var task = vueVars.dataSet[i][0] // task

        if (task == foregroundApp) {
            vueVars.dataSet[i][1] += 1 //seconds
            vueVars.dataSet[i][2] = (vueVars.dataSet[i][1] / 60).toFixed(2) //minutes
            vueVars.dataSet[i][3] = ((vueVars.dataSet[i][1] / 60) / 60).toFixed(2) //hours
            taskExists = true
            break
        }
    }
    if (!taskExists) {
        vueVars.dataSet.push([foregroundApp, 1, 0, 0])
    }

    refreshTable()
})

function refreshTable() {
    var table = $(vueVars.table).DataTable()
    table.clear()
    table.rows.add(vueVars.dataSet)
    table.draw()
}

function getTableName() {
    var rightNow = new Date()
    var res = rightNow.toISOString().slice(0, 10).replace(/TZ/g, "")
    return res
}