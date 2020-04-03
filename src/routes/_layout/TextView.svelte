<script>
    import { onMount, afterUpdate } from 'svelte'

    import { lookup_input, lookup_offset, active_lookup } from '../../stores'

    import TextLine from './TextLine'
    export let lines = []

    let focus = 0
    $: lookup_input.set(lines[focus][0])

    // let reload = false;

    onMount(_ => (focus = 0))
    // afterUpdate(_ => (focus = 0))
</script>

<style lang="scss">
    article {
        margin: 0;
    }
</style>

<article>
    {#each lines as line, idx (idx)}
        <TextLine {idx} bind:focus tokens={line[1]} />
    {/each}
</article>
