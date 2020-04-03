<script context="module">
    export async function preload() {
        // console.log(`load books!`);
        const res = await this.fetch(`api/texts`)
        const data = await res.json()
        return { texts: data, count: data.length }
    }

    export function render(tokens) {
        return tokens.map(x => x[0]).join('')
    }
</script>

<script>
    export let texts = []
    export let count = 0
</script>

<style lang="scss">
    // .count {
    //     @include color(neutral, 7);
    //     @include font-size(90%);
    //     // font-weight: 200;
    // }

    // .list {
    //     display: block;
    //     @include bgcolor(white);
    //     @include corner(lg);
    //     @include shadow(lg);
    // }

    // header {
    //     display: flex;
    //     // @include bgcolor(neutral, 1);
    //     @include border-bottom(color(neutral, 3));
    // }

    // .body {
    //     display: block;
    //     padding-bottom: 2.5rem;
    // }

    // .row {
    //     display: flex;
    //     width: 100%;
    //     &:nth-child(odd) {
    //         @include bgcolor(neutral, 1);
    //     }

    //     @include hover {
    //         @include bgcolor(primary, 1);
    //     }
    // }

    // .cap,
    // .col {
    //     padding: 0.75rem;

    //     @include screen-min(tablet) {
    //         padding: 0.5rem 1rem;
    //     }

    //     @include screen-min(laptop) {
    //         padding: 0.5rem 1.25rem;
    //     }

    //     @include screen-min(desktop) {
    //         padding: 0.5rem 1.5rem;
    //     }
    // }

    // .cap {
    //     line-height: 2rem;
    //     font-weight: 500;
    //     @include color(neutral, 6);
    //     @include font-size(sm);
    //     text-transform: uppercase;
    // }

    // .title,
    // .book-title {
    //     width: 85%;
    //     @include screen-min(tablet) {
    //         width: 50%;
    //     }
    // }

    // .book-title {
    //     @include font-size(sm);
    //     @include screen-min(phablet) {
    //         @include font-size(rem(15));
    //     }
    //     @include screen-min(laptop) {
    //         @include font-size(md);
    //     }
    // }

    // .author,
    // .book-author {
    //     display: none;
    //     @include screen-min(tablet) {
    //         display: block;
    //         width: 35%;
    //     }
    // }

    // .chapnum,
    // .book-chapnum {
    //     width: 15%;
    //     text-align: right;
    //     @include screen-min(tablet) {
    //         width: 15%;
    //     }
    // }

    // .book-title {
    //     // @include truncate(50%);

    //     @include font-size(sm);
    //     @include screen-min(tablet) {
    //         @include font-size(md);
    //     }

    //     > a {
    //         display: block;
    //         text-decoration: none;
    //         @include truncate();
    //         @include color(primary, 6);
    //         @include hover() {
    //             @include color(primary, 5);
    //         }
    //     }
    // }

    // .book-author {
    //     > div {
    //         @include truncate();
    //     }
    //     @include color(neutral, 6);
    // }

    // .book-chapnum {
    //     @include font-size(sm);
    //     @include color(neutral, 6);
    // }

    // .list {
    //     margin-top: 1rem;
    // }
</style>

<h1>
    Danh sách truyện:
    <span class="count">({count})</span>
</h1>

<div class="list">
    {#each texts as text}
        <a href="texts/{text.fname}" class="link">{render(text.vi_title)}</a>
    {/each}

</div>
