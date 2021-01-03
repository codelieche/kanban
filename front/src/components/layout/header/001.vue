<template>
  <div class="header">
    <router-link to="/" keey="header-logo">
      <div class="logo">
        <img src="@/assets/logo.png" alt="codelieche" />
        <span>编程教程</span>
      </div>
    </router-link>

    <div class="nav">
      <ul>
        <li v-for="(item, index) in navs" :key="index">
          <router-link
            :to="item.slug"
            :class="{
              'router-link-exact-active': item.slug === headerSlug,
            }"
            >{{ item.title }}</router-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { mapState } from 'vuex'

import { headerSlug } from '@/hooks/store/useHeaderSlug'
import { PageHeaderNav } from '@/types/base/nav'

export default defineComponent({
  name: 'Header001',
  props: {
    navs: {
      type: Array,
      default() {
        let arr: Array<PageHeaderNav> = []
        arr = [
          // { slug: '/', title: '首页' },
          { slug: '/test', title: '文档中心' },
          { slug: '/user', title: '用户中心' },
        ]
        return arr
      },
    },
  },
  setup() {
    // watch(
    //   headerSlug,
    //   () => {
    //     console.log("headerSlug变化了", headerSlug)
    //   },
    //   { immediate: true, deep: true }
    // )

    return {
      headerSlug,
    }
  },
})
</script>

<style lang="less" scoped>
@HeaderHight: 50px;
@LogoHeight: 30px;
.header {
  background-color: #333744;
  height: @HeaderHight;
  text-align: left;
  display: flex;
  .logo,
  .nav {
    display: inline-block;
  }
  .logo {
    width: 160px;
    // float: left;
    height: @HeaderHight;
    // padding: 10px;
    box-sizing: border-box;
    color: #f9f9f9;
    padding-left: 10px;
    img {
      padding: 5px;
      height: 20px;
      width: 20px;
      border-radius: 25px;
      background-color: #f8f8f8;
      display: inline-block;
      margin-bottom: 10px;
    }
    span {
      display: inline-block;
      height: 50px;
      padding: 10px 5px;
      line-height: 40px;
      overflow: hidden;
      box-sizing: border-box;
      font-size: 16px;
      font-weight: 500;
    }
  }

  // 右侧的导航
  .nav {
    flex: 1;
    // float: right;
    text-align: right;
    overflow: hidden;
    color: #f9f9f9;
    height: @HeaderHight;
    overflow: hidden;
    margin: 0px 0px;
    box-sizing: border-box;
    ul {
      list-style: none;
      margin-block-start: none;
      display: block;
      color: #f8f8f8;
      margin-block-start: 0em; // 浏览器自动填充了
      margin-block-end: 0em;
      padding-inline-start: 10px;
      li {
        margin: 0;
        padding: 0;
        display: inline-block;
        height: @HeaderHight;
        text-align: center;
        &:hover,
        a.router-link-exact-active {
          background-color: #4a5064;
        }
        a {
          min-width: 60px;
          padding: 0 10px;
          font-size: 15px;
          color: #f8f8f8;
          display: inline-block;
          height: @HeaderHight;
          line-height: @HeaderHight;
          text-decoration: none;
        }
        // height: 60px;
      }
    }
  }
}
</style>