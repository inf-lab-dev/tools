<template>
    <div ref="editorElement" class="editor">
        <div v-if="!editorInstance" class="editor__loader">
            <progress class="editor__loaderx progress is-primary" max="100">
                Loading
            </progress>
            <h2 class="title">Loading the editor</h2>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    createEditor,
    createViteWorkerOptions,
    type DecryptedAnnotation,
    type Editor,
} from 'solution-zone';

export type Selection = Pick<DecryptedAnnotation, 'line' | 'column'>;

const editorElement = useTemplateRef<HTMLDivElement>('editorElement');
const editorInstance = shallowRef<Editor>();

const props = defineProps<{
    language: string;
    annotations: DecryptedAnnotation[];
}>();

const emit = defineEmits<{
    updateSelection: [selection: Selection, hasContent: boolean];
}>();

const modelValue = defineModel<string>({ required: true });

function updateAnnotations() {
    if (!editorInstance.value) {
        return;
    }

    const [monaco, editor] = editorInstance.value;

    const markers = props.annotations.map(
        ({
            line: [startLineNumber, endLineNumber],
            column: [startColumn, endColumn],
            comment: message,
        }) => ({
            startLineNumber,
            endLineNumber,
            startColumn,
            endColumn,
            message,
            severity: monaco.MarkerSeverity.Info,
        }),
    );

    monaco.editor.setModelMarkers(editor.getModel()!, 'annotations', markers);
}

async function setupEditor() {
    if (!editorElement.value) {
        throw new ReferenceError(
            'Could not find element to display solution within.',
        );
    }

    const [monaco, editor] = await createEditor({
        worker: await createViteWorkerOptions(
            import('monaco-editor/esm/vs/editor/editor.worker?worker'),
            import('monaco-editor/esm/vs/language/css/css.worker?worker'),
            import('monaco-editor/esm/vs/language/html/html.worker?worker'),
            import('monaco-editor/esm/vs/language/json/json.worker?worker'),
            (async () => {
                class FailingTsWorker extends Worker {
                    constructor() {
                        super('/invalid-url');

                        throw new Error('Make ts-worker fail automatically.');
                    }
                }

                return { default: FailingTsWorker };
            })(),
        ),
        element: editorElement.value,
        options: {
            language: props.language,
            value: modelValue.value,
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderValidationDecorations: 'on',
            theme: matchMedia('(prefers-color-scheme: dark)').matches
                ? 'vs-dark'
                : 'vs-light',
        },
    });

    editorInstance.value = [monaco, editor];

    editor.onDidChangeModelContent(() => {
        const value = editor.getValue();

        if (value !== modelValue.value) {
            modelValue.value = value;
        }
    });

    editor.onDidChangeCursorSelection((event) => {
        const { startLineNumber, endLineNumber, startColumn, endColumn } =
            event.selection;

        emit(
            'updateSelection',
            {
                line: [startLineNumber, endLineNumber],
                column: [startColumn, endColumn],
            },
            startLineNumber !== endLineNumber || startColumn !== endColumn,
        );
    });

    updateAnnotations();
}

function gotoSelection(selection: Selection) {
    if (!editorInstance.value) {
        throw new ReferenceError(
            'Could not find editor to go to selection within.',
        );
    }

    const [, editor] = editorInstance.value;
    const {
        line: [startLineNumber, endLineNumber],
        column: [startColumn, endColumn],
    } = selection;

    const monacoSelection = {
        startLineNumber,
        startColumn,
        endLineNumber,
        endColumn,
    };

    editor.revealRangeInCenter(monacoSelection);
    editor.setSelection(monacoSelection);
}

watch(
    props,
    () => {
        updateAnnotations();

        if (editorInstance.value) {
            const [monaco, editor] = editorInstance.value;

            monaco.editor.setModelLanguage(editor.getModel()!, props.language);
        }
    },
    { deep: true },
);

watch(modelValue, (newValue) => {
    if (editorInstance.value) {
        const [, editor] = editorInstance.value;

        if (newValue && editor.getValue() !== newValue) {
            editor.setValue(newValue);
        }
    }
});

onMounted(() => setupEditor());
onBeforeUnmount(() => {
    if (editorInstance.value) {
        const [, editor] = editorInstance.value;

        editor.dispose();
    }
});

defineExpose({ gotoSelection });
</script>

<style lang="scss" scoped>
.editor {
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;

    &__loader {
        display: flex;
        flex-direction: column;

        width: 100%;
        height: 100%;

        justify-content: center;
        align-items: center;

        &__bar {
            width: 100%;
        }
    }
}
</style>
