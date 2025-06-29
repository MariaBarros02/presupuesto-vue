<script setup>
import { computed } from 'vue';
import {formatearDinero} from '../helpers'
import "vue3-circle-progress/dist/circle-progress.css"
import CircleProgress from 'vue3-circle-progress'


const props = defineProps({
  presupuesto: {
    type: Number,
    required: true,
  },
  disponible: {
    type: Number,
    required: true
  },
  gastado: {
    type: Number,
    required: true
  }
});

defineEmits(['reiniciar-app'])

const calcularPorcentaje = computed(()=>{
  const {presupuesto, disponible } = props;
  return parseInt(((presupuesto - disponible) / presupuesto) * 100)
})
</script>

<template>
  <div class="dos-columnas">
    <div class="contenedor-grafico">
      <p class="porcentaje">{{ calcularPorcentaje }}%</p>
      <CircleProgress :percent="calcularPorcentaje" :size="250" :border-width="20" :border-bg-width="20" fill-color="#3b82f6" empty-color="#e1e1e1" />
    </div>

    <div class="contenedor-presupuesto">
      <button class="restear-app" type="button" @click="$emit('reiniciar-app')">Resetear App</button>
      <p><span>Presupuesto: </span>{{ formatearDinero(presupuesto)}}</p>
      <p><span>Disponible: </span>{{formatearDinero(disponible)}}</p>
      <p><span>Gastado: </span>{{formatearDinero(gastado)}}</p>
    </div>
  </div>
</template>

<style scoped>
.dos-columnas {
  display: flex;
  flex-direction: column;
}
.dos-columnas > :first-child {
  margin-bottom: 3rem;
}

.contenedor-grafico {
  position: relative;
}

.porcentaje {
  position: absolute;
  margin: auto;
  top: calc(50% - 1.5rem);
  left: 0;
  right: 0;
  text-align: center;
  z-index: 100;
  font-size: 3rem;
  font-weight: 700;
  color: var(--gris-oscuro);
}
.contenedor-presupuesto {
    width: 100%;

}
.contenedor-presupuesto p {
    font-size: 2.4rem;
    text-align: center;
    color: var(--gris-oscuro);
}
.contenedor-presupuesto span {
    font-weight: 900;
    color: var(--azul);

}
.restear-app {
    background-color: #DB2777;
    border: none;
    padding: 1rem;
    width: 100%;
    color: var(--blanco);
    font-weight: 900;
    text-transform: uppercase;
    border-radius: 1rem;
    transition: background-color 300ms ease;
}

.restear-app:hover{
    background-color: #c11d67;
    cursor: pointer;
}

@media (min-width: 768px) {
  .dos-columnas {
    flex-direction: row;
    gap: 4rem;
    align-items: center;
  }

  .dos-columnas > :first-child {
    margin-bottom: 0;
  }

  .contenedor-presupuesto p {
    text-align: left;
}
}
</style>
