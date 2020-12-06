/**
 * @class
 * @name SoulHeader
 * @extends VueComponent
 * 页头。
 */
Vue.component('soul-header', {
    props: {
        'defaultActive': ""
    },
    template: `<el-header class="soul-header clearfix">
    <el-container class="soul-header-logo"><a href="/" title="回到首页"><img src="/site_icon.png"/>灵魂小站</a></el-container>
    <el-container class="soul-header-navi">
        <slot></slot>
        <el-menu
        class="soul-header-navi-tabs"
        mode="horizontal"
        :default-active="defaultActive"
        @select="naviSelect"
        >
            <el-menu-item index="home">首页</el-menu-item>
            <el-menu-item index="apps">应用</el-menu-item>
            <el-menu-item index="res">资源</el-menu-item>
            <el-menu-item index="blog">博客</el-menu-item>
        </el-menu>
    </el-container>
</el-header>`,
    methods: {
        naviSelect(index) {
            location.href = `/${index}`;
        }
    }
});

/**
 * @class
 * @name SoulHeader
 * @extends VueComponent
 * 正文容器。
 */
Vue.component('soul-main', {
    template: `<section class="soul-main"><slot></slot></section>`
});

/**
 * @class
 * @name SoulFooter
 * @extends VueComponent
 * 页脚。
 */
Vue.component('soul-footer', {
    props: {
        'links': Array
    },
    template: `<el-footer class="soul-footer" height="auto">
    <el-container class="soul-footer-flex">
        <section class="soul-footer-col" v-if="links">
            <h3>相关链接</h3>
            <slot>
                <p v-for="(link, i) in links" :key="i">
                    <a :href="link.href" target="_blank">{{link.text}}</a>
                </p>
            </slot>
        </section>
        <section class="soul-footer-col">
            <h3>关于我</h3>
            <p><a href="https://space.bilibili.com/328066747" target="_blank">B站账号</a></p>
            <p><a href="http://www.mywiki.cn/dgck81lnn" target="_blank">LNN的博客？</a></p>
            <p><a href="https://github.com/DGCK81LNN" target="_blank">GitHub</a></p>
            <p><a href="https://zh.moegirl.org.cn/User:DGCK81LNN" target="_blank">萌娘百科用户页</a></p>
        </section>
        <section class="soul-footer-col">
            <h3>©2020 DGCK81LNN.</h3>
            <p>本站图文内容除另有声明外，<br>均采用<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/deed.zh" target="_blank">知识共享署名-相同方式共享 4.0 国际许可协议</a>进行许可。</p>
            <p>更多信息见<a href="/about" target="_blank">关于</a>页。</p>
            <p><a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/deed.zh" target="_blank"><img alt="知识共享许可协议" style="border-width:0" src="/cc_by-sa_4.0_88x31.png"/></a></p>
        </section>
    </el-container>
</el-footer>`
});
