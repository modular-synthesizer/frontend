<template>

</template>

<script lang="ts">
import { PropType } from 'vue';
import ITool from '~~/lib/interfaces/ITool';

/**
 * This component represents the panel allowing the user to preview the node he's currently creating.
 * I will mainly instancite the tool as a dummy audio module, and represent its parameters and ports.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default {
    ports: {
        tool: {
            type: Object as PropType<ITool>,
            required: true
        }
    }
}
</script>