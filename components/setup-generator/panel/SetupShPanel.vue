<template>
    <article
        :class="[
            'panel',
            {
                'is-primary': active,
            },
        ]"
    >
        <h2 class="panel-heading">setup.sh Generator</h2>
        <div class="panel-block">
            <div class="field">
                <label class="label" for="url">URL zum ZIP-Archiv</label>
                <div class="control">
                    <input
                        v-model="url"
                        :class="[
                            'input',
                            {
                                'is-danger': !!!url,
                            },
                        ]"
                        id="url"
                        type="url"
                        autofocus
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
                        v-model="commands"
                        class="textarea"
                        @focus="activate"
                    ></textarea>
                </div>
                <p class="help">
                    Ein Befehl pro Zeile, du kannst die Platzhalter
                    <code>%zipFileName%</code> und
                    <code>%zipFolderName%</code> verwenden.
                </p>
            </div>
        </div>
    </article>
</template>

<script lang="ts" setup>
const UNKNOWN_FILE_NAME = 'unknown.zip';

const emit = defineEmits<{
    activate: [];
    'update:code': [code: string];
}>();

const props = defineProps<{
    active: boolean;
}>();

const url = shallowRef('');
const commands = shallowRef('cd %zipFolderName%');

const fileName = computed(() => {
    try {
        return (
            new URL(url.value).pathname.split('/').pop() ?? UNKNOWN_FILE_NAME
        );
    } catch {
        return UNKNOWN_FILE_NAME;
    }
});
const folderName = computed(
    () => fileName.value.split('.').shift() ?? 'unknown',
);

const code = computed(() => {
    const commandList = commands.value.split('\n');
    const renderedCommands = commandList
        ? `
# Display further instructions
echo -e "\${YELLOW}👉 To continue, run the following commands:\${RESET}"
${commandList.map(renderCommand).join('\n')}
`
        : '';

    return `#!/bin/bash

# Define escape sequences for colors
RED='\\033[0;31m'
GREEN='\\033[0;32m'
BLUE='\\033[0;34m'
CYAN='\\033[0;36m'
YELLOW='\\033[0;33m'
BOLD='\\033[1m'
RESET='\\033[0m'

# URL of the ZIP archive
URL="${url.value}"

# the name of the zip file that has been downloaded
ZIP_FILE="${fileName.value}"

# Hello World, I guess...
echo -e "\${CYAN}\${BOLD}👋 Welcome!\${RESET} Let's get your files ready to go! 🚀"

# Download the zip file
echo -e "\${BLUE}🔗 Downloading from $URL...\${RESET}"
curl -L -o "$ZIP_FILE" "$URL" && echo -e "\${GREEN}✅ Download complete!\${RESET}"

# Unzip the file
echo -e "\${BLUE}📂 Unzipping $ZIP_FILE...\${RESET}"
unzip "$ZIP_FILE" -d ${folderName.value} && rm "$ZIP_FILE"
echo -e "\${GREEN}✅ Unzipping complete!\${RESET}"${renderedCommands}
# End the script
echo -e "\${GREEN}✅ Goodbye! 👋\${RESET}"
`;
});

function renderCommand(command: string) {
    const interpolated = command
        .replace(/%zipFileName%/g, fileName.value)
        .replace(/%zipFolderName%/g, folderName.value);

    return `echo -e "\${BOLD}   ${interpolated}\${RESET}"`;
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
