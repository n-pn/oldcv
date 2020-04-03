<script>
  export let name = "feather";
</script>

<style lang="scss">
  svg {
    display: inline-block;
    width: 1em;
    height: 1em;
    padding: 0;
    margin: 0;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
</style>

<svg class="icon _{name}">
  <use xlink:href="/feather-sprite.svg#{name}" />
</svg>
