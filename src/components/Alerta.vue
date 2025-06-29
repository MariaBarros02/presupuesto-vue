
<template>
    <div class="alerta">
        <slot></slot>
    </div>
</template>
<style scoped>
    .alerta{
        padding: 1rem;
        font-weight: 900;
        text-transform:uppercase;
        font-size: 1.6rem;
        background-color: var(--blanco);
        text-align:center;
        border-left: .5rem solid #B81c1c;
        color: #B91c1c;
        margin-bottom: 2rem;
    }
</style>