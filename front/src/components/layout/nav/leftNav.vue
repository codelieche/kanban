<template>
  <!-- 文本注释 -->
  <div class="item" :class="{ collapsed: collapsed }" v-if="!item.is_deleted">
    <div v-if="collapsed" class="title" @click="onTitleClick">
      <!-- 折叠的情况 -->
      <el-tooltip effect="dark" :content="item.title" placement="right">
        <div>
          <!-- element-plus里面的元素需要一个root元素包裹 -->
          <span v-if="item.is_link && item.link">
            <!-- 是a连接 -->
            <a
              :href="item.link"
              :target="item.target === '_blank' ? '_blank' : ''"
              :style="{ paddingLeft: paddingLeftValue }"
            >
              <!-- 左侧显示icon -->
              <span
                class="icon"
                :class="
                  item.icon
                    ? item.icon.startsWith('el-')
                      ? item.icon
                      : `fa fa-${item.icon}`
                    : 'el-icon-arrow-right'
                "
              ></span>
            </a>
          </span>

          <!-- 跳转内部Url的情况 -->
          <router-link
            v-else-if="
              (!!item.slug && item.level > 1) || (!item.children && item.slug)
            "
            :to="item.slug"
            :class="{
              active:
                urlpath.indexOf(item.slug) == 0 && item.children.length < 1,
            }"
            :style="{ paddingLeft: paddingLeftValue }"
          >
            <span
              class="icon"
              :class="
                item.icon
                  ? item.icon.startsWith('el-')
                    ? item.icon
                    : `fa fa-${item.icon}`
                  : 'el-icon-arrow-right'
              "
            ></span>
          </router-link>

          <span
            v-else
            class="icon"
            :class="
              item.icon
                ? item.icon.startsWith('el-')
                  ? item.icon
                  : `fa fa-${item.icon}`
                : 'el-icon-arrow-right'
            "
          ></span>
        </div>
      </el-tooltip>
      <!-- 折叠情况结束 -->
    </div>

    <!-- 非折叠的情况 -->
    <div class="title" @click="onTitleClick" v-else>
      <!-- 判断是不是外链 -->
      <span v-if="item.is_link && item.link">
        <!-- 是a连接 -->
        <a
          :href="item.link"
          :target="item.target === '_blank' ? '_blank' : ''"
          :style="{ paddingLeft: paddingLeftValue }"
        >
          <!-- 左侧显示icon -->
          <span
            class="icon"
            :class="
              item.icon
                ? item.icon.startsWith('el-')
                  ? item.icon
                  : `fa fa-${item.icon}`
                : 'el-icon-arrow-right'
            "
          ></span>
          {{ item.title }}
        </a>
      </span>

      <!-- 不是a链接的情况 -->
      <!-- 跳转内部Url的情况 -->
      <!-- 一级菜单无子菜单的可跳转slug：非定义菜单有slug的可跳转 -->
      <router-link
        v-else-if="
          (!!item.slug && item.level > 1) || (!item.children && item.slug)
        "
        :class="{
          active: urlpath.indexOf(item.slug) == 0 && item.children.length < 1,
        }"
        :to="item.slug"
        :style="{ paddingLeft: paddingLeftValue }"
      >
        <span
          class="icon"
          :class="
            item.icon
              ? item.icon.startsWith('el-')
                ? item.icon
                : `fa fa-${item.icon}`
              : 'el-icon-arrow-right'
          "
        ></span>
        {{ item.title }}
      </router-link>

      <span v-else>
        <!-- slug不可跳转/slug为空的情况 -->
        <span
          class="icon"
          :class="
            item.icon
              ? item.icon.startsWith('el-')
                ? item.icon
                : `fa fa-${item.icon}`
              : 'el-icon-arrow-right'
          "
          :style="{ paddingLeft: paddingLeftValue }"
        ></span>
        {{ item.title }}
      </span>

      <!-- 有子菜单的，右侧显示个icon -->
      <div class="right" v-if="hasChildren">
        <span
          :class="openChildren ? 'el-icon-caret-bottom' : 'el-icon-caret-left'"
        ></span>
      </div>
    </div>

    <!-- 子元素 -->
    <div class="children" v-if="hasChildren" :class="{ active: openChildren }">
      <NavItem
        v-for="(subItem, subIndex) in item.children"
        :item="subItem"
        :key="subIndex"
        :collapsed="collapsed"
        :openParentChildren="openChildrenFunc"
      >
      </NavItem>
    </div>
    <!-- 子元素结束 -->
  </div>
</template>

<script>
export default {
  name: 'NavItem',
  props: {
    item: Object, // 导航数据对象
    index: Number, // 序号
    collapsed: Boolean, // 是否是折叠的
    openParentChildren: {
      type: Function,
      default() {
        return null
      },
    },
  },
  mounted() {
    if (this.$route.path.indexOf(this.item.slug) >= 0) {
      if (this.openParentChildren != null) {
        this.openParentChildren()
      }
    }
  },
  data() {
    return {
      openChildren: false, // 是否打开子菜单
    }
  },
  computed: {
    hasChildren() {
      return Array.isArray(this.item.children) && this.item.children.length > 0
    },
    paddingLeftValue() {
      if (this.collapsed) {
        return 0
      } else {
        return `${this.item.level * 10}px`
      }
    },
    urlpath() {
      return this.$route.path
    },
  },
  methods: {
    onTitleClick() {
      // 取反
      this.openChildren = !this.openChildren
    },
    openChildrenFunc() {
      // console.log("opeChildrenFunc", data)
      // console.log(this.$route)
      this.openChildren = true
    },
  },
}
</script>

<style lang="less" scoped>
// 当行Item的标题鼠标悬放时候的背景色
@nav-tiem-title-hove-backgroud: rgba(112, 119, 143, 0.16);
@nav-item-active-background: #1890ff;

.item {
  &.collapsed {
    position: relative;
    .title {
      width: 100%;
      .icon {
        width: 65px;
        text-align: center;
      }
    }
    .children {
      //   position: absolute;
      //   left: 70px;
      //   top: 0;
      //   background-color: #3f3f3f;
      border-top: 4px sold red;
    }
  }
}

.item {
  position: relative;
  .title {
    position: relative;
    line-height: 35px;
    text-align: left;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    &:hover {
      background: @nav-tiem-title-hove-backgroud;
    }
    .icon {
      display: inline-block;
      margin-right: 4px;
    }
    .right {
      display: inline-block;
      position: absolute;
      right: 8px;
      span {
        font-size: 10px;
        line-height: 35px;
      }
    }
    a {
      line-height: 35px;
      display: inline-block;
      width: 100%;
      box-sizing: border-box;
      text-decoration: none;
      color: #f8f8f8;
      &.router-link-exact-active,
      &.active {
        background-color: @nav-item-active-background;
      }
    }
  }

  .children {
    display: none;

    &.active {
      display: block;
    }
  }
}
</style>