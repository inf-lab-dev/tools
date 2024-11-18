<template>
    <div class="wrapper">
        <div class="grid is-col-min-16">
            <div class="cell">
                <SetupShPanel
                    :active="panel === 'setup'"
                    @activate="onPanelActivated('setup')"
                    @update:code="onCodeUpdated"
                />
                <MakeZipPanel
                    :active="panel === 'make-zip'"
                    @activate="onPanelActivated('make-zip')"
                    @update:code="onCodeUpdated"
                />
            </div>
            <div class="cell">
                <button
                    class="button is-primary is-fullwidth mb-4"
                    @click="save"
                >
                    Datei speichern
                </button>
                <div class="box">
                    <pre class="wrapper__code" v-html="highlightedCode"></pre>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { createHighlighterCoreSync, createJavaScriptRegexEngine } from 'shiki';
import bash from 'shiki/langs/bash.mjs';
import c from 'shiki/langs/c.mjs';
import diff from 'shiki/langs/diff.mjs';
import js from 'shiki/langs/javascript.mjs';
import python from 'shiki/langs/python.mjs';
import githubLight from 'shiki/themes/github-light.mjs';
import MakeZipPanel from './panel/MakeZipPanel.vue';
import SetupShPanel from './panel/SetupShPanel.vue';

const panel = shallowRef('setup');
const code = shallowRef('');

const highligher = computed(() =>
    createHighlighterCoreSync({
        langs: [js, c, python, bash, diff],
        themes: [githubLight],
        engine: createJavaScriptRegexEngine(),
    }),
);

const highlightedCode = computed(() =>
    highligher.value
        .codeToHtml(code.value, {
            lang: 'bash',
            theme: githubLight,
        })
        // unwrap the code-block
        .replace(/(<pre.*<code>|<\/code.*pre>)/g, ''),
);

function onPanelActivated(newPanel: string) {
    panel.value = newPanel;
}

function onCodeUpdated(newCode: string) {
    code.value = newCode;
}

function save() {
    const blob = new Blob([code.value], {
        type: 'text/plain',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${panel.value}.sh`;

    link.click();

    URL.revokeObjectURL(url);
}

onBeforeUnmount(() => highligher.value?.dispose());
</script>

<style lang="scss" scoped>
.wrapper {
    padding: 1rem;

    &__code {
        user-select: all;
    }
}

.field {
    width: 100%;
}
</style>
