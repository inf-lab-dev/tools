<template>
    <form class="panel is-info comment" @submit.prevent="createComment">
        <h2 class="panel-heading">Kommentare</h2>
        <div class="panel-block">
            <div class="field comment__field">
                <label class="label" for="language-selection">Kommentar</label>
                <div class="control">
                    <textarea
                        v-model="comment"
                        :disabled="disabled"
                        class="textarea"
                    ></textarea>
                </div>
            </div>
        </div>
        <div class="panel-block is-flex is-flex-direction-column">
            <button
                :disabled="disabled"
                type="submit"
                class="button is-fullwidth"
            >
                Kommentar erstellen
            </button>
        </div>
    </form>
</template>

<script lang="ts" setup>
defineProps<{
    disabled: boolean;
}>();

const emit = defineEmits<{
    create: [comment: string];
}>();

const comment = shallowRef('');

function createComment() {
    emit('create', comment.value);

    comment.value = '';
}
</script>

<style lang="scss" scoped>
.comment {
    &__field {
        width: 100%;
    }
}
</style>
