<script>
    import { onMount } from 'svelte'
    import FixedHeader from './_layout/FixedHeader.svelte'
    import Inspect from './_layout/Inspect'

    import { active_lookup, lookup_input, lookup_offset } from '../stores'

    export let segment
    // $: console.log({ segment });

    $: if (segment != 'c') active_lookup.set(false)

    onMount(_ => check_sidebar())

    function check_sidebar() {
        let size = window.innerWidth
        active_lookup.set(size >= 800 && segment === 'c')
    }
</script>

<style lang="scss">
    :global(#sapper) {
        min-width: 100%;
    }

    $sidebar-width: 24rem;

    .content {
        display: block;
        min-height: 100%;

        width: 100%;
        min-width: rem(320);
        margin-top: 3rem;

        // transition: width 0.1s ease;

        &._slide {
            @include screen-min(tablet) {
                // transform: translateX(-$sidebar-width);
                width: calc(100% - #{$sidebar-width});
            }
            @include screen-min(1600px) {
                width: 100%;
            }
        }
    }

    .section {
        display: block;
        margin: 0 auto;
        max-width: 50rem;

        padding: 0.75rem;

        @include screen-min(phone) {
            padding: 1rem;
        }

        @include screen-min(phablet) {
            padding: 1.25rem;
        }
        @include screen-min(tablet) {
            padding: 1.5rem;
        }
        @include screen-min(laptop) {
            padding: 2rem;
        }
    }
</style>

<svelte:head>
    <title>Chivi</title>
</svelte:head>

<FixedHeader {segment} />

<div class="content" class:_slide={$active_lookup}>
    <div class="section">
        <slot />
    </div>
</div>

<Inspect
    bind:active={$active_lookup}
    input={$lookup_input}
    offset={$lookup_offset} />
