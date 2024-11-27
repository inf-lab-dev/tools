<template>
    <ul>
        <li v-for="warning in warnings">{{ warning }}</li>
    </ul>
    <div v-if="renderer">
        {{ html }}
    </div>
    <div v-else>Loading...</div>
</template>

<script lang="ts" setup>
import markdownItFootnote from 'markdown-it-footnote';
import {
    createMarkdownRenderer,
    disposeMdItInstance,
    type MarkdownRenderer,
} from 'vitepress';

const renderer = shallowRef<MarkdownRenderer>();
const warnings = ref<string[]>([]);

const model = defineModel<string>({
    required: true,
});

const html = computed(() => renderer.value?.render(model.value));

async function createRenderer() {
    renderer.value = await createMarkdownRenderer(
        'virtual-src',
        {
            // TODO: keep this in-sync with vitepress - possibly auto-generate it?
            config: (md) => md.use(markdownItFootnote),
            math: true,

            codeCopyButtonTitle: 'Code kopieren',

            container: {
                tipLabel: 'Tipp',
                warningLabel: 'Warnung',
                dangerLabel: 'Achtung',
                infoLabel: 'Information',
                noteLabel: 'Information',
                importantLabel: 'Wichtig',
                cautionLabel: 'Vorsicht',
            },
        },
        '/',
        {
            warn: (msg, options) => {
                if (options?.clear) {
                    warnings.value = [];
                }

                warnings.value.push(
                    (options?.timestamp ? `[${new Date()}] ` : '') + msg,
                );
            },
        },
    );
}

onBeforeUnmount(() => disposeMdItInstance());
onMounted(() => createRenderer());
</script>
