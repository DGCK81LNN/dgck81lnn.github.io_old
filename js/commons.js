/**
 * @class
 * @name SoulShitFlex
 * @extends VueComponent
 */
Vue.component('soul-shit-flex', {
    template: `<div class="soul-shit-flex"><slot/></div>`
});

/**
 * @class
 * @name SoulHeader
 * @extends VueComponent
 * 页头。
 */
Vue.component('soul-header', {
    template: `
    <b-navbar
    toggleable=sm
    variant=light
    class="shadow soul-header">
        <b-navbar-brand href="/">
            <img
            src="https://dgck81lnn.github.io/site_icon.png"
            class="align-middle"
            style="height:40px">
            灵魂小站
        </b-navbar-brand>
        <b-navbar-toggle
            target="nav-collapse"
            label="导航栏开关"
        ></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
            <b-nav-item href="/home" right>首页</b-nav-item>
            <b-nav-item href="/apps" right>应用</b-nav-item>
            <b-nav-item href="/res" right>资源</b-nav-item>
            <b-nav-item-dropdown text="子站" right>
                <b-dropdown-item href="/blog">博客区</b-dropdown-item>
                <b-dropdown-item href="/sandbox" target=_blank>沙盒区</b-dropdown-item>
                <b-dropdown-item href="/legacy" target=_blank>遗留区</b-dropdown-item>
            </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>`
});
/**
 * @class
 * @name SoulBlogHeader
 * @extends VueComponent
 * 博客站页头。
 */
Vue.component('soul-blog-header', {
    template: `
    <b-navbar
    variant=light
    class="shadow soul-header">
        <b-navbar-brand href="/">
            <img
            src="https://dgck81lnn.github.io/site_icon.png"
            class="align-middle"
            style="height:40px">
            LNN的博客！
        </b-navbar-brand>
        <b-navbar-nav align=right>
            <b-nav-item href="/">主站</b-dropdown-item>
        </b-navbar-nav>
    </b-navbar>`
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
    template: `<div class="soul-footer" height="auto">
    <soul-shit-flex class="soul-footer-flex">
        <section class="soul-footer-col" v-if="links">
            <h5>相关链接</h5>
            <ul class="soul-footer-col-list">
                <li v-for="(link, i) in links" :key="i">
                    <a :href="link.href" target="_blank">{{link.text}}</a>
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
            <p>本站内容在GitHub上开源。</p>
            <p>
                博客站内容除另有声明外，<br>均采用<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/deed.zh" target="_blank">CC BY-SA 4.0 国际许可协议</a>进行许可。<br>
                <a href="http://creativecommons.org/licenses/by-sa/4.0/deed.zh" target="_blank"><img alt="知识共享许可协议" style="border-width:0" src="/cc_by-sa_4.0_88x31.png"/></a>
            </p>
        </section>
    </soul-shit-flex>
</div>`
});

/**
 * @class
 * @name Prism
 * @extends VueComponent
 * Copied from https://github.com/egoist/vue-prism-component/blob/master/src/index.js
 * Modified by me
 */
Vue.component('prism', {
    props: {
        code: {
            type: String
        },
        inline: {
            type: Boolean,
            default: false
        },
        language: {
            type: String,
            default: 'markup'
        }
    },
    setup(props, {
        slots,
        attrs
    }) {
        const defaultSlot = (slots && slots.default && slots.default()) || []
        const code =
            props.code || (defaultSlot && defaultSlot.length) ?
            defaultSlot[0].children :
            ''
        const inline = props.inline
        const language = props.language
        const prismLanguage = Prism.languages[language]
        const className = `language-${language}`

        if (process.env.NODE_ENV === 'development' && !prismLanguage) {
            throw new Error(
                `Prism component for language "${language}" was not found, did you forget to register it? See all available ones: https://cdn.jsdelivr.net/npm/prismjs/components/`
            )
        }
        return () => {
            if (inline) {
                return h('code', {
                    class: [className],
                    innerHTML: Prism.highlight(code, prismLanguage)
                })
            }

            return h(
                'pre', {
                    ...attrs,
                    class: [attrs.class, className]
                },
                [
                    h('code', {
                        ...attrs,
                        class: [attrs.class, className],
                        innerHTML: Prism.highlight(code, prismLanguage)
                    })
                ]
            )
        }
    }
});

/**
 * @class
 * @name SoulManualPrism
 * @extends VueComponent
 */
Vue.component('soul-manual-prism', {
    template: `<pre class="soul-manual-prism"><code><slot/></code></pre>`
});
