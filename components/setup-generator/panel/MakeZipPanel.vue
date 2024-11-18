<template>
    <article
        :class="[
            'panel',
            {
                'is-primary': active,
            },
        ]"
    >
        <h2 class="panel-heading">make-zip.sh Generator</h2>
        <div class="panel-block">
            <div class="field">
                <label class="label" for="file">Name des ZIP-Archivs</label>
                <div class="control">
                    <input
                        v-model="file"
                        :class="[
                            'input',
                            {
                                'is-danger': !!!file,
                            },
                        ]"
                        id="file"
                        type="text"
                        @focus="activate"
                    />
                </div>
            </div>
        </div>
        <div class="panel-block">
            <div class="field">
                <label class="label" for="commands">
                    Befehle nach dem Entpacken
                </label>
                <div class="control">
                    <textarea
                        v-model="files"
                        :class="[
                            'textarea',
                            {
                                'is-danger': !!!files,
                            },
                        ]"
                        @focus="activate"
                    ></textarea>
                </div>
                <p class="help">
                    Ein Pfad pro Zeile, werden relativ zur
                    <code>make-zip.sh</code> interpretiert.
                </p>
            </div>
        </div>
    </article>
</template>

<script lang="ts" setup>
const ZIP_EXTENSION = '.zip';

const emit = defineEmits<{
    activate: [];
    'update:code': [code: string];
}>();

const props = defineProps<{
    active: boolean;
}>();

const file = shallowRef('');
const files = shallowRef('task.pdf');

const fileName = computed(() =>
    file.value.endsWith(ZIP_EXTENSION)
        ? file.value
        : `${file.value}${ZIP_EXTENSION}`,
);
const code = computed(() => {
    const filesList = files.value.split('\n').map(renderFile);

    return `#!/bin/bash

# Remove if it exists
if [ -f ${fileName.value} ]; then
  rm ${fileName.value}
fi

# And recreate
zip -j ${fileName.value} ${filesList.join(' ')}
`;
});

function renderFile(file: string) {
    return file.startsWith('/') ||
        file.startsWith('../') ||
        file.startsWith('./')
        ? file
        : `./${file}`;
}

function activate() {
    emit('activate');
}

watchEffect(() => {
    if (props.active) {
        emit('update:code', code.value);
    }
});
</script>

<style lang="scss" scoped>
.field {
    width: 100%;
}
</style>
