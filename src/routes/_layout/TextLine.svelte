<script context="module">
    export function render_line(tokens, active = false) {
        let body = ''

        let skip = 0 // offset of the original chinese
        let size = 0 // count of all vietphrase tokens

        for (let [val, len, dic] of tokens) {
            if (dic > 0) {
                if (!active) body += val
                else body += `<x-v d=${dic} i=${size} o=${skip}>${val}</x-v>`

                size += 1
            } else {
                if (val === '⟨') body += '<cite>⟨'
                else if (val === '⟩') body += '⟩</cite>'
                else if (val === '[') body += '<x-m>['
                else if (val === ']') body += ']</x-m>'
                else if (val === '“') body += '<q>'
                else if (val === '”') body += '</q>'
                else if (val === '‘') body += '<i>‘'
                else if (val === '’') body += '’</i>'
                else body += val
            }

            skip += len
        }
        return [body, size]
    }
</script>

<script>
    import { lookup_input, lookup_offset, active_lookup } from '../../stores'

    export let idx = 0
    export let focus = 0
    export let tokens = []

    $: [content, tk_size] = render_line(tokens, idx === focus)

    $: if (idx === focus) {
        move_focus(cursor_id)
    }

    let self = null

    let cursor_id = 0
    let cursor_el = null

    function move_focus(new_cursor_id) {
        if (!new_cursor_id) return
        else if (new_cursor_id < 0) new_cursor_id = tk_size - 1
        else if (new_cursor_id >= tk_size) new_cursor_id = 0

        console.log({ new_cursor_id })

        const new_cursor_el = self.querySelector(`[i="${new_cursor_id}"]`)
        console.log(new_cursor_el)

        if (!new_cursor_el) return

        if (cursor_el) cursor_el.classList.remove('_active')

        cursor_id = new_cursor_id
        cursor_el = new_cursor_el
        cursor_el.classList.add('_active')

        lookup_offset.set(+cursor_el.getAttribute('o'))
        active_lookup.set(true)

        // window.scrollTo(0, on_elem.offsetTop - 80) // 5rem
    }

    function handle_keypress(event) {
        if (idx !== focus) return

        switch (event.keyCode) {
            case 37: // left
                move_focus(cursor_id - 1)
                event.preventDefault()
                break

            case 39: // right
                move_focus(cursor_id + 1)
                event.preventDefault()
                break
        }
    }

    function handle_click(event) {
        const target = event.target
        switch (target.nodeName) {
            case 'X-V':
                move_focus(+target.getAttribute('i'))
                event.preventDefault()
                return

            default:
                focus = idx
                cursor_id = 0
                event.preventDefault()
                return
        }
    }
</script>

<style lang="scss">
    @mixin token-color($color, $text-color: $color) {
        border-bottom-color: $color;
        &._active {
            color: $text-color;
        }
    }

    :global(x-m) {
        @include color(neutral, 6);
    }

    :global(x-v) {
        border-bottom: 1px solid transparent;

        @include hover {
            cursor: pointer;
        }

        &[d='0'] {
            @include token-color(color(neutral, 4), color(neutral, 5));
        }

        &[d='1'] {
            @include token-color(color(primary, 4), color(primary, 5));
        }

        &[d='2'] {
            @include token-color(color(harmful, 4), color(harmful, 5));
        }
    }

    p {
        margin: 0;
        margin-top: 1rem;
        @include font-size(md);

        &:first-of-type {
            margin-top: 0;
            font-weight: 300;
            @include color(neutral, 6);
            @include font-size(xl);
            line-height: 1.5rem;
        }

        @include screen-min(tablet) {
            margin-top: 1.25rem;
            @include font-size(rem(17));

            &:first-of-type {
                margin-top: 0;
                @include font-size(x2);
                line-height: 1.75rem;
            }
        }

        @include screen-min(laptop) {
            margin-top: 1.5rem;
            @include font-size(rem(18));
            &:first-of-type {
                margin-top: 0;
                @include font-size(x3);
                line-height: 2rem;
            }
        }
    }

    :global(q) {
        font-style: italic;
    }
</style>

<svelte:window on:keydown={handle_keypress} />

<p bind:this={self} on:click={handle_click}>
    {@html content}
</p>
