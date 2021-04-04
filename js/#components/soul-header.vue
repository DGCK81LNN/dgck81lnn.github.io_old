<template>
  <b-navbar toggleable="sm" variant="light" class="shadow soul-header">
    <b-navbar-brand href="/home/">
      <img
        src="/site_icon.png"
        class="align-middle"
        style="height: 40px"
      />
      灵魂小站
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse" label="导航栏开关"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="/home" right>首页</b-nav-item>
        <b-nav-item href="/apps" right>应用</b-nav-item>
        <b-nav-item href="/res" right>资源</b-nav-item>
        <b-nav-item-dropdown text="子站" right>
          <b-dropdown-item href="/blog">博客区</b-dropdown-item>
          <b-dropdown-item href="/sandbox" target="_blank"
            >沙盒区</b-dropdown-item
          >
          <b-dropdown-item href="/legacy" target="_blank"
            >遗留区</b-dropdown-item
          >
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<style>
.soul-header {
  padding: 8px 10%;
  border-bottom: 1px solid var(--soul-color-border-1);
}
</style>