<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 加载效果 -->
      <el-card
        v-loading="isLoading"
        style="min-height: 600px"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-tabs>
          <el-tab-pane label="用户管理">
            <!-- 用了一个行列布局 -->
            <TreeItem
              :node="titaleObj"
              @delDepartment="getDepartmentList"
            ></TreeItem>
            <el-tree :data="data" default-expand-all>
              <template v-slot="scope">
                <TreeItem
                  :node="scope.node"
                  @delDepartment="getDepartmentList"
                ></TreeItem>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import { getDepartmentList } from '@/api/departments'
import TreeItem from './components/TreeItem.vue'
export default {
  filters: {},
  components: { TreeItem },
  data () {
    return {
      data: [],
      titaleObj: {},
      isLoading: true
    }
  },
  computed: {},
  watch: {},
  created () { this.getDepartmentList() },
  methods: {
    async getDepartmentList () {
      const res = await getDepartmentList()
      // console.log(res)
      function tranFerListToTree (list, pid) {
        var list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = tranFerListToTree(list, item.id)
          }
        })
        return list1
      }
      this.data = tranFerListToTree(res.depts, '')
      this.titaleObj = res.depts[0]
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
