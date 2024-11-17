<template>
    <div class="table-container">
        <table class="table">
            <thead>
                <tr>
                    <th class="table__header--range">
                        <abbr title="Start (Zeile, Spalte)">Start</abbr>
                    </th>
                    <th class="table__header--range">
                        <abbr title="Ende (Zeile, Spalte)">Ende</abbr>
                    </th>
                    <th class="table__header--comment">Kommentar</th>
                    <th class="table__header--actions">Aktionen</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="modelValue.length === 0" class="is-info">
                    <td colspan="4">
                        Es wurden noch keine Kommentare erstellt, markiere Text
                        im Editor und erstelle einen!
                    </td>
                </tr>

                <template v-else>
                    <tr
                        v-for="(
                            {
                                line: [startLine, endLine],
                                column: [startColumn, endColumn],
                                comment,
                            },
                            index
                        ) in modelValue"
                        :key="index"
                    >
                        <td>{{ startLine }}, {{ startColumn }}</td>
                        <td>{{ endColumn }}, {{ endLine }}</td>
                        <td>{{ comment }}</td>
                        <td>
                            <div class="buttons">
                                <button class="button" @click="reveal(index)">
                                    Auswählen
                                </button>
                                <button
                                    class="button is-danger"
                                    @click="remove(index)"
                                >
                                    Löschen
                                </button>
                            </div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
import { type DecryptedAnnotation } from 'solution-zone';
import type { Selection } from './Editor.vue';

const emit = defineEmits<{
    reveal: [selection: Selection];
}>();

const modelValue = defineModel<DecryptedAnnotation[]>({ required: true });

function remove(index: number) {
    const { comment } = modelValue.value![index];

    const proceed = confirm(
        `Möchtest du wirklich den Kommentar "${comment}" löschen?`,
    );

    if (proceed) {
        modelValue.value.splice(index, 1);
    }
}

function reveal(index: number) {
    const { line, column } = modelValue.value![index];

    emit('reveal', { line, column });
}
</script>

<style lang="scss" scoped>
.table {
    width: 100%;

    &__header {
        &--range {
            width: 5%;
        }

        &--comment {
            width: 70%;
        }

        &--actions {
            width: 20%;
        }
    }
}
</style>
