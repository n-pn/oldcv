<script context="module">
    const fixture =
        '诗萝莉摇了摇头，说：“我的道心目前还算与境界匹配……但我希望自己能有更强大的道心。我和宋师兄接触很早，师兄除了晋级快之外，还有道心，稳如磐石，无论境界怎么提升，师兄的道心一直能跟上境界。所以，我想要知道宋师兄你道心一直稳定的方法。”'
    export async function preload({ query }) {
        const inp = query.inp || fixture

        const res = await this.fetch('/api/inspect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ t: inp }),
        })

        return await res.json()
    }
</script>

<script>
    import MIcon from '$melte/MIcon.svelte'

    export let active = true

    export let chinese
    export let hanviet
    export let entries

    export let offset = 0
    let current = entries[0]

    function render_line(tokens, offset) {
        const current = entries[offset]
        if (current.length === 0) return

        const range = offset + +current[0][0]

        let output = ''
        for (let [val, pos] of tokens) {
            if (pos < 0) output += val
            else {
                let klass = pos >= offset && pos < range ? ' _active' : ''
                output += `<ip-chr class="${klass}" data-i="${pos}">${val}</ip-chr>`
            }
        }

        return output
    }

    function handle_click(event) {
        const target = event.target
        if (target.nodeName !== 'IP-CHR') return

        const new_offset = +target.dataset.i
        if (new_offset < 0 || new_offset >= chinese.length) return

        const new_current = entries[new_offset]
        if (new_current.length === 0) return

        offset = new_offset
        current = new_current
    }

    function chinese_text(offset, length) {
        return chinese.slice(offset, offset + length).join('')
    }

    function hanviet_text(offset, length) {
        let index = 0
        while (hanviet[index][1] !== offset) index += 1
        if (index + length >= hanviet.length) return ''

        let output = ''
        while (hanviet[index][1] < offset + length) {
            output += hanviet[index][0]
            index += 1
        }
        return output.trim().toLowerCase()
    }
</script>

<style lang="scss">
    $sidebar-width: 24rem;

    aside {
        position: fixed;
        display: block;
        top: 0;

        right: -$sidebar-width;
        width: $sidebar-width;

        height: 100%;
        z-index: 999;

        @include bgcolor(white);
        @include shadow(lg);

        transition: transform 0.1s ease;

        &._active {
            transform: translateX(-$sidebar-width);
        }
    }

    $zh-height: 4.5rem;
    $hv-height: 5.75rem;
    $hd-height: 3rem;

    header {
        display: flex;
        height: $hd-height;
        padding: 0.5rem 0;
        // @include bgcolor(neutral, 1);
        border-bottom: 1px solid color(neutral, 2);

        :global(svg) {
            display: inline-block;
            vertical-align: text-top;
            width: 1rem;
            height: 1rem;
        }

        h2 {
            margin-left: 1rem;
            margin-right: auto;
            font-weight: 500;
            text-transform: uppercase;
            line-height: $hd-height - 1rem;
            @include color(neutral, 6);
            @include font-size(sm);
        }

        button {
            margin-left: auto;
            margin-right: 0.5rem;
            @include color(neutral, 6);
            @include bgcolor(transparent);
            @include hover {
                @include color(primary, 6);
            }
        }
    }

    section {
        height: calc(100% - #{$zh-height + $hv-height + $hd-height});
        overflow-y: scroll;
    }

    :global(ip-chr) {
        @include hover {
            cursor: pointer;
            @include color(primary, 5);
        }

        &._active {
            @include color(primary, 5);
        }
    }

    h4 {
        font-weight: 500;
        text-transform: uppercase;
        @include color(neutral, 6);
        @include font-size(sm);
    }

    .input {
        overflow-y: scroll;
        line-height: 1.25rem;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid color(neutral, 3);

        @include bgcolor(neutral, 1);
        @include font-family(sans);

        &._zh {
            height: $zh-height;
        }

        &._hv {
            height: $hv-height;
        }
    }

    .entry {
        margin: 0;
        padding: 0 1rem;

        & + & {
            border-top: 1px solid color(neutral, 3);
        }

        h3 {
            margin-top: 0.5rem;
            font-weight: bold;
            @include font-size(lg);
            @include color(neutral, 7);
        }
    }

    .item {
        margin: 0.5rem 0;
        @include clearfix;
    }

    .term {
        line-height: 1.375rem;
        margin-top: 0.25rem;
    }
</style>

<aside class:_active={active}>
    <header>
        <h2>
            <MIcon name="compass" />
            <span>Giải nghĩa</span>
        </h2>

        <button on:click={() => (active = !active)}>
            <MIcon name="x" />
        </button>
    </header>

    <div class="input _zh" on:click={handle_click}>
        {@html render_line(chinese.map((x, i) => [x, i]), offset)}
    </div>

    <div class="input _hv" on:click={handle_click}>
        {@html render_line(hanviet, offset)}
    </div>

    <section>
        {#each current as [len, item]}
            <div class="entry">
                <h3>
                    {chinese_text(offset, +len)} [ {hanviet_text(offset, +len)}
                    ]
                </h3>
                {#each item as [name, lines]}
                    <div class="item">
                        <h4>{name}</h4>
                        {#each lines.split('\n') as line}
                            <p class="term">{line}</p>
                        {/each}
                    </div>
                {/each}
            </div>
        {/each}
    </section>
</aside>
