<script context="module">
    export async function preload({ params }) {
        const slug = params.slug
        const res = await this.fetch(`api/texts/${slug}`)
        const data = await res.json()
        return { lines: data }
    }
</script>

<script>
    import { onMount } from 'svelte'
    import { goto } from '@sapper/app'

    import MIcon from '$melte/MIcon.svelte'
    import TextView from '../_layout/TextView.svelte'

    // export let slug = null

    export let lines

    // function navigate(e) {
    //     if (!e.ctrlKey) return

    //     if (e.keyCode == '37') {
    //         e.preventDefault()
    //         if (has_prev) goto(`c/${book_id}-${+chapter_id - 1}`)
    //         else goto(`b/${book_id}`)
    //     } else if (e.keyCode == '39') {
    //         e.preventDefault()
    //         if (has_next) goto(`c/${book_id}-${+chapter_id + 1}`)
    //         else goto(`create?b=${book_id}`)
    //     }
    // }
</script>

<style lang="scss">
    // footer {
    //     display: flex;
    //     justify-content: center;
    //     margin-top: 1rem;
    // }

    // $size: 2rem;
    // $icon-size: 1.25rem;
    // .m-btn {
    //     text-decoration: none;
    //     display: inline-flex;
    //     & + & {
    //         margin-left: 0.5rem;
    //     }

    //     height: $size;
    //     line-height: $icon-size;
    //     // width: $size;
    //     padding: ($size - $icon-size) / 2;
    //     :global(svg) {
    //         // width: 100%;
    //         // height: 100%;
    //         width: $icon-size;
    //         height: $icon-size;
    //         margin-top: -1px;
    //     }
    //     span {
    //         @include font-size(xs);
    //     }
    // }
    // .mulu span {
    //     margin-left: ($size - $icon-size) / 2;
    // }
</style>

<!-- <svelte:window on:keydown={navigate} /> -->

<TextView {lines} />
<!--
<footer>
    {#if has_prev}
        <a class="m-btn _line" href="c/{book_id}-{+chapter_id - 1}">
            <MIcon name="chevron-left" />
            <span>Trước</span>
        </a>
    {:else}
        <span class="m-btn _line _disable">
            <MIcon name="chevron-left" />
            <span>Trước</span>
        </span>
    {/if}
    <a class="m-btn _line mulu" href="b/{book_id}">
        <MIcon name="list" />
        <span>Mục lục</span>
    </a>

    {#if has_next}
        <a
            class="next m-btn _line _primary"
            href="c/{book_id}-{+chapter_id + 1}">
            <span>Tiếp</span>
            <MIcon name="chevron-right" />
        </a>
    {:else}
        <span class="m-btn _line _disable">
            <span>Tiếp</span>
            <MIcon name="chevron-right" />
        </span>
    {/if}
</footer> -->
