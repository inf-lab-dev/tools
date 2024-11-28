<template>
    <div v-if="!renderedContent" class="selection">
        <p class="selection__text">
            Klicke, um eine Markdown-Datei auszuwählen, oder lege sie auf dieser
            Seite ab.

            <span class="selection__note"
                >Aus technischen Gründen unterstützt diese Markdown-Darstellung
                <em>nicht die selben Funktionen</em> wie inf-lab.dev!
                <br />
                Insbesondere Erweiterungen bei Code-Blöcken sind hier nicht
                verfügbar.</span
            >
        </p>
        <input
            class="selection__input"
            :disabled="isLoading"
            type="file"
            accept=".md"
            @change="onFileSelected"
        />
    </div>

    <div v-else v-html="renderedContent" :class="$style.content"></div>
</template>

<script lang="ts" setup>
import jsYaml from 'js-yaml';
import { Marked } from 'marked';
import markedAlert from 'marked-alert';
import markedFootnote from 'marked-footnote';
import { markedHighlight } from 'marked-highlight';
import markedKatex from 'marked-katex-extension';
import { createHighlighterCoreSync, createJavaScriptRegexEngine } from 'shiki';
import bash from 'shiki/langs/bash.mjs';
import c from 'shiki/langs/c.mjs';
import diff from 'shiki/langs/diff.mjs';
import js from 'shiki/langs/javascript.mjs';
import python from 'shiki/langs/python.mjs';
import githubLight from 'shiki/themes/github-light.mjs';

type Options = null | {
    pdf?: {
        title?: string;
    };
};

const FRONT_MATTER_REGEX = /^---\s*\n([\s\S]+?)\n---\s*\n/;

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const renderedContent = ref<string>();

const highligher = computed(() =>
    createHighlighterCoreSync({
        langs: [js, c, python, bash, diff],
        themes: [githubLight],
        engine: createJavaScriptRegexEngine(),
    }),
);

const marked = computed(
    () =>
        new Marked(
            markedHighlight({
                emptyLangClass: 'shiki github-light',
                langPrefix: 'shiki github-light language-',
                highlight(code, lang) {
                    return (
                        highligher.value
                            .codeToHtml(code, {
                                lang,
                                theme: githubLight,
                            })
                            // unwrap the code-block
                            .replace(/(<pre.*<code>|<\/code.*pre>)/g, '')
                    );
                },
            }),
            markedKatex({
                throwOnError: false,
            }),
            markedFootnote(),
            markedAlert(),
        ),
);

function renderFile(fileName: string, fileContent: string) {
    const options = jsYaml.load(
        fileContent.match(FRONT_MATTER_REGEX)?.[1]!,
    ) as Options;

    document.title = fileName;

    if (options && options.pdf && options.pdf.title) {
        document.title = options.pdf.title;
    }

    renderedContent.value = marked.value
        .parse(fileContent.replace(FRONT_MATTER_REGEX, ''), { async: false })
        // remove footnotes label and replace with line
        .replace(
            /<h2 id="footnote-label".*>.*<\/h2>/g,
            '<hr style="height: 1px">',
        );
}

function onFileSelected(event: Event) {
    isLoading.value = true;

    const file = (event.target as HTMLInputElement).files![0];

    const reader = new FileReader();

    reader.onload = () => {
        renderFile(file.name, reader.result as string);

        // use this timeout to get into next rendering tick and wait for math font being loaded
        setTimeout(() => {
            print();

            if (!('noreload' in route.query)) {
                router.go(0);
            }
        }, 5);
    };

    reader.onerror = () => {
        alert(
            `Die Datei "${file.name}" konnte nicht geladen werden: ${reader.error}`,
        );

        router.go(0);
    };

    reader.readAsText(file);
}
</script>

<style lang="scss" scoped>
.selection {
    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;
    text-align: center;

    font-size: 2rem;
    padding: 1rem;

    &__text {
        padding: 1rem;
    }

    &__note {
        display: block;
        font-size: 1rem;
    }

    &,
    &__input {
        position: absolute;

        top: 0;
        left: 0;

        height: 100vh;
        width: 100vw;

        margin: 0;
        padding: 0;
    }

    &__input {
        opacity: 0;
    }
}
</style>

<style lang="scss">
// make available globally
@use '~/node_modules/katex/dist/katex.min.css';
</style>

<style lang="scss" module>
// can't use "scoped" to apply the extended classes aswell
@use '~/node_modules/github-markdown-css/github-markdown-light.css';

.content {
    padding: 30px;

    * {
        // force to print with background
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;

        // remove all previously set styles
        all: unset;
        display: revert;
    }

    // restore some defaults
    em {
        font-style: italic;
    }

    ul,
    ol {
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 40px;
    }

    ol {
        list-style-type: decimal;
    }

    th,
    td {
        &[align='right'] {
            text-align: right;
        }
    }

    // use this weird selector to not get module classes
    section[class='footnotes'] {
        color: #59636e;
    }

    @extend .markdown-body;

    code {
        white-space: pre-wrap !important;

        &.shiki {
            font-size: 110% !important;
        }
    }
}
</style>
