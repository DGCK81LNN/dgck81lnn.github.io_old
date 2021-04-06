<template>
  <section class="soul-main"><slot></slot></section>
</template>

<style>
.soul-main {
  margin: 1rem;
  padding: 20px 10%;
}

@media screen and (max-width: 575px) {
  .soul-main {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>