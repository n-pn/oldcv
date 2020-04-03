<script>
    import MIcon from '$melte/MIcon.svelte'
    import { active_lookup } from '../../stores'
    export let segment

    // let scroll_down = false;

    // function handle_scroll(e) {
    //   scroll_down = window.oldScroll < window.scrollY;
    //   window.oldScroll = window.scrollY;
    // }
    // $: console.log({ segment });
</script>

<style lang="scss">
    $height: 3rem;
    $inner-height: 2.25rem;
    $gutter: ($height - $inner-height) / 2;

    header {
        position: fixed;
        display: flex;
        width: 100%;
        top: 0;
        left: 0;
        height: 3rem;
        padding: $gutter;
        z-index: 100;

        // transition: transform 1s ease;

        // &._hide {
        //   transform: translateX(-3rem);
        // }

        @include bgcolor(primary, 6);
        @include shadow(xl);
        @include clearfix;
    }

    .left {
        display: inline-flex;
        margin-right: auto;
    }

    .right {
        display: inline-flex;
        margin-left: auto;
    }

    $icon-size: 1.25rem;
    $padding: ($inner-height - $icon-size) / 2;

    .header-item {
        // display: inline-block;
        @include color(white);
        @include corner(sm);
        @include bgcolor(primary, 6);
        @include font-size(sm);

        float: left;
        padding: $padding;
        height: $inner-height;
        line-height: $icon-size;

        font-weight: 500;
        text-decoration: none;
        text-transform: uppercase;
        transition: background 0.3s ease;

        @include clearfix;

        & + & {
            margin-left: $gutter;
        }

        &._active {
            @include bgcolor(primary, 5);
        }

        @include hover {
            @include color(white);
            @include bgcolor(primary, 4);
        }

        :global(img),
        :global(svg) {
            float: left;
        }

        :global(svg) {
            // margin-top: 0.125rem;
            width: 1.25rem;
            height: 1.25rem;
        }

        :global(.icon) {
            float: left;
            width: $icon-size;
            height: $icon-size;
            vertical-align: top;
        }

        span {
            float: left;
            margin-left: 0.25rem;
            &.s-tablet {
                display: none;

                @include screen-min(tablet) {
                    display: inline-block;
                }
            }
        }

        &._active span {
            display: inline-block;
        }
    }

    .icon {
        max-width: 2rem;
        max-height: 2rem;
    }

    button {
        border: 0;
    }
</style>

<!-- <svelte:window on:scroll={handle_scroll} /> -->

<!-- <header class:_hide={scroll_down}> -->
<header>
    <nav class="left">
        <!-- <button class="header-item">
      <MIcon name="menu" />
    </button> -->
        <a class="header-item" class:_active={!segment} href="/">
            <img class="icon" src="/favicon.svg" alt="logo" />
            <span class="s-tablet">Chivi</span>
        </a>

        <a
            class="header-item"
            class:_active={segment === 'texts'}
            href="/texts">
            <MIcon name="plus-square" />
            <span class="s-tablet">Lịch sử</span>
        </a>

        <a
            class="header-item"
            class:_active={segment === 'dicts'}
            href="/dicts">
            <MIcon name="server" />
            <span class="s-tablet">Từ điển</span>
        </a>
    </nav>

    <nav class="right">
        <button
            class="header-item"
            class:_active={$active_lookup}
            on:click={() => active_lookup.update(x => !x)}>
            <MIcon name="compass" />
            <span class="s-tablet">Nghĩa</span>
        </button>
    </nav>
</header>
