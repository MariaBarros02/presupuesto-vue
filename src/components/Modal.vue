<script setup>
import { ref, computed } from "vue";
import cerrarModal from "../assets/img/cerrar.svg";
import Alerta from "./Alerta.vue";

const emit = defineEmits([
  "cerrar-modal",
  "update:nombre",
  "update:cantidad",
  "update:categoria",
  "guardar-gasto",
  "eliminar-gasto"
]);
const props = defineProps({
  modal: {
    type: Object,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  cantidad: {
    type: [String, Number],
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  disponible: {
    type: Number,
    required: true,
  },
  id: {
    type: [String, null],
    required: true,
  },
});

const gastoAnterior = props.cantidad;
const error = ref("");
const editando = computed(()=>{
  return props.id
})
const agregarGasto = () => {
  const { cantidad, nombre, categoria, disponible, id } = props;
  if ([cantidad, nombre, categoria].includes("")) {
    error.value = "Todos los campos son obligatorios";
    setTimeout(() => {
      error.value = null;
    }, 3000);

    return;
  }

  if (cantidad <= 0) {
    error.value = "El valor ingresado no es válido";
    setTimeout(() => {
      error.value = null;
    }, 3000);

    return;
  }

  if (id) {
    if (cantidad > gastoAnterior + disponible) {
      error.value = "El valor del gasto ingresado supera el presupuesto";
      setTimeout(() => {
        error.value = null;
      }, 3000);

      return;
    }
  } else {
    if (cantidad > disponible) {
      error.value = "El valor del gasto ingresado supera el presupuesto";
      setTimeout(() => {
        error.value = null;
      }, 3000);

      return;
    }
  }

  emit("guardar-gasto");
};
</script>

<template>
  <div class="modal">
    <div class="cerrar-modal" @click="$emit('cerrar-modal')">
      <img :src="cerrarModal" />
    </div>
    <div
      class="contenedor contenedor-formulario"
      :class="[modal.animar ? 'animar' : 'cerrar']"
    >
      <form class="nuevo-gasto" @submit.prevent="agregarGasto">
        <legend>{{  editando ? "Actualizar gasto" : "Añadir gasto"  }} </legend>
        <Alerta v-if="error">
          {{ error }}
        </Alerta>
        <div class="campo">
          <label for="nombre"> Nombre: </label>
          <input
            type="text"
            id="nombre"
            placeholder="Añade el nombre del gasto"
            :value="nombre"
            @input="$emit('update:nombre', $event.target.value)"
          />
        </div>
        <div class="campo">
          <label for="cantidad"> Cantidad: </label>
          <input
            type="number"
            id="cantidad"
            placeholder="Añade la cantidad del gasto"
            :value="cantidad"
            @input="$emit('update:cantidad', +$event.target.value)"
          />
        </div>
        <div class="campo">
          <label for="categoria"> Categoría: </label>
          <select
            id="categoria"
            :value="categoria"
            @input="$emit('update:categoria', $event.target.value)"
          >
            <option value="">-- Seleccione --</option>
            <option value="comida">Comida</option>
            <option value="casa">Casa</option>
            <option value="gastos">Gastos Varios</option>
            <option value="ocio">Ocio</option>
            <option value="salud">Salud</option>
            <option value="suscripciones">Suscripciones</option>
          </select>
        </div>
        <input type="submit" :value="[editando ? 'Guardar cambios' : 'Añadir gasto']" />
      </form>
      <button v-if="editando" type="button" class="btn-eliminar" @click="$emit('eliminar-gasto')"> Eliminar gasto </button>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.9);
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.cerrar-modal {
  position: absolute;
  right: 3rem;
  top: 3rem;
}

.cerrar-modal img {
  width: 3rem;
  cursor: pointer;
}

.contenedor-formulario {
  transition: all 300ms ease-in;
  opacity: 0;
}

.contenedor-formulario.animar {
  opacity: 1;
}
.contenedor-formulario.cerrar {
  opacity: 0;
}

.nuevo-gasto {
  margin: 10rem auto 0 auto;
  display: grid;
  gap: 2rem;
}

.campo {
  display: grid;
  gap: 2rem;
}

.nuevo-gasto legend {
  text-align: center;
  color: var(--blanco);
  font-size: 3rem;
  font-weight: 700;
}
.nuevo-gasto input,
.nuevo-gasto select {
  background-color: var(--gris-claro);
  border-radius: 1rem;
  padding: 1rem;
  border: none;
  font-size: 2.2rem;
}

.nuevo-gasto label {
  color: var(--blanco);
}

.nuevo-gasto input[type="submit"] {
  background-color: var(--azul);
  color: var(--blanco);
  font-weight: 700;
  cursor: pointer;
}
.btn-eliminar {
  padding: 1rem;
  width: 100%;
  background-color: #ef4444;
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--blanco);
  margin-top: 10rem;
  cursor: pointer;
  border:none;

}
</style>
