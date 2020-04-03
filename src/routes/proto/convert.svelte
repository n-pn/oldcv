<script context="module">
    const fixture = '3T64Kvj'
    export async function preload({ query }) {
        const slug = query.slug || fixture

        const res = await this.fetch(`/api/texts/${slug}`)
        const lines = await res.json()
        return { lines }
    }

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
        return body
    }
</script>

<script>
    export let lines = []

    let focus_line = 0
    let hover_line = 0

    let span_ptr = 0
    let span_cur = null

    function change_span_cur(new_span_cur) {
        if (!new_span_cur) return
        if (span_cur) span_cur.classList.remove('_active')
        span_cur = new_span_cur
        span_cur.classList.add('_active')
    }

    function handle_click(event, new_line) {
        focus_line = new_line

        const target = event.target
        switch (target.nodeName) {
            case 'X-V':
                change_span_cur(target)
                break

            default:
                break
        }
    }
</script>

<style lang="scss">
    @mixin token-color($color, $text-color: $color) {
        border-bottom-color: $color;
        border-bottom-style: dashed;

        @include hover {
            cursor: pointer;
            color: $text-color;
            border-bottom-style: solid;
        }

        &._active {
            color: $text-color;
        }

        p._focus & {
            border-bottom-style: solid;
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

{#each lines as [zh, vi], i}
    <p
        class:_focus={focus_line === i}
        on:click={e => handle_click(e, i)}
        on:mouseenter={() => (hover_line = i)}>
        {@html render_line(vi, i === focus_line || i === hover_line)}
    </p>
{/each}
