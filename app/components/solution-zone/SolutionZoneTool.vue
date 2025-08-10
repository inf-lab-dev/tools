<template>
    <div class="columns">
        <div class="column">
            <EncryptPanel />
        </div>
        <div class="column">
            <DecryptPanel />
        </div>
    </div>
</template>

<script lang="ts" setup>
import DecryptPanel from './panel/DecryptPanel.vue';
import EncryptPanel from './panel/EncryptPanel.vue';
</script>

<style lang="css" scoped></style>
