<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import Presupuesto from "./components/Presupuesto.vue";
import ControlPresupuesto from "./components/ControlPresupuesto.vue";
import iconoNuevoGasto from "./assets/img/nuevo-gasto.svg";
import Modal from "./components/Modal.vue";
import Gasto from "./components/Gasto.vue";
import Filtro from "./components/Filtro.vue";
import { crearId } from "./helpers";

const modal = reactive({
  mostrar: false,
  animar: false,
});

const presupuesto = ref(0);
const disponible = ref(0);
const gastado = ref(0);
const gastos = ref([]);
const filtro = ref('');

const gasto = reactive({
  nombre: "",
  cantidad: "",
  categoria: "",
  id: null,
  fecha: Date.now(),
});

watch(
  gastos,
  () => {
    const totalGastado = gastos.value.reduce(
      (total, gasto) => gasto.cantidad + total,
      0
    );
    gastado.value = totalGastado;
    disponible.value = presupuesto.value - gastado.value;

    localStorage.setItem('gastos', JSON.stringify(gastos.value))
  },
  { deep: true }
);

watch(
  modal,
  () => {
    if (!modal.mostrar) {
      reiniciarObjeto();
    }
  },
  { deep: true }
);

watch(presupuesto, ()=>{
  localStorage.setItem('presupuesto', presupuesto.value);
})
const definirPresupuesto = (cantidad) => {
  presupuesto.value = cantidad;
  disponible.value = cantidad;
};

onMounted(()=>{
  const presupuestoAlmacenado = localStorage.getItem('presupuesto')
  if(presupuestoAlmacenado){
    presupuesto.value = Number(presupuestoAlmacenado)
    disponible.value = Number(presupuestoAlmacenado)
  }

  const gastosAlmacenados = localStorage.getItem('gastos');
  if(gastosAlmacenados) {
    gastos.value = JSON.parse(gastosAlmacenados)
  }
})
const mostrarModal = () => {
  modal.mostrar = true;
  setTimeout(() => {
    modal.animar = true;
  }, 300);
};

const cerrarModal = () => {
  modal.animar = false;
  setTimeout(() => {
    modal.mostrar = false;
  }, 300);
};

const guardarGasto = () => {
  if (gasto.id) {
    const { id } = gasto;
    const i = gastos.value.findIndex((gasto) => gasto.id === id);
    gastos.value[i] = { ...gasto };
  } else {
    gastos.value.push({ ...gasto, id: crearId() });
  }

  cerrarModal();
  reiniciarObjeto();
};

const reiniciarObjeto = () => {
  Object.assign(gasto, {
    nombre: "",
    cantidad: "",
    categoria: "",
    id: null,
    fecha: Date.now(),
  });
};
const seleccionarGasto = (id) => {
  const gastoSeleccionado = gastos.value.filter((gasto) => gasto.id === id)[0];
  Object.assign(gasto, gastoSeleccionado);
  mostrarModal();
};

const eliminarGasto = () => {
  if (confirm("¿Estás seguro que quieres eliminar este gasto?")) {
    gastos.value = gastos.value.filter(
      (gastoState) => gastoState.id !== gasto.id
    );
    cerrarModal();
  }
};

const gastosFiltrados = computed(()=>{
    if(filtro.value){
      return gastos.value.filter(gasto => gasto.categoria === filtro.value)
    }
    return gastos.value
})

const reiniciarApp = () =>{
   if (confirm("¿Estás seguro que quieres eliminar el presupuesto?")) {
    gastos.value = [];
    presupuesto.value= 0 
  }
}
</script>

<template>
  <div :class="{ fijar: modal.mostrar }">
    <header>
      <h1>Planificador de gastos</h1>
      <div class="contenedor-header contenedor sombra">
        <Presupuesto
          v-if="presupuesto === 0"
          @definir-presupuesto="definirPresupuesto"
        />
        <ControlPresupuesto :presupuesto :disponible :gastado @reiniciar-app="reiniciarApp" v-else />
      </div>
    </header>
    <main v-if="presupuesto > 0">
      <Filtro v-model:filtro="filtro" />
      <div class="listado-gastos contenedor">
        <h2>{{ gastosFiltrados.length > 0 ? "Listado de gastos" : "No hay gastos" }}</h2>

        <Gasto
          v-for="gasto in gastosFiltrados"
          :gasto="gasto"
          @seleccionar-gasto="seleccionarGasto"
        />
      </div>
      <div class="crear-gasto">
        <img
          :src="iconoNuevoGasto"
          @click="mostrarModal"
          alt="icono nuevo gasto"
        />
      </div>
      <Modal
        v-if="modal.mostrar"
        :modal
        :disponible
        :id="gasto.id"
        v-model:nombre="gasto.nombre"
        v-model:cantidad="gasto.cantidad"
        v-model:categoria="gasto.categoria"
        @cerrar-modal="cerrarModal"
        @guardar-gasto="guardarGasto"
        @eliminar-gasto="eliminarGasto"
      />
    </main>
  </div>
</template>

<style>
:root {
  --azul: #3b82f6;
  --blanco: #fff;
  --gris-claro: #f5f5f5;
  --gris: #94a3b8;
  --gris-oscuro: #64748b;
  --negro: #000;
}
html {
  font-size: 62.5%;
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}
body {
  font-size: 1.6rem;
  font-family: "Lato", sans-serif;
  background-color: var(--gris-claro);
}
h1 {
  font-size: 4rem;
}
h2 {
  font-size: 3rem;
}
header {
  background-color: var(--azul);
}

header h1 {
  padding: 3rem 0;
  margin: 0;
  color: var(--blanco);
  text-align: center;
}

.contenedor {
  width: 90%;
  max-width: 80rem;
  margin: 0 auto;
}
.contenedor-header {
  margin-top: -5rem;
  transform: translateY(5rem);
  padding: 5rem;
}

.sombra {
  box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  background-color: var(--blanco);
  border-radius: 1.2rem;
  padding: 5rem;
}

.crear-gasto {
  position: fixed;
  bottom: 5rem;
  right: 5rem;
}
.crear-gasto img {
  width: 5rem;
  cursor: pointer;
}

.crear-gasto img:hover {
}

.listado-gastos {
  margin-top: 10rem;
}
.listado-gastos h2 {
  font-weight: 900;
  color: var(--gris-oscuro);
}

.fijar {
  overflow: hidden;
  height: 100vh;
}
</style>
