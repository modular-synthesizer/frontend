<template>
    <v-container fluid>
        <v-row no-gutters>
            <v-row cols="5" class="panel preview">
                <tools-preview :tool="tool" />
            </v-row>
            <v-row cols="7" class="panel form">
                <tools-form :tool="tool" />
            </v-row>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import ToolsFactory from '@/lib/factories/Tools'
import ITool from '~~/lib/interfaces/ITool';

/**
 * This component renders the page used to edit the tools in the application.
 * This interface is divided into two main sections :
 * 1. on the left, the preview of the audio module being built
 * 2. on the right the different elements of the audio module
 */
export default {
    data: () => ({
        tool: ToolsFactory.empty() as ITool
    })
}
</script>

<style scoped>
.panel {
    height: 100%;
    overflow: hidden;
}
</style>