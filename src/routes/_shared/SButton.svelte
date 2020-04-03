<script>
  export let primary = false
</script>

<style type="text/scss">
  button {
    display: inline-block;
    border: 1px solid color(neutral, 6);
    background-color: color(neutral, 7);
    color: color(neutral, 3);
    padding: 0 0.5em;

    &._primary {
      border-color: color(primary, 4);
      background-color: color(primary, 4);
      color: #fff;
    }
  }
</style>

<button class:_primary={!!primary}>
  <slot />
</button>
