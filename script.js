"use strict"


const number = document.getElementById('number');
const text = document.getElementById('text');
const month = document.getElementById('month');
const year = document.getElementById('year');
const tasksContainer = document.getElementById('tasksContainer');
const setDate =()=>{
    const date = new Date();
    number.textContent = date.toLocaleString('es',{day:'numeric'});
    text.textContent= date.toLocaleDateString('es',{weekday:'long'});
    month.textContent = date.toLocaleDateString('es',{month:'short'});
    year.textContent = date.toLocaleDateString('es',{year:'numeric'});
}
setDate();

const formulario = document.querySelector("#formulario");
const tareas = document.querySelector("#tareas");
const total = document.querySelector("#total");
const completadas = document.querySelector("#completadas");
let task = [];
/* EVENTOS */

(() => {
    formulario.addEventListener('submit', validarFormulario);
    tareas.addEventListener("click", eliminarTarea);
    tareas.addEventListener("click", completarTarea);
    tareas.addEventListener("click", marcarTareaComoImportante);
    document.addEventListener("DOMContentLoaded", () => {
        let datosLS = JSON.parse(window.localStorage.getItem("tareas")) || [];

        task = datosLS;
        agregarHTML();

    })
})()


function validarFormulario(e) {
    e.preventDefault();
    //validar los campos
    const tarea = document.querySelector("#tarea").value;
    if (tarea.trim().length === 0) {
        return
    }

    const objTarea = { id: Date.now(), tarea: tarea, estado: false };
    task = [...task, objTarea];
    formulario.reset();
    agregarHTML();
}

function agregarEstadoHTML(newItem) {  
    if(newItem.estado) return `<span class='completa'>${newItem.tarea}</span>`
    
    if(newItem.importante) return `<span class='importante importa'>${newItem.tarea}</span>`

    return `<span>${newItem.tarea}</span>`

}

function agregarHTML() {
    while (tareas.firstChild) {
        tareas.removeChild(tareas.firstChild)
    }
    if (task.length > 0) {
        task.forEach(item => {
          const elemento = document.createElement('div');
            elemento.classList.add('item-tarea');
            elemento.innerHTML = `
                <p>${agregarEstadoHTML(item)}</p>
                <div class="botones">
                    <button class="eliminar" data-id="${item.id}">Eliminar</button>
                    <button class="completada" data-id="${item.id}">Hecha</button>
                    <button class="importante" data-id="${item.id}">Importante</button>
                                    </div>
            `
            tareas.appendChild(elemento)
        });

    } else {
        const mensaje = document.createElement("h5");
        mensaje.textContent = "SIN TAREAS"
        tareas.appendChild(mensaje)
    }

    let totalTareas = task.length;

    let tareasCompletas = task.filter(item => item.estado === true).length;
   
    window.localStorage.setItem("tareas", JSON.stringify(task) )
}



function eliminarTarea(e) {
    if (e.target.classList.contains("eliminar")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        //eliminamos con el array method filter
        const nuevasTareas = task.filter((item) => item.id !== tareaID);
        task = nuevasTareas;
        agregarHTML();
    }
}

//completar tarea
function completarTarea(e) {
    if (e.target.classList.contains("completada")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        const nuevasTareas = task.map(item => {
            if (item.id === tareaID) {
                item.estado = !item.estado;
                return item;
            } else {
                return item
            }
        })
        task = nuevasTareas;
        agregarHTML();
    }
}

function marcarTareaComoImportante(e) {
    if (e.target.classList.contains("importante")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        const nuevasTareas = task.map(item => {
            if (item.id === tareaID) {
                item.importante = !item.importante;
                return item;
            } else {
                return item
            }
        })
        task = nuevasTareas;
        agregarHTML();
    }
}

