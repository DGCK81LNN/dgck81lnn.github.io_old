<template>
  <div class="soul-footer" height="auto" v-once>
    <div class="soul-shit-flex soul-footer-flex">
      <section class="soul-footer-col" v-if="links">
        <h5>相关链接</h5>
        <ul class="soul-footer-col-list">
          <li v-for="(link, i) in links" :key="i">
            <a :href="link.href" target="_blank">{{ link.text }}</a>
          </li>
        </ul>
      </section>
      <section class="soul-footer-col">
        <h5>关于我</h5>
        <ul class="soul-footer-col-list">
          <li><a href="https://space.bilibili.com/328066747" target="_blank">B站账号</a></li>
          <li><a href="https://github.com/DGCK81LNN" target="_blank">GitHub</a></li>
          <li><a href="https://zh.moegirl.org.cn/User:DGCK81LNN" target="_blank">萌娘百科用户页</a></li>
        </ul>
      </section>
      <section class="soul-footer-col">
        <h5>©2020 DGCK81LNN.</h5>
        <p>
          <a href="https://github.com/DGCK81LNN/dgck81lnn.github.io_old"
            ><img
              src="https://img.shields.io/badge/-在GitHub上查看-222222?logo=github"
              alt="在GitHub上查看源代码"
          /></a>
          <img
            src="https://img.shields.io/badge/许可证-MPL--2.0-orange"
            alt="许可证：MPL-2.0"
          />
        </p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    links: Array,
  },
};
</script>

<style>
.soul-footer {
  background-color: rgb(214, 242, 238);
  margin: 0;
  padding: 2rem calc(10% + 8px) 8rem;
  clear: both;
}

.soul-footer-flex {
  flex-wrap: wrap;
}

.soul-footer-col {
  display: inline-block;
  flex: auto;
}

.soul-footer-col-list {
  padding: 0;
  list-style: none;
}

.soul-footer-col-list li {
  margin: 0.3em 0;
}
</style>