<template>

</template>

<script lang="ts">
import { PropType } from 'vue';
import ITool from '~~/lib/interfaces/ITool';

/**
 * This component represents the form allowing the user to add, edit, or remove elements
 * from an audio module to make it exactly what he needs.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default {
    props: {
        tool: {
            type: Object as PropType<ITool>,
            required: true,
        }
    }
}
</script>